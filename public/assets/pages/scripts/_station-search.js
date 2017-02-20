$(function() {

    var table;

    // Load sub-table
    function loadDetails(data) {
        var table = '';
            table += '<table width="100%">';
            table += '<thead><tr style="border:1px solid #efefef;">';
            table += '<td style="border:1px solid #efefef;">Site</td><td style="border:1px solid #efefef;">Logo</td><td style="border:1px solid #efefef;">Description</td></tr></thead>';
            table += '<tbody><tr><td style="color:#337ab7; background-color:#f4f6f7; border:1px solid #efefef;">' + data.site + '</td>';
            table += '<td style="color:#337ab7; background-color:#f4f6f7; border:1px solid #efefef;">' + data.logo + '</td>';
            table += '<td style="color:#337ab7; background-color:#f4f6f7; border:1px solid #efefef;">' + data.description + '</td></tr></tbody>';
            table += '</table>';
            return table;
    }

    // Load search results table
    function loadTable(result) {
        table = $('#tbl-stations').DataTable({
            "cache": true,
            "destroy": true,
            "responsive": true,
            "data": result.data,
            "columns": [
                // {"data":"id", "visible": false },
                {"data":"name"},
                {"data":"stream"},
                {"data":"genre",
                    "render": function (data, type, full, meta) {
                        var values = [];
                        var json = JSON.parse(data);
                        for (let genre of json.genres) {
                            values.push(genre.text);
                        }
                        return values.join(', ');
                    }
                },
                {"data":"location"},
                {"data": "id",
                    "className": "details-control",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        html += '<a href="#" class="btn btn-sm btn-outline btn-edit" id="'+data+'"><i class="fa fa-pencil"></i> Edit</a>';
                        html += '<a href="#" class="btn btn-sm btn-outline btn-delete"><i class="fa fa-trash-o" style="color:#e7505a;"></i> Delete</a>';
                        return html;
                    }
                }
            ],
            "stateLoadCallback": function (settings) {
                console.log("SETTINGS:");
                console.log(settings);
            }
        });
    }

    function getGenreData() {
        var form = $('#frm-station-edit');
        return $('select[name=genre]', form).val();
    }

    function getLocationData() {
        var form = $('#frm-station-edit');
        return $('select[name=location]', form).val();
    }

    function getSearchValue(data) {
        var result = '';
        if(Array.isArray(data)) {
            result = data.join('|');
        } else {
            result = data;
        }
        return $.trim(result);
    }

    // Add event listener for editing
    $('#tbl-stations tbody').on('click', '.btn-edit', function () {
        var id = $(this).prop('id');
        location.href = '/stations/update?id='+id;
        
        // sessionStorage.station = JSON.stringify(data);
        // loadForm(row.data());
        // $('#station-edit').show();
        // $('#search-results').hide();
    });

    // Add event listener for deleting
    $('#tbl-stations tbody').on('click', '.btn-delete', function () {

        var tr = $(this).closest('tr');
        var row = table.row(tr);
        bootbox.prompt("Confirm Delete<br><small>Please enter the word <strong>DELETE</strong> to confirm the deletion</small>",
            function(result) {
            if (result === null) {
                // cancel
            } else if (result.toUpperCase() === 'DELETE') {
                // delete
                console.log(row.data());
                Station.delete(row.data());
            }
        });

    });

    // Hide - Show advanced search fields
    $('#btn-advanced-search').on('click', function() {
        $('#advanced-search').toggle();
    });

    $('#btn-close').on('click', function() {
        var form = $(this).closest("form");
        form.parsley().reset();
        $('#station-edit').hide();
        $('#search-results').show();
        $('.form-alert .close').click();
        $('#btn-save').prop('disabled', true);
    });

    // Clear the search fields
    $('#btn-cancel').on('click', function(){
        $('input[type="text"]', '#frm-search').each(function() {
            $(this).val('');
        });
        $('input[type="text"]:first', '#frm-search').focus();
    });

    // Save the record
    // $('#btn-save').on('click', function() {
    //     var form = $(this).closest("form");
    //     if (form.parsley().isValid()) {

    //         // Get form field values
    //         var values = [];
    //         $('input, select', form).each(function() {
    //             if($(this).val()) {
    //                 let prop = $(this).prop('name') + '=' + $(this).val();
    //                 values.push(prop);
    //             }
    //         });

    //         // Get URL
    //         var uri = App.getAPIHost() + '/stations/' + $('[name=id]', form).val();

    //         $.ajax({
    //             url: uri,
    //             method: 'POST',
    //             data: values.join('&'),
    //             contentType: 'application/json'})
    //         .done(function(response) {
    //             if(response.error) {
    //                 App.alert({
    //                     type: 'danger',
    //                     container: '.form-alert',
    //                     message: response.error.message,
    //                 });
    //             }
    //             else {
    //                 App.alert({
    //                     type: 'success',
    //                     icon: 'smile-o',
    //                     message: 'Record successfully updated',
    //                     container: '.form-alert'
    //                 });
    //             }
    //         })
    //         .fail(function(response) {
    //             console.log("Server Error: " + response.status + " " + response.statusText);
    //         });

    //     } else {
    //         form.parsley().validate();
    //         App.alert({
    //             type: 'danger',
    //             container: '.form-alert',
    //             message: 'One or more fields contains errors'
    //         });
    //     }
    // });


    /*
     *  Execute the search
     */
    $('#btn-search').on('click', function() {

        // $('#station-edit').hide();
        $('#search-results').show();
        $('button.close').click();

        var qs = [];
        $('input:visible, select:visible', '#frm-search').each(function(){
            if($(this).val()) {
                qs.push($(this).attr('name') + '=' + getSearchValue($(this).val()));
            }
        });
console.log(qs);
// return false;
        App.blockUI();

        var uri = App.getAPIHost() + '/stations?';

        $.getJSON(uri + qs.join('&'), function(data) {
            console.log(data);

            if(data.count > 0) {
                loadTable(data);
            } else {
                App.alert({
                    type: 'warning',  // alert's type
                    message: 'No results found',
                    icon: 'frown-o'
                });
                if(table) {
                    table.clear().draw();
                }
            }
            App.unblockUI();

        }).fail(function(jqXMLHttpRequest, textStatus, errorThrown) {
            $error = jqXMLHttpRequest.responseJSON || jqXMLHttpRequest.responseText;
            App.unblockUI();
            App.alert({
                type: 'danger',
                message: $error
            });
        });
    });

    $(document).bind('dirty.dirtyforms', function(event) {
        var form = $(event.target).closest('form');
        var disabled = !form.dirtyForms('isDirty');
        $('#btn-save').prop('disabled', disabled);
    });

    // Handle enter key to trigger the search button
    $('#frm-search').on('keypress', 'input[type=text]', function(e) {
        if(e.which == 13) {
            $('#btn-search').click();
        }
    });

    // Handle portlet refresh
    $('.reload').on('click', function(){
        $('#btn-cancel').trigger('click');
    });

    // Initalize select2 controls
    $('select', '#frm-search').select2({
        allowClear: true,
        width: null
    });

})