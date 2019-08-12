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
                <input list="stationsList" placeholder="Search Stations" id="stationSelector" onchange="get_stop_info(this.value)">
                <datalist id="stationsList">`+stop_data_list_string+`</datalist>`;
    }
}

function get_stop_info(stop){
    console.log("You have clicked: " + stop);
    for(marker of markers){
        if(marker.stop_info.actual_stop_id === stop){
            map.setCenter(marker.getPosition());
            let stop_routes = AjaxGetRoutes(marker.stop_info.stop_id);
            console.log("Stop Routes Below!");
            console.log(stop_routes);
            // for(route of stop_routes){
            //     stop_info_section.innerHTML += `
            //     <div>Route: `+route.bus_number+`</div>
            //     <div>Headsign: `+route.stop_headsign+`</div>
            // `;
            // }

        }
    }
}
