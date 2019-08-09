console.log("map_initialiser.js Loaded!");


$.ajax({
    url: get_sun_url,
    type: 'POST',
    success:function (data){
        loadData(data);
    }
});


function loadData(data) {
        sunrise = data.sunrise;
        sunset = data.sunset;
        console.log("Sunrise: "+ sunrise);
        console.log("Sunset: "+ sunset);
}


var initialize = function () {
    console.log("Called initialise map function!");
    getUserLocation();

    map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: lat, lng: lng}, //investigate where lat nd lng variables are coming from
            zoom: 12,
            mapTypeControl: false,
            fullscreenControl: false
    });

    set_night_mode();
    create_radius_selector();
    // look at changing where this is positioned in script to resolve marker jumping from O'connell street
    user_location_marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

    loopBusStops();

    var markerCluster = new MarkerClusterer(map, markers,
        {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        }
    );


    initialiseUserLocation();

    geocoder = new google.maps.Geocoder();

    generateRouteSearch();

};
