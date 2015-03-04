/**
 * Created by tudor on 07/02/15.
 */

Template.hubConfigureFilters.events({
    "click .filter": function(ev, tplInstance) {
        ev.preventDefault();
        var self = this;
        Meteor.call("addFilterToHub", tplInstance.data.hub, this, function(){
            var newFilters = _.map(Session.get("hubConfigureFilters_filters"), function(filter) {
                var returnedFilter = filter;
                returnedFilter.selectedInHub = false;
                if (filter.id === self.id) {
                    returnedFilter.selectedInHub = true;
                }
                return returnedFilter;
            });
            Session.set("hubConfigureFilters_filters", newFilters);
        });
    }
});

Template.hubConfigureFilters.helpers({
    filters: function() {
        if (Session.get("hubConfigureFilters_filters")) {
            return Session.get("hubConfigureFilters_filters");
        }
        return [];
    }
});

Template.hubConfigureFilters.rendered = function() {
    var self = this;
    Meteor.call("apimethods_getUserFilters", function(error, result) {
        if (!error) {
            var filters = _.map(result.data, function(filter) {
                var returnedFilter = filter;
                returnedFilter.selectedInHub = false;
                if (self.data.hub.filter && filter.id === self.data.hub.filter.id) {
                    returnedFilter.selectedInHub = true;
                }
                return returnedFilter;
            });
            Session.set("hubConfigureFilters_filters", filters);
        }
    });
};