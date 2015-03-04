/**
 * Created by tudor on 07/02/15.
 */

Template.hubConfigureParticipants.events({
    "click .doSearch": function(e, tplInstance) {
        e.preventDefault();
        var searchTerm = tplInstance.$(".searchTerm");
        if (searchTerm.val() !== "" && searchTerm.val().length > 3) {
            Session.set("hubConfigureParticipants_buttonEnabled", false);
            Meteor.call('apimethods_findUsers', searchTerm.val(), function(error, result) {
                if (error) {
                    Session.set("hubConfigureParticipants_buttonEnabled", true);
                }
                var hubUsers = JiraUsers.find({hubs: tplInstance.data.hub._id}).fetch();
                var foundUsers = _.map(result.data, function(user) {
                    var checkedUser = user;
                    checkedUser.added = false;
                    var userInHubAlready = _.find(hubUsers, function(hubUser) {
                        return hubUser.key === checkedUser.key;
                    });
                    if (userInHubAlready) {
                        checkedUser.added = true;
                    }
                    return checkedUser;
                });
                Session.set("hubConfigureParticipants_foundUsers", foundUsers);
                searchTerm.val("");
            });
        }
    },
    "keyup .searchTerm": function(e, tplInstance) {
        e.preventDefault();
        if ($(e.target).val().length > 3) {
            Session.set("hubConfigureParticipants_buttonEnabled", true);
        } else {
            Session.set("hubConfigureParticipants_buttonEnabled", false);
        }
    },

    "click .add": function(e, tplInstance) {
        Meteor.call("addJiraUserToHub", tplInstance.data.hub._id, this, function() {
            var foundUsers = Session.get("hubConfigureParticipants_foundUsers");
            var foundUserIndex = -2;
            _.find(foundUsers, function(user) {
                foundUserIndex++;
                return  (user.key === this.key);
            });
            foundUsers.splice(foundUserIndex, 1);
            Session.set("hubConfigureParticipants_foundUsers", foundUsers);
        });
    },

    "click .remove": function(e, tplInstance) {
        Meteor.call("removeJiraUserFromHub", tplInstance.data.hub._id, this, function() {
            var foundUsers = Session.get("hubConfigureParticipants_foundUsers");
            var foundUserIndex = -2;
            _.find(foundUsers, function(user) {
                foundUserIndex++;
                return  (user.key === this.key);
            });
            foundUsers.splice(foundUserIndex, 1);
            Session.set("hubConfigureParticipants_foundUsers", foundUsers);
        });
    }

});

Template.hubConfigureParticipants.helpers({
    foundUsers: function() {
        if (Session.get("hubConfigureParticipants_foundUsers") === "undefined") {
            return [];
        } else {
            return Session.get("hubConfigureParticipants_foundUsers");
        }
    },

    hubUsers: function() {
        return JiraUsers.find({hubs: this.hub._id});
    },

    buttonEnabled: function() {
        if (!Session.get("hubConfigureParticipants_buttonEnabled")) {
            return "disabled";
        }
        return "";
    }
});

