var showing_journey_results = false;

function clear_the_route(){
    if(directionsRenderer != null){
        directionsRenderer.set('directions', null);
        directionsRenderer = null;
        console.log("Route Cleared");
        document.getElementById("clear_route").style.display = "none";
    }
    else{
        console.log("No route to clear");
    }
}



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
                                <input class="mdl-textfield__input" type="text" name="input_route_origin" id="input_route_origin" placeholder="Your current location">
                                <label class="mdl-textfield__label" for="input_route_origin"></label>
                            </div>
                        </div>
                    
                        <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                            <a tabindex="-1" onclick="clearSearch('input_route_origin')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/baseline-clear-24px.svg"></a>
                        </div>
                        
                    </div>
                
                <!--    Destination Input-->
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" name="input_route_destination" id="input_route_destination" placeholder="Enter destination">
                                <label class="mdl-textfield__label" for="input_route_destination"></label>
                             </div>
                         </div>
                             
                        <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                             <a tabindex="-1" onclick="clearSearch('input_route_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/baseline-clear-24px.svg"></a>
                        </div>
                        
                    </div>
                     
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                        <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="now" >
                        <input type="radio" id="now" class="mdl-radio__button datetime_option" name="options" value="now" checked >
                        <span class="mdl-radio__label">Now &nbsp;&nbsp;&nbsp;</span>
                        </label>
                        
                        <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="departureTime" >
                        <input type="radio" id="departureTime" class="mdl-radio__button datetime_option" name="options" value="departureTime" >
                        <span class="mdl-radio__label">Depart At &nbsp;&nbsp;&nbsp;</span>
                        </label>
                        
                        <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="arrivalTime" >
                        <input type="radio" id="arrivalTime" class="mdl-radio__button datetime_option" name="options" value="arrivalTime" >
                        <span class="mdl-radio__label">Arrive At</span>
                        </label>
                     </div>
                
                    <div id="datetime_selector_container" class="mdl-grid" style="display: none">
                        <div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <input type="time" id="journey_time" max="23:59" value="now" required>
                            <!-- Pre-selected value -->
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height">
                                <input type="text" value="" class="mdl-textfield__input" id="sample6">
                                <input type="hidden" value="" name="sample6">
                                <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                                <label for="sample6" class="mdl-textfield__label">Date</label>
                                <ul for="sample6" class="mdl-menu mdl-menu--bottom-left mdl-js-menu" id="date"></ul>
                            </div>
                            
                        </div>
                    </div>
                
                 
                    <div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                    <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="route_submit" onclick="validate_directions_form()" value="Search">
                
                    </div>
                    
                    <div id="clear_route" class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style="display: none">
                    <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="clear_the_route()" value="Clear Route">
                
                    </div>
                </form>`;
            componentHandler.upgradeAllRegistered();
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

function validate_directions_form(){
    let submitted_time = document.getElementById("journey_time");
    let submitted_date = document.getElementById("date");

    if(submitted_date.value === current_date && submitted_time.value < current_time){
        alert("Pleas enter a valid time");
    }
    else{
        console.log("Valid Time");
        geocodeAddress();
    }

}

