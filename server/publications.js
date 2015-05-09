/**
 * Created by tudor on 07/12/14.
 */

Meteor.publish("hubs", function() {
    if (this.userId) {
        var allHubs = Hubs.find();
        return allHubs;
    }
    return [];
});

Meteor.publish("providers", function() {
    if (this.userId) {
        var providersForTheLoggedInUser = Providers.find();
        return providersForTheLoggedInUser;
    }
    return [];
});

Meteor.publish("jiraUsers", function() {
    if (this.userId) {
        var jiraUsers = JiraUsers.find();
        return jiraUsers;
    }
    return [];
});

Meteor.publish("notes", function() {
    if (this.userId) {
        return Notes.find({userId: this.userId});
    }
    return [];
});