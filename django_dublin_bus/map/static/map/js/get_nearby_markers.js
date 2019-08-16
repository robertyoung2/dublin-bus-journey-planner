// Function to populate nearby markers on pan or user location

previous_markers = [];

function getnearby() {
    var currentZoom = map.getZoom();
    var location = map.getCenter();
    var nearby_markers = [];
    var nearby_check = [];
    var previous_check = [];

    if (bounds === undefined || bounds === null){
        nearby_radius = 100;
    }
    else {
        var northeastBound = bounds.getNorthEast();

        nearby_radius = haversine(location.lat(), location.lng(), northeastBound.lat(), northeastBound.lng())
    }


    // List of current nearby markers as marker objects
    function update_marker_lists() {
        for (marker of markers) {
            var marker_dist_from_location = google.maps.geometry.spherical.computeDistanceBetween(location,
                marker.position);

            if (marker_dist_from_location <= nearby_radius) {
                nearby_markers.push(marker);
            }
        }
    }

    // Makes lists of unique marker stop_ids for previous and nearby markers
    function uniqueTags() {
        for (nearby of nearby_markers) {
            nearby_check.push(nearby.stop_info.stop_id)
        }

        if (previous_markers.length > 0) {
            for (previous of previous_markers) {
                previous_check.push(previous.stop_info.stop_id)
            }
        }
    }

    // If the marker is not on the map, adds it to the map
    function addMarkerMap(nearby_markers, previous_check) {
        const previous_markers_set = new Set(previous_check);

        for (near_marker of nearby_markers) {
            if (previous_markers_set.has(near_marker.stop_info.stop_id) === false) {
                near_marker.setMap(map);
            }
        }
    }

    // If the marker shouldn't be displayed, removes it
    function removeMarkers(nearby_check, previous_markers) {
        if (previous_markers.length > 0) {
            const nearby_markers_set = new Set(nearby_check);

            for (previous_marker of previous_markers) {
                if (nearby_markers_set.has(previous_marker.stop_info.stop_id) === false) {
                    previous_marker.setMap(null);
                }
            }
        }
    }

    // Checks to make sure at desired zoom level before add & removing markers
    // Else if the zoom level is too far out, make sure no markers are displayed
    if(currentZoom >= 16) {
        update_marker_lists();
        uniqueTags();
        removeMarkers(nearby_check, previous_markers);
        addMarkerMap(nearby_markers, previous_check);
        previous_markers = Object.assign([], nearby_markers);
    }
    else if(currentZoom < 16 && previous_markers.length > 0){
        for(pre_marker of previous_markers){
            pre_marker.setMap(null);
            previous_markers = [];
        }
    }
}