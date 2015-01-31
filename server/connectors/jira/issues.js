/**
 * Created by tudor on 12/01/15.
 */

Meteor.methods({
   connectors_jira_filter: function() {
        return JIRAConnector.searchForUsers("tu");
   }
});
