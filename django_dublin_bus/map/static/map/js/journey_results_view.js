function generate_journey_results_view(){
    if(journey_results_section.innerHTML === ""){
        journey_results_section.innerHTML = `
                <div class="grid-x align-left">
                    <div class="cell grid-x ">
                        <div id="back_button" class="cell small-2 medium-2"><img src=`+back_button_image_url+`></div>
                    </div>
                    <div id="route_options_container" class="cell grid-y align-self-top"></div>
                </div>
                `;
    }
    document.getElementById("back_button").addEventListener('click', function () {
        showing_journey_results = false;
        generate_directions_views();
    });

}
