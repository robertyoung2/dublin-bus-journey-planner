function Ajax_Model(data) {
    setup_ajax();
    console.log("Model Data Ajax:" + data);
    $.ajax({
        type: "POST",
        data: {'data': data},
        dataType: 'json',
        url: model_url,

        success: function (predictions, status) {
            console.log("Returned Model Data:"+ predictions);
            console.log(status);

            let journey_counter = 0;
            for(prediction of predictions){
                let keys = Object.keys(prediction);
                let route_total_transit_time = 0;
                for(route of keys){
                    let incomplete_prediction = false;

                    if(prediction[route].length < 1){
                        incomplete_prediction = true;
                    }
                    for(route_step of rendered_route_list[journey_counter].legs[0].steps){
                        if((incomplete_prediction) && (route_step.travel_mode == "TRANSIT") && (route_step.transit.line.short_name == route)){
                            console.log("Empty Route Found");
                            console.log("Gmaps Step Time: " + route_step.duration.value);
                            prediction[route].push(route_step.duration.value);
                            break;
                        }
                    }
                    console.log(route + ": " + prediction[route]);



                    for (segment of prediction[route]){
                        route_total_transit_time += segment;
                    }

                }
                for(route_step of rendered_route_list[journey_counter].legs[0].steps){
                    if(route_step.travel_mode == "WALKING"){
                        route_total_transit_time += route_step.duration.value;
                        console.log("Walking Time Added!");
                    }
                }
                console.log("Total Transit Time for journey "+journey_counter+": " + route_total_transit_time + " seconds");
                console.log("**********");
                journey_counter++;
            }
        },
        error: function (jqXHR) {
            console.log(jqXHR);
        }
    });
}