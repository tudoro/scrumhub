/**
 * Created by tudor on 11/01/15.
 */
Template.connectJira.events({
   "click a": function(ev) {
       ev.preventDefault();
       Meteor.call('startOAuth', function(error, result) {
           if (result.success === true) {
               window.location.href = "http://localhost:8080/plugins/servlet/oauth/authorize?oauth_token=" + result.token;
           }
       });
   }
});