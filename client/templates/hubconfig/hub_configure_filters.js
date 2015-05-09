/**
 * Created by tudor on 07/02/15.
 */

Template.hubConfigureFilters.events({
    "click .filter": function(ev, tplInstance) {
        ev.preventDefault();
        var self = this;
        Meteor.call("addFilterToHub", tplInstance.data.hub, this, function() {
            var newFilters = _.map(Session.get("hubConfigureFilters_filters"), function(filter) {
                var returnedFilter = filter;
                //returnedFilter.selectedInHub = false;
                if (filter.id === self.id) {
                    returnedFilter.selectedInHub = !self.selectedInHub;
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
            var filters = result.data;
            _.each(filters, function(filter, index) {
                filters[index].selectedInHub = false;
                if (self.data) {
                    for (var count = 0; count < self.data.hub.filters.length; count++) {
                        if (self.data.hub.filters[count].id === filter.id) {
                            filters[index].selectedInHub = true;
                            break;
                        }
                    }
                }
            });
            Session.set("hubConfigureFilters_filters", filters);
        }
    });
};