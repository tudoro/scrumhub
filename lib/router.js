/**
 * Created by tudor on 05/12/14.
 */

Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading',
    //notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe('hubs'), Meteor.subscribe("providers")]
    }
});

Router.route("/", {
    name: "home",
    template: "hubsList",
    yieldTemplates: {
        hubsListHeader: {to: "header"}
    }
});

Router.route("/hubs/add", {
    name: "addHub",
    template: "hubsList",
    yieldTemplates: {
        hubAdd: {to: "header"}
    }
});

Router.route("/oauth_callback", {
    name: "jiraOauthCallback",
    template: "jiraOauthCallback",
    data: function() {
        return this.params.query;
    }
});


requireLoginAndProvider = function() {
    console.log(this.params);
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        }
        else {
            this.render("accessDenied");
        }
    }
    else {
        if (!Providers.findOne({name: "jira", accessToken: {$ne: ""}})) {
            this.render("connectJira");
        }
        else {
            this.next();
        }
    }
};

Router.onBeforeAction(requireLoginAndProvider, {
    except:["jiraOauthCallback"]
});
