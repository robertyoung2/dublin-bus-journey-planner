console.log("geolocation.js Loaded!");
// centering the the initial map position on dublin
window.lat = 53.3498;
window.lng = -6.2603;

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
        // console.log("Called updatePosition function!");
        if (position) {
            window.lat = position.coords.latitude;
            window.lng = position.coords.longitude;
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
    var toggle = true;
    var redraw = function (payload) {
        lat = payload.message.lat;
        lng = payload.message.lng;

        user_location_marker.setPosition({lat: lat, lng: lng, alt: 0});
        if (toggle) {
            map.setCenter({lat: lat, lng: lng, alt: 0});
            map.setZoom(16);
            toggle = false;
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
