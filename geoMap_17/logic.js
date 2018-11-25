// // Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var longitude = []
var latitude = []
var mag = []  

function getColor(d) {
  return   d > 5  ? '#E31A1C' :
  d > 4  ? '#FC4E2A' :
  d > 3   ? '#FD8D3C' :
  d > 2   ? '#FEB24C' :
  d > 1   ? '#FED976' :
    '#FFEDA0';
}


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log('d3json data:', data)
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
 // console.log('earthquakeData' , earthquakeData)

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    //console.log('onEach', feature )

    layer.bindPopup("<h3>" + feature.properties.place +
     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

     console.log('mag',feature.properties.mag );

// Create a circle and pass in some initial options





radius =  (feature.properties.mag * 10000)
var eqMarker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
  color: getColor(feature.properties.mag),
  fillColor: getColor(feature.properties.mag),
  fillOpacity: 0.5,
  radius: radius
});

eqMarkers.push(eqMarker);

  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array

  var eqMarkers = [];
  var radius = 0;
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature



    
  });

//   // Sending our earthquakes layer to the createMap function
 //  console.log('latitude', latitude)
 console.log('eqMarkers', eqMarkers);
 var eqCircleLayer = L.layerGroup(eqMarkers)
   createMap(earthquakes, eqCircleLayer);
 }



function createMap(earthquakes, eqCircleLayer) {
  console.log('in map', longitude)

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
   var overlayMaps = {
    // Earthquakes: earthquakes
       Earthquakes: eqCircleLayer
   };
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  //  layers: [streetmap, earthquakes]
  layers: [streetmap, eqCircleLayer]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }  
      return div;
  };
  legend.addTo(myMap);
  

}

