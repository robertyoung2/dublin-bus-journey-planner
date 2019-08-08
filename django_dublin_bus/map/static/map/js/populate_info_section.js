console.log("populate_info_section.js Loaded!");
function populate_info(info){
    console.log("Called populate_info function!");
    var info_section = document.getElementById("info_section");
    info_section.innerHTML = "";
    if (info == "directions"){
        info_section.innerHTML = '<form action="Getinput" method="get">' +
                                    'Origin: <input  type="text" name="input_route_origin" id="input_route_origin">' +
                                    'Destination: <input type="text" name="input_route_destination" id="input_route_destination">' +
                                    '<input type="button" id="route_submit" value="Search"></input>' +
                                '</form>' +
                                '<select id="option">'+
                                    '<option value="now">now</option>' +
                                    '<option value="departureTime">departureTime</option>' +
                                    '<option value="arrivalTime">arrivalTime</option>' +
                                '</select>' +
                                '<select id="date"></select>'+
                                '<input type="time" id="time" hidden="hidden">';
        generateRouteSearch();
        setRouteClick();
        set_date_options();
    }
    else if(info == "map"){
        info_section.innerHTML = '<form action="Getinput" method="get">' +
                                    'Key <input type="text" name="set_home" id="set_home">' +
                                    'Location: <input type="text" name="set destination" id="set destination">' +
                                    '<input type="button" id="set_favourites" value="Save Favourite"></input>' +
                                '</form>';
        capture_favourites();
    }
    else if(info == "journey"){
        info_section.innerHTML = '<div id="mySidebar" class="sidebar">' +
                                    '<a href="#">' +
                                        '<div id="right-panel">' +
                                            '<table id="route_options_container"></table>' +
                                        '</div>' +
                                    '</a>' +
                                ' </div>';
    }
}

