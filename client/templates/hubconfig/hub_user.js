/**
 * Created by tudor on 26/02/15.
 */

Template.hubUser.helpers({
    userRemovable: function () {
        if (this.meetupUser !== Meteor.userId())
            return true;
        return false;
    }
});