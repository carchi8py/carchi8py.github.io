
function loadData() {

    // Variables
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var street = $('#street').val();
    var city = $('#city').val();

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    $body.append('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location='
                + street + ',' + city + '"');
    $body.append('asdf')
    console.log('<image class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location='
                + street + ',' + city + '">');


    // YOUR CODE GOES HERE!

    return false;
};

$('#form-container').submit(loadData);

// loadData();
