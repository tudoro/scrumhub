Template.hubActivity.helpers({
    hubUsers: function() {
        return JiraUsers.find({hubs: this._id});
    }
});

Template.hubActivity.events({
    "click .selectActivityUser": function(ev, template) {
        ev.preventDefault();
        Meteor.call("setActiveUserInHub", template.data, this);
    }
});
