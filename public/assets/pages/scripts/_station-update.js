$(function() {

    var invalidFields = []; 

    // Clear the search fields
    $('#btn-cancel').on('click', function(){
        clearForm();
        $('button.close').click();
    });

    // Initalize select2 controls
    $('select').select2({
        allowClear: true,
        width: null
    });

    // Initalize dirty form
    $(document).bind('dirty.dirtyforms', function(event) {
        var form = $(event.target).closest('form');
        var disabled = !form.dirtyForms('isDirty');
        $('#btn-save').prop('disabled', disabled);
    });

    function clearForm() {
        $('input').each(function() {
            $(this).val('');
        });
        $('select').each(function() {
            $(this).val('').trigger('change');
        });
        $('input[type="text"]:first').focus();
    }

    function loadForm(data) {

        let uri = App.getAPIHost() + '/stations/' + data.id; // + '?cache=false';
        $.getJSON(uri, function(response) {

            let station;
            let genres = [];
            let locations = [];

            for (station of response.data) {
                genres.push(station.genreid);
                if (locations.indexOf(station.locationid) === -1) {
                    locations.push(station.locationid);
                }
            }

            var form = $('#frm-station-edit');
            $('input[name=id]', form).val(station.id);
            $('input[name=name]', form).val(station.name);
            $('input[name=site]', form).val(station.site);
            $('input[name=logo]', form).val(station.logo);
            $('select[name=codec]', form).val(station.codec);
            $('input[name=stream]', form).val(station.stream);
            $('select[name=status]', form).val(station.status);
            $('input[name=bitrate]', form).val(station.bitrate);
            $('input[name=description]', form).val(station.description);
            $('input[name=oldgenre]', form).val(genres.join());
            $('input[name=oldlocation]', form).val(locations.join());
            $('select[name=genre]', form).select2().val(genres).trigger('change');
            $('select[name=location]', form).select2().val(locations).trigger('change');
            form.dirtyForms();

        }).fail(function(jqXMLHttpRequest, textStatus, errorThrown) {
            App.unblockUI();
            App.alert({
                type: 'danger',
                message: jqXMLHttpRequest.responseJSON.error
            });
        });
    }


  // Save the record
  $('#btn-save').on('click', function() {

      var form = $(this).closest("form");
      if (form.parsley().isValid()) {

          // Get form field values
          var values = {};
          $('input:not(:hidden), select', form).each(function() {
              if($(this).val()) {
                  values[$(this).prop('name')] = $.trim($(this).val());
              }
          });          

          // Original Genre Values
          var ogids = [];
          $('option[data-ogid]', form).each(function() {
              ogids.push($(this).val());
          });
          values['ogids'] = ogids.join(',');

          // Get URL
          var url = App.getAPIHost() + '/stations/' + $('[name=id]', form).val();

          $.ajax({
              url: url,
              method: 'POST',
              data: JSON.stringify(values),
              dataType: 'json',
              contentType: 'application/json'})
          .done(function(response) {
              if(response.error) {
                  App.alert({
                      type: 'danger',
                      container: '.form-alert',
                      message: response.error.message,
                  });
              }
              else {
                App.alert({
                    type: 'success',
                    icon: 'smile-o',
                    message: 'Record successfully updated',
                    container: '.form-alert'
                });
              }
          })
          .fail(function(response) {
            console.log("Server Error: " + response.status + " " + response.statusText);
          });

      } else {
          form.parsley().validate();
          App.alert({
              type: 'danger',
              container: '.form-alert',
              message: 'The following fields are required: ' + invalidFields.join(', ')
          });
      }

  });

  $('#frm-station-edit').parsley().on('field:error', function(fieldInstance){
      
      var fieldName = titleCase(fieldInstance.$element[0].name);
      invalidFields.push(fieldName);
      // var ok = $('.parsley-error').length === 0;
      // $('.bs-callout-info').toggleClass('hidden', !ok);
      // $('.bs-callout-warning').toggleClass('hidden', ok);

  });          

  function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }

})
