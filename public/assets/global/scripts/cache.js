/**
Core script to handle the entire theme and core functions
**/
var Cache = function() {

    // initializes main settings
    var handleInit = function() {

    };

    return {

        //main function to initiate the theme
        init: function() {
            handleInit(); // initialize core variables
        },
        set: function(key, value) {
            this[key] = value;
        },
        get: function(key) {
            return this[key];
        }
    };

}();

jQuery(document).ready(function() {    
   Cache.init(); // init metronic core componets
});