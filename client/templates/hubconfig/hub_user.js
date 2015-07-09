/**
 * Created by tudor on 26/02/15.
 */

Template.hubUser.helpers({
    userRemovable: function () {
        if (this.meetupUser !== Meteor.userId() || JIRAConnectorConfig.INDIVIDUAL_OAUTH_CONNECTIONS !== true)
            return true;
        return false;
    }
});