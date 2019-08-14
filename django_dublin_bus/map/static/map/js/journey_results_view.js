function generate_journey_results_view(){
    if(journey_results_section.innerHTML === ""){
        journey_results_section.innerHTML = `
                <div class="mdl-grid">
                    <div class="mdl-grid">
                        <div id="back_button" class="mdl-cell mdl-cel--12-col">
                            <img src=`+back_button_image_url+`>
                        </div>
                    </div>
                    
                    
                
                    <div id="route_options_container" class="mdl-grid">
                        
                    </div>
                </div>
                `;
    }
    document.getElementById("back_button").addEventListener('click', function () {
        showing_journey_results = false;
        generate_directions_views();
    });

}
