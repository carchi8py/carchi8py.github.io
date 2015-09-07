
//I couldn't figure out how to get the callback on getJSON to work so that i could set
//The FQ variables in locations. The only way i was able to was to disable async
$.ajaxSetup({'async': false});

var Location = function(title, latitude, longitude, icon, type, foursquare) {
	//To remeber the parent context
	var self = this;

	self.title = ko.observable(title);
	self.fqRating = ko.observable()
	self.fqHereNow = ko.observable()
	self.fqBestPhoto = ko.observable()
	self.fqOpenNow = ko.observable()
	self.fqOpenWhen = ko.observable()
	self.content = '<h2 class="info-title">' + title + self.fqRating() + '</h2>'
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon = ko.observable(icon)
	self.type = ko.observable(type)
	self.foursquare = ko.observable(foursquare)

	self.marker = new google.maps.Marker({
		position: new google.maps.LatLng(self.latitude(), self.longitude()),
		map: map,
		icon: self.icon()
	});

	self.infoWindow = function() {
		console.log('print other stuff')
		console.log(self.fqRating())
		self.content1 = '<h3 class="info-title">' + title + '</h3>';
		self.content2 = '<b>Rating:</b>' + self.fqRating() + '<br>';
		self.content3 = '<b>People here now:</b> ' + self.fqHereNow() + '<br>';
		self.content4 = '<img src="' + self.fqBestPhoto().prefix + '240x240' + self.fqBestPhoto().suffix + '">'
		self.content = self.content1 + self.content2 + self.content3 + self.content4
		infowindow.setContent(self.content);
		infowindow.open(map, self.marker);
	}

	google.maps.event.addListener(self.marker, 'click', function() {
		parent.viewModel.openInfoWindow(self);
	});
};

FSclientId = ko.observable('QLHZUN0VNMCUV0OMSJPTE0EBH3BQVMYLR41OUGQONTMWRLSJ');
FSsecret = ko.observable('TXY4D3TTKCUOXVGZEXLRCRHOPBEMLS0FBGSP2SVN14O52ZB2');

var ViewModel = function() {
	//To remeber the parent context
	var self = this;
	self.query = ko.observable('');

	myLocations = 		
		[
			new Location('Gordon Ramsay Burgr', 36.1108308, -115.1722186, 'img/lib/restaurant.png', 'Casual', '50ca2199e4b020a122695a7f'),
			new Location('Gordon Ramsay Pub and Grill', 36.1174613, -115.175927, 'img/lib/restaurant.png', 'Casual', '49dea68af964a520a8601fe3'),
			new Location('Holsteins', 36.1098873, -115.1745552, 'img/lib/restaurant.png', 'Casual', '4d014d3ac8bda0936a1975af'),
			new Location('Nine Fine Irishmen', 36.1021012, -115.1737873, 'img/lib/bar.png', 'Casual', '41326e00f964a520b7141fe3'),
			new Location('Fat Tuesday', 36.1206347,-115.172078, 'img/lib/bar_coktail.png', 'Casual', '4c0063009cf52d7fa5b713e7'),
			new Location("Dick's Last Resort", 36.0994759,-115.1756075, 'img/lib/restaurant.png', 'Casual', '4abc14aaf964a5204b8620e3'),
			//Shows
			new Location('Cirque du Soleil: Zarkana', 36.1060481, -115.1773626, 'img/lib/theater.png', 'Shows', '50818420e4b0a7491c0e692b'),
			new Location('Cirque du Soleil: Zumanity', 36.102895, -115.1748606, 'img/lib/stripclub2.png', 'Shows', '4a70e3c2f964a520b3d81fe3'),
			new Location('Cirque du Soleil: O', 36.113911, -115.1773742, 'img/lib/theater.png', 'Shows', '54e56c37498e5435363715e6'),
			new Location('Cirque du Soleil: Beatles Love', 36.1202598, -115.1748707, 'img/lib/music_live.png', 'Shows', '4a6e51e1f964a5207dd41fe3'),
			new Location('Cirque du Soleil: Mystere', 36.1244956, -115.1725308, 'img/lib/theater.png', 'Shows', '4ad68155f964a520850721e3'),
			new Location('Cirque du Soleil: Ka', 36.10324, -115.1702839, 'img/lib/theater.png', 'Shows', '4ac83f91f964a52004bc20e3'),
			new Location('Cirque du Soleil: Criss Angel Believe', 36.0946657, -115.1774926, 'img/lib/music_live.png', 'Shows', '4ae1e8f6f964a520a58821e3'),
			new Location('David Copperfield', 36.1014952, -115.1698515, 'img/lib/magicshow.png', 'Shows', '4ba5a60ef964a520441939e3'),
			new Location('Absinthe', 36.1152939,-115.174143, 'img/lib/theater.png', 'Shows', '4d8a8a09d85f370452f700dc'),
			new Location('Thunder from Down Under', 36.0993095,-115.1759191, 'img/lib/stripclub2.png', 'Shows', '4b7cc2f0f964a5207da42fe3'),
			new Location('Tournament of Kings', 36.0990753,-115.1755671, 'img/lib/theater.png', 'Shows', '4b22f5d9f964a520275124e3'),
			new Location('Laugh Factory', 36.0993853,-115.1712763, 'img/lib/comedyclub.png', 'Shows', '4f83c4bae4b0107aa18cf3be'),
			//Fine Dinning
			new Location('Picasso', 36.1133574, -115.1750467, 'img/lib/restaurant.png', 'Dinning', '4b42b0f0f964a520ced825e3'),
			//Shops
			new Location('Coca Cola Store', 36.1037712, -115.172412, 'img/lib/mural.png', 'Shop', '4b803bbdf964a520285f30e3'),
			new Location("M&M's World", 36.1033984, -115.172469, 'img/lib/mural.png', 'Shop', '4ba53706f964a520f2ec38e3'),
			new Location("Hershey's Chocolate World", 36.1017125,-115.1736885, 'img/lib/mural.png', 'Shop', '538699bd498e73b89178e1c6'),
			//Attractions
			new Location('CSI: The Experience', 36.1038639, -115.1680313, 'img/lib/theater.png','Attractions', '4b91d01cf964a52022d933e3'),
			new Location('Big Apple Coaster', 36.1023669,-115.1745465, 'img/lib/themepark.png','Attractions', '4a92b8b8f964a5206e1d20e3'),
			new Location('Fountains of Bellaio', 36.1127918,-115.1740086, 'img/lib/waterpark.png','Attractions', '4ab0498ef964a520dd6620e3'),
			new Location('Conservatory of Bellaio', 36.1120479,-115.1766143, 'img/lib/publicart.png','Attractions', '4aff3365f964a520d53522e3'),
			new Location('Volcano at Mirage', 36.1215249,-115.1726073, 'img/lib/publicart.png','Attractions', '4bdba272c79cc928fde983e9'),
			new Location('Secret Garden', 36.1204735,-115.1781435, 'img/lib/zoo.png','Attractions', '4b4ba8e9f964a52021a326e3'),
			new Location('Bare', 36.1206111,-115.1774072, 'img/lib/stripclub2.png','Attractions', '49de8b37f964a52075601fe3'),
			new Location('Madame Tussauds', 36.1212493,-115.171161, 'img/lib/anthropo.png','Attractions', '4b9fe4c5f964a5203b4837e3'),
			new Location('Outdoor Gondola', 36.1226034,-115.1706848, 'img/lib/cruiseship.png','Attractions', '4d2fac937791224bea27ca42'),
			new Location('Indoor Gondola', 36.1231648,-115.1689538, 'img/lib/cruiseship.png','Attractions', '4dd322ab18381e5587c4faa6'),
			new Location('High Roller', 36.1176507,-115.1681208, 'img/lib/ferriswheel.png','Attractions', '52b0da9811d28f203caf4682'),
			new Location('Brooklyn Bowl', 36.1175012,-115.169673, 'img/lib/bowling.png','Attractions', '516dd2f4e4b005f4f245a8dc'),
			new Location('Eiffel Tower', 36.1127861,-115.1718286, 'img/lib/wifi.png','Attractions', '4bc1502074a9a593c6c7d1f6'),
			new Location('Shark Reef Aquarium', 36.0912725,-115.1743524, 'img/lib/aquarium.png','Attractions', '4ba26422f964a5202ff437e3'),
		];
	self.locations = ko.observableArray(myLocations.slice());

	self.openInfoWindow = function(obj) {
		var location2 = self.getFoursquareVenue(obj);
		obj.infoWindow();
	};

	self.showLocationByType = function(type) {
		self.searchType(type);
	}

	self.showAllLocations = function() {
		self.showLocationByType('All');
	};

	self.showCasualLocations = function() {
		self.showLocationByType('Casual');
	};

	self.showShowsLocations = function() {
		self.showLocationByType('Shows');
	};

	self.showDinningLocations = function() {
		self.showLocationByType('Dinning');
	};

	self.showShopLocations = function() {
		self.showLocationByType('Shop');
	};

	self.showAttractionsLocations = function() {
		self.showLocationByType('Attractions');
	};

	self.searchType = function(value) {
		//First hide everything
		self.hideAllMarkers();
		self.locations.removeAll();
		var locs = [];
		for(var x in parent.myLocations){
			var curentLoc = parent.myLocations[x];
			if(value == 'All') {
				locs.push(curentLoc);
				self.showMarker(curentLoc);
			} else if(value == curentLoc.type()) {
				locs.push(curentLoc);
				self.showMarker(curentLoc);
			}
		}
		self.locations(locs)
	};

	self.search = function(value) {
		console.log('W00t')
		self.hideAllMarkers();
		self.locations.removeAll();
		var locs = [];
		for(var x in parent.myLocations){
			var curentLoc = parent.myLocations[x];
			if(valueMatches(value, curentLoc.title())) {
				self.showMarker(curentLoc);
				locs.push(curentLoc);
			}
		}
		self.locations(locs);
	};

	self.searched = function() {
		if(self.locations().length) {
			console.log(self.locations().length)
			self.openInfoWindow(self.locations()[0]);
			self.searchType('All');
		}
		console.log('bye')
	}

	self.hideAllMarkers = function() {
		var markers = self.locations();
		for(var x in self.locations()) {
			markers[x].marker.setMap(null);
		}
	}

	self.showMarker = function(location) {
		location.marker.setMap(map);
	}

	self.getFoursquareVenue = function(location)
	{
		baseURL = 'https://api.foursquare.com/v2/venues/'
		console.log(location)
		foursquareApiQuery = baseURL + location.foursquare() + '/?client_id=' + FSclientId() + '&client_secret=' + FSsecret() + '&v=20150906';
		console.log(foursquareApiQuery)
		var test = $.getJSON(foursquareApiQuery, function(data) {
			location.fqRating(data.response.venue.rating);
			location.fqHereNow(data.response.venue.hereNow.count);
			location.fqBestPhoto(data.response.venue.bestPhoto);
			location.fqOpenNow(data.response.venue.popular.status);
			location.fqOpenWhen(data.response.venue.popular.timeframes);
		});
	};
};

var map, infowindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 36.115, lng: -115.172},
		zoom: 16
	});
	infowindow = new google.maps.InfoWindow();
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);
};

regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

valueMatches = function (inputItem, testItem) {
	var CASE_INSENSITIVE_MATCHING = 'i';
	return RegExp(regExpEscape(inputItem.trim()), CASE_INSENSITIVE_MATCHING).test(testItem);
};
