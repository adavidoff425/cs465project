const user = document.getElementById('map-data').getAttribute('data-user');
console.log(user);
const home = document.getElementById()

const apiKey = 'AIzaSyAYNWMjJ6GEX_Ja-l9iWLVFnzh4MCxSvE0';
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
			'color': '#f0e4e3',
		}],
	},
	{
		'featureType': 'poi.park',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#c2dbc5',
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
			'color': '#c5f5f5',
		}],
	},
	{
		'featureType': 'road.arterial',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#e2dac5',
		}],
	},
	{
		'featureType': 'road.local',
		'elementType': 'geometry',
		'stylers': [{
			'color': '#fbebf2',
		}],
	},
	{
		'featureType': 'water',
		'elementType': 'all',
		'stylers': [{
			'visibility': 'on',
		},
			{
				'color': '#fcb339',
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
	//const username = document.getElementById('user').value; // or calendar.user???
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: { lat: 45.5051, lng: -122.6750 }, // Map centered at city of portland 
		styles: mapStyle,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
	});

	map.data.loadGeoJson('places.json', {idPropertyName: 'placeid'});

	// Defines the custom marker icons using place's category
	map.data.setStyle((feature) => {
		var img = `./img/icon_${feature.getProperty('category')}.png`;
		if(`${feature.getProperty('category')}` == 'home') {
		    var lat = parseFloat(`${feature.getGeometry().get().lat()}`); 
			var lng = parseFloat(`${feature.getGeometry().get().lng()}`);
			const home = '['+lat+','+lng+']';
		}
		return {	
			icon: {
        		//visible: feature.getProperty('username') === username, /// set to true if username of place matches
				url: img,
				scaledSize: new google.maps.Size(48, 48),
			}
		};
	});
	
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
})


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
	});*/

	map.data.addListener('click', (event) => {
		const category = event.feature.getProperty('category');
		const name = event.feature.getProperty('name');
		const description = event.feature.getProperty('description');
		const date = event.feature.getProperty('date');
		const time = event.feature.getProperty('time');
		const position = event.feature.getGeometry().get();
		const content = `
			<div style="margin: none;">
			<h2>${name}</h2><p>${description}</p>
			<p>${date}<br/><b>Time: </b> ${time}</p>
			<button onclick=addEvent(event.feature)>Add Calendar Event</button>
			</div>
		`;
		infoWindow.setContent(content);
		infoWindow.setPosition(position);
		infoWindow.setZIndex(9999);
		infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
		map.setCenter(position);
		infoWindow.open(map);
		map.addListener('click', () => {
			infoWindow.close(map);
		});
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
	title.textContent = 'Address Search';
	titleBar.appendChild(title);
	container.setAttribute('id', 'pac-container');
	input.setAttribute('id', 'pac-input');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', 'Enter an address');
	container.appendChild(input);
	card.appendChild(titleBar);
	card.appendChild(container);
	CenterHome(card, map, map.getCenter(), home);
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

	const autocomplete = new google.maps.places.Autocomplete(input, options);
	autocomplete.setFields(['address_components', 'geometry', 'name']);

	// Set origin point when user selects an address
	const originMarker = new google.maps.Marker({map: map});
	originMarker.setVisible(false);
	var originLocation = home;
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
}

async function calculateDistances(data, origin) {
	const places = [];
	const destinations = [];

	// Build parallel arrays for the place IDs and destinations
	data.forEach((place) => {
		const placeId = place.getProperty('place_id');
		const placeLoc = place.getGeometry().get();

		places.push(placeId);
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

// function to take address, call places api and return coordinates

// Displays list of calendar events
function showEventsList(data, places) {
	if (places.length == 0) {
		window.alert('no calendar events to display');
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
		const currentPlace = data.getFeatureById(place.placeid);
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

async function CenterHome(controlElement, map, center, home) {
	var control = this;
	control.center_ = center;
	controlElement.style.clear = 'both';

	const centerHome = document.createElement('button');
	centerHome.id = 'centerHome';
	centerHome.title = 'Home';
	controlElement.appendChild(centerHome);

	const homeText = document.createElement('div');
	homeText.id = 'homeText';
	homeText.innerHTML = 'Center Map at Home';
	centerHome.appendChild(homeText);

	const setCenter = document.createElement('button');
	setCenter.id = 'setCenter';
	setCenter.title = 'Click to change center';
	controlElement.appendChild(setCenter);

	const centerText = document.createElement('div');
	centerText.id = 'centerText';
	centerText.innerHTML = 'Set Center';
	setCenter.appendChild(centerText);

	centerHome.addEventListener('click', function() {
		map.setCenter(home);
	});

	setCenter.addEventListener('click', function() {
		var current = control.center_;
		console.log(home);
		//map.setCenter(current);
	});

	return;
}


// Function to return geojson object for marker on map, not in use yet
/*function toGeoJson(place) {
  var geojson = {geometry: {}, "features": []},
	var _feature = {type: 'Feature', properties: {}};
	var _id = place.place_id;
	var _geometry = place.getGeometry();
	var _type = _geometry.getType();
	var _latlng = _geometry.get();
	geojson.geometry = {type: _type, coordinates: _latlng};
	_feature.id = _id;
	geojson.features.push(_feature);
}

function addrSearch(query) {
  var service = new google.maps.places.PlacesService(map);  
  var search = {
    query: query,
    fields: ['formatted_address'],
  };

  service.findPlaceFromQuery(search, function(result, status) {
    if (status === google.maps.place.PlacesServiceStatus.OK) {
      return result[0].toGeoJson();  
    }
  });
}*/
