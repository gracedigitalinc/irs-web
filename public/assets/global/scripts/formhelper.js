var FormHelper = function () {

	/* 
		public functions
	*/
	return {

		getFormRules: function(id) {

			var rules;
			
			switch(id) {
				case 'frm-station-edit':
					rules = {
			     		name: {
			     			required: true, 
			     			minlength: 3,
			     			maxlength: 255
			     		},
			     		status: {
			     			required: true
			     		},
			     		stream: {
			     			required: true,
			     			url: true
			     		},
			     		site: {
			     			required: false,
			     			url: true
			     		},
			     		logo: {
			     			required: false,
			     			url: true
			     		},
			            description: {
			            	required: false,
			     			maxlength: 255			            	
			            }
			        }
			        break;				

			    case 'frm-user-password':
			        rules = {
			            subaccount_password: {
			                required: true, 
			                pwcheck: true,
			                minlength: 3,
			            }, 
			            subaccount_new_password: {
			                required: true, 
			                pwcheck: true,
			                minlength: 3,
			                equalTo: "#password"
			            }
			        }
			        break;			    		
			}
			return rules;
		},

		getFormMessages: function(id) {

			var messages;

			switch(id) {
				case 'frm-station-update':
					messages = {
						/*
						name: {
			                required: "This field is required to submit the form."
			            },
						status: {
			                required: "This field is required to submit the form."
			            }
			            */
			        }
			        break;
			    
				case 'frm-user-password':
					messages = {
			            subaccount_password: {
			                required: "This field is needed to submit the form."
			            },			            
			            subaccount_new_password: {
			                required: "This field is required and must match the new password."
			            },
			        }
			        break;

				default:
			        break;
			}
			return messages;
		}
	}

}();