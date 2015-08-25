
function loadData() {

    // Variables
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var street = $('#street').val();
    var city = $('#city').val();
    var stretviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=1200x800&location=' + street + ',' + city + '"';
    console.log(stretviewURL);

    var nytKey = 'f04dc6617122670611c89974ff297d6b:17:72661996'
    var nytURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=' + nytKey;

    $greeting.text('So, you want to live at ' + street + ', ' + city + '?');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    $body.append('<img class="bgimg" src="' + stretviewURL + '>');

    // Getting NYTimes data

    $.getJSON(nytURL, function(data) {
        $nytHeaderElem.text('New York Time Articles About ' + city);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">'+article.headline.main+'</a><p>' + article.snippet + '</p></li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could not be Loaded');
    });


    // Wikipedia AJAX request

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);

    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
    console.log(wikiURL)

    $.ajax({
        url: wikiURL,
        dataType: "jsonp", 
        //jsonp: "callback",
        success : function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();
