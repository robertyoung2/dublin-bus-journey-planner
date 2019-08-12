function AjaxGetRoutes(stop_id) {
    console.log(stop_id);
    console.log(typeof stop_id);
    setup_ajax();
    return $.ajax({
        type: "POST",
        data: {'stop_id': stop_id},
        url: get_routes_url,

        success: function (routes, status) {
            // Do unit test to make sure the right format is being returned and the data is correct
            console.log(routes);
            console.log(status);
            return routes;
        },
        error: function (jqXHR) {
            console.log(jqXHR);
            // Might be worth displaying this to the user in meaningful way
        }
    });
}