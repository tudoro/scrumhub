/**
 * Created by tudor on 28/03/15.
 */

Template.addHubNote.events({
    "submit form": function(ev) {
        ev.preventDefault();
        var note = {
            text: $(ev.target).find("[name=text]").val()
        }

        var errors = validateNote(note);
        if (errors.text) {
            return Session.set("addHubNote_noteErrors", errors);
        }
        Meteor.call("noteInsert", note, this._id, function() {
            $(ev.target).find("[name=text]").val("");
        });
    }
});

Template.addHubNote.created = function() {
    Session.set("addHubNote_noteErrors", {});
};

Template.addHubNote.helpers({
    errorMessage: function (field) {
        return Session.get("addHubNote_noteErrors")[field];
    },
    errorClass: function(field) {
        return !!Session.get("addHubNote_noteErrors")[field] ? "has-error" : "";
    }
});
