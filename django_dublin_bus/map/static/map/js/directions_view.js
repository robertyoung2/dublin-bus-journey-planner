var showing_journey_results = false;
function generate_directions_views(){

    console.log("INSIDE DIRECTIONS VIEW");
    directions_button.classList.add("active_view");
    favourites_button.classList.remove("active_view");
    stop_info_button.classList.remove("active_view");

    favourites_section.style.display = "none";
    stop_info_section.style.display = "none";


    if(!showing_journey_results){
        journey_results_section.style.display = "none";
        directions_section.style.display = "initial";

        if(directions_section.innerHTML === ""){
            directions_section.innerHTML =`

<form class="cell" action="Getinput" method="get">

<!--    Origin Input-->

    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
            <div class="mdl-textfield mdl-js-textfield ">
                <input class="mdl-textfield__input" type="text" name="input_route_origin" id="input_route_origin" placeholder="Enter Origin (Default Current Location)">
                <label class="mdl-textfield__label" for="input_route_origin"></label>
            </div>
        </div>
    
        <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
            <a tabindex="-1" onclick="clearSearch('input_route_origin')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/baseline-clear-24px.svg"></a>
        </div>
        
    </div>

    <!--                            Destination Input-->
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" name="input_route_destination" id="input_route_destination" placeholder="Enter Destination">
                <label class="mdl-textfield__label" for="input_route_destination"></label>
             </div>
         </div>
             
        <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
             <a tabindex="-1" onclick="clearSearch('input_route_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/baseline-clear-24px.svg"></a>
        </div>
        
    </div>

<!--    <select id="option" onchange="set_date_options()">-->
<!--        <option value="now">Now</option>-->
<!--        <option value="departureTime">Departure Time</option>-->
<!--        <option value="arrivalTime">Arrival Time</option>-->
<!--    </select>-->


    <!--                    <div id="datetime_selector_container" class="grid-x cell align-center" style="display: none">-->

<!--    <select id="date"></select>-->


<!--    <input type="time" id="journey_time" value="now" required>-->

<!--    <input type="button" class="mdl-button mdl-js-button mdl-button&#45;&#45;raised mdl-js-ripple-effect" id="route_submit" onclick="geocodeAddress()" value="Search">-->

</form>

                `;
            generateRouteSearch();
            set_date_options();
        }
    }
    else{
        journey_results_section.style.display = "initial";
        directions_section.style.display = "none";
        generate_journey_results_view();
    }
}