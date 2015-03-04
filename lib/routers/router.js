/**
 * Created by tudor on 05/12/14.
 */

Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading',
    //notFoundTemplate: 'notFound',
    waitOn: function() {
        return [Meteor.subscribe('hubs'), Meteor.subscribe("providers"), Meteor.subscribe("jiraUsers")]
    }
});

Router.route("/", {
    name: "home",
    template: "hubsList",
    yieldTemplates: {
        hubsListHeader: {to: "header"}
    }
});

Router.route("/hubs/create", {
    name: "addHub",
    template: "hubsList",
    yieldTemplates: {
        hubAdd: {to: "header"}
    }
});

Router.route("/hubs/:_id/configure/participants", {
    name: "configureHubParticipants",
    template: "hubConfigureParticipants",
    yieldTemplates: {
        hubConfigure: {to: "header"}
    },
    data: function() {
        var templateData = {};
        templateData.hub = Hubs.findOne(this.params._id);
        templateData.config = "participants";
        templateData._id = this.params._id;
        return templateData;
    },
    onBeforeAction: RouterFilters.hasAdminAccessToHub
});

Router.route("/hubs/:_id/configure/filters", {
    name: "configureHubFilters",
    template: "hubConfigureFilters",
    yieldTemplates: {
        hubConfigure: {to: "header"}
    },
    data: function() {
        var templateData = {};
        templateData.hub = Hubs.findOne(this.params._id);
        templateData.config = "filters";
        templateData._id = this.params._id;
        return templateData;
    },
    onBeforeAction: RouterFilters.hasAdminAccessToHub
});

Router.route("/oauth_callback", {
    name: "jiraOauthCallback",
    template: "jiraOauthCallback",
    data: function() {
        return this.params.query;
    }
});

Router.route("/hub/:_id/activity", {
    name: "hubActivity",
    template: "hubActivity",
    yieldTemplates: {
        hubActivityHeader: {to: "header"}
    },
    data: function() {
        return Hubs.findOne(this.params._id);
    }
});


Router.onBeforeAction(RouterFilters.requireLoginAndProvider, {
    except:["jiraOauthCallback"]
});
