function generate_journey_results_view(){
    if(journey_results_section.innerHTML === ""){
        journey_results_section.innerHTML = `

                    <div class="mdl-grid back_journey">
                        <div id="back_button" class="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                            <img src=`+back_button_image_url+`>
                        </div>                        

                        <div class="mdl-cell mdl-cell--11-col mdl-cell--7-col-tablet mdl-cell--3-col-phone journey_heading">
                           Suggested Journeys
                        </div>
                        </div>
                    </div>
                    

                    <div id="route_options_container" class="mdl-grid">
                    </div>
                `;
    }
    document.getElementById("back_button").addEventListener('click', function () {
        showing_journey_results = false;
        generate_directions_views();
    });

}
