function AjaxGetRoutes(stop_id, stop_info_section) {
    console.log(stop_id);
    console.log(typeof stop_id);
    setup_ajax();
    $.ajax({
        type: "POST",
        data: {'stop_id': stop_id},
        url: get_routes_url,

        success: function (route_data, status) {
            // Do unit test to make sure the right format is being returned and the data is correct
            let stop_routes = new Set();

            for(route of route_data){
                stop_routes.add(route.bus_numbers);
            }

            for(route of stop_routes){
                stop_info_section.innerHTML += `
                    <span>`+route+`</span>
                `;
            }
        },
        error: function (jqXHR) {
            console.log(jqXHR);
            // Might be worth displaying this to the user in meaningful way
        }
    });
}