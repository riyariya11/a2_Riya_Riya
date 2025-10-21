// StAuth10244: I Riya Patel, 123456 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

let map;
let markers = [];
let userMarker = null;
let geocoder;
let directionsService;
let directionsRenderer;

function initMap() {
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 43.2557, lng: -79.8711 }, // Hamilton
    zoom: 12
  });

  directionsRenderer.setMap(map);

  // Add initial 10 markers
  const initialLocations = [
    { name: "Art Gallery of Hamilton", address: "123 King St W, Hamilton", category: "museum" },
    { name: "Albion Falls", address: "885 Mountain Brow Blvd, Hamilton", category: "waterfall" },
    // ... add 8 more locations of your choice
  ];

  initialLocations.forEach(loc => {
    addMarkerFromAddress(loc.address, loc.name, loc.category);
  });

  document.getElementById('addForm').addEventListener('submit', handleAddMarker);
  document.getElementById('locateBtn').addEventListener('click', handleGeolocation);
}

function addMarkerFromAddress(address, name, category) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK') {
      const marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location,
        title: name,
        category
      });

      const info = new google.maps.InfoWindow({
        content: `<strong>${name}</strong><br>${address}<br><button onclick="getDirections(${results[0].geometry.location.lat()},${results[0].geometry.location.lng()})">Get Directions</button>`
      });

      marker.addListener('click', () => info.open(map, marker));
      markers.push(marker);
    }
  });
}

function filterMarkers(category) {
  markers.forEach(m => {
    if (category === 'all' || m.category === category) {
      m.setMap(map);
    } else {
      m.setMap(null);
    }
  });
}

function handleAddMarker(e) {
  e.preventDefault();
  const address = document.getElementById('address').value;
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  addMarkerFromAddress(address, name, category);
  e.target.reset();
}

function handleGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      if (userMarker) userMarker.setMap(null);
      userMarker = new google.maps.Marker({
        map,
        position: userPos,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        title: "You are here"
      });
      map.setCenter(userPos);
    });
  } else {
    alert("Geolocation not supported");
  }
}

function getDirections(destLat, destLng) {
  if (!userMarker) {
    alert("Please click the location button first.");
    return;
  }
  const request = {
    origin: userMarker.getPosition(),
    destination: { lat: destLat, lng: destLng },
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
    }
  });
}
