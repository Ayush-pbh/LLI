// import { verifyLogin, localGet, localSet, setupSidenav, fetch_user_details } from "./universal-script";
// Variables
// server_host = "http://localhost:3000/"
// api_server = "https://lli.onrender.com/"





var map;
function setupMinimap() {
    console.log("Setting up MiniMap")

    mapbox_token = "pk.eyJ1IjoiYXl1c2hwYmgiLCJhIjoiY2xidzNmeHcxMDUzeDN4bHB3eHJjZ3czMSJ9.QqwJl13b-XbrXatNKFcJ4w";

    var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + mapbox_token, {
        attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 512,
        zoomOffset: -1
    });
    map = L.map('minimap')
        .addLayer(mapboxTiles)
        .setView([28.614034419696885, 77.23181496247136], 7);

}

function setupProfilePic(){
    console.log("Setup Profile Pic");
    let userInfo = localGet('currentLoginUser', true)
    if(userInfo.profilepicurl=='000'){
        if(confirm(`Hi ${userInfo.fname}, You don't have a profile picture setup. Do you want to setup now?`)) {
            goToPageWithAnimation('./changeProfilePic.html')
        } else {
            // Do nothing!
        }
    }
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

function drawMiniMapCluster() {
    var temp_markers = L.markerClusterGroup()

    for (var i = 0; i < addressPoints.length; i++) {
        var a = addressPoints[i];
        let l = a.location
        var marker = L.marker(new L.LatLng(l[0], l[1]), { title: a.title });
        marker.bindPopup(`Case #${i + 1} ${a.title}`);
        temp_markers.addLayer(marker);
    }
    map.addLayer(temp_markers)
}
function removePlate() {
    gsap.to('.plate', { left: '100%', duration: .3 })
}
let notificationPaneVsible = false

function toggleNavigationPane() {
    if (notificationPaneVsible) {
        notificationPaneVsible = false
        document.getElementsByClassName('top-right-navbar-icon')[0].innerHTML = '<i class="material-icons">notifications</i>'
    }
    else {
        notificationPaneVsible = true
        document.getElementsByClassName('top-right-navbar-icon')[0].innerHTML = '<i class="material-icons">clear</i>'
    }
    document.getElementsByClassName('notification-pane')[0].classList.toggle('visible')
    console.log("JJ")
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
});

chatSectionVisible = false
function toggleChatSection() {
    // Just toggle Chat section visibility
    document.getElementsByClassName('chatSection')[0].classList.toggle('visible');
    if (chatSectionVisible) {
        document.getElementsByClassName('top-right-navbar-icon')[0].innerHTML = `<i class="material-icons">chat</i>`
        chatSectionVisible = false
    }
    else {
        document.getElementsByClassName('top-right-navbar-icon')[0].innerHTML = `<i class="material-icons">clear</i>`
        chatSectionVisible = true
    }
}
// Check for pre fetched data 

window.onload = function () {

    console.log("ON LOAD PER")
    // Look for cached data in the localstorage
    let currentLoginUser = localGet('currentLoginUser')
    if(currentLoginUser!='null'){
        console.log("Refreing to Cache")
        setupSidenav();
        setupProfilePic();

    }
    else{
        console.log("No Cache FOund!")
        fetch_user_details()
        setTimeout(() => {
            setupSidenav()
            setupProfilePic();
        }, 1500);
    }

    setupMinimap()
    drawMiniMapCluster()
    // Socket
    initSocket()
}
