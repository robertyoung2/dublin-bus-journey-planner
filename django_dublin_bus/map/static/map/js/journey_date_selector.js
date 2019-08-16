function set_date_options() {
    //Function displays the date and time
    $(function () {
        populate_time_data();

        $(".datetime_option").click(function () {
            selected_datetime_option = $(this).val();
            if (selected_datetime_option === 'departureTime' || selected_datetime_option === 'arrivalTime') {
                document.getElementById("datetime_selector_container").style.display = "initial";
                componentHandler.upgradeAllRegistered();
            }
            else {
                document.getElementById("datetime_selector_container").style.display = "none";
                componentHandler.upgradeAllRegistered();
            }
        });
    });
}


function populate_date_data(){
    var today = new Date();
    current_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

    for (var day = 0; day < 7; day++) {
        date_value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() + day);

        let next_day = new Date();

        date_string = new Date(next_day.setDate(next_day.getDate() + day)).toDateString();
        date_data_list_string += `<option value="${date_value}">${date_string}</option>`;
    }
    componentHandler.upgradeAllRegistered();
}


function populate_time_data(){
    var current_datetime = new Date(),
        current_hour = current_datetime.getHours(),
        current_minute = current_datetime.getMinutes(),
        current_minute_for_min = current_minute - 1;

    if(current_hour < 10){
        current_hour = '0' + current_hour;
    }

    if(current_minute < 10){
        current_minute = '0' + current_minute;
    }

    current_time = current_hour + ':' + current_minute;

    if(document.getElementById("journey_time")){
        document.getElementById("journey_time").min = current_hour + ":" + current_minute_for_min;
        document.getElementById("journey_time").value = current_time;
    }
}
