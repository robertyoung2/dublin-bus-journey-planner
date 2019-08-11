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



var initialize = function () {
    console.log("Called initialise map function!");
    getUserLocation();

    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: lng}, //investigate where lat nd lng variables are coming from
            zoom: 12,
            mapTypeControl: false,
            fullscreenControl: false
    });

    initialiseUserLocation();

    var styles = [
    {
        "featureType": "transit.station.bus",
        "stylers": [{ "visibility": "off" }]
    }
    ];
    map.setOptions({ styles: styles });

    set_night_mode();
    create_radius_selector();


    var bus_marker_icon = {
        url: user_marker_image_url, //the image itself
        scaledSize: new google.maps.Size(75, 75) // resizing image to 50% smaller
    };
    user_location_marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map: map,
        icon: bus_marker_icon
    });

    //Hardcoding autocomplete bounds from results from google map markers
    marker_bounds = new google.maps.LatLngBounds();
    marker_bounds.extend(new google.maps.LatLng(53.07067778, -6.614865495999993));
    marker_bounds.extend(new google.maps.LatLng(53.60619628, -6.053310958999987));

    // loopBusStops();

    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
    );


    geocoder = new google.maps.Geocoder();

};
