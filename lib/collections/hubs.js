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
                filter: null
            });
            var hubId = Hubs.insert(hub);

            if (Meteor.isServer) {
                var jiraUser = JIRAConnector.getInfoAboutMyself().data;
                var existingJiraUser = JiraUsers.findOne({key: jiraUser.key});
                if (!existingJiraUser) {
                    var newJiraUser = _.extend(jiraUser, {
                        hubs: [hubId],
                        owns: [hubId],
                        meetupUser: Meteor.userId()
                    });
                    JiraUsers.insert(newJiraUser);
                } else if (existingJiraUser.hubs.indexOf(hubId) === -1) {
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
            Hubs.remove(hub._id);
        }
    },

    addFilterToHub: function(hub, filter) {
        if (Meteor.user()) {
            Hubs.update({_id: hub._id}, {
                $set: {
                    filter: filter
                }
            });
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