console.log("Loaded journey_date_selector.js");

function set_date_options() {

    //Function displays the date and time
    $(function () {
        console.log("Inside Show/Hide date function!");

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

        // console.log(day);
        // console.log(today);
        // console.log(date_value);
        // console.log(date_string);
        // console.log();

        // <option value="${'{{bus_stop.actual_stop_id}}'}">${'{{bus_stop.stop_name}}'} (${'{{bus_stop.actual_stop_id}}'})</option>

        // let new_date = document.createElement('option');
        date_data_list_string += `<option value="${date_value}">${date_string}</option>`;
        // new_date.value = date_value;
        // if(day === 0){
        //     new_date.setAttribute('data-selected', "true");
        // }


        // let new_date = document.createElement('li');
        // new_date.classList.add("mdl-menu__item");
        // new_date.setAttribute('data-val', date_value);
        // if(day === 0){
        //     new_date.setAttribute('data-selected', "true");
        // }
        // var textnode = document.createTextNode(date_string);
        // new_date.appendChild(textnode);
        //
        // if(document.getElementById("date")){
        //     document.getElementById("date").appendChild(new_date);
        // }

    }
    componentHandler.upgradeAllRegistered();
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

    if(document.getElementById("journey_time")){
        document.getElementById("journey_time").min = current_time;
        document.getElementById("journey_time").value = current_time;
    }

}