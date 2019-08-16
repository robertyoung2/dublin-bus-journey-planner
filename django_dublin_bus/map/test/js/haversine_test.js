//Test haversine.js
QUnit.test( "Testing haversine functionality", function( assert ) {
    var lat1=53.2814001;
    var lon1=-6.1990189;
    var lat2=53.279729;
    var lon2=-6.216867;

    assert.equal(haversine(lat1,lon1,lat2,lon2),1201.0585733887608,"Haversine Function works!");
});