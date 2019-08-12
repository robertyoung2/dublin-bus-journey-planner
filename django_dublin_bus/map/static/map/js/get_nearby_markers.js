function getnearby(pos){
    var location = new google.maps.LatLng(pos.lat, pos.lng);
    var nearby_markers = []
    // console.log("Nearby Radius: " + nearby_radius);
    for(marker of markers){
        var marker_dist_from_location = google.maps.geometry.spherical.computeDistanceBetween(location, marker.position);
        if(marker_dist_from_location <= nearby_radius){
            nearby_markers.push(marker);
        }
    }
    // console.log("Nearby Markers: " + nearby_markers.length);
}

function create_radius_selector(){
    var centerControlDiv = document.createElement('select');
    centerControlDiv.id = "cmbitems";
    centerControlDiv.name = "cmbitems";
    centerControlDiv.innerHTML =
        '<option value=500>500</option>' +
        '<option value=800>800</option>' +
        '<option value=900>900</option>' +
        '<option value=1000>1000</option>' +
        '<option value=1200>1200</option>' +
        '<option value=1500>1500</option>' +
        '<option value=1700>1700</option>' +
        '<option value=1800>1800</option>' +
        '<option value=2000>2000</option>';

    nearby_radius = centerControlDiv.value;
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
}

function CenterControl(controlDiv, map) {
    controlDiv.style.width = '80px';
    // Setup the click event listeners: simply set the map to Chicago.
    controlDiv.addEventListener('click', function() {
        controlDiv.onchange = function () {
            console.log("Changed Value Yo!");
            nearby_radius = controlDiv.value;
        }
    });
}