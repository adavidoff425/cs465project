let user = document.getElementById('map-data').getAttribute('data-user');
console.log(user);
if(user == null) user = 'adavidoff425';
let home = document.getElementById('map-data').getAttribute('data-home');
console.log(home);
var homeLoc;
const categories = ["cafe", "doctor", "food", "home", "school", "work"];

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
		zoom: 14,
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
			homeLoc = new google.maps.LatLng({ lat: lat, lng: lng });
		}
		return {	
			icon: {
				url: img,
				scaledSize: new google.maps.Size(48, 48),
			},
			visible: `${feature.getProperty('username')}` == user,
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
		var start = event.feature.getProperty('start_time');
		var end = event.feature.getProperty('end_time');
		var ampm_start = '';
		var ampm_end = '';
		if(start > 12) {
			start %= 12;
			ampm_start = 'pm';
		} else {
			ampm_start = 'am';
		}
		if(end > 12) {
			end %= 12;
			ampm_start = 'pm';
		} else {
			ampm_start = 'am';
		}
		const position = event.feature.getGeometry().get();
		const homeWin = `
			<div style="margin: none;">
			<h2>${name}</h2><p>${description}</p>
			</div>
		`;
		const content = `
			<div style="margin: none;">
			<h2>${name}</h2><p>${description}</p>
			<p>${date}<br/><b>Time: </b> ${start}${ampm_start}-${end}${ampm_end}</p>
			</div>
		`;

		if(category === 'home')
			infoWindow.setContent(homeWin);
		else
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
	CenterHome(card, map, map.getCenter(), homeLoc);
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
		originLocation = place.geometry;
		var latitude = originLocation.location.lat();
		var longitude = originLocation.location.lng();
		var latlng = new google.maps.LatLng({ lat: latitude, lng: longitude});
		map.setCenter(latlng);
		map.setZoom(15);

		originMarker.setPosition(latlng);
		originMarker.setVisible(true);

		originMarker.addListener('click', (event) => {
				console.log(place);
				
				const content = `
					<div>
					<h2>${place.name}</h2>
					<p>Add a Calendar Event</p>
					</div>
					<div id=addEvent-form>
									<form action='/addevent' method='post'>
										<input type='text' placeholder='Event Category' name=category>
										<input type='text' placeholder='Event Name' name=event_name>
										<input type='text' placeholder='Description' name=description>
										<input type='text' placeholder='Date' name=date>
										<input type='text' placeholder='Event Start' name=startTime>
										<input type='text' placeholder='Event End' name=endTime>
										<input type='text' name=lat value=${place.geometry.location.lat()}>
										<input type='text' name=lng value=${place.geometry.location.lng()}>
										<input type='text' name=req_username value=${user}>
										<p><button type='submit' name='enter'>Enter</button></p>
									</div>
				`;
		
				infoWindow.setContent(content);
				infoWindow.setPosition(originMarker.position);
				infoWindow.setZIndex(9999);
				infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
				map.setCenter(originMarker.position);
				infoWindow.open(map);
				map.addListener('click', () => {
					infoWindow.close(map);
				});
			});

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
		console.log(place);
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

	centerHome.addEventListener('click', function() {
		map.setCenter(homeLoc);
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
}*/

function addrSearch(query) {
  var service = new google.maps.places.PlacesService(map);  
  var search = {
    query: query,
    fields: ['formatted_address'],
  };

  service.findPlaceFromQuery(search, function(result, status) {
    if (status === google.maps.place.PlacesServiceStatus.OK) {
	  console.log(result[0]);
      return result[0];  
    }
  });
}
