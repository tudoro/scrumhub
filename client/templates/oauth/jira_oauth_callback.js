/**
 * Created by tudor on 11/01/15.
 */

Template.jiraOauthCallback.helpers({
    oAuthStatus: function() {
        if (Session.get("jiraOauthCallbackOauthStatus") === undefined ) {
            return "warning";
        }
        else if (Session.get("jiraOauthCallbackOauthStatus") === true) {
            return "success";
        }
        else {
            return "danger";
        }
    },
    oAuthStatusText: function() {
        if (Session.get("jiraOauthCallbackOauthStatus") === undefined ) {
            return "Almost wrapped up with connecting to your JIRA account...";
        }
        else if (Session.get("jiraOauthCallbackOauthStatus") === true) {
            return "Success! Your JIRA account is now set up.";
        }
        else {
            return "Oh snap, setting up your JIRA account failed. You could try again...";
        }
    }

});

Template.jiraOauthCallback.rendered = function() {
    Meteor.call('finishOauth', this.data.oauth_token, this.data.oauth_verifier, function(error, result) {
        if (result === true) {
            Session.set("jiraOauthCallbackOauthStatus", true);
        }
        else {
            Session.set("jiraOauthCallbackOauthStatus", false);
        }
    });
};
