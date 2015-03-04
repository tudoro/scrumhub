/**
 * Created by tudor on 07/12/14.
 */

Meteor.publish("hubs", function() {
    if (this.userId) {
        var allHubs = Hubs.find();
        //allHubs.forEach(function(hub) {
        //    var ownerName = "unknown";
        //    if (hub.owner !== undefined) {
        //        var owner = Meteor.users.find(hub.owner);
        //        if (owner) {
        //            ownerName = owner.name;
        //        }
        //    }
        //    _.extend(hub, {
        //        ownerName: ownerName
        //    });
        //
        //});
        //console.log(allHubs);
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