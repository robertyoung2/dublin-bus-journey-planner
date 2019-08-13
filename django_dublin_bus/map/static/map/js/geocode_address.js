/* Function that performs geodecoding. */
function geocodeAddress() {
    console.log('called geocode_Address')
    var origin_new = "";
    var dest_new = "";
    var origin_lat;
    var origin_lng;
    var origin_found = false;

    if(destination_searchbox.value === ""){
        alert("Please provide a destination in order to plan your journey!");
        return;
    }

    if (origin_searchbox.value === "") {
        origin_lat = userPosition.lat;
        origin_lng = userPosition.lng;
        origin_found = true;
    }

    if (Object.keys(window.localStorage).includes(origin_searchbox.value.toLowerCase())) {
        origin_new = window.localStorage.getItem(origin_searchbox.value.toLowerCase());
    }
    else {
        origin_new = origin_searchbox.value
    }

    if (Object.keys(window.localStorage).includes(destination_searchbox.value.toLowerCase())) {
        console.log("here also");
        dest_new = window.localStorage.getItem(destination_searchbox.value.toLowerCase());
    }
    else {
        dest_new = destination_searchbox.value
    }


    if(origin_found === false){
        geocoder.geocode({'address': origin_new},
            function (res_origin, status) {
                /* If place is legitimate and able to get GPS co-ordinates. */
                if (status === 'OK') {

                    origin_lat = res_origin[0].geometry.location.lat();
                    origin_lng = res_origin[0].geometry.location.lng();
                }
                else {
                    alert('Geocode was not successful for the following reason: ' + status);

                }
            }
        );
    }

    geocoder.geocode({'address': dest_new}, function (res_dest, status) {
        if (status === 'OK') {
            mapLocation(
                origin_lat,
                origin_lng,
                res_dest[0].geometry.location.lat(),
                res_dest[0].geometry.location.lng()
            );
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}