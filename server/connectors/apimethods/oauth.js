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
            return result.success;
        }
    }
});
