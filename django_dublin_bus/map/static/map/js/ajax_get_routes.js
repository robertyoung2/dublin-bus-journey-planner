function AjaxGetRoutes(stop_id, infowindow, stop_name) {
    console.log(stop_id);
    setup_ajax();
    $.ajax({
        type: "POST",
        data: {'stop_id': stop_id},
        url: get_routes_url,

        success: function (routes, status) {
            // Do unit test to make sure the right format is being returned and the data is correct
            console.log(routes);
            console.log(status);

            // Refactor content string to stop_info_content or something like this
            var stop_info_content = '<div id="stop_name">' + stop_name + '</div>';
            stop_info_content += '<div><ul>';
            var route_list = []

            // Record performance for this loop execution, see is there a better way to do it
            console.time('Time');
            //var start = new Date().getTime();
            for (route in routes) {
                var route_number = routes[route].fields.bus_numbers; //remember route is a string, not a number "0", "1", etc.
                if (!route_list.includes(route_number)) {
                    stop_info_content += '<li>' + route_number + '</li>';
                    route_list.push(route_number);
                }
            }
            console.timeEnd('Time');
            //var end = new Date().getTime();
            //var time = end - start;
            //console.log('Execution time: ' + time);

            stop_info_content += '</ul></div>';

            infowindow.setContent(stop_info_content);
        },
        error: function (jqXHR) {
            console.log(jqXHR);
            // Might be worth displaying this to the user in meaningful way
        }
    });
}