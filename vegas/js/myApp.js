var Location = function(title, latitude, longitude, icon, type) {
	//To remeber the parent context
	var self = this;

	self.title = ko.observable(title);
	self.content = '<h2 class="info-title">' + title + '</h2>'
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon = ko.observable(icon)
	self.type = ko.observable(type)

	self.marker = new google.maps.Marker({
		position: new google.maps.LatLng(self.latitude(), self.longitude()),
		map: map,
		icon: self.icon()
	});

	self.infoWindow = function() {
		infowindow.setContent(self.content);
		infowindow.open(map, self.marker);
	}

	google.maps.event.addListener(self.marker, 'click', self.infoWindow);
};

var ViewModel = function() {
	//To remeber the parent context
	var self = this;
	self.query = ko.observable('');

	myLocations = 		
		[
			new Location('Gordon Ramsay Burgr', 36.1108308, -115.1722186, 'img/lib/restaurant.png', 'Casual'),
			new Location('Gordon Ramsay Pub and Grill', 36.1174613, -115.175927, 'img/lib/restaurant.png', 'Casual'),
			new Location('Holsteins', 36.1098873, -115.1745552, 'img/lib/restaurant.png', 'Casual'),
			new Location('Nine Fine Irishmen', 36.1021012, -115.1737873, 'img/lib/bar.png', 'Casual'),
			//Shows
			new Location('Cirque du Soleil: Zarkana', 36.1060481, -115.1773626, 'img/lib/theater.png', 'Shows'),
			new Location('Cirque du Soleil: Zumanity', 36.102895, -115.1748606, 'img/lib/stripclub2.png', 'Shows'),
			new Location('Cirque du Soleil: O', 36.113911, -115.1773742, 'img/lib/theater.png', 'Shows'),
			new Location('Cirque du Soleil: Beatles Love', 36.1202598, -115.1748707, 'img/lib/music_live.png', 'Shows'),
			new Location('Cirque du Soleil: Mystere', 36.1244956, -115.1725308, 'img/lib/theater.png', 'Shows'),
			new Location('Cirque du Soleil: Ka', 36.10324, -115.1702839, 'img/lib/theater.png', 'Shows'),
			new Location('Cirque du Soleil: Criss Angel Believe', 36.0946657, -115.1774926, 'img/lib/music_live.png', 'Shows'),
			//Fine Dinning
			new Location('Picasso', 36.1133574, -115.1750467, 'img/lib/restaurant.png', 'Dinning'),
		];

	self.locations = ko.observableArray(myLocations.slice());

	self.openInfoWindow = function(obj) {
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
