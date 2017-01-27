/**
Core script to handle the navigation functions
**/
var Nav = function() {

	var handleState = function() {
		console.log('handleState');
	}


	var handleNav = function() {
		console.log('handleNav');

    	$('.nav-link').on('click', function() {
    		console.log('nav-clicked')

    		// reset nav
    		$('.nav-item').each(function(index, value) {
    			$(this).removeClass('open');
    			$(this).find('.selected').removeClass('selected');
    			$(this).find('.arrow').addClass('open');

    			$(this).find('.sub-menu').css('display', 'inital');
    			$(this).find('.sub-menu .nav-item').removeClass('active open');
    			$(this).find('.sub-menu .nav-item span:last-child').removeClass('selected');
    		});

    	});
    	
	}

	return {

	    // main function to initiate the nav handler
	    init: function() {	

	    	$('.page-sidebar-menu li:first-child').addClass('open');
	    	$('.nav-link:first > span:nth-child(3)').addClass('selected');
	    	$('.nav-link:first > span:nth-child(4)').addClass('open');

	    	$('.sub-menu:first').css('display','block');
	    	$('.sub-menu:first .nav-item').addClass('active open');
	    	$('.sub-menu:first .nav-item > .nav-link span:last-child').addClass('selected');

			handleState();
			handleNav();
		}

	};

}();

jQuery(document).ready(function() {    
   Nav.init(); 
});