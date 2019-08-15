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
                        alert('Please enter a valid address from google maps');
                    }
                }
            );
        });
    }

}

function saveFavourite(){
    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase())){
        alert("Key Already Exists - Add a New One");
    //    Will need to change logic to handle button click when implemented
    }
    else{
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);
    }

    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase()) && window.localStorage.getItem(sethome.value.toLowerCase()) === destination.value){
        // alert("Favourite Stop Saved!");
        var x = document.getElementById("snackbar");
        x.className = "show";
        // Add the "show" class to DIV
        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        clearSearch('set_home');
        clearSearch('set_destination');
        populate_saved_favourites();
    }
    else{
        alert("Stop not saved");
    }
}
