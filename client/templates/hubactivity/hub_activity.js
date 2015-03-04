Template.hubActivity.helpers({
    hubUsers: function() {
        console.log(this);
        return JiraUsers.find({hubs: this._id});
    }
});

Template.hubActivity.events({
    "click .selectActivityUser": function(ev, template) {
        ev.preventDefault();
        Hubs.update(this._id, {
           $set: {
               activeJiraUser: template.data._id
           }
        });
    }
})