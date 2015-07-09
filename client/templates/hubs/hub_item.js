/**
 * Created by tudor on 07/12/14.
 */

Template.hubItem.helpers({
    ownHub: function() {
        return this.owner === Meteor.userId();
    },
    accessToHub: function() {
        JiraUsers.findOne({key: jiraUser.key});
    },
    lastModifiedFormattedDate: function() {
        var date = new Date(this.lastModified);
        return date.toLocaleString();
    },
    canJoin: function() {
        if (JIRAConnectorConfig.INDIVIDUAL_OAUTH_CONNECTIONS === true) {
            var jiraUserInHub = JiraUsers.findOne({meetupUser: Meteor.userId(), hubs: this._id});
            if (jiraUserInHub !== undefined && typeof jiraUserInHub === "object") {
                return true;
            }
            return false;
        }
        return true;
    },
    canCreateNotes: function() {
        var jiraUserInHub = JiraUsers.findOne({meetupUser: Meteor.userId(), hubs: this._id});
        if (jiraUserInHub !== undefined && typeof jiraUserInHub === "object") {
            return true;
        }
        return false;
    }
});
Template.hubItem.events({
    "click .delete": function(e) {
        e.preventDefault();
        Meteor.call("hubRemove", this);
    }
});
