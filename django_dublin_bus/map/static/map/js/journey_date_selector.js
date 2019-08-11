console.log("Loaded journey_date_selector.js");
function set_date_options(){
    //
    $(function(){
        var today = new Date()
        console.log("Today: "+today);
        for(var day =0 ;day < 7; day++){
            date_value = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + (today.getDate()+day);
            date_name = new Date(date_value);
            $("#date").append("<option value="+date_value+">"+date_name.toDateString()+"</option>");
        }
    });

    //Function displays the date and time
    $(function() {
        console.log("Inside Show/Hide date function!");

        $("#option").change(function () {
            if ($(this).val() == 'departureTime' || $(this).val() == 'arrivalTime'){
                $(".datetime_selector_container").show();
            }
            if ($(this).val() == 'now'){
                $(".datetime_selector_container").hide();
            }
        });
    });
}
