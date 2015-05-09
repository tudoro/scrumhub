/**
 * Created by tudor on 12/03/15.
 */
Template.hubActivityDetails.helpers({
    items: function(type) {
        var items = [];
        if (this.displayedIssues.length > 0) {
            if (this.displayedIssues[0].key !== undefined) {
                items = this.displayedIssues;
            }
            else {
                _.each(this.displayedIssues, function(note) {
                    var date = new Date(note.lastModified);
                    items.push({
                        key: date.toLocaleString(),
                        renderedFields: {
                            description: note.text
                        }
                    });
                });
            }
        }

        return items;
    }
});

Template.hubActivityDetails.events({
    "click .filter": function(ev, template) {
        ev.preventDefault();
        Meteor.call("setActiveFilter", template.data, this);
    }
});