console.log("Loaded journey_date_selector.js");

function set_date_options() {

    //Function displays the date and time
    $(function () {
        console.log("Inside Show/Hide date function!");
        populate_date_data();
        populate_time_data();

        $(".datetime_option").click(function () {
            selected_datetime_option = $(this).val();
            if (selected_datetime_option === 'departureTime' || selected_datetime_option === 'arrivalTime') {
                document.getElementById("datetime_selector_container").style.display = "initial";
            }
            else {
                document.getElementById("datetime_selector_container").style.display = "none";
            }
        });
    });
}

function populate_date_data(){

    var today = new Date();
    current_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

    for (var day = 0; day < 7; day++) {
        date_value = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + (today.getDate() + day);
        date_string = new Date(today.setDate(today.getDate() + day)).toDateString();

        console.log(date_value);
        console.log(date_string);
        console.log();

        let new_date = document.createElement('option');
        new_date.value = date_value;
        var textnode = document.createTextNode(date_string);
        new_date.appendChild(textnode);

        document.getElementById("date").appendChild(new_date);
    }
}

function populate_time_data(){
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
    current_time = current_hour + ':' + current_minute;
    document.getElementById("journey_time").min = current_time;

    $('input[type="time"][value="now"]').each(function () {
        $(this).attr({'value': current_time});
    });
}