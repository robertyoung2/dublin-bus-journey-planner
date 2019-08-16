function geocodeAddress() {
    var origin_new = "";
    var dest_new = "";
    var origin_lat;
    var origin_lng;
    var origin_found = false;

    if(destination_searchbox.value === ""){
        callsnackBar("enter_destination");
        return;
    }

    if (origin_searchbox.value === "") {
        origin_lat = userPosition.lat;
        origin_lng = userPosition.lng;
        origin_found = true;
    }
    else if (Object.keys(window.localStorage).includes(origin_searchbox.value.toLowerCase())) {
        origin_new = window.localStorage.getItem(origin_searchbox.value.toLowerCase());
    }
    else {
        origin_new = origin_searchbox.value
    }

    if (Object.keys(window.localStorage).includes(destination_searchbox.value.toLowerCase())) {
        dest_new = window.localStorage.getItem(destination_searchbox.value.toLowerCase());
    }
    else {
        dest_new = destination_searchbox.value
    }

    if(origin_found === false){
        geocoder.geocode({'address': origin_new},
            function (res_origin, status) {
                if (status === 'OK') {
                    origin_lat = res_origin[0].geometry.location.lat();
                    origin_lng = res_origin[0].geometry.location.lng();
                    geocode_destination(origin_lat, origin_lng, dest_new);
                }
                else {
                    callsnackBar("valid_address");
                }
            }
        );
    }
    else{
        geocode_destination(origin_lat, origin_lng, dest_new);
    }
}


function geocode_destination(origin_lat, origin_lng, dest_new){
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
            callsnackBar("valid_address");
        }
    });
}
