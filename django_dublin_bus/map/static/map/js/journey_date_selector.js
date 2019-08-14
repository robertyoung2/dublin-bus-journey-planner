console.log("Loaded journey_date_selector.js");

function set_date_options() {
    console.log("Called Set Datetime options Function!");
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

        $(".datetime_option").click(function () {
            selected_datetime_option = $(this).val();
            console.log($(this).val());
            if ($(this).val() === 'departureTime' || $(this).val() === 'arrivalTime') {
                console.log("Show container");
                document.getElementById("datetime_selector_container").style.display = "initial";
                // $(".datetime_selector_container").show();

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
                console.log("Hide container");
                document.getElementById("datetime_selector_container").style.display = "none";
                // $(".datetime_selector_container").hide();
            }
        });
    });
}