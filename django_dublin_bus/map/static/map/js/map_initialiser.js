console.log("map_initialiser.js Loaded!");

setup_ajax();
$.ajax({
    url: get_sun_url,
    type: 'POST',
    success: function (data) {
        sunrise = data.sunrise;
        sunset = data.sunset;
        console.log("Sunrise: " + sunrise);
        console.log("Sunset: " + sunset);
    }
});

// Function to initialise map
var initialize = function () {
    console.log("Called initialise map function!");

    // Centre on Dublin at the start
    const initialPosition = {
        lat: 53.3498,
        lng: -6.2603
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: initialPosition.lat,
            lng: initialPosition.lng
        },
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false
    });

    var user_marker_icon = {
        url: user_marker_image_url, //the image itself
        scaledSize: new google.maps.Size(75, 75) // resizing image to 50% smaller
    };

    const marker = new google.maps.Marker({
        map,
        position: initialPosition,
        icon: user_marker_icon
    });

    //Hardcoding autocomplete bounds from results from google map markers
    marker_bounds = new google.maps.LatLngBounds();
    marker_bounds.extend(new google.maps.LatLng(53.07067778, -6.614865495999993));
    marker_bounds.extend(new google.maps.LatLng(53.60619628, -6.053310958999987));

    // Call the track location function
    trackLocation({
        onSuccess: ({
            coords: {latitude: lat,longitude: lng}}) => {
            marker.setPosition({lat, lng});
            if (geolocationFlag === true) {
                map.panTo({lat,lng});
                map.setZoom(17);
            }
            userPosition = {lat: lat, lng: lng};
            getnearby(userPosition);
        },
        onError: err =>
            alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
    });

    var geoControlDiv = document.createElement('div');
    var geoControl = new GeoControl(geoControlDiv, map);
    geoControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(geoControlDiv);

    // Listener to update markers as viewpoint centre changes
    map.addListener('center_changed', function () {
        bounds = map.getBounds();
        getnearby();
    });
    map.addListener('dragend', function() {
        if(document.getElementById("stop_info_view_section").style.display === "initial"){
            generate_nearby_stop_info(false);
        }
    });

    // Listener to deactivate view tracking of user location on drag of map
    map.addListener('drag', function () {
        geolocationFlag = false;
    });

    // Checks zoom level and if markers should be displayed
    map.addListener('zoom_changed', function () {
        bounds = map.getBounds();
        getnearby();
    });

    var styles = [
        {"featureType": "transit.station.bus","stylers": [{"visibility": "off"}]}
    ];
    map.setOptions({
        styles: styles
    });

    set_night_mode();
    loopBusStops();
    geocoder = new google.maps.Geocoder();
};

// Initialise controls for the maps
function GeoControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '22px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'User Geolocation';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.width = '35px';
    controlText.style.height = '35px';
    controlText.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/149/149049.svg)";

    controlUI.appendChild(controlText);

    // Setup the click event listeners:  set the map to user location.
    controlUI.addEventListener('click', function () {
        geolocationFlag = true;
        map.panTo({
            lat: userPosition.lat,
            lng: userPosition.lng
        });
        map.setZoom(17);
        controlText.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/149/149049.svg)";
        getnearby();
        generate_nearby_stop_info(false);
    });

    // Setup the drag event listeners: change CSS of geolocation button
    map.addListener('drag', function(){
        controlText.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/149/149430.svg)";
    });
}
