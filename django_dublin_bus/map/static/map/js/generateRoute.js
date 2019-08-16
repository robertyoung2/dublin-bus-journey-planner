function generateRouteSearch(){
    origin_searchbox = document.getElementById('input_route_origin');
    destination_searchbox = document.getElementById('input_route_destination');
    autocomplete_options = {
        bounds:marker_bounds,
        strictBounds: true
    };
    autocomplete = new google.maps.places.Autocomplete(origin_searchbox, autocomplete_options);
    autocomplete = new google.maps.places.Autocomplete(destination_searchbox, autocomplete_options);
}
