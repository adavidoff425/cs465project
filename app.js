const mapStyle = [{
	'featureType': 'administrative',
	'elementType': 'all',
	'stylers': [{
		'visibility': 'on',
	},
		{
			'lightness': 33,
		},
	],
},
	{
		'featureType': 'landscape',
		'elementType': 'all',
		'stylers': [{
			'color': '#f2e5d4',
		}],
	},
	{
		'featureType': 'poi.park',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#c5dac6',
		}],
	},
	{
		'featureType': 'poi.park',
		'elementType': 'labels',
		'stylers': [{
			'visibility': 'on',
		},
			{
				'lightness': 20,
			},
		],
	},
	{
		'featureType': 'road.highway',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#c5c6c6',
		}],
	},
	{
		'featureType': 'road.arterial',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#e4d7c6',
		}],
	},
	{
		'featureType': 'road.local',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#fbfaf7',
		}],
	},
	{
		'featureType': 'water',
		'elementType': 'all',
		'stylers': [{
			'visibility': 'on',
		},
			{
				'color': '#acbcc9',
			},
		],
	},
];

var customLabel = {
	appt: {
		label: 'A'
	},
	school: {
		label: 'S'
	},
	home: {
		label: 'HOME'
	},
	work: {
		label: 'W'
	},
	other: {
		label: 'O'
	}
};

function getURL(url, callback) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				req.onreadystatechange = doNothing;
				callback(req, req.status);
			}
		};

		req.open('GET', url, true);
		req.send(null);
	}

function initMap() {
//	const username = document.getElementById('user').value;
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: { lat: 45.5051, lng: -122.6750 }, // Map centered at city of portland
		styles: mapStyle,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
	});

	// Defines the custom marker icons using place's category
	map.data.setStyle((feature) => {
		return {
			icon: {
				url: `img/icon_${feature.getProperty('category')}.png`,
				scaledSize: new google.maps.Size(64, 64),
			},
		};
	});
	
	map.data.loadGeoJson('places.json', {idPropertyName: 'storeid'});

	const apiKey = 'AIzaSyAYNWMjJ6GEX_Ja-l9iWLVFnzh4MCxSvE0';
	const infoWindow = new google.maps.InfoWindow();


/*	getURL('users.json', function (data) {
		var newUser = true;
		var user = json.documentElement.getElementsByTagName('users');
		Array.prototype.forEach.call(users, function(userElem) {
			if(username === userElem.gettAtrribute('username')) {
				const home = userElem.getAttribute('home');
				newUser = false;
				break;
			}
		});
		if(newUser) {
			// ADD USER AND HOME TO DATABASE
	}
	var icon = customLabel[type] || {};
	var marker = new google.maps.Marker({
		map: map,
		position: home,
		label: icon.label,
		shape: circle,
	});
});*/


	getURL('places.json', function (data) {
		var markers = json.documentElement.getElementsByTagName('marker');
		Array.prototype.forEach.call(markers, function(markerElem) {
			var id = markerElem.getAttribute('id');
			var name = markerElem.getAttribute('name');
			var address = markerElem.getAttribute('address');
			var type = markerElem.getAttribute('category');
			var latlng = new google.maps.LatLng(
				parseFloat(markerElem.getAttribute('lat')),
				parseFloat(markerElem.getAttribute('lng')));

			var infoWinContent = document.createElement('div');
			var strong = document.createElement('strong');
			strong.textContent = name
			infoWinContent.appendChild(strong);
			infoWinContent.appendChild(document.createElement('br'));

			var text = document.createElement('text');
			text.textContent = address
			infoWinContent.appendChild(text);
			var icon = customLabel[type] || {};
			var marker = new google.maps.Marker({
				map: map,
				position: latlng,
				label: icon.label
			});
			marker.addListener('click', function() {
				infoWindow.setContent(infoWinContent);
				infoWindow.open(map, marker);
				map.setCenter(marker.getPosition());
			});
		});
	});

	map.data.addListener('click', (event) => {
		const category = event.feature.getProperty('category');
		const name = event.feature.getProperty('name');
		const description = event.feature.getProperty('description');
		const date = event.feature.getProperty('date');
		const time = event.feature.getProperty('time');
		const position = event.feature.getGeometry().get();
		const content = `
			<img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
			<div style="margin-left:220px; margin-bottom:20px;">
			<h2>${name}</h2><p>${description}</p>
			<p>${date}<br/><b>Time: </b> ${time}</p>
			<p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
			</div>
			`;
		infoWindow.setContent(content);
		infoWindow.setPosition(position);
		infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
		infoWindow.open(map);
	});


	//Build and add search bar
	const card = document.createElement('div');
	const titleBar = document.createElement('div');
	const title = document.createElement('div');
	const container = document.createElement('div');
	const input = document.createElement('input');
	const options = {
		types: ['address'],
		componentRestrictions: {country: 'us'},
	};

	card.setAttribute('id', 'pac-card');
	title.setAttribute('id', 'title');
	title.textContent = 'Find the nearest place';
	titleBar.appendChild(title);
	container.setAttribute('id', 'pac-container');
	input.setAttribute('id', 'pac-input');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', 'Enter an address');
	container.appendChild(input);
	card.appendChild(titleBar);
	card.appendChild(container);
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

	const autocomplete = new google.maps.places.Autocomplete(input, options);
	autocomplete.setFields(['address_components', 'geometry', 'name']);

	// Set origin point when user selects an address
	const originMarker = new google.maps.Marker({map: map});
	originMarker.setVisible(false);
	let originLocation = map.getCenter();
	console.log(originLocation);

	autocomplete.addListener('place_changed', async () => {
		originMarker.setVisible(false);
		originLocation = map.getCenter();
		const place = autocomplete.getPlace();

		if (!place.geometry) {
			window.alert('No address available for input: \'' + place.name + '\' ');
			return;
		}

		// Recenter the map to selected address
		originLocation = place.geometry.location;
		map.setCenter(originLocation);
		map.setZoom(11);
		console.log(place);

		originMarker.setPosition(originLocation);
		originMarker.setVisible(true);

		const eventsList = await calculateDistances(map.data, originLocation);
		showEventsList(map.data, eventsList);

		return;
	});


	async function calculateDistances(data, origin) {
		const places = [];
		const destinations = [];

		// Build parallel arrays for the place IDs and destinations
		data.forEach((place) => {
			const placeNum = place.getProperty('place_id');
			const placeLoc = place.getGeometry().get();

			places.push(placeNum);
			destinations.push(placeLoc);
		});

		// Retrieve the distances of each place from the origin
		// The returned list will be in the same order as the destinations list
		const service = new google.maps.DistanceMatrixService();
		const getDistanceMatrix =
			(service, parameters) => new Promise((resolve, reject) => {
				service.getDistanceMatrix(parameters, (response, status) => {
					if (status != google.maps.DistanceMatrixStatus.OK) {
						reject(response);
					} else {
						const distances = [];
						const results = response.rows[0].elements;
						for (let j = 0; j < results.length; j++) {
							const element = results[j];
							const distanceText = element.distance.text;
							const distanceVal = element.distance.value;
							const distanceObject = {
								placeid: places[j],
								distanceText: distanceText,
								distanceVal: distanceVal,
							};
							distances.push(distanceObject);
						}

						resolve(distances);
					}
				});
			});

		const distancesList = await getDistanceMatrix(service, {
			origins: [origin],
			destinations: destinations,
			travelMode: 'DRIVING',
			unitSystem: google.maps.UnitSystem.METRIC,
		});

		distancesList.sort((first, second) => {
			return first.distanceVal - second.distanceVal;
		});

		return distancesList;
	}

	// Displays list of calendar events
	function showEventsList(data, places) {
		if (places.length == 0) {
			console.log('empty places');
			return;
		}

		let panel = document.createElement('div');
		// If the panel already exists, use it. Else, create it and add to the page.
		if (document.getElementById('panel')) {
			panel = document.getElementById('panel');
			// If panel is already open, close it
			if (panel.classList.contains('open')) {
				panel.classList.remove('open');
			}
		} else {
			panel.setAttribute('id', 'panel');
			const body = document.body;
			body.insertBefore(panel, body.childNodes[0]);
		}


		// Clear the previous details
		while (panel.lastChild) {
			panel.removeChild(panel.lastChild);
		}

		places.forEach((place) => {
			// Add place details with text formatting
			const name = document.createElement('p');
			name.classList.add('place');
			const currentPlace = data.getFeatureById(place.storeid);
			name.textContent = currentPlace.getProperty('name');
			panel.appendChild(name);
			const distanceText = document.createElement('p');
			distanceText.classList.add('distanceText');
			distanceText.textContent = place.distanceText;
			panel.appendChild(distanceText);
		});

		// Open the panel
		panel.classList.add('open');

		return;
	}

	function CenterHome(controlElement, map, center) {
		var control = this;
		control.center_ = center;
		controlElement.style.clear = 'both';

		var centerHome = document.createElement('div');
		centerHome.id = 'centerHome';
		centerHome.title = 'Home';
		controlElement.appendChild(centerHome);

		var homeText = document.createElement('div');
		homeText.id = 'homeText';
		homeText.innerHTML = 'Center Map at Home';
		centerHome.appendChild(homeText);

		var setCenter = document.createElement('div');
		setCenter.id = 'setCenter';
		setCenter.title = 'Click to change center';
		controlElement.appendChild(setCenter);

		var centerText = document.createElement('div');
		centerText.id = 'centerText';
		centerText.innerHTML = 'Set Center';
		setCenter.appendChild(centerText);

		centerHome.addEventListener('click', function() {
			map.setCenter(center);
		});

		setCenter.addEventListener('click', function() {
			var current = control.getCenter();
			map.setCenter(current);
		});
	}	
}
