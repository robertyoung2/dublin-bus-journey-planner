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
            <div id="favourites_grid" class="mdl-grid">
                
                <!--Key Enter Field-->
                <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--2-col-phone">
                    <div class="mdl-textfield mdl-js-textfield">
                        <input class="mdl-textfield__input" type="text" name="set_home" id="set_home" placeholder="Enter name">
                        <label class="mdl-textfield__label" for="set_home"></label>
                    </div>
                </div>
                        
                 <!--Remove Key Entry Button-->
                <div class="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--hide-phone">
                    <a tabindex="-1" onclick="clearSearch('set_home')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/baseline-clear-24px.svg"></a>
                </div>
                        
                <!-- Favourite Address Entry Field -->
                 <div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--2-col-phone">
                    <div class="mdl-textfield mdl-js-textfield">
                        <input class="mdl-textfield__input" type="text" name="set destination" id="set_destination" placeholder="Enter location">
                        <label class="mdl-textfield__label" for="set_destination"></label>
                    </div>
                </div>
                        
                 <!--Remove Address Button -->
                <div class="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--hide-phone">
                    <a tabindex="-1" onclick="clearSearch('set_destination')">
                        <img id="clear_search_icon" title="Clear destination search" src="/static/map/images/baseline-clear-24px.svg">
                    </a>
                </div>
                
                <!--Set Favourites Button -->
                 <div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                    <input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="set_favourites" value="Save Favourite">
                </div>
                
                <!-- Saved Favourites Table -->
                <div id="favourites_table_cell" class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                    <ul class="demo-list-control mdl-list" id="saved_favourites"></ul>
                </div>
            </div>
            
            <div id="save_favourites" class>Favourite saved</div>
            <div id="not_save_favourites" class>Failed to save favourite</div>
            <div id="key_delete" class>Favourite deleted</div>
            <div id="key_not_exist" class>Favourite does not exist!</div>
            <div id="invalid_address" class>Invalid Google Maps Address</div>
            <div id="key_exists" class>Favourite already exists</div>
            <div id="provide_key" class>Please give your favourite a name</div>
            <div id="key_too_long" class>Name too long (max. 20 characters)</div>
        `;

        capture_favourites();
        populate_saved_favourites();
    }
}

function populate_saved_favourites(){
    if(document.getElementById("saved_favourites")){
        document.getElementById("saved_favourites").innerHTML = "";
        counter = 0;
        for(storage_key of Object.keys(window.localStorage)){
            storage_value = window.localStorage.getItem(storage_key);
            storage_key = titleCase(storage_key);

            if(!storage_key.startsWith("Sub-") && storage_key.length <= 20){
                document.getElementById("saved_favourites").innerHTML += `
                    <li class="mdl-list__item">
                        <span class="mdl-list__item-primary-content" onclick="route_to_favourite('${storage_value}')">
                          <i class="material-icons  mdl-list__item-icon">directions</i>
                          ${storage_key}
                        </span>
                        
                        <span class="mdl-list__item-secondary-action">
                            <button class="mdl-button mdl-js-button mdl-button--icon" onclick="delete_favourite('${storage_key}')">
                              <i class="material-icons">clear</i>
                            </button>
                        </span>
                    </li>
                `;
            }
            counter++;
        }
    }
    componentHandler.upgradeAllRegistered();
}


function upperCase(str) {
    return str.toUpperCase();
}


function titleCase(str) {
    var firstLetterRx = /(^|\s)[a-z]/g;
    return str.replace(firstLetterRx, upperCase);
}


function route_to_favourite(destination){
    generate_directions_views();
    document.getElementById("input_route_destination").value = destination;
}
