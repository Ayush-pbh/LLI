
current_position = [77.96672676049816, 30.416703571740868];



// document.addEventListener('DOMContentLoaded', function () {
//     setup();
//     setTimeout(() => {
//         drawToiletList();
//     }, 1500);
//     var elems = document.querySelectorAll('.sidenav');
//     var instances = M.Sidenav.init(elems, { edge: 'left', draggable: true, preventScrolling: true });
// });
function sendMessagetoPolice() {
  var text = prompt("Enter Your Message!")
  
}



// MAPS
mapboxgl.accessToken = 'pk.eyJ1IjoiYXl1c2hwYmgiLCJhIjoiY2xlYXJ1eGJnMTI3MDNvbWUyY3lhdWJkOSJ9.MLBfllkNNA2UwCFOGtcQtA';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v11',
center: [77.96881147368174, 30.335116872671804],
zoom: 11
});

ToiletMarkers = Array();

function addMapMarkers(){
    // Point A --- police
    ToiletMarkers.push(new mapboxgl.Marker({color:"#111"}).setLngLat([77.9532119396738,30.343376113278268]).addTo(map));
    // Point B --> Us
    ToiletMarkers.push(new mapboxgl.Marker({color:"#111"}).setLngLat(current_position).addTo(map));
}



currLocationMarker = undefined;

async function openMapAndNavigateTo(d){
    // if(!map_visible) toggleMapVisiblity();
    // addCurrentLocationMarker();
    console.log(d);
    profile = 'cycling'
    start = '77.96672676049816,30.416703571740868'
    end = `${d[0]},${d[1]}`
    url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start};${end}?geometries=geojson&access_token=pk.eyJ1IjoiYXl1c2hwYmgiLCJhIjoiY2xlYXJ1eGJnMTI3MDNvbWUyY3lhdWJkOSJ9.MLBfllkNNA2UwCFOGtcQtA`;
    const query = await fetch(
        url,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      // add turn instructions here at the end
      // end_journey = new mapboxgl.Marker().setLngLat()
    }
    
    function drawRouteOnMap(){
      // make an initial directions request that
      // starts and ends at the same location
    
      // Add starting point to the map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: current_position
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 5,
          'circle-color': '#3887be'
        }
      });
      // this is where the code from the next step will go
    }

r = 1
a = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNjJlZDE2OGI0ZWU1ODkzZDZjZWFlNTIwIiwiaWF0IjoxNjU5NzU0ODczfQ.EimbMlMVXdtMpwmq7Jy4aCFNVqYKBuuhEb6fhPrHxe4'
jwt_token = a

window.onload = function(){
    removePlate();
    addMapMarkers()
    openMapAndNavigateTo([77.9532119396738,30.343376113278268])
}
