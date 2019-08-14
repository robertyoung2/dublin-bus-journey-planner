// For inside initialise map function
console.log("Loaded Cache_User_Favourites.js");

function capture_favourites(){
    console.log("called capture_favourites function!");
    sethome = document.getElementById('set_home');
    destination = document.getElementById('set_destination');

    autocomplete = new google.maps.places.Autocomplete(destination, autocomplete_options);

    document.getElementById('set_favourites').addEventListener('click', function () {
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);

        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

        clearSearch('set_home');
        clearSearch('set_destination');
    });
}
