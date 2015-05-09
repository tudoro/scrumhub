/**
 * Created by tudor on 07/01/15.
 */

Meteor.methods({
    startOAuth: function() {
        if (Meteor.user()) {
            var result = JIRAConnector.getOAuthRequestToken();
            if (result.success === true) {
                return {
                    success: true,
                    token: result.token
                };
            }
            else {
                return {
                    success:false
                }
            }
        }
    },

    finishOAuth: function(oAuthVerifier) {
        if (Meteor.user()) {
            var result = JIRAConnector.getOAuthAccessToken(oAuthVerifier);
            if (Meteor.isServer) {
                var jiraUser = JIRAConnector.getInfoAboutMyself().data;
                var existingJiraUser = JiraUsers.findOne({key: jiraUser.key});
                if (!existingJiraUser) {
                    var newJiraUser = _.extend(jiraUser, {
                        meetupUser: Meteor.userId()
                    });
                    JiraUsers.insert(newJiraUser);
                }
            }
            return result.success;
        }
    }
});
