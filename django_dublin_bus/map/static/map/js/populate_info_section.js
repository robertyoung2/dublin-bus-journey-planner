console.log("populate_info_section.js Loaded!");
var directions_button = document.getElementById("directions_view_button");
var favourites_button = document.getElementById("favourites_view_button");
var journey_button = document.getElementById("stop_info_view_button");
var info_section = document.getElementById("info_section");

function populate_info(info){
    console.log("Called populate_info function!");

    info_section.innerHTML = "";
    if (info == "directions_view"){
        generate_directions_views();
    }
    else if(info == "favourites_view"){
        generate_favourites_view();
    }
    else if(info == "stop_info_view"){
        generate_stop_info_view();
    }
}

