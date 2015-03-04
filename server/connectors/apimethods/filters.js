/**
 * Created by tudor on 07/02/15.
 */

Meteor.methods({
    apimethods_getUserFilters: function() {
        if (Meteor.user()) {
            return JIRAConnector.getUserFilters();
        }
        return [];
    }
});