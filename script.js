let map;
let markers = [];
let geocoder;

function initMap() {
  const hamilton = { lat: 43.2557, lng: -79.8711 };

  // Initialize map with Map ID
  map = new google.maps.Map(document.getElementById("map"), {
    center: hamilton,
    zoom: 12,
    mapId: "f38bd73cc468fc68390a0ee7"  // <-- Replace with your Map ID
  });

  geocoder = new google.maps.Geocoder();

  // Default markers using coordinates
  const defaultPlaces = [
    { name: "Royal Ontario Museum", lat: 43.6677, lng: -79.3948, category: "museum" },
    { name: "Webster's Falls", lat: 43.2444, lng: -79.9855, category: "waterfall" },
    { name: "The French", lat: 43.2575, lng: -79.8678, category: "restaurant" }
  ];

  defaultPlaces.forEach(place => addMarker(place));

  // Form submission for adding marker by address
  document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const category = document.getElementById("category").value;

    addMarker({ name, address, category });
    this.reset();
  });

  // Geolocation button
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        map.setZoom(14);
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "You are here!"
        });
      }, () => alert("Geolocation failed!"));
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
}

// Add marker function
function addMarker(place) {
  if (place.lat && place.lng) {
    // Use coordinates for default markers
    const marker = new google.maps.Marker({
      map: map,
      position: { lat: place.lat, lng: place.lng },
      title: place.name,
      category: place.category
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h6>${place.name}</h6><p>${place.category}</p>`
    });

    marker.addListener("click", () => infoWindow.open(map, marker));
    markers.push(marker);
  } else if (place.address) {
    // Use geocoding for user-added markers
    geocoder.geocode({ address: place.address }, (results, status) => {
      if (status === "OK") {
        const marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: place.name,
          category: place.category
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h6>${place.name}</h6><p>${place.category}</p>`
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        markers.push(marker);
      } else {
        alert(`Geocode failed for "${place.address}": ${status}`);
      }
    });
  }
}

// Filter markers by category
function filterMarkers(category) {
  markers.forEach(marker => {
    marker.setMap((category === "all" || marker.category === category) ? map : null);
  });
}
