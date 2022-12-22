

// This token will be given by the server in prod!
mapbox_token = "pk.eyJ1IjoiYXl1c2hwYmgiLCJhIjoiY2xidzNmeHcxMDUzeDN4bHB3eHJjZ3czMSJ9.QqwJl13b-XbrXatNKFcJ4w";

// var map = L.map('map').setView([28.622,77.209], 13);

L.mapbox.accessToken = mapbox_token;
    
var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
       attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
       tileSize: 512,
       zoomOffset: -1
});



var map = L.map('map')
  .addLayer(mapboxTiles)
  .setView([28.614034419696885, 77.23181496247136], 10);
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
    iconUrl: '../img/user-location-icon.png',
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
    getLocation()
}

var addressPoints = [
    {
        location: [28.623493144771466, 77.40220897359319],
        title: "Dogs to case",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.629520254041598, 77.40838878293852],
        title: "Ill Cats",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.584308501221848, 77.3465906884353],
        title: "New Case in Delhi",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.58069072069355, 77.15913647162692],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.69037464946998, 77.26762645791163],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.609463918680692, 77.22126665419738],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.60876745964762, 77.2474461388197],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.535770891159412, 77.2696013302778],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.581346354034242, 77.2020056097299],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.60405694573754, 77.28498475976636],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.599371416433392, 77.30016123979864],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.71558130098897, 77.2056814825038],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.712530244069253, 77.20750935695604],
        title: "in Radio Colony",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.700066528054315, 77.20686075634394],
        title: "Delhi COllege of Photography",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.69985964887287, 77.18982024935379],
        title: "FIsh",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.712219962108644, 77.19170708749803],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.71930450410376, 77.20597630096384],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.699217335088996, 77.1683716644111],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.685611786469163, 77.1616172969242],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    {
        location: [28.709091222459357, 77.17270780156318],
        title: "",
        caseid: "sladjbhskjvsdsadfvasudfvsdfsdfd",
    },
    
    ];

		
for (var i = 0; i < addressPoints.length; i++) {
    var a = addressPoints[i];
    let l = a.location
    var marker = L.marker(new L.LatLng(l[0], l[1]), { title: a.title });
    marker.bindPopup(`Case #${i+1} ${a.title}`);
    temp_markers.addLayer(marker);
}

map.addLayer(temp_markers)

    