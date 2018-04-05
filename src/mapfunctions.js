// Initialise map
var map = L.map('map').fitBounds([ [52.40163, 10.16552], [52.42210, 10.20132] ]); 
searchresultlayer = L.geoJSON().addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxNativeZoom: 19,
  maxZoom: 22,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Dorferlebnispfad

var layerDorferlebnispfad;

var showDorferlebnispfad = function(show) {
  if (show) {
    if (layerDorferlebnispfad === undefined) {
      layerDorferlebnispfad = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: iconDorferlebnispfad});
        }
      });
      
//       layerDorferlebnispfad.bindTooltip(function(layer){
//         return layer.feature.properties.tags.name;
//       });
      layerDorferlebnispfad.bindPopup(function(layer){
        var content ="";
        content = content + '<b>' + layer.feature.properties.tags.name + '</b><br>';
        content = content + layer.feature.properties.tags.description + '<br>';
        content = content + '<br>';
        content = content + 'Weitere Details unter <a href="' + layer.feature.properties.tags.website + '">'+ layer.feature.properties.tags.website + '</a>';
        return content
      });
      
      //Pfad
      $.getJSON( "data/dorferlebnispfad.geojson", function(geojson ) {
          //var geojson = osmtogeojson(json_data);
          layerDorferlebnispfad.addData(geojson);
      });
      
      // Stationen
      $.getJSON( createOverpassQuery(), function(json_data ) {
          var geojson = osmtogeojson(json_data);
          layerDorferlebnispfad.addData(geojson);
        });
      
      
      
    }
    map.addLayer(layerDorferlebnispfad);
  } else {
    if (layerDorferlebnispfad !== undefined) {
      map.removeLayer(layerDorferlebnispfad);
    }
  }
}

var iconDorferlebnispfad = L.icon({
  iconUrl: 'images/dorferlebnispfad.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  shadowUrl: 'images/dorferlebnispfad_schatten.png',
  shadowSize: [32, 32],
  shadowAnchor: [8, 32],
  popupAnchor: [0, -32]
});

var createOverpassQuery = function(selectors) {
  var base_url= "https://overpass-api.de/api/interpreter?data="
  var area = "52.40163, 10.16552, 52.42210, 10.20132"
  var query ='[out:json][timeout:25];';
  
  query = query + "("
  query = query + 'relation["name"="Dorferlebnispfad Dollbergen"](' + area + ');'
  query = query + 'node(r);'
  query = query + ");"
 
  query = query + 'out;>;out skel qt;';
  return base_url+query;
}

var getMapBounds = function() {
  var bounds = map.getBounds();
  return "" + bounds.getSouthWest().lat + ', ' + bounds.getSouthWest().lng + ', ' + bounds.getNorthEast().lat + ', ' + bounds.getNorthEast().lng;
};

// Suche

var createOverpassSearchQuery = function(searchstring) {
  var base_url= "https://overpass-api.de/api/interpreter?data="
  var area = getMapBounds();
  var query ='[out:json][timeout:25];';
  
  query = query + "("
  query = query + 'node["name"~"' + searchstring + '",i](' + area + ');'
  query = query + 'way["name"~"' + searchstring + '",i](' + area + ');'
  query = query + ");"
 
  query = query + 'out;>;out skel qt;';
  return base_url+query;
}


var searchresultlayer;

var search = function(searchstring) {
  map.removeLayer(searchresultlayer);
  searchresultlayer = L.geoJSON(null);
  map.addLayer(searchresultlayer);
  
  searchresultlayer.bindPopup(function(layer){
    var content ="";
    if (layer.feature.properties.tags.hasOwnProperty("name")) {
      content = content + '<b>' + layer.feature.properties.tags.name + '</b><br>';
    }
//     content = content + layer.feature.properties.tags.description + '<br>';
//     content = content + '<br>';
//     content = content + 'Weitere Details unter <a href="' + layer.feature.properties.tags.website + '">'+ layer.feature.properties.tags.website + '</a>';
    return content
  });
  
  
  $.getJSON( createOverpassSearchQuery(searchstring), function(json_data ) {
    var geojson = osmtogeojson(json_data);
    searchresultlayer.addData(geojson);
    map.fitBounds(searchresultlayer.getBounds(), {maxZoom: 19, padding: [20,20], animate: true, duration: 2.0});
  });
}


var setSearchString = function(string) {
  var element=document.getElementById("txtSearch");
  element.value=string;
}  
