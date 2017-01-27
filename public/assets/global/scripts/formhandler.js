var FormHandler = function () {

	var setDefaults = function () {
		// $.validator.setDefaults({
		// 	submitHandler: function(form) { 
		// 		console.log(form);
		// 	}
		// });
	}

	

	var _getValidator = function (form) {

		var validator = form.validate({
	      errorElement: 'span', //default input error message container
	      errorClass: 'help-inline', // default input error message class
	      focusInvalid: true, // do not focus the last invalid input
	      ignore: "",
	      rules: FormHelper.getFormRules($(form).attr('id')),
	      messages: FormHelper.getFormMessages($(form).attr('id')),
	      invalidHandler: function (event, validator) { //display error alert on form submit 
	          $(this).hide();
	          $(this).show();
	          App.scrollTo($(this), -200);
	      },
	      highlight: function (element) { // hightlight error inputs
	          $(element).closest('.help-inline').removeClass('ok'); // display OK icon
	          $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
	      },
	      unhighlight: function (element) { // revert the change done by hightlight
	          $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
	      },
	      success: function (label) {
	  				label.addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
	  		          .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
	      },
	      errorPlacement: function (error, element) {
	          error.insertAfter(element.closest('.form-control'));
	      }
		});

		return validator;
	}
	
	var _isValidForm = function (form) {

		var result;
		var validator;
		console.log('validator');
		validator = _getValidator(form);
		console.log(validator)
		result = (validator.form()) ? true : false;
		console.log('is form valid')
		console.log(result);
		return result;
	} 

	// handlers
    var handleEvents = function () {

		// handle enter key
		$('input[type=text]', 'form:visible').on('keypress', function(e) {
		    if(e.which == 13) {
		    	var form = $(this).closest('form');
		    	if(form.data('src') != 'ajax') {
		        	form.submit();
		    		return false;
		    	}
		    }
		});

		// handle save button
		// $('#btn-save', 'form:visible').on('click', function(e) {
			// UI.stopEvent(e);
			// Notify.clearMessages();
		// 	$(this).closest('form').submit();
		// });

		// handle cancel button
		// $('#btn-cancel', 'form:visible').on('click', function(e) {
		// 	Notify.clearMessages();
		// 	cleanForm();
		// });

		// handle close button
		// $('#btn-close').on('click', function(e) {
		// 	console.log('checkpoint #2');
		// 	_cleanForm($(this).closest('form'));
		// });

		// handle validation and submission
	}

	// private functions
	var _cleanForm = function (form) {
		// var validator = _getValidator(form);
		// validator.resetForm();
		form.validate().resetForm();
		// form.validate().reset();
	}

	//	public functions
	return {
		init: function () {
			setDefaults();
			// initControls();
			handleEvents();
		},
		isValid: _isValidForm,
		reset: _cleanForm
	}

}();

jQuery(document).ready(function() {    
   FormHandler.init(); // init metronic core componets
});

/*
 * Form Serializer
 */
(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);