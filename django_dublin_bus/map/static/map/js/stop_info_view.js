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









            <ul class="tabs " data-tabs id="example-tabs">
              <li class="tabs-title is-active"><a href="#search_stop_view" aria-selected="true">Search Stop</a></li>
              <li class="tabs-title"><a href="#nearby_stops_view" onclick="generate_nearby_stop_info(true)">Nearby Stops</a></li>
            </ul>
            
            <div class="tabs-content" data-tabs-content="example-tabs">
              <div class="tabs-panel is-active" id="search_stop_view">
                <input list="stationsList" placeholder="Search Stations" id="stationSelector" oninput="search_stop_number(this.value)" onblur="clearSearch('stationSelector')">
                <datalist id="stationsList">${stop_data_list_string}</datalist>
                <div id="search_stop_view_content"></div>
              </div>
              <div class="tabs-panel" id="nearby_stops_view">
                    
              </div>
            </div>`;
        // $(document).foundation();
    }
}

function search_stop_number(stop){
    let search_stop_view = document.getElementById("search_stop_view_content");

    search_stop_view.innerHTML = "";

    for(marker of markers){
        if(marker.stop_info.actual_stop_id === stop){

            search_stop_view.innerHTML += `
                <ul id="searched_stop_list" class="accordion" data-accordion>
                    <li id="stop_${marker.stop_info.actual_stop_id}" class="accordion-item is-active" data-accordion-item>
                        <a href="#stop_${marker.stop_info.actual_stop_id}" class="accordion-title">${marker.stop_info.stop_name} (${marker.stop_info.actual_stop_id})</a>
                        <div id="searched_stop_content" class="accordion-content" data-tab-content >
                            <p>Routes Served:</p>
                        </div>
                    </li>  
                </ul>`;
            AjaxGetRoutes(marker.stop_info.stop_id, marker.stop_info.actual_stop_id, "searched_stop_content");
            map.setCenter(marker.getPosition());
            // $(document).foundation();
        }
    }
}

function generate_nearby_stop_info(button_clicked){
    console.log("Called generate stops function");
    let nearby_stops_view = document.getElementById("nearby_stops_view");

    if(nearby_stops_view.classList.contains("is-active") || button_clicked === true){
        nearby_stops_view.innerHTML = "";

        if(previous_markers.length > 0){
            nearby_stops_view.innerHTML = `
                <div class="table-scroll">
                    <table>
                        <tbody>
                            <tr>
                                <ul id="nearby_stops_list" class="accordion" data-accordion data-multi-expand="true" data-allow-all-closed="true"></ul>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;

            let nearby_stop_counter = 0;
            for(marker of previous_markers){
                document.getElementById("nearby_stops_list").innerHTML +=
                    `<li class="accordion-item" data-accordion-item>
                        <a href="#" class="accordion-title">${marker.stop_info.stop_name} (${marker.stop_info.actual_stop_id})</a>
                        <div id="nearby_stop_content_${nearby_stop_counter}" class="accordion-content" data-tab-content >
                        
                        </div>
                    </li>`;
                AjaxGetRoutes(marker.stop_info.stop_id, marker.stop_info.actual_stop_id, "nearby_stop_content_"+nearby_stop_counter);
                nearby_stop_counter++;
            }
            // $(document).foundation();
        }
        else{
            document.getElementById("stop_info_view_section").innerHTML +=
                `<div class="card" >No Nearby Stops</div>`;
        }

    }
}
