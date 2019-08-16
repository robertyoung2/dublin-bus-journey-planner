
function haversine(lat1, lon1, lat2, lon2){

var R = 6371; // km
var dLat = (lat2-lat1)*Math.PI/180;
var dLon = (lon2-lon1)*Math.PI/180;
var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
var c = 2 * Math.asin(Math.sqrt(a));
var d = R * c *1000;

return d;
}

