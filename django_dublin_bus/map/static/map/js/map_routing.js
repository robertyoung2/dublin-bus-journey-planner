console.log("map_routing.js Loaded!");
/* Function that performs geodecoding. */
function geocodeAddress() {
    var origin_new = "";
    var dest_new = "";
    if (origin_searchbox.value == "") {
        if (Object.keys(window.localStorage).includes(destination_searchbox.value)) {
            console.log("here also");
            dest_new = window.localStorage.getItem(destination_searchbox.value);
        } else {
            dest_new = destination_searchbox.value
        }
        geocoder.geocode({'address': dest_new}, function (res_dest, status) {
            if (status === 'OK') {
                console.log(status);
                mapLocation(
                    geo_for_emptystring[1],
                    geo_for_emptystring[0],
                    res_dest[0].geometry.location.lat(),

                    res_dest[0].geometry.location.lng()
                );
                console.log("success")
                console.log(geo_for_emptystring);
            }
        });
    } else {
        if (Object.keys(window.localStorage).includes(origin_searchbox.value.toLowerCase())) {
            origin_new = window.localStorage.getItem(origin_searchbox.value.toLowerCase());
        } else {
            origin_new = origin_searchbox.value
        }

        if (Object.keys(window.localStorage).includes(destination_searchbox.value.toLowerCase())) {
            console.log("here also");
            dest_new = window.localStorage.getItem(destination_searchbox.value.toLowerCase());
        } else {
            dest_new = destination_searchbox.value
        }

        console.log(origin_new);
        console.log(dest_new);
        geocoder.geocode({'address': origin_new},
            function (res_origin, status) {
                /* If place is legitimate and able to get GPS co-ordinates. */
                if (status === 'OK') {
                    /* Set center based upon the lat and longitiude on final map */
                    map.setCenter(res_origin[0].geometry.location);

                    /* Status of response is used for checking if
                the respose from geocoding is valid or not (N.B. This is not a formal definition). */
                    geocoder.geocode({'address': dest_new}, function (res_dest, status) {

                        if (status === 'OK') {
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
}


/* Displaying the actual route on map */
function mapLocation(origin_lat, origin_lng, dest_lat, dest_lng) {
    console.log("Called mapLocation function!");
    var origin = new google.maps.LatLng(origin_lat, origin_lng);
    var destination = new google.maps.LatLng(dest_lat, dest_lng);

    if (option.value == 'now'){
        var departureTime = new Date();
    }
    else if (option.value == 'departureTime') {
        var departureTime = document.getElementById("date").value + " " + document.getElementById("time").value;
        departureTime = new Date(Date.parse(departureTime));
    }
     else if (option.value == 'arrivalTime') {
        var arrivalTime = document.getElementById("date").value + " " + document.getElementById("time").value;
        arrivalTime = new Date(Date.parse(arrivalTime));
    }



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
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                modes: ['BUS'],
                routingPreference: 'FEWER_TRANSFERS'
            },
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function (response, status) {
            if (status === 'OK') {
                console.log(response);
                directionsRenderer.setDirections(response);

                console.log(response.routes.length);
                let route_options_table = document.getElementById('route_options_container');
                route_options_table.innerHTML = "";

                var model_journeys = [];
                rendered_route_list = [];

                for (i = 0; i < response.routes.length; i++) {
                    console.log("Journey Number: " + i);
                    let journey = {};
                    let include = true;
                    let steps_counter = 0;
                    let steps_len = response.routes[i].legs[0].steps.length;

                    let cell_array_data = [];
                    for (let step of response.routes[i].legs[0].steps) {
                        if(step.travel_mode == "WALKING"){
                            cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">directions_walk</i>');
                        }
                        else if(step.travel_mode == "TRANSIT"){
                            if(step.transit.line.vehicle.type != "BUS"){
                                include = false;
                                break;
                            }
                            let route_dict = {
                                "Origin_Lat": step.transit.departure_stop.location.lat(),
                                "Origin_Lon": step.transit.departure_stop.location.lng(),
                                "Dest_Lat": step.transit.arrival_stop.location.lat(),
                                "Dest_Lon": step.transit.arrival_stop.location.lng(),
                                "Origin": step.transit.arrival_stop.name,
                                "Destination": step.transit.headsign,
                                "Departure_Datetime": new Date(step.transit.departure_time.value)
                            };
                            journey[step.transit.line.short_name] = route_dict;

                            console.log("Origin_Lat: " + step.transit.departure_stop.location.lat());
                            console.log("Origin_Lon: " + step.transit.departure_stop.location.lng());
                            console.log("Dest_Lat: " + step.transit.arrival_stop.location.lat());
                            console.log("Dest_Lon: " + step.transit.arrival_stop.location.lng());
                            console.log("Bus_Headsign: " + step.transit.headsign);
                            console.log("Arrival Location: " + step.transit.arrival_stop.name);
                            console.log("Bus_Route: " + step.transit.line.short_name);
                            console.log("Departure_Datetime: " + new Date(step.transit.departure_time.value));
                            console.log();
                            cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">directions_bus</i>');
                            // let newCell2 = new_route_row.insertCell(-1);
                            let current_route = step.transit.line.short_name;
                            cell_array_data.push('<p>'+current_route+'</p>');
                        }
                        if (steps_counter < steps_len - 1){
                            // let nextStepCell = new_route_row.insertCell(-1);
                            cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">navigate_next</i>');
                        }
                        steps_counter += 1;
                    }
                    if(include == true){
                        let new_route_row = route_options_table.insertRow(-1);
                        new_route_row.id = i;
                        new_route_row.onclick = function () {
                            console.log(this.id);
                            directionsRenderer.setRouteIndex(parseInt(this.id));
                        };
                        for(cell of cell_array_data){
                            let newCell = new_route_row.insertCell(-1);
                            newCell.innerHTML = cell;
                        }
                        model_journeys.push(journey);
                        rendered_route_list.push(response.routes[i]);
                        console.log("****************");
                    }
                }
                console.log("Data for Backend:" + model_journeys);
                console.log("****************");
                console.log("Accessable GMaps Data: " + rendered_route_list);
                Ajax_Model(JSON.stringify(model_journeys));
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });

    }
}