// For inside initialise map function
console.log("Loaded Cache_User_Favourites.js");

function capture_favourites(){
    //This can all be refactored and modularised better
    console.log("called capture_favourites function!");
    sethome = document.getElementById('set_home');
    destination = document.getElementById('set_destination');
    let set_favourites_button = document.getElementById('set_favourites');

    if(destination){
        autocomplete = new google.maps.places.Autocomplete(destination, autocomplete_options);
    }


    if(set_favourites_button){
        set_favourites_button.addEventListener('click', function () {

            geocoder.geocode({'address': destination.value},
                function (res_origin, status) {
                    /* If place is legitimate and able to get GPS co-ordinates. */
                    if (status === 'OK') {
                        console.log("sucessful geocode");
                        saveFavourite();
                    }
                    else {
                        callsnackBar("valid_address");
                    }
                }
            );
        });
    }

}

function saveFavourite(){
    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase())){
        callsnackBar("key_exists");
    //    Will need to change logic to handle button click when implemented
    }
    else if(sethome.value === ""){
        callsnackBar("provide_key");
    }
    else{
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);
    }

    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase()) && window.localStorage.getItem(sethome.value.toLowerCase()) === destination.value){

        clearSearch('set_home');
        clearSearch('set_destination');
        populate_saved_favourites();
        callsnackBar("save_favourites");
    }
    else{
        callsnackBar("not_save_favourites");
    }
}


function delete_favourite(favourite_key){
    if(Object.keys(window.localStorage).includes(favourite_key.toLowerCase())){
        localStorage.removeItem(favourite_key.toLowerCase());
        populate_saved_favourites();
        callsnackBar("key_delete");

    //    Will need to change logic to handle button click when implemented
    }
    else{
        callsnackBar("key_not_exist");
    }
}

function callsnackBar(elementid){
    var x = document.getElementById(elementid);
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}