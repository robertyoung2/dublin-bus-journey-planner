//Test set_map_night_mode.js
QUnit.test( "Testing day-night functionality", function( assert ) {
    sunrise = 677667600; // 9AM
    sunset = 677714400; // 10PM
    var styles;

    timetoday = 677664000; // 8AM
    assert.equal(set_night_mode(sunrise, sunset, timetoday)[1], "Night", "Success! It is Before Sunrise");

    timetoday = 677685600; // 2PM
    assert.equal(set_night_mode(sunrise, sunset, timetoday)[1], "Day", "Success! It is Daytime");

    timetoday = 677718000; // 11PM
    assert.equal(set_night_mode(sunrise, sunset, timetoday)[1], "Night", "Success! It is After Sunset");
});
