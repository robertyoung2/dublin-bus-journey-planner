console.log("populate_info_section.js Loaded!");
var directions_button = document.getElementById("directions_view_button");
var favourites_button = document.getElementById("favourites_view_button");
var stop_info_button = document.getElementById("stop_info_view_button");

var directions_section = document.getElementById("directions_view_section");
var favourites_section = document.getElementById("favourites_view_section");
var stop_info_section = document.getElementById("stop_info_view_section");

var info_section = document.getElementById("info_section");

function populate_info(info){
    console.log("Called populate_info function!");


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

