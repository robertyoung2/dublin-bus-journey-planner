// Function to populate nearby markers on pan and user location
// Currently works in isolation for user location and panning
// Next version will have both working in harmony

previous_markers = [];

function getnearby() {

    var location = map.getCenter();
    // var location = new google.maps.LatLng(pos.lat, pos.lng);
    var nearby_markers = [];
    var nearby_check = [];
    var previous_check = [];
    nearby_radius = 500;

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
        console.log("starting addMarkerMap ")
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

    update_marker_lists();
    uniqueTags();
    removeMarkers(nearby_check, previous_markers);
    addMarkerMap(nearby_markers, previous_check);
    previous_markers = Object.assign([], nearby_markers);
}