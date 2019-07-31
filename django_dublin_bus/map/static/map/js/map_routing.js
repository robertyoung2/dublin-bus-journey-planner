console.log("map_routing.js Loaded!");
/* Function that performs geodecoding. */
function geocodeAddress() {
    console.log("Called geocodeAddress function!");
    geocoder.geocode({'address': origin_searchbox.value},
        function (res_origin, status) {
            console.log("Gimme the loot!");
            /* If place is legitimate and able to get GPS co-ordinates. */
            if (status === 'OK') {
                /* Set center based upon the lat and longitiude on final map */
                map.setCenter(res_origin[0].geometry.location);

                /* Status of response is used for checking if
                the respose from geocoding is valid or not (N.B. This is not a formal definition). */
                geocoder.geocode({'address': destination_searchbox.value}, function (res_dest, status) {

                    if (status === 'OK') {
                        console.log("I have a muthafuckin result yo!");
                        mapLocation(
                            res_origin[0].geometry.location.lat(),
                            res_origin[0].geometry.location.lng(),
                            res_dest[0].geometry.location.lat(),
                            res_dest[0].geometry.location.lng()
                        );
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }

                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        }
    );
}


/* Displaying the actual route on map */
function mapLocation(origin_lat, origin_lng, dest_lat, dest_lng) {
    console.log("Called mapLocation function!");
    var origin = new google.maps.LatLng(origin_lat, origin_lng);
    var destination = new google.maps.LatLng(dest_lat, dest_lng);


    if(directionsRenderer){
        directionsRenderer.setMap(null);
    }
    var directionsService = new google.maps.DirectionsService();

    directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    openNav();

    function calculateAndDisplayRoute(directionsService, directionsRenderer) {
        console.log("Called calculateAndDisplayRoute function!");
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'TRANSIT',
            provideRouteAlternatives: true,
            transitOptions: {
                modes: ['BUS'],
            },
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function (response, status) {
            if (status === 'OK') {
                console.log(response);
                directionsRenderer.setDirections(response);

                console.log(response.routes.length);
                let route_options_table = document.getElementById('route_options_container');
                route_options_table.innerHTML = "";
                for (i = 0; i < response.routes.length; i++) {
                    let new_route_row = route_options_table.insertRow(-1);
                    new_route_row.id = i;
                    new_route_row.onclick = function () {
                        console.log(this.id);
                        directionsRenderer.setRouteIndex(parseInt(this.id));
                    };
                    let steps_counter = 0;
                    let steps_len = response.routes[i].legs[0].steps.length;
                    for (let step of response.routes[i].legs[0].steps) {
                        let newCell = new_route_row.insertCell(-1);
                        if(step.travel_mode == "WALKING"){
                            newCell.innerHTML = '<i class="material-icons" style="font-size:30px;color:white">directions_walk</i>';
                        }
                        else if(step.travel_mode == "TRANSIT"){
                            newCell.innerHTML = '<i class="material-icons" style="font-size:30px;color:white">directions_bus</i>';
                            let newCell2 = new_route_row.insertCell(-1);
                            let current_route = step.transit.line.short_name;
                            newCell2.innerHTML = '<p>'+current_route+'</p>';
                        }
                        if (steps_counter < steps_len - 1){
                            let nextStepCell = new_route_row.insertCell(-1);
                            nextStepCell.innerHTML = '<i class="material-icons" style="font-size:30px;color:white">navigate_next</i>';
                        }
                        steps_counter += 1;
                    }
                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });

    }
}