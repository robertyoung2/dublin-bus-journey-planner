//Test haversine.js
QUnit.test( "Testing haversine functionality", function( assert ) {
    var lat1=53.2814001;
    var lon1=-6.1990189;
    var lat2=53.279729;
    var lon2=-6.216867;

    // assert.notEqual(lat1,lat2,"Latitude parameters are not equal.");

    // assert.notEqual(lon1,lon2,"Longitude parameters are not equal.");

    //Get the lon and lat result
    let result=haversine(lat1,lon1,lat2,lon2);
    assert.equal(result,1201.0585733887608,"Haversine Function works!");
});