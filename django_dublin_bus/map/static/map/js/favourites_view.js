function generate_favourites_view(){
    directions_button.classList.remove("active_view");
    favourites_button.classList.add("active_view");
    stop_info_button.classList.remove("active_view");

    directions_section.style.display = "none";
    journey_results_section.style.display = "none";
    stop_info_section.style.display = "none";
    favourites_section.style.display = "initial";

    if(favourites_section.innerHTML === ""){
        favourites_section.innerHTML = `
            <div id="saved_favourites" class="grid-x align-center"></div>
            
            <form class="cell" action="Getinput" method="get">
         
                <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
                        <div class="mdl-textfield mdl-js-textfield">
                            <input class="mdl-textfield__input" type="text" name="set_home" id="set_home" placeholder="Enter key">
                            <label class="mdl-textfield__label" for="set_home"></label>
                        </div>
                    </div>


                    <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                        <a tabindex="-1" onclick="clearSearch('set_home')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/baseline-clear-24px.svg"></a>
                    </div>
                    
                </div>
                    
                     <div class="mdl-grid">
                     <div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
                        <div class="mdl-textfield mdl-js-textfield">
                            <input class="mdl-textfield__input" type="text" name="set destination" id="set_destination" placeholder="Enter location">
                            <label class="mdl-textfield__label" for="set_destination"></label>
                        </div>
                    </div>
                    
                    <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--1-col-phone mdl-cell--middle">
                        <a tabindex="-1" onclick="clearSearch('set_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/baseline-clear-24px.svg"></a>
                    </div>
                    
                    
                    <div class="cell small-3 medium-3">
                    <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="set_favourites" value="Save Favourite">
                    </div>

                    <div class="small-7 medium-7"></div>
                </div>
                <div id="snackbar">Favourite saved</div>
                
            </form>`;

        componentHandler.upgradeAllRegistered();
        capture_favourites();
        populate_saved_favourites();
    }
}

function populate_saved_favourites(){
    document.getElementById("saved_favourites").innerHTML = "";
    counter = 0;
    for(storage_key of Object.keys(window.localStorage)){
        storage_value = window.localStorage.getItem(storage_key);
        storage_key = titleCase(storage_key);

        document.getElementById("saved_favourites").innerHTML += `
            <div class="cell grid-x" onclick="route_to_favourite('${storage_value}')">
                <div class="cell small-2 medium-2"></div>
                <div class="cell small-4 medium-4">${storage_key}</div>
                <div class="cell small-4 medium-4">${storage_value}</div>
                <div class="cell small-2 medium-2"></div>
            </div>
        `;
        counter++;
    }
}