function capture_favourites(){
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
                        saveFavourite();
                    }
                    else {
                        callsnackBar("invalid_address");
                    }
                }
            );
        });
    }
}


function saveFavourite(){
    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase())){
        callsnackBar("key_exists");
    }
    else if(sethome.value === ""){
        callsnackBar("provide_key");
    }
    else if(sethome.value.length > 20){
        callsnackBar("key_too_long");
    }
    else{
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);

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
}


function delete_favourite(favourite_key){
    if(Object.keys(window.localStorage).includes(favourite_key.toLowerCase())){
        localStorage.removeItem(favourite_key.toLowerCase());
        populate_saved_favourites();
        callsnackBar("key_delete");
    }
    else{
        callsnackBar("key_not_exist");
    }
}


function callsnackBar(elementid){
    console.log("Snack Bar Called!");
    var x = document.getElementById(elementid);
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
