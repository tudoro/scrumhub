/**
 * Created by tudor on 30/03/15.
 */

Template.hubNote.helpers({
    lastModifiedFormattedDate: function() {
        var date = new Date(this.lastModified);
        return date.toLocaleString();
    }
});

Template.hubNote.events({
    "click .delete": function(e) {
        e.preventDefault();
        Meteor.call("noteRemove", this);
    }
});