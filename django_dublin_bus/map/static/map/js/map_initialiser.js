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

    marker_bounds = new google.maps.LatLngBounds();
    loopBusStops();


    geocoder = new google.maps.Geocoder();

};
