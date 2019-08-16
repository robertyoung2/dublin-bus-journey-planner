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
            populate_date_data();
            directions_section.innerHTML =`
                <form action="Getinput" method="get">
                
                    <!--Origin Input-->
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--7-col mdl-cell--7-col-tablet mdl-cell--3-col-phone">
                            <div class="mdl-textfield mdl-js-textfield ">
                                <input class="mdl-textfield__input" type="text" name="input_route_origin" id="input_route_origin" placeholder="Your current location">
                                <label class="mdl-textfield__label" for="input_route_origin"></label>
                            </div>
                        </div>
                    
                        <div class="mdl-cell mdl-cell--5-col mdl-cell--1-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                            <a tabindex="-1" onclick="clearSearch('input_route_origin')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/baseline-clear-24px.svg"></a>
                        </div>
                    </div>
                
                    <!--Destination Input-->
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--7-col mdl-cell--7-col-tablet mdl-cell--3-col-phone">
                            <div class="mdl-textfield mdl-js-textfield">
                                <input class="mdl-textfield__input" type="text" name="input_route_destination" id="input_route_destination" placeholder="Enter destination">
                                <label class="mdl-textfield__label" for="input_route_destination"></label>
                             </div>
                         </div>
                             
                        <div class="mdl-cell mdl-cell--5-col mdl-cell--1-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                             <a tabindex="-1" onclick="clearSearch('input_route_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/baseline-clear-24px.svg"></a>
                        </div>
                    </div>
                     
                    <!--Submit & Clear Buttons-->
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--2-col-phone">
                        <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="route_submit" onclick="validate_directions_form()" value="Search">
                    
                        </div>
                        
                        <div id="clear_route" style="display: none" >
                            <div class="mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--2-col-phone">
                                <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="clear_the_route()" value="Clear Route">
                            </div>
                        </div>
                        
                    </div> 
                    
                    <!--Journey Time Radio Buttons-->
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="now" >
                                <input type="radio" id="now" class="mdl-radio__button datetime_option" name="options" value="now" checked >
                                <span class="mdl-radio__label">Now</span>
                            </label>
                            
                            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="departureTime" >
                                <input type="radio" id="departureTime" class="mdl-radio__button datetime_option" name="options" value="departureTime" >
                                <span class="mdl-radio__label">Depart At</span>
                            </label>
                            
                            <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="arrivalTime" >
                                <input type="radio" id="arrivalTime" class="mdl-radio__button datetime_option" name="options" value="arrivalTime" >
                                <span class="mdl-radio__label">Arrive At</span>
                            </label>
                        </div>
                     </div>

                    <!--Datetime Options-->
                    <div id="datetime_selector_container" style="display: none">
                        <div class="mdl-grid">
                            <!--Time-->
                            <div class="mdl-cell mdl-cell--2-col mdl-cell--1-col-tablet mdl-cell--1-col-phone mdl-cell--top">
                                <div id="time_selector" class="mdl-textfield mdl-js-textfield" readonly="true">
                                    <input id="journey_time" max="23:59" required class="mdl-textfield__input" type="time">
                                    <label class="mdl-textfield__label" for="sample2"></label>
                                    <!--<span id="time_selector_error" class="mdl-textfield__error">Please enter a valid time!</span>-->
                                </div>
                            </div>
                            
                            <!--Date-->
                            <!-- Pre-selected value -->
                            <div class="mdl-cell mdl-cell--5-col mdl-cell--6-col-tablet mdl-cell--2-col-phone mdl-cell--top">
                                
                                <div id="date_selector" class="mdl-textfield mdl-js-textfield" readonly="true">
                                    <input class="mdl-textfield__input search_stops_input"  type="text" list="date" placeholder="Select Date" id="date_input">
                                    <label class="mdl-textfield__label" for="date_input"></label>
                                </div>
                                <datalist id="date">${date_data_list_string}</datalist>
                            </div>
                            
                        </div>
                    </div>
                </form>
                <div id="valid_time" class>Please enter a valid time</div>
                <div id="enter_destination" class>Please provide a destination</div>
                <div id="valid_address" class>Please enter a valid address</div>
                                `;
            componentHandler.upgradeAllRegistered();
            document.getElementById("time_selector").classList.remove("is-invalid");
            document.getElementById("time_selector").classList.add("is-valid");
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
    let submitted_date = document.getElementById("date_input");
    geolocationFlag = false;

    console.log("Current Date Value:" + current_date);
    console.log("Submitted Date Value: " + submitted_date.value);

    if(submitted_date.value === current_date && submitted_time.value < current_time){
        callsnackBar("valid_time");

    }
    else{
        console.log("Valid Time");
        geocodeAddress();
    }
}

