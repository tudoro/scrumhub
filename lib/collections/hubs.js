/**
 * Created by tudor on 07/12/14.
 */

Hubs = new Mongo.Collection("hubs");

Meteor.methods({
    hubInsert: function(postAttributes) {
        if (Meteor.user()) {
            var user = Meteor.user();
            var now = new Date();

            errors = validateHub(postAttributes);
            if (errors.name) {
                throw new Meteor.Error("invalid-hub", "Hub should contain at least a name");
            }

            var hub = _.extend(postAttributes, {
                owner: user._id,
                creator: user._id,
                lastModified: now,
                dateCreated: now,
                filters: [{
                    id: "notes",
                    active: true,
                    name: "Notes"
                }],
                displayedIssues: []
            });
            var hubId = Hubs.insert(hub);

            if (Meteor.isServer && JIRAConnectorConfig.INDIVIDUAL_OAUTH_CONNECTIONS === true) {
                var jiraUser = JIRAConnector.getInfoAboutMyself().data;

                Hubs.update({_id: hubId}, {
                    $set: {
                        activeJiraUser: jiraUser.name
                    }
                });

                var existingJiraUser = JiraUsers.findOne({key: jiraUser.key});
                if (!existingJiraUser) {
                    var newJiraUser = _.extend(jiraUser, {
                        hubs: [hubId],
                        owns: [hubId],
                        meetupUser: Meteor.userId()
                    });
                    JiraUsers.insert(newJiraUser);
                } else if (existingJiraUser.hubs === undefined || existingJiraUser.hubs.indexOf(hubId) === -1) {
                    JiraUsers.update({_id: existingJiraUser._id}, {
                        $push: {
                            hubs: hubId,
                            owns: hubId
                        },
                        $set: {
                            meetupUser: Meteor.userId()
                        }
                    });
                }
            }
        }
    },

    hubRemove: function(hub) {
        if (Meteor.user() && hub.owner === Meteor.userId()) {
            JiraUsers.update({hubs: hub._id},
                {
                    $pull: {
                        hubs: hub._id,
                        owns: hub._id
                    }
                },
                {
                    multi:true
                });
            Notes.remove({hubId: hub._id});
            Hubs.remove(hub._id);
        }
    },

    addFilterToHub: function(hub, filter) {
        if (Meteor.user() && hub.owner === Meteor.userId()) {
            if (filter.selectedInHub === true) {
                Hubs.update({_id: hub._id}, {
                    $pull: {
                        filters: {
                            id: filter.id
                        }
                    }
                });
            }
            else {
                filter.active = false;
                if (hub.filters.length === 0) {
                    filter.active = true;
                }
                Hubs.update({_id: hub._id}, {
                    $push: {
                        filters: filter
                    }
                });
            }
        }
    },

    setActiveUserInHub: function(hub, activeUser) {
        // the owner can change/set the active user
        // if the logged in user is also the active user to be set than he also has the privilege to change the activeUserId
        if (Meteor.user() && (hub.owner === Meteor.userId() || activeUser.meetupUser === Meteor.userId())) {
            Hubs.update({_id: hub._id}, {
                $set: {
                    activeJiraUser: activeUser.name
                }
            });
            hub.activeJiraUser = activeUser.name;
            var activeFilter = hub.filters[0];
            _.each(hub.filters, function(filter) {
                if (filter.active === true) {
                    activeFilter = filter;
                }
            });
            if (Meteor.isServer) {
                var displayedIssues = [];
                if (activeFilter.id === "notes") {
                    var jiraUser = JiraUsers.findOne({name: hub.activeJiraUser});
                    displayedIssues = Notes.find({
                        userId: jiraUser.meetupUser,
                        hubId: hub._id
                    }, {
                        sort: {
                            lastModified: -1
                        }
                    }).fetch();
                }
                else {
                    var result = Meteor.call("apimethods_getIssuesForFilter", activeFilter, hub);
                    if (result.data && result.data.issues) {
                        var displayedIssues = result.data.issues;
                    }
                }

                Hubs.update({_id: hub._id}, {
                    $set: {
                        displayedIssues: displayedIssues
                    }
                });
            }

        }
    },

    setActiveFilter: function(hub, filter) {
        if (Meteor.isServer && Meteor.user()) {
            var newFilters = _.map(hub.filters, function(hubFilter) {
                hubFilter.active = false;
                if (filter.id === hubFilter.id) {
                    hubFilter.active = true;
                }
                return hubFilter;
            });
            Hubs.update({_id: hub._id}, {
                $set: {
                    filters: newFilters
                }
            });
            if (Meteor.isServer) {
                var displayedIssues = [];
                if (filter.id === "notes") {
                    var jiraUser = JiraUsers.findOne({name: hub.activeJiraUser});
                    displayedIssues = Notes.find({
                        userId: jiraUser.meetupUser,
                        hubId: hub._id
                    }, {
                        sort: {
                            lastModified: -1
                        }
                    }).fetch();
                }
                else {
                    var result = Meteor.call("apimethods_getIssuesForFilter", filter, hub);
                    if (result.data && result.data.issues) {
                        var displayedIssues = result.data.issues;
                    }
                }
                Hubs.update({_id: hub._id}, {
                    $set: {
                        displayedIssues: displayedIssues
                    }
                });
            }
        }
    }

});

validateHub = function(hub) {
    var errors = {};
    if (!hub.name) {
        errors.name = "Please fill in a name";
    }
    return errors;
};