/**StAuth10244: I Riya Riya, 000922180 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else. */
let map;
let markers = [];
let geocoder;

function initMap() {
  const hamilton = { lat: 43.2557, lng: -79.8711 };

  // Initialize map with Map ID
  map = new google.maps.Map(document.getElementById("map"), {
    center: hamilton,
    zoom: 12,
    mapId: "f38bd73cc468fc68390a0ee7"  
  });

  geocoder = new google.maps.Geocoder();

  // Default markers using coordinates
  const defaultPlaces = [
// Museums
    { name: "Dundurn Castle", lat: 43.2488, lng: -79.8821, category: "museum" },
    { name: "Canadian Warplane Heritage Museum", lat: 43.2066, lng: -79.8794, category: "museum" },
    { name: "Hamilton Museum of Steam & Technology", lat: 43.2480, lng: -79.8700, category: "museum" },
    { name: "Whitehern Historic House", lat: 43.2559, lng: -79.8690, category: "museum" },
    { name: "Canadian Football Hall of Fame", lat: 43.2670, lng: -79.8670, category: "museum" },

    // Waterfalls
    { name: "Albion Falls", lat: 43.2481, lng: -79.8495, category: "waterfall" },
    { name: "Webster's Falls", lat: 43.2444, lng: -79.9855, category: "waterfall" },
    { name: "Tew's Falls", lat: 43.2385, lng: -79.9813, category: "waterfall" },
    { name: "Crooks Hollow Falls", lat: 43.2745, lng: -79.8905, category: "waterfall" },
    { name: "Buttermilk Falls", lat: 43.2370, lng: -79.9620, category: "waterfall" },

    // Restaurants
    { name: "Royal Hamilton Yacht Club", lat: 43.2668, lng: -79.8495, category: "restaurant" },
    { name: "The French", lat: 43.2575, lng: -79.8678, category: "restaurant" },
    { name: "Mulberry Street Coffeehouse", lat: 43.2601, lng: -79.8660, category: "restaurant" },
    { name: "Earth to Table", lat: 43.2650, lng: -79.8690, category: "restaurant" },
    { name: "Rapscallion Rogue Eatery", lat: 43.2585, lng: -79.8675, category: "restaurant" },

    // Attractions / Other
    { name: "Centre Mall", lat: 43.2655, lng: -79.8725, category: "attraction" },
    { name: "Art Gallery of Hamilton", lat: 43.2627, lng: -79.8691, category: "museum" },
    { name: "Hamilton City Hall", lat: 43.2605, lng: -79.8662, category: "attraction" },
    { name: "FirstOntario Centre", lat: 43.2635, lng: -79.8685, category: "attraction" },
    { name: "Hamilton Farmers Market", lat: 43.2638, lng: -79.8690, category: "attraction" },
    { name: "Jackson Square", lat: 43.2623, lng: -79.8683, category: "attraction" },
    { name: "Canadian War Memorial", lat: 43.2620, lng: -79.8695, category: "attraction" }
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
