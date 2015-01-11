/**
 * Created by tudor on 12/12/14.
 */
Template.hubsListHeader.helpers({
    filterClass: function(filterType) {
        if (Session.get("hubFilter") === filterType || (Session.get("hubFilter") === undefined && filterType === "all"))
            return "btn-primary";
        else
            return "btn-link";
    },
    hubsCount: function(filterType) {
        if (filterType === "mine")
            return Hubs.find({owner: Meteor.userId()}).count();
        else
            return Hubs.find().count();
    }
});

Template.hubsListHeader.events({
    "click .filter-all": function() {
        Session.set("hubFilter", "all");
    },
    "click .filter-mine": function() {
        Session.set("hubFilter", "mine");
    },
    "click .add-hub": function() {
        Router.go("addHub");
    }
});