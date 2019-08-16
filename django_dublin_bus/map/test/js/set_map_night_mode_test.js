//Test set_map_night_mode.js
QUnit.test( "Testing day-night functionality", function( assert ) {
    timetoday=1565632619132;
    //Test to see if the logic is right.
    // assert.notEqual(timetoday,0,"Unix time is a non-zero value.");
    let setting = set_night_mode(timetoday);
    assert.equal(setting, "Night", "Time function Works!");
});

function set_night_mode(timetoday){
    // Get todays date and time
    // Check to see if the date and time is between sunrise and sunset
    // If not, add night mode styles to map
    let sunrise=1565589600;
    let sunset=1565636400;
    if(timetoday >= parseInt(sunset+'000') || timetoday <= (parseInt(sunrise+'000')))
    {
        return "Day";
    }
    else
    {
        return "Night";
    }
}