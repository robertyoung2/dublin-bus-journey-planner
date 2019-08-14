console.log("Loaded journey_date_selector.js");

function set_date_options() {
    //
    $(function () {
        var today = new Date();
        console.log("Today: " + today);
        for (var day = 0; day < 7; day++) {
            date_value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() + day);
            date_name = new Date(date_value);
            $("#date").append("<option value=" + date_value + ">" + date_name.toDateString() + "</option>");
        }
    });

    //Function displays the date and time
    $(function () {
        console.log("Inside Show/Hide date function!");

        $("#option").change(function () {
            if ($(this).val() === 'departureTime' || $(this).val() === 'arrivalTime') {
                $(".datetime_selector_container").show();

                $(function () {
                    //Sets default time to now
                    var current_datetime = new Date(),
                        current_hour = current_datetime.getHours(),
                        current_minute = current_datetime.getMinutes();
                    if(current_hour < 10){
                        current_hour = '0' + current_hour;
                    }
                    if(current_minute < 10){
                        current_minute = '0' + current_minute;
                    }
                    $('input[type="time"][value="now"]').each(function () {
                        $(this).attr({'value': current_hour + ':' + current_minute});
                    });
                });
            }
            else {
                $(".datetime_selector_container").hide();
            }
        });
    });
}