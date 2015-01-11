/**
 * Created by tudor on 07/12/14.
 */

Template.hubItem.helpers({
    ownHub: function() {
        return this.owner === Meteor.userId();
    },
    ownerUser: function() {
        if (this.owner === Meteor.userId()) {
            return "<a href = '#'>yourself</a>";
        }
        else {
            return "<a href = '#'>" + this.ownerName + "</a>";
        }
    },
    lastModifiedFormattedDate: function() {
        var date = new Date(this.lastModified);
        return date.toLocaleString();

    }
});
Template.hubItem.events({
    "click .delete": function(e) {
        e.preventDefault();
        Hubs.remove(this._id);
    }
});
