function AjaxGetRoutes(stop_id, actual_stop_id, element_id) {
    console.log(stop_id);
    console.log(typeof stop_id);
    setup_ajax();
    $.ajax({
        type: "POST",
        data: {json_data: JSON.stringify({'stop_id': stop_id, "actual_stop_id":actual_stop_id})},
        url: get_routes_url,

        success: function (route_data, status) {
            // Do unit test to make sure the right format is being returned and the data is correct
            let stop_routes = new Set();
            let element = document.getElementById(element_id);

            for(route of route_data[0]){
                stop_routes.add(route.bus_numbers);
            }

            for(route of stop_routes){
                element.innerHTML += `
                    <span class="badge primary">`+route+`</span>
                `;
            }
            element.innerHTML += `
                <p>Realtime info</p>
            `;

            if(route_data[1].length > 0){
                for(route of route_data[1]){
                    element.innerHTML += `
                        <div>
                            <span class="badge secondary">${route.duetime}</span>
                            <span>${route.route} towards ${route.destination}</span>
                        </div>`;
                }
            }
            else{
                element.innerHTML += `<h3>No Realtime Information Available For This Stop</h3>`;
            }


        },
        error: function (jqXHR) {
            console.log(jqXHR);
            // Might be worth displaying this to the user in meaningful way
        }
    });
}