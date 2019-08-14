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
                <div class="grid-x align-center">
                    <div class="small-2 medium-2"></div>
                    <div class="cell small-7 medium-7">
                        <input type="text" name="set_home" id="set_home" placeholder="Enter Key">
                    </div>
                    <div class="cell small-1 medium-1">
                        <a tabindex="-1" onclick="clearSearch('set_home')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/clear_search.png"></a>
                    </div>
                    <div class="small-2 medium-2"></div>
                    
                    <div class="small-2 medium-2"></div>
                    <div class="cell small-7 medium-7">
                        <input type="text" name="set destination" id="set_destination" placeholder="Enter Location">
                    </div>
                    <div class="cell small-1 medium-1">
                        <a tabindex="-1" onclick="clearSearch('set_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/clear_search.png"></a>
                    </div>
                    <div class="small-2 medium-2"></div>
                    
                    <div class="small-2 medium-2"></div>
                    <div class="cell small-3 medium-3">
                        <input type="button" id="set_favourites" value="Save Favourite">
                    </div>
                    <div class="small-7 medium-7"></div>
                </div>
            </form>`;
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

function upperCase(str) {
    return str.toUpperCase();
}
function titleCase(str) {
    var firstLetterRx = /(^|\s)[a-z]/g;
    return str.replace(firstLetterRx, upperCase);
}

function route_to_favourite(destination){
//    add functionality to route to the passed destination
    generate_directions_views();
    document.getElementById("input_route_destination").value = destination;
}