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
                                '</form>';
        generateRouteSearch();
        setRouteClick();
    }
    else if(info == "map"){
        info_section.innerHTML = "<h1>Map</h1>"
    }
    else if(info == "journey"){
        info_section.innerHTML = '<div class="page_container">' +
                                    '<div id="mySidebar" class="sidebar">' +
                                        '<a href="#">' +
                                            '<div id="right-panel">' +
                                                '<table id="route_options_container"></table>' +
                                            '</div>' +
                                        '</a>' +
                                    ' </div>' +
                                '</div>';
    }
}

