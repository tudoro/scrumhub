/**
 * Created by tudor on 16/12/14.
 */
Template.hubAdd.events({
    "submit form": function(ev) {
        ev.preventDefault();

        var hub = {
            name: $(ev.target).find('[name=name]').val(),
            description: $(ev.target).find('[name=description]').val()
        };

        var errors = validateHub(hub);
        if (errors.name) {
            return Session.set("hubErrors", errors);
        }

        Meteor.call("hubInsert", hub, function(error, result) {
            if (error)  {
                return alert(error.reason);
            }
            Router.go('home');
        });
    },
    "click .cancel-create-hub": function (ev) {
        ev.preventDefault();
        Router.go("home");
    }
});

Template.hubAdd.created = function() {
    Session.set("hubErrors", {});
}

Template.hubAdd.helpers({
    errorMessage: function(field) {
        return Session.get("hubErrors")[field];
    },
    errorClass: function(field) {
        return !!Session.get("hubErrors")[field] ? "has-error" : "";
    }
});
