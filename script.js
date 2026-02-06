// ETO YUNG LATITUDE AND LONGITUDE
const realLocation = {
  lat: 40.463667,   //Spain
  lng: -3.74922
};

let userGuess = null;
let guessMarker = null;

// Initialize map
const map = L.map('map', {
  minZoom: 2
}).setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  noWrap: true
}).addTo(map);

const bounds = [
  [-90, -180],
  [90, 180]
];

map.setMaxBounds(bounds);

map.on('drag', function () {
  map.panInsideBounds(bounds, { animate: false });
});



// Handle map click
map.on('click', function(e) {
  if (guessMarker) map.removeLayer(guessMarker);
  guessMarker = L.marker(e.latlng).addTo(map);
  userGuess = e.latlng;
});

// Distance calculation (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

document.getElementById("submitBtn").onclick = function () {
  if (!userGuess) {
    alert("Tap the map to make a guess!");
    return;
  }

  const distance = getDistance(
    userGuess.lat,
    userGuess.lng,
    realLocation.lat,
    realLocation.lng
  ).toFixed(2);

  const realMarker = L.marker([realLocation.lat, realLocation.lng])
    .addTo(map)
    .bindPopup("Correct location")
    .openPopup();

  L.polyline(
    [userGuess, [realLocation.lat, realLocation.lng]],
    { dashArray: '5,5' }
  ).addTo(map);

  document.getElementById("result").innerHTML =
    `You were <b>${distance} km</b> away!`;

  // Lock game
  map.off('click');
  document.getElementById("submitBtn").disabled = true;
};
