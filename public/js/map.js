mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
// Add a marker to the map. Note that lng must be set between -180 and 180
const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
 .setPopup(new mapboxgl.Popup({offset:25}) // add pop-up to the marker
 .setHTML(`<h5>${listing.title}</h5><p>Exact Location provides after booking</p>`)) // popup content
.addTo(map)