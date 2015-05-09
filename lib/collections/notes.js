/**
 * Created by tudor on 18/03/15.
 */

Notes  = new Mongo.Collection("Notes");

validateNote = function validateNote(note) {
    var errors = {};
    if (!note.text) {
        errors.text = "Please write something first!";
    }
    return errors;
}

Meteor.methods({
    noteInsert: function(note, hubId) {
        if (Meteor.user()) {
            var jiraUser = JiraUsers.findOne({meetupUser: Meteor.userId(), hubs: hubId});
            if (jiraUser) {
                errors = validateHub(note);
                if (errors.text) {
                    throw new Meteor.Error("invalid-note", "The note should have a text at least");
                }
                var now = new Date();
                var noteToInsert = _.extend(note, {
                    hubId: hubId,
                    userId: Meteor.userId(),
                    lastModified: now,
                    dateCreated: now
                });
                Notes.insert(noteToInsert);
            }
        }
    },
    noteRemove: function(note) {
        if (Meteor.user() && note.userId === Meteor.userId()) {
            Notes.remove(note._id);
        }
    }
});
