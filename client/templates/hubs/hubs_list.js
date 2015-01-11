/**
 * Created by tudor on 07/12/14.
 */

Template.hubsList.helpers({
    hubs: function() {
        if (Session.get("hubFilter") === "mine")
            return Hubs.find({owner: Meteor.userId()}, {sort: {lastModified: -1}});
        else
            return Hubs.find({}, {sort: {lastModified: -1}});
    }
});
