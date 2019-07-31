console.log("generateRoute.js Loaded!");
function generateRouteSearch(){
    console.log("Called generateRoute function!");
    origin_searchbox = document.getElementById('input_route_origin');
    destination_searchbox = document.getElementById('input_route_destination');
    var options = {
        types: ['geocode'],
        componentRestrictions: {country: 'ie'}
    };

    autocomplete = new google.maps.places.Autocomplete(origin_searchbox, options);
    autocomplete = new google.maps.places.Autocomplete(destination_searchbox, options);
}

function setRouteClick(){
    console.log("Called setRouteClick function!");
    /* Action after pressing the submit button. */
    document.getElementById('route_submit').addEventListener('click', function () {
        geocodeAddress();
    });
}

function openNav() {
    populate_info("journey");
    document.getElementById("mySidebar").style.width = "450px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}