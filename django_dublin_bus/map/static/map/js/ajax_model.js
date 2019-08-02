function Ajax_Model(data) {
    console.log("Model Data:" + data);
    $.ajax({
        type: "POST",
        data: {'data': data},
        url: model_url,

        success: function (predictions, status) {
            // console.log(predictions);
            console.log(status);
            for(prediction of predictions){
                let keys = Object.keys(prediction);
                let route_total_transit_time = 0;
                for(route of keys){
                    console.log(route + ": " + prediction[route]);
                    for (segment of prediction[route]){
                        route_total_transit_time += segment;
                    }
                }
                console.log("Total Transit Time: " + route_total_transit_time + " seconds");
            }
        },
        error: function (jqXHR) {
            console.log(jqXHR);
        }
    });
}