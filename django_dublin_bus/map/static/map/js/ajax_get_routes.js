function AjaxGetRoutes(stop_id, actual_stop_id, element_id) {
    setup_ajax();
    $.ajax({
        type: "POST",
        data: {json_data: JSON.stringify({'stop_id': stop_id, "actual_stop_id":actual_stop_id})},
        url: get_routes_url,

        success: function (route_data, status) {
            let element = document.getElementById(element_id);
            duetime_dict[actual_stop_id] = {};

            if(element){
                element.innerHTML = "";
                if(route_data[1].length > 0){

                    for(route of route_data[1]){

                        if(route.route in duetime_dict[actual_stop_id] === false){
                            duetime_dict[actual_stop_id][route.route] = [];
                            element.innerHTML += `

                            <div class="flex-container">

                                 <div style="flex: 0 0 70px">
                                    <span class="mdl-chip mdl-chip--contact">
                                        <i class="material-icons">directions_bus</i>
                                        <span class="mdl-chip__text">${route.route}</span>
                                    </span>
                                 </div>
                         
                                <div style="flex-basis:60%" class="route_destination_heading">
                                    <span>${route.destination}</span>
                                </div>
                                    
                                <div style="flex-basis:30%" class="minutes_nearby_stops">
                                   <span id="duetimes_${actual_stop_id}_${route.route}"></span>
                                </div>
                                   
                            </div>
                            <div></div>

                            `;
                        }
                        duetime_dict[actual_stop_id][route.route].push(route.duetime);
                    }

                    for(let key in duetime_dict[actual_stop_id]){
                        let duetime_result = duetime_dict[actual_stop_id][key];
                        let duetime_counter = 0;
                        let time_ending = "";
                        for(duetime of duetime_result){
                            if(duetime !== "Due"){
                                time_ending = " min";
                            }
                            else{
                                time_ending = ""
                            }
                            if(duetime_counter < duetime_result.length - 1){
                                time_ending += ", "
                            }

                            document.getElementById("duetimes_"+actual_stop_id+"_"+key).innerHTML += duetime + time_ending;
                            duetime_counter++;
                        }
                    }
                }
                else{
                    element.innerHTML += `<br><span class="no_real">No Realtime Information Available For This Stop<span>`;
                }
            }
        },
        error: function (jqXHR) {
            console.log(jqXHR);
        }
    });
}