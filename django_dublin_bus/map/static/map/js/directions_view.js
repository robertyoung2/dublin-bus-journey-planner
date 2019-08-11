function generate_directions_views(){
    console.log("INSIDE DIRECTIONS VIEW");
    directions_button.classList.add("active_view");
    favourites_button.classList.remove("active_view");
    stop_info_button.classList.remove("active_view");

    favourites_section.style.display = "none";
    stop_info_section.style.display = "none";
    directions_section.style.display = "initial";


    if(directions_section.innerHTML === ""){
        directions_section.innerHTML =`
            <form action="Getinput" method="get">
                <div class="grid-container">
                    <div class="grid-x align-center">
                        <div class="cell small-8 medium-8">
                            <input  type="text" name="input_route_origin" id="input_route_origin" placeholder="Enter Origin (Default Current Location)">
                        </div>
                        <div class="cell small-2 medium-2">
                            <a tabindex="-1" onclick="clearSearch('input_route_origin')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/clear_search.png"></a>
                        </div>
                        <div class="cell small-8 medium-8">
                            <input type="text" name="input_route_destination" id="input_route_destination" placeholder="Enter Destination">
                        </div>
                        <div class="cell small-2 medium-2">
                            <a tabindex="-1" onclick="clearSearch('input_route_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/clear_search.png"></a>
                        </div>
                    </div>
                    <div class="grid-x align-center">
                        <div class="cell small-6 medium-6 large-4">
                            <select id="option">
                                <option value="now">Now</option>
                                <option value="departureTime">Departure Time</option>
                                <option value="arrivalTime">Arrival Time</option>
                            </select>
                        </div>
                        <div class="cell small-4 medium-4 large-6"></div>
                    </div>
                    <div class="grid-x align-center">
                        <div class="small-6 medium-6 cell datetime_selector_container" hidden="hidden">
                            <select id="date"></select>
                        </div>
                        <div class="small-3 medium-3 cell datetime_selector_container" hidden="hidden">
                            <input type="time" id="journey_time" value="now" required>
                        </div>
                        <div class="small-1 medium-1 cell"></div>
                    </div>
                    <div class="grid-x align-center">
                        <div class="small-3 medium-3 cell">
                            <input type="button" id="route_submit" value="Search">
                        </div>
                        <div class="small-7 medium-7 cell"></div>
                    </div>
               </div>
            </form>`;
        generateRouteSearch();
        setRouteClick();
        set_date_options();
    }
}