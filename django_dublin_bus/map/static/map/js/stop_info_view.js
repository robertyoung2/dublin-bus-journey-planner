console.log("Loaded stop_info_view script");
function generate_stop_info_view(){
    directions_button.classList.remove("active_view");
    favourites_button.classList.remove("active_view");
    stop_info_button.classList.add("active_view");

    favourites_section.style.display = "none";
    journey_results_section.style.display = "none";
    directions_section.style.display = "none";
    stop_info_section.style.display = "initial";

    if(stop_info_section.innerHTML === ""){
        stop_info_section.innerHTML = `
                <input list="stationsList" placeholder="Search Stations" id="stationSelector" onchange="search_stop_number(this.value)">
                <datalist id="stationsList">`+stop_data_list_string+`</datalist>`;
    }
}

function search_stop_number(stop){
    console.log("You have clicked: " + stop);
    for(marker of markers){

        if(marker.stop_info.actual_stop_id === stop){
            console.log(marker.stop_info.actual_stop_id);
            console.log(marker.stop_info.stop_id);
            stop_info_section.innerHTML += `<div>`+marker.stop_info.stop_name+` (`+marker.stop_info.actual_stop_id+`)</div>`;
            AjaxGetRoutes(marker.stop_info.stop_id, stop_info_section);
            map.setCenter(marker.getPosition());
        }
    }
}

function generate_nearby_stop_info(){
    if(document.getElementById("stop_info_view_section").style.display === "initial"){
        document.getElementById("stop_info_view_section").innerHTML = "";
        if(previous_markers.length > 0){
            for(marker of previous_markers){
                document.getElementById("stop_info_view_section").innerHTML +=
                    `<div>${marker.stop_info.stop_name} (${marker.stop_info.actual_stop_id})</div>`;
            }
        }
        else{
            document.getElementById("stop_info_view_section").innerHTML +=
                `<div>No Nearby Stops</div>`;
        }

    }
}
