
//I couldn't figure out how to get the callback on getJSON to work so that i could set
//The FQ variables in locations. The only way i was able to was to disable async
$.ajaxSetup({'async': false});

var map, infowindow;

var Location = function(title, latitude, longitude, icon, type, foursquare) {
	//To remeber the parent context
	var self = this;

	self.title = ko.observable(title);
	self.fqRating = ko.observable();
	self.fqHereNow = ko.observable();
	self.fqBestPhoto = ko.observable();
	self.fqOpenNow = ko.observable();
	self.fqOpenWhen = [];
	self.fqPhoto2 = ko.observable();
	self.fqPhoto3 = ko.observable();
	self.fqPhoto4 = ko.observable();
	self.fqPhoto5 = ko.observable();
	self.content = '<h2 class="info-title">' + title + self.fqRating() + '</h2>';
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon = ko.observable(icon);
	self.type = ko.observable(type);
	self.foursquare = ko.observable(foursquare);

	self.marker = new google.maps.Marker({
		position: new google.maps.LatLng(self.latitude(), self.longitude()),
		map: map,
		icon: self.icon(),
		animation: google.maps.Animation.DROP
	});

	self.infoWindow = function() {
		self.content1 = '<center><h3 class="info-title">' + title + '</h3></center>';
		self.content2 = '<table><tr><td><b>Rating: </b>' + self.fqRating() + '</td>';
		self.content3 = '<td><b>People here now: </b> ' + self.fqHereNow() + '</td></tr>';
		self.timeinfo = '';
		if (self.fqOpenWhen.length > 0)
		{
			var i = 0;
			self.fqOpenWhen.forEach(function(item){
				if (i == 0) {
					self.timeinfo = self.timeinfo + '<tr><td><b>' + item.days + ': </b>';
					item.open.forEach(function(openItem) {
						self.timeinfo = self.timeinfo + openItem.renderedTime + ' ';
					});
					self.timeinfo = self.timeinfo + '</td>';
				} else {
					self.timeinfo = self.timeinfo + '<td><b>' + item.days + ': </b>';
					item.open.forEach(function(openItem) {
						self.timeinfo = self.timeinfo + openItem.renderedTime + ' ';
					});
					self.timeinfo = self.timeinfo + '</td>';
				}
				i = i+1;
				if (i == 2) {
					self.timeinfo = self.timeinfo + '</tr>';
					i = 0;
				}
			});
		} else {
			self.timeinfo = '<tr><td colspan="2">No Fourquare Opening time information<td></tr>';
		}
		self.content4 = '<a href="https://foursquare.com/v/' + self.foursquare() + '"><img src="' + self.fqBestPhoto().prefix + '100x100' + self.fqBestPhoto().suffix + '">';
		self.content5 = '<img src="' + self.fqPhoto2().prefix + '100x100' + self.fqPhoto2().suffix + '">';
		self.content6 = '<img src="' + self.fqPhoto3().prefix + '100x100' + self.fqPhoto3().suffix + '">';
		self.content7 = '<img src="' + self.fqPhoto4().prefix + '100x100' + self.fqPhoto4().suffix + '"></a><br>';
		self.content = self.content1 + self.content2 + self.content3 + self.timeinfo + self.content4 + self.content5 + self.content6 + self.content7;
		var latLng = self.marker.getPosition();
		infowindow.setContent(self.content);
		infowindow.open(map, self.marker);
		map.panTo(latLng)
		//map.setCenter(latLng);
	};

	google.maps.event.addListener(self.marker, 'click', function() {
		parent.viewModel.openInfoWindow(self);
	});

	google.maps.event.addListener(parent.infowindow, 'closeclick', function() {
		parent.viewModel.closeInfoWindow(self);
	});
};

FSclientId = ko.observable('QLHZUN0VNMCUV0OMSJPTE0EBH3BQVMYLR41OUGQONTMWRLSJ');
FSsecret = ko.observable('TXY4D3TTKCUOXVGZEXLRCRHOPBEMLS0FBGSP2SVN14O52ZB2');

var ViewModel = function() {
	//To remeber the parent context
	var self = this;
	self.queryResultsShown = ko.observable(false);
	self.query = ko.observable('');

	myLocations = 		
		[
			new Location('Gordon Ramsay Burgr', 36.1108308, -115.1722186, 'img/lib/restaurant.png', 'Casual', '50ca2199e4b020a122695a7f'),
			new Location('Gordon Ramsay Pub and Grill', 36.1174613, -115.175927, 'img/lib/restaurant.png', 'Casual', '49dea68af964a520a8601fe3'),
			new Location('Holsteins', 36.1098873, -115.1745552, 'img/lib/restaurant.png', 'Casual', '4d014d3ac8bda0936a1975af'),
			new Location('Nine Fine Irishmen', 36.1021012, -115.1737873, 'img/lib/bar.png', 'Casual', '41326e00f964a520b7141fe3'),
			new Location('Fat Tuesday', 36.1206347,-115.172078, 'img/lib/bar_coktail.png', 'Casual', '4c0063009cf52d7fa5b713e7'),
			new Location("Dick's Last Resort", 36.0994759,-115.1756075, 'img/lib/restaurant.png', 'Casual', '4abc14aaf964a5204b8620e3'),
			new Location("Bouchon Bistro", 36.12116583662729,-115.16957519059744, 'img/lib/restaurant.png', 'Casual', '4a5b64a8f964a52012bb1fe3'),
			new Location("db Brasserie", 36.12221069887141,-115.17025840471311, 'img/lib/restaurant.png', 'Casual', '53507ffb498e9680b3965881'),
			new Location("FukuBurger", 36.10649555455546,-115.17238330704077, 'img/lib/restaurant.png', 'Casual', '5515acfe498ee91ac6ebf293'),
			new Location("Jaleo", 36.1096522950836,-115.17376130151159, 'img/lib/restaurant_mexican.png', 'Casual', '4d014e1f85c6a14363095237'),
			new Location("Mizumi", 36.126557328330485,-115.16704496962676, 'img/lib/japanese-food.png', 'Casual', '4fa4999de4b00c5843b54749'),
			new Location("Spago By Wolfgang Puck", 36.118686226131665,-115.17593828901438, 'img/lib/restaurant.png', 'Casual', '49dea637f964a520a6601fe3'),
			new Location("Yusho Japanese Grill & Noodle House", 36.104773,-115.173614, 'img/lib/japanese-food.png', 'Casual', '5340a412498e605fae439e85'),
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
			new Location('Penn & Teller', 36.118469129151535, -115.1871530121643, 'img/lib/magicshow.png', 'Shows', '4a76586df964a520e1e21fe3'),
			//Fine Dinning
			new Location('Picasso', 36.1133574, -115.1750467, 'img/lib/restaurant.png', 'Dinning', '4b42b0f0f964a520ced825e3'),
			new Location('Craftsteak', 36.10272318912341, -115.16836881637573, 'img/lib/restaurant_steakhouse.png', 'Dinning', '4a8437c4f964a520f0fb1fe3'),
			new Location('Jean Georges Steakhouse', 36.10740403456521, -115.1775312423706, 'img/lib/restaurant_steakhouse.png', 'Dinning', '4b29683ff964a5205c9e24e3'),
			new Location('Shibuya', 36.102411122843996, -115.16959190368652, 'img/lib/japanese-food.png', 'Dinning', '4b120b95f964a5208d8823e3'),
			new Location('Restaurant Guy Savoy', 36.11511301421067, -115.17445029650867, 'img/lib/restaurant.png', 'Dinning', '49dea64cf964a520a7601fe3'),
			new Location('Aureole Wine Lounge', 36.090933157496636, -115.1762866973877, 'img/lib/restaurant.png', 'Dinning', '4abae7faf964a5205a8320e3'),
			new Location('Twist by Pierre Gagnaire', 36.10618617477056, -115.17454326152802, 'img/lib/restaurant.png', 'Dinning', '4b454a7af964a520fa0926e3'),
			new Location('Joël Robuchon', 36.10279329326528, -115.16982415862289, 'img/lib/restaurant.png', 'Dinning', '51b928d60b6b311ab315a38e'),
			new Location('Bartolotta Ristorante di Mare', 36.126193954266554, -115.16740322113037, 'img/lib/restaurant_italian.png', 'Dinning', '4b3d53d6f964a520799225e3'),
			new Location('Carnevino', 36.12521066349459, -115.16859668647233, 'img/lib/restaurant_steakhouse.png', 'Dinning', '4a7f8759f964a5204ff41fe3'),
			new Location('CUT By Wolfgang Puck', 36.12366801631726, -115.16940149185976, 'img/lib/restaurant_steakhouse.png', 'Dinning', '4a3eab08f964a52043a31fe3'),
			new Location("L'Atelier de Joël Robuchon", 36.10277640687448, -115.16982415862289, 'img/lib/restaurant.png', 'Dinning', '4b2f06cbf964a5202ae924e3'),
			new Location("Le Cirque", 36.113315579778664, -115.1746703114034, 'img/lib/restaurant.png', 'Dinning', '4b3e46adf964a520899a25e3'),
			new Location("Michael Mina", 36.11239662894296, -115.17731666564941, 'img/lib/restaurant_fish.png', 'Dinning', '4b46ac72f964a520a32626e3'),
			new Location("Sage", 36.107781213239754, -115.17609461467109, 'img/lib/restaurant.png', 'Dinning', '4b293a50f964a5204a9b24e3'),
			new Location("SW Steakhouse", 36.12618, -115.167086, 'img/lib/restaurant_steakhouse.png', 'Dinning', '4ab2f918f964a520296d20e3'),
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

	self.showResults = function() {
		self.queryResultsShown(true);
	}

	self.openInfoWindow = function(obj) {
		var location = self.getFoursquareVenue(obj);
		//Stop Animation if we click on something else
		for(var x in parent.myLocations) {
			var currentLoc = parent.myLocations[x];
			currentLoc.marker.setAnimation(null);
		}
		self.queryResultsShown(false);
		obj.marker.setAnimation(google.maps.Animation.BOUNCE);
		obj.infoWindow();
	};

	self.closeInfoWindow = function(obj) {
		obj.marker.setAnimation(null);
	};

	self.showLocationByType = function(type) {
		self.searchType(type);
	};

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
		self.locations(locs);
	};

	self.search = function(value) {
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
			self.openInfoWindow(self.locations()[0]);
			self.searchType('All');
		}
	};

	self.hideAllMarkers = function() {
		var markers = self.locations();
		for(var x in self.locations()) {
			markers[x].marker.setMap(null);
		}
	};

	self.showMarker = function(location) {
		location.marker.setMap(map);
	};

	self.getFoursquareVenue = function(location)
	{
		baseURL = 'https://api.foursquare.com/v2/venues/';
		foursquareApiQuery = baseURL + location.foursquare() + '/?client_id=' + FSclientId() + '&client_secret=' + FSsecret() + '&v=20150906';
		var test = $.getJSON(foursquareApiQuery, function(data) {
			location.fqRating(data.response.venue.rating);
			location.fqHereNow(data.response.venue.hereNow.count);
			location.fqBestPhoto(data.response.venue.bestPhoto);
			location.fqPhoto2(data.response.venue.photos.groups[0].items[1]);
			location.fqPhoto3(data.response.venue.photos.groups[0].items[2]);
			location.fqPhoto4(data.response.venue.photos.groups[0].items[3]);
			location.fqPhoto5(data.response.venue.photos.groups[0].items[4]);
			//Some locations do not have a Status, so we'll put an empty string
			try {
				location.fqOpenNow(data.response.venue.popular.status);
			}
			catch(err) {
				location.fqOpenNow('');
			}
			//Some locations do not have a time table, so we'll put an empty string
			try {
				location.fqOpenWhen = data.response.venue.popular.timeframes;
			}
			catch(err) {
				location.fqOpenWhen = [];
			}
		}).fail(function() {
			alert("Unable to connect to Foursquare");
		});
	};
};


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 36.110, lng: -115.179},
		zoom: 15
	});
	infowindow = new google.maps.InfoWindow();
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);
}

regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

valueMatches = function (inputItem, testItem) {
	var CASE_INSENSITIVE_MATCHING = 'i';
	return RegExp(regExpEscape(inputItem.trim()), CASE_INSENSITIVE_MATCHING).test(testItem);
};
