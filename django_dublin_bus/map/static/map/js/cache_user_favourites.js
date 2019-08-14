// For inside initialise map function
console.log("Loaded Cache_User_Favourites.js");

function capture_favourites(){
    //This can all be refactored and modularised better
    console.log("called capture_favourites function!");
    sethome = document.getElementById('set_home');
    destination = document.getElementById('set_destination');

    autocomplete = new google.maps.places.Autocomplete(destination, autocomplete_options);

    document.getElementById('set_favourites').addEventListener('click', function () {

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

function saveFavourite(){
    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase())){
        alert("Key Already Exists - Add a New One");
    //    Will need to change logic to handle button click when implemented
    }
    else{
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);
    }

    if(Object.keys(window.localStorage).includes(sethome.value.toLowerCase()) && window.localStorage.getItem(sethome.value.toLowerCase()) === destination.value){
        alert("Favourite Stop Saved!");
        clearSearch('set_home');
        clearSearch('set_destination');
        populate_saved_favourites();
    }
    else{
        alert("Stop not saved");
    }
}
