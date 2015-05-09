/**
 * Created by tudor on 14/03/15.
 */

Meteor.methods({
    apimethods_getIssuesForFilter: function(filter, hub) {
        if (Meteor.user()) {
            var jql = "assignee = '"+hub.activeJiraUser+"' AND " + filter.jql;
            return JIRAConnector.getIssuesByJQL(jql);
        }
    }
});
