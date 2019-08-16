//Test journey_date_selector.js file
set_date_options();
QUnit.test("Determine whether datetime options are show/hiding correctly", function (assert) {

    //Test the value is correct passing
    let option = document.getElementById("option");
    let datetime_selector_container = document.getElementById("datetime_selector_container");

    option.options[0].selected = true;
    assert.equal(option.value, "now", "value is now");

    option.options[1].selected = true;
    assert.equal(option.value, "departureTime", "value is departureTime");

    option.options[2].selected = true;
    assert.equal(option.value, "arrivalTime", "value is arrivalTime");
});
