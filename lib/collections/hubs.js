/**
 * Created by tudor on 07/12/14.
 */

Hubs = new Mongo.Collection("hubs");

Hubs.allow({
    remove: function(userId, hub) {
        return hub && hub.owner === userId;
    }
});

Meteor.methods({
    hubInsert: function(postAttributes) {
        var user = Meteor.user();
        var now = new Date();

        errors = validateHub(postAttributes);
        if (errors.name) {
            throw new Meteor.Error("invalid-hub", "Hub should contain at least a name");
        }

        var hub = _.extend(postAttributes, {
            owner: user._id,
            creator: user._id,
            lastModified: now,
            dateCreated: now
        });

        Hubs.insert(hub);
    }
});

validateHub = function(hub) {
    var errors = {};
    if (!hub.name) {
        errors.name = "Please fill in a name";
    }
    return errors;
};