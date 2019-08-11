function generate_stop_info_view(){
    directions_button.classList.remove("active_view");
    favourites_button.classList.remove("active_view");
    journey_button.classList.add("active_view");

    info_section.innerHTML = '<div id="mySidebar" class="sidebar">' +
                                '<a href="#">' +
                                    '<div id="right-panel">' +
                                        '<table id="route_options_container" class="table-scroll"></table>' +
                                    '</div>' +
                                '</a>' +
                            ' </div>';
}