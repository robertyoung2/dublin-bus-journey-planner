/* Function that performs geodecoding. */
function geocodeAddress() {
    var origin_new = "";
    var dest_new = "";
    if (origin_searchbox.value == "") {
        if (Object.keys(window.localStorage).includes(destination_searchbox.value)) {
            console.log("here also");
            dest_new = window.localStorage.getItem(destination_searchbox.value);
        } else {
            dest_new = destination_searchbox.value
        }
        geocoder.geocode({'address': dest_new}, function (res_dest, status) {
            if (status === 'OK') {
                console.log(status);
                mapLocation(
                    geo_for_emptystring[1],
                    geo_for_emptystring[0],
                    res_dest[0].geometry.location.lat(),
                    res_dest[0].geometry.location.lng()
                );
                console.log("success")
                console.log(geo_for_emptystring);
            }
        });
    } else {
        if (Object.keys(window.localStorage).includes(origin_searchbox.value.toLowerCase())) {
            origin_new = window.localStorage.getItem(origin_searchbox.value.toLowerCase());
        } else {
            origin_new = origin_searchbox.value
        }

        if (Object.keys(window.localStorage).includes(destination_searchbox.value.toLowerCase())) {
            console.log("here also");
            dest_new = window.localStorage.getItem(destination_searchbox.value.toLowerCase());
        } else {
            dest_new = destination_searchbox.value
        }

        console.log(origin_new);
        console.log(dest_new);
        geocoder.geocode({'address': origin_new},
            function (res_origin, status) {
                /* If place is legitimate and able to get GPS co-ordinates. */
                if (status === 'OK') {
                    /* Set center based upon the lat and longitiude on final map */
                    map.setCenter(res_origin[0].geometry.location);

                    /* Status of response is used for checking if
                the respose from geocoding is valid or not (N.B. This is not a formal definition). */
                    geocoder.geocode({'address': dest_new}, function (res_dest, status) {

                        if (status === 'OK') {
                            mapLocation(
                                res_origin[0].geometry.location.lat(),
                                res_origin[0].geometry.location.lng(),
                                res_dest[0].geometry.location.lat(),
                                res_dest[0].geometry.location.lng()
                            );
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }

                    });

                } else {
                    alert('Geocode was not successful for the following reason: ' + status);

                }

            }
        );
    }
}