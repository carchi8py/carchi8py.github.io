
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
	self.fqOpenWhen = []
	self.fqPhoto2 = ko.observable()
	self.fqPhoto3 = ko.observable()
	self.fqPhoto4 = ko.observable()
	self.fqPhoto5 = ko.observable()
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
		self.content1 = '<center><h3 class="info-title">' + title + '</h3></center>';
		self.content2 = '<b>Rating: </b>' + self.fqRating() + '<br>';
		self.content3 = '<b>People here now: </b> ' + self.fqHereNow() + '<br><br>';
		self.timeinfo = ''
		if (self.fqOpenWhen.length > 0)
		{
			self.fqOpenWhen.forEach(function(item){
				console.log(item)
				self.timeinfo = self.timeinfo + '<b>' + item.days + ': </b>'
				item.open.forEach(function(openItem) {
					self.timeinfo = self.timeinfo + openItem.renderedTime + ' '
				})
				self.timeinfo = self.timeinfo + '<br>'
			})
		} else {
			self.timeinfo = "No Fourquare Opening time information<br>"
		}
		self.content4 = '<a href="https://foursquare.com/v/' + self.foursquare() + '"><img src="' + self.fqBestPhoto().prefix + '100x100' + self.fqBestPhoto().suffix + '">'
		self.content5 = '<img src="' + self.fqPhoto2().prefix + '100x100' + self.fqPhoto2().suffix + '">'
		self.content6 = '<img src="' + self.fqPhoto3().prefix + '100x100' + self.fqPhoto3().suffix + '">'
		self.content7 = '<img src="' + self.fqPhoto4().prefix + '100x100' + self.fqPhoto4().suffix + '">'
		self.content8 = '<img src="' + self.fqPhoto5().prefix + '100x100' + self.fqPhoto5().suffix + '"></a><br>'
		self.content = self.content1 + self.content2 + self.timeinfo + self.content3 + self.content4 + self.content5 + self.content6 + self.content7 + self.content8
		var latLng = self.marker.getPosition();
		infowindow.setContent(self.content);
		infowindow.open(map, self.marker);
		map.setCenter(latLng);
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
			//sushi
			new Location('Katana Sushi & Sake', 37.3655601634738, -122.02805866186294, 'img/lib/japanese-food.png', 'Sushi', '4c0c6878b1b676b04c23df86'),
			new Location('Tasty Subs & Pizza', 37.38337923241529, -121.99536476149174, 'img/lib/restaurant_indian.png', 'Indian', '4a70af81f964a52034d81fe3'),
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

	self.showSushiLocations = function() {
		self.showLocationByType('Sushi');
	};

	self.showIndianLocations = function() {
		self.showLocationByType('Indian');
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
			location.fqPhoto2(data.response.venue.photos.groups[0].items[1])
			location.fqPhoto3(data.response.venue.photos.groups[0].items[2])
			location.fqPhoto4(data.response.venue.photos.groups[0].items[3])
			location.fqPhoto5(data.response.venue.photos.groups[0].items[4])
			//Some locations do not have a Status, so we'll put an empty string
			try {
				location.fqOpenNow(data.response.venue.popular.status);
			}
			catch(err) {
				location.fqOpenNow('')
			}
			//Some locations do not have a time table, so we'll put an empty string
			try {
				location.fqOpenWhen = data.response.venue.popular.timeframes;
			}
			catch(err) {
				location.fqOpenWhen = []
			}
		});
	};
};

var map, infowindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.35, lng: -122.02},
		zoom: 13
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
