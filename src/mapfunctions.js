// Initialise map
var map = L.map('map').fitBounds([ [52.40163, 10.16552], [52.42210, 10.20132] ]); 
searchresultlayer = L.geoJSON().addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxNativeZoom: 19,
  maxZoom: 22,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var ObjectCompare = function(object, path, data) {
  var pathparts=path.split(".");
  var current=object
  for (var i=0; i< pathparts.length; i++) {
    if (! current.hasOwnProperty(pathparts[i])) {
      return false;
    }
    current=current[pathparts[i]];
  }
  
  if (data !== undefined) {
    if (current!=data) {
      return false;
    }
  }
  
  return true;
}


var getMapBounds = function() {
  var bounds = map.getBounds();
  //return "" + bounds.getSouthWest().lat + ', ' + bounds.getSouthWest().lng + ', ' + bounds.getNorthEast().lat + ', ' + bounds.getNorthEast().lng;
  return "52.40021943419403, 10.158920288085938, 52.423726814004645, 10.202608108520508"
};



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
  
  overpass.search_name(searchstring, function(geojson) {
    searchresultlayer.addData(geojson);
    map.fitBounds(searchresultlayer.getBounds(), {maxZoom: 19, padding: [20,20], animate: true, duration: 2.0});
  });
  
    overpass.search_meta(searchstring, function(geojson) {
      searchresultlayer.addData(geojson);
      map.fitBounds(searchresultlayer.getBounds(), {maxZoom: 19, padding: [20,20], animate: true, duration: 2.0});
    });

}


var setSearchString = function(string) {
  var element=document.getElementById("txtSearch");
  element.value=string;
   document.getElementById('btnSearch').click();
}

