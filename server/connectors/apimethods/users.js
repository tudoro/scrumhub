/**
 * Created by tudor on 12/01/15.
 */

Meteor.methods({
   apimethods_findUsers: function(userSearchTerm) {
       if (Meteor.user()) {
           return JIRAConnector.searchForUsers(userSearchTerm);
       }
       return [];
   }
});
