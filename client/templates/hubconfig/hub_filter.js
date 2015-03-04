/**
 * Created by tudor on 07/02/15.
 */

Template.hubFilter.helpers({
    addBtnClass: function() {
        return this.selectedInHub ? "btn-warning" : "btn-default";
    },

    addBtnText: function() {
        return this.selectedInHub ? "Active": "Select";
    }
});