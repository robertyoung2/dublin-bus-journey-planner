console.log("geolocation.js Loaded!");
// centering the the initial map position on dublin
window.lat = 53.3498;
window.lng = -6.2603;

function getnearby(pos) {
    if (typeof nearby_radius === 'undefined')
    {
        nearby_radius=500;
    }
    console.log("Nearby Radius: " + nearby_radius);
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pos,
        radius: nearby_radius,
        types: ['bus_station']

    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var placeId = results[i].place_id;
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'placeId': placeId}, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        console.log("Nearby Station Results: " + results);
                        console.log("Lat: "+results[0].geometry.location.lat() + " " + " Lon: "+results[0].geometry.location.lng());
                    }
                }

            });
        }
    }
}


function getUserLocation(){
    // console.log("Called getUserLocation function!");
    // Test to see if the browser has HTML5 geolocation
    function getLocation() {
        // console.log("Called getLocation function!");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition);
        }
        return null;
    }

    // Updates the map position values to users location
    function updatePosition(position) {
        if (position) {
            pos={
                lat:position.coords.latitude,
                lng:position.coords.longitude
            };
            window.lat = position.coords.latitude;
            window.lng = position.coords.longitude;
            geo_for_emptystring.length = 0;
            geo_for_emptystring.push(position.coords.longitude);
            geo_for_emptystring.push(position.coords.latitude);
            // getnearby(pos,x);
        }
    }

    // interval in ms
    setInterval(function () {
        // console.log("Called setInterval function!");
        updatePosition(getLocation());
    }, 10000);
}

function currentLocation() {
    // console.log("Called currentLocation function!");
    return {lat: window.lat, lng: window.lng};
}

function initialiseUserLocation(){
    console.log("Called initialiseUserLocation function!");
    window.initialize = initialize;
    var first_load = true;
    var redraw = function (payload) {
        lat = payload.message.lat;
        lng = payload.message.lng;

        user_location_marker.setPosition({lat: lat, lng: lng, alt: 0});
        if (first_load) {
            map.setCenter({lat: lat, lng: lng, alt: 0});
            map.setZoom(16);
            first_load = false;
        }
    };

    var pnChannel = "map2-channel";

    var pubnub = new PubNub({
        publishKey: 'pub-c-180f8ae2-5a29-43b3-88a3-c550c9d1352c',
        subscribeKey: 'sub-c-165dd5b0-9d91-11e9-b7bc-46e9b2e3ba6e'
    });

    pubnub.subscribe({channels: [pnChannel]});
    pubnub.addListener({message: redraw});

    setInterval(function () {
        pubnub.publish({channel: pnChannel, message: currentLocation()});
    }, 5000);
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

    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
}

function CenterControl(controlDiv, map) {
    controlDiv.style.width = '80px';
    // Setup the click event listeners: simply set the map to Chicago.
    controlDiv.addEventListener('click', function() {
        controlDiv.onchange = function () {
            nearby_radius = controlDiv.value;
        }
    });
}