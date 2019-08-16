console.log("Loaded stop_info_view script");
function generate_stop_info_view(){
    console.log("Called Generate_stop_info_view");

    directions_button.classList.remove("active_view");
    favourites_button.classList.remove("active_view");
    stop_info_button.classList.add("active_view");

    favourites_section.style.display = "none";
    journey_results_section.style.display = "none";
    directions_section.style.display = "none";
    stop_info_section.style.display = "initial";

    if(stop_info_section.innerHTML === ""){

        stop_info_section.innerHTML = `

            <div class="mdl-tabs mdl-js-tabs">
                <div class="mdl-tabs__tab-bar">
                    <a id="search_stop_tab" href="#search_stop_view" class="mdl-tabs__tab">Search Stop</a>
                    <a href="#nearby_stops_view" class="mdl-tabs__tab" onclick="generate_nearby_stop_info(true)">Nearby Stops</a>
                </div>  
            
                <div class="mdl-tabs__panel is-active" id="search_stop_view">
                    <form action="#">
                        <div class="mdl-textfield mdl-js-textfield">
                            <input class="mdl-textfield__input search_stops_input"  type="text" list="stationsList" placeholder="Search Stations" id="stationSelector" oninput=" search_stop_number(this.value)" onblur="clearSearch('stationSelector')">
                            <label class="mdl-textfield__label" for="stationSelector"></label>
                        </div>
                    </form>
                    
                <datalist id="stationsList">${stop_data_list_string}</datalist>
                <div id="search_stop_view_content"></div>
                </div>
                <div class="mdl-tabs__panel" id="nearby_stops_view">
                </div>
            </div>
            `;
        componentHandler.upgradeAllRegistered();
    }
}

function search_stop_number(stop){

    let search_stop_view = document.getElementById("search_stop_view_content");

    search_stop_view.innerHTML = "";
    duetime_dict = {};

    for(marker of markers){
        if(marker.stop_info.actual_stop_id === stop){
            create_stop_info_card(
                marker.stop_info.stop_id,
                marker.stop_info.actual_stop_id,
                document.getElementById("search_stop_view_content"),
                "searched_stop_content"
            );
            map.setCenter(marker.getPosition());
        }
    }
}

function generate_nearby_stop_info(button_clicked){

    console.log("Called generate stops function");
    let nearby_stops_view = document.getElementById("nearby_stops_view");

    if(nearby_stops_view.classList.contains("is-active") || button_clicked === true){
        nearby_stops_view.innerHTML = "";

        if(previous_markers.length > 0){
            // console.log("Has previous markers");
            nearby_stops_view.innerHTML = `<div id="nearby_stops_list" class="mdl-grid"></div>`;
            duetime_dict = {};

            let nearby_stop_counter = 0;
            console.log("Before Create Stop info card");
            for(marker of previous_markers){
                create_stop_info_card(
                    marker.stop_info.stop_id,
                    marker.stop_info.actual_stop_id,
                    document.getElementById("nearby_stops_list"),
                    "nearby_stop_content_"+nearby_stop_counter
                );
                nearby_stop_counter++;
            }
        }
        else if (map.getZoom() <= 16){
            // console.log("No nearby stops!");
            nearby_stops_view.innerHTML +=
                `<div class="nearby_markers_message">Zoom in to see markers </div>`;

            // <i class="material-icons nearby_markers_message">zoom_in</i>
        } else {
                        nearby_stops_view.innerHTML +=
                `<div class="nearby_markers_message"> No nearby markers</div>`;
        }

    }
}

function create_stop_info_card(stop_id, actual_stop_id, injection_element, stop_input_id){
    injection_element.innerHTML +=`
        <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
   
            <div class="demo-card-wide mdl-card mdl-shadow--2dp">
            
                <div class="mdl-card__title">
                    <span class="mdl-card__title-text marker_stop_heading_nearby">${marker.stop_info.actual_stop_id} - ${marker.stop_info.stop_name}</span>
                </div>
            
                <div class="mdl-card__supporting-text">
                    <div id="${stop_input_id}"></div>
                </div>
                
            </div>
        </div>`;
    AjaxGetRoutes(marker.stop_info.stop_id, marker.stop_info.actual_stop_id, stop_input_id);
}