console.log("populate_info_section.js Loaded!");
var directions_button = document.getElementById("directions_view");
var favourites_button = document.getElementById("favourites_view");
var journey_button = document.getElementById("journey_view");

function populate_info(info){
    console.log("Called populate_info function!");
    var info_section = document.getElementById("info_section");
    info_section.innerHTML = "";
    if (info == "directions_view"){
        directions_button.classList.add("active_view");
        favourites_button.classList.remove("active_view");
        journey_button.classList.remove("active_view");
        info_section.innerHTML =
            '<form action="Getinput" method="get">' +
            '   <div class="grid-container">' +
            '       <div class="grid-y grid-padding-y">' +
            '           <div class="medium-6 cell">' +
            '               <input  type="text" name="input_route_origin" id="input_route_origin" placeholder="Enter Origin (Default Current Location)">' +
            '           </div>' +
            '          <div class="medium-6 cell">' +
            '               <input type="text" name="input_route_destination" id="input_route_destination" placeholder="Enter Destination">' +
            '           </div>' +
            '           <div class="medium-6 cell">' +
            '               <select id="option">'+
            '                   <option value="now">now</option>' +
            '                   <option value="departureTime">departureTime</option>' +
            '                   <option value="arrivalTime">arrivalTime</option>' +
            '               </select>' +
            '           </div>' +
            '           <div class="medium-6 cell datetime_selector_container" hidden="hidden">' +
            '               <select id="date"></select>' +
            '           </div>' +
            '           <div class="medium-6 cell datetime_selector_container" hidden="hidden">' +
            '               <input type="time" id="time" min="05:00" max="4:00" required>' +
            '           </div>' +
            '           <div class="medium-6 cell">' +
            '               <input type="button" id="route_submit" value="Search">' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</form>';
        generateRouteSearch();
        setRouteClick();
        set_date_options();
    }
    else if(info == "favourites_view"){
        directions_button.classList.remove("active_view");
        favourites_button.classList.add("active_view");
        journey_button.classList.remove("active_view");

        info_section.innerHTML = '<form action="Getinput" method="get">' +
                                    'Key <input type="text" name="set_home" id="set_home">' +
                                    'Location: <input type="text" name="set destination" id="set destination">' +
                                    '<input type="button" id="set_favourites" value="Save Favourite">' +
                                '</form>';
        capture_favourites();
    }
    else if(info == "journey_view"){
        directions_button.classList.remove("active_view");
        favourites_button.classList.remove("active_view");
        journey_button.classList.add("active_view");

        info_section.innerHTML = '<div id="mySidebar" class="sidebar">' +
                                    '<a href="#">' +
                                        '<div id="right-panel">' +
                                            '<table id="route_options_container" class="table-scroll"></table>' +
                                        '</div>' +
                                    '</a>' +
                                ' </div>';
    }
}

