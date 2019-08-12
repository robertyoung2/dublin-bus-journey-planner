console.log("map_initialiser.js Loaded!");

setup_ajax();
$.ajax({
    url: get_sun_url,
    type: 'POST',
    success:function (data){
        sunrise = data.sunrise;
        sunset = data.sunset;
        console.log("Sunrise: "+ sunrise);
        console.log("Sunset: "+ sunset);
    }
});

// The following geolocation live tracking code was taken and adapted from the tutorial at the following address:
// https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e

// Function to track follow user location
const trackLocation = ({ onSuccess, onError = () => { } }) => {
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
    const initialPosition = {lat: 53.3498, lng: -6.2603};

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: initialPosition.lat, lng: initialPosition.lng}, //investigate where lat nd lng variables are coming from
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false
    });

    var user_marker_icon = {
        url: user_marker_image_url, //the image itself
        scaledSize: new google.maps.Size(75, 75) // resizing image to 50% smaller
    };

    const marker = new google.maps.Marker({map, position: initialPosition, icon:user_marker_icon});

    //Hardcoding autocomplete bounds from results from google map markers
    marker_bounds = new google.maps.LatLngBounds();
    marker_bounds.extend(new google.maps.LatLng(53.07067778, -6.614865495999993));
    marker_bounds.extend(new google.maps.LatLng(53.60619628, -6.053310958999987));

    // Call the track location function
    trackLocation({
        onSuccess: ({coords: {latitude: lat, longitude: lng}}) => {
            marker.setPosition({lat, lng});
            map.panTo({lat, lng});
            pos = {lat:lat, lng:lng};
            getnearby(pos);
        },
        onError: err =>
            alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
    });

      map.addListener('center_changed', function() {
          getnearby();
  });


    var styles = [
    {
        "featureType": "transit.station.bus",
        "stylers": [{ "visibility": "off" }]
    }
    ];
    map.setOptions({ styles: styles });

    set_night_mode();

    loopBusStops();

    geocoder = new google.maps.Geocoder();
};

