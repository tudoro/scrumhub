/**
 * Created by tudor on 02/02/15.
 */

Template.hubConfigure.helpers({
    active: function(category) {
       return this.config === category ? "active":"";
    }
});