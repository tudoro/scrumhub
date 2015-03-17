/**
 * Created by tudor on 14/03/15.
 */

Meteor.methods({
    apimethods_getWorkedOnIssues: function(hub) {
        if (Meteor.user()) {
            var jql = "assignee was "+hub.activeJiraUser+" AFTER startOfDay(-3) AND " + hub.filter.jql;
            return JIRAConnector.getIssuesByJQL(jql);
        }
        return [];
    },
    apimethods_getWorkingOnIssues: function(hub) {
        if (Meteor.user()) {
            var jql = "assignee = '"+hub.activeJiraUser+"' AND " + hub.filter.jql;
            return JIRAConnector.getIssuesByJQL(jql);
        }
    }
});
