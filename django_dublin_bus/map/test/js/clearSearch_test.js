//Test clearSearch.js file
QUnit.test( "Testing of clear search", function( assert ) {

    //Call the function to see if it erase the element's value.
    let element_id = 'set_location';
    document.getElementById(element_id).value = "StillOrgan";
    clearSearch(element_id);
    let empty_box= document.getElementById(element_id).value;
    assert.equal(empty_box, "", "Clear function Works!");
});