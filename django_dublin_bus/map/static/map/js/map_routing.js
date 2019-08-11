console.log("map_routing.js Loaded!");

/* Displaying the actual route on map */
function mapLocation(origin_lat, origin_lng, dest_lat, dest_lng) {
    console.log("Called mapLocation function!");
    var origin = new google.maps.LatLng(origin_lat, origin_lng);
    var destination = new google.maps.LatLng(dest_lat, dest_lng);
    var departureTime;
    var arrivalTime;

    if (option.value === 'now'){
        departureTime = new Date();
    }
    else if (option.value === 'departureTime') {
        departureTime = new Date(Date.parse(document.getElementById("date").value + " " + document.getElementById("time").value));
    }
     else if (option.value === 'arrivalTime') {
        arrivalTime = new Date(Date.parse(document.getElementById("date").value + " " + document.getElementById("time").value));
    }

    if(directionsRenderer){
        directionsRenderer.setMap(null);
    }
    var directionsService = new google.maps.DirectionsService();

    directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsRenderer,origin, destination, arrivalTime, departureTime);
    populate_info("stop_info_view");
}


function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination, arrivalTime, departureTime) {
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
                    if(step.travel_mode === "WALKING"){
                        cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">directions_walk</i>');
                    }
                    else if(step.travel_mode === "TRANSIT"){
                        if(step.transit.line.vehicle.type !== "BUS"){
                            include = false;
                            break;
                        }
                        let current_route;
                        if(step.transit.line.short_name){
                             current_route = step.transit.line.short_name;
                        }
                        else{
                            current_route = step.transit.line.name;
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
                        journey[current_route] = route_dict;

                        console.log("Origin_Lat: " + step.transit.departure_stop.location.lat());
                        console.log("Origin_Lon: " + step.transit.departure_stop.location.lng());
                        console.log("Dest_Lat: " + step.transit.arrival_stop.location.lat());
                        console.log("Dest_Lon: " + step.transit.arrival_stop.location.lng());
                        console.log("Bus_Headsign: " + step.transit.headsign);
                        console.log("Arrival Location: " + step.transit.arrival_stop.name);
                        console.log("Bus_Route: " + current_route);
                        console.log("Departure_Datetime: " + new Date(step.transit.departure_time.value));
                        console.log();
                        cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">directions_bus</i>');
                        // let newCell2 = new_route_row.insertCell(-1);

                        cell_array_data.push('<p>'+current_route+'</p>');
                    }
                    if (steps_counter < steps_len - 1){
                        // let nextStepCell = new_route_row.insertCell(-1);
                        cell_array_data.push('<i class="material-icons" style="font-size:30px;color:white">navigate_next</i>');
                    }
                    steps_counter += 1;
                }
                if(include === true){
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
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}