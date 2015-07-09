/**
 * Created by tudor on 25/02/15.
 */

RouterFilters = {
    requireLoginAndProvider: function () {
        if (!Meteor.user()) {
            if (Meteor.loggingIn()) {
                this.render(this.loadingTemplate);
            }
            else {
                this.render("accessDenied");
            }
        }
        else {
            var provider = null;
            if (JIRAConnectorConfig.INDIVIDUAL_OAUTH_CONNECTIONS === true) {
                provider = Providers.findOne({name: "jira", user: Meteor.userId(), accessToken: {$ne: ""}});
            }
            else {
                provider = Providers.findOne({name: "jira", accessToken: {$ne: ""}});
            }
            if (!provider) {
                this.render("connectJira");
            }
            else {
                this.next();
            }
        }
    },

    hasAdminAccessToHub: function() {
        var hub = Hubs.findOne(this.params._id);
        if (hub.owner === Meteor.userId()) {
            this.next();
        }
        else {
            Router.go("/");
        }
    }
}
