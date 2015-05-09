/**
 * Created by tudor on 04/02/15.
 */

JiraUsers = new Mongo.Collection("JiraUsers");

Meteor.methods({
    addJiraUserToHub: function(hubId, jiraUser) {
        if (Meteor.user()) {
            var existingJiraUser = JiraUsers.findOne({key: jiraUser.key});
            if (!existingJiraUser) {
                var newJiraUser = _.extend(jiraUser, {
                    hubs: [hubId]
                });
                JiraUsers.insert(newJiraUser);
            } else if (existingJiraUser.hubs === undefined || existingJiraUser.hubs.indexOf(hubId) === -1) {
                JiraUsers.update({_id: existingJiraUser._id}, {
                    $push: {
                        hubs: hubId
                    }
                });
            }
        }
    },
    removeJiraUserFromHub: function(hubId, jiraUser) {
        if (Meteor.user()) {
            var existingJiraUser = JiraUsers.findOne({key: jiraUser.key});
            if (existingJiraUser) {
                JiraUsers.update({_id: existingJiraUser._id}, {
                    $pull: {
                        hubs: hubId
                    }
                });
                Notes.remove({hubId: hubId, userId: jiraUser.meetupUser});
            }
        }
    }
})