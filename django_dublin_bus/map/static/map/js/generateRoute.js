console.log("generateRoute.js Loaded!");
function generateRouteSearch(){
    console.log("Called generateRoute function!");
    origin_searchbox = document.getElementById('input_route_origin');
    destination_searchbox = document.getElementById('input_route_destination');
    autocomplete_options = {
        types: ['geocode'],
        componentRestrictions: {country: 'ie'}
    };

    autocomplete = new google.maps.places.Autocomplete(origin_searchbox, autocomplete_options);
    autocomplete = new google.maps.places.Autocomplete(destination_searchbox, autocomplete_options);
}

function setRouteClick(){
    console.log("Called setRouteClick function!");
    /* Action after pressing the submit button. */
    document.getElementById('route_submit').addEventListener('click', function () {
        if(($("#option").val() == 'departureTime' || $("#option").val() == 'arrivalTime') && ($("#time").val() == "" || $("#date").val()  == "")){
            alert('Date and Time is required!');
        }
        else{
            geocodeAddress();
        }
    });
}
