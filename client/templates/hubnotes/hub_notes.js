/**
 * Created by tudor on 18/03/15.
 */
Template.hubNotes.helpers({
    notes: function() {
        return Notes.find({
            userId: Meteor.userId(),
            hubId: this._id
        }, {
            sort: {
                lastModified: -1
            }
        });
    }
});