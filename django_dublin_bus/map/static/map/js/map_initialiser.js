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

// The following geolocation live tracking code was taken and adapted from the tutorial at the following address:
// https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e

// Function to track follow user location
const trackLocation = ({
    onSuccess,
    onError = () => {}
}) => {
    if ('geolocation' in navigator === false) {
        return onError(new Error('Geolocation is not supported by your browser.'));
    }

    // Else use watch position
    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
    });
};

const getPositionErrorMessage = code => {
    switch (code) {
        case 1:
            return 'Permission denied.';
        case 2:
            return 'Position unavailable.';
        case 3:
            return 'Timeout reached.';
    }
};

// Function to initialise map
var initialize = function () {
    console.log("Called initialise map function!");

    // Centre on Dublin at the statt
    const initialPosition = {
        lat: 53.3498,
        lng: -6.2603
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: initialPosition.lat,
            lng: initialPosition.lng
        }, //investigate where lat nd lng variables are coming from
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
            console.log("user lat is" + userPosition.lat)
            console.log("user lng" + userPosition.lng)
            getnearby(userPosition);
        },
        onError: err =>
            alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    // Listener to update markers as viewpoint centre changes
    map.addListener('center_changed', function () {
        getnearby();
    });

    // Listener to deactivate view tracking of user location on drag of map
    map.addListener('drag', function () {
        geolocationFlag = false;
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

function CenterControl(controlDiv, map) {

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
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
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
    });

    map.addListener('drag', function(){
        controlText.style.backgroundImage = "url(https://image.flaticon.com/icons/svg/149/149430.svg)";
    });
}
