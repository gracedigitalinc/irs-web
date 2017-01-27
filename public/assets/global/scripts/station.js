/**
Core script to handle the Station functions
**/
var Station = function() {

	var _delete = function(data) {
            // Get URL
            var uri = App.getAPIHost() + '/stations/' + data.id;

            $.ajax({
                url: uri, 
                method: 'DELETE',
            	contentType: 'application/json'
            })
            .done(function(response) {
                if(response.error) {
                    App.alert({
                        type: 'danger', 
                        container: '.form-alert', 
                        message: response.error.message
                    });
                }
                else {
                    App.alert({
                        type: 'success', 
                        icon: 'smile-o',
                        message: 'Record successfully deleted', 
                        container: '.form-alert'
                    });
                }
            })
            .fail(function(response) {
                console.log("Server Error: " + response.status + " " + response.statusText);
            });  
    	}

    	return {
    	    // main function to initiate the nav handler
    	    init: function() {	
    	    	// do stuff
    		},
    		delete: _delete
    	};

}();

jQuery(document).ready(function() {    
   Station.init(); 
});