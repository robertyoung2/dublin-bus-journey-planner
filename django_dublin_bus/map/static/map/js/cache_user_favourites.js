// For inside initialise map function
console.log("Loaded Cache_User_Favourites.js");

function capture_favourites(){
    console.log("called capture_favourites function!");
    sethome = document.getElementById('set_home');
    destination = document.getElementById('set_destination');

    autocomplete = new google.maps.places.Autocomplete(destination, autocomplete_options);

    document.getElementById('set_favourites').addEventListener('click', function () {
        window.localStorage.setItem(sethome.value.toLowerCase(),destination.value);
        alert("Favourite Stop Saved!");

        clearSearch('set_home');
        clearSearch('set_destination');
    });
}
