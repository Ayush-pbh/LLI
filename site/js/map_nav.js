

// This token will be given by the server in prod!
mapbox_token = "pk.eyJ1IjoiYXl1c2hwYmgiLCJhIjoiY2xidzNmeHcxMDUzeDN4bHB3eHJjZ3czMSJ9.QqwJl13b-XbrXatNKFcJ4w";

// var map = L.map('map').setView([28.622,77.209], 13);

L.mapbox.accessToken = mapbox_token;
// mapbox://styles/mapbox/dark-v11
var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
       attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
       tileSize: 512,
       zoomOffset: -1
});
let l = localGet('sos_location', true)



var map = L.map('map')
  .addLayer(mapboxTiles)
  .setView([l[0],l[1]], 10);
let location_available = false
function getLocation() {
    if (navigator.geolocation) {
        if(!location_available){
            navigator.geolocation.getCurrentPosition(setuserlocation);
            location_available = true
        }
        else{
            navigator.geolocation.getCurrentPosition(function(position){
                map.panTo(new L.LatLng(position.coords.latitude,position.coords.longitude));
                console.log("Map Panning")
            });
        }
    } 
    else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


var userLocationIcon = L.icon({
    iconUrl: '../img/sos_symbol.png',
    iconSize:     [40,40], // size of the icon
    popupAnchor:  [0,0 ] // point from which the popup should open relative to the iconAnchor
});

function setuserlocation(position){

    let userLocation = [position.coords.latitude,position.coords.longitude]
    console.log(`User Location : [Latt,Long] = [${position.coords.latitude},${position.coords.longitude}]`)
    map.setView(userLocation,15)
    
    marker_userlocation = L.marker(userLocation, {icon: userLocationIcon}).addTo(map);
    marker_userlocation.bindPopup("You are here!");
}

function refreshMapClusterData() {
    // Animate the loading icon...
    document.getElementsByClassName('reload-mapcluster')[0].classList.add('visible')
    document.getElementsByClassName('dim-background')[0].classList.remove('off')
    setTimeout(() => {
        document.getElementsByClassName('reload-mapcluster')[0].classList.remove('visible')
        document.getElementsByClassName('dim-background')[0].classList.add('off')
    }, 1000);
}


var temp_markers = L.markerClusterGroup()

function initMap(){
    // getLocation()
}

		
// for (var i = 0; i < addressPoints.length; i++) {
//     var a = addressPoints[i];
//     let l = a.location
//     var marker = L.marker(new L.LatLng(l[0], l[1]), { title: a.title });
//     marker.bindPopup(`Case #${i+1} ${a.title}`);
//     temp_markers.addLayer(marker);
// }

// Adding the marker for sos call

// var marker = L.marker(new L.LatLng(l[0], l[1]), { title: "SOS CALL" }); 
// marker.bindPopup('!! SOS CALL !!')
// temp_markers.addLayer(marker)

let userLocation = [l[0], l[1]] 
map.setView(userLocation,12)

marker_userlocation = L.marker(userLocation, {icon: userLocationIcon}).addTo(map);
marker_userlocation.bindPopup("!! SOS CALL !!");

// map.addLayer(temp_markers)


var policeLocIcon = L.icon({
    iconUrl: '../img/police_symbol.png',
    iconSize:     [40,40], // size of the icon
    popupAnchor:  [0,0 ] // point from which the popup should open relative to the iconAnchor
});

let simulated_police_location = [30.343409550416425, 77.95322184536796]

let policeLoc = [simulated_police_location[0], simulated_police_location[1]] 
// map.setView(policeLoc,15)

marker_policeLoc = L.marker(policeLoc, {icon: policeLocIcon}).addTo(map);
marker_policeLoc.bindPopup("!! SOS CALL !!");
console.log("yay")
removePlate();