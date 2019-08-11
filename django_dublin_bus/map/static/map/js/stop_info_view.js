function generate_stop_info_view(){
    directions_button.classList.remove("active_view");
    favourites_button.classList.remove("active_view");
    stop_info_button.classList.add("active_view");

    favourites_section.style.display = "none";
    directions_section.style.display = "none";
    stop_info_section.style.display = "initial";

    if(stop_info_section.innerHTML === ""){
        stop_info_section.innerHTML =
            '<div id="mySidebar" class="sidebar">' +
                '<a href="#">' +
                    '<div id="right-panel">' +
                        '<table id="route_options_container" class="table-scroll"></table>' +
                    '</div>' +
                '</a>' +
            ' </div>';
    }

}