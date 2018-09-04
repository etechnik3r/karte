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


// Dorferlebnispfad

var layerDorferlebnispfad;
var layerFlohmarkt;

var showDorferlebnispfad = function(show) {
  if (show) {
    if (layerDorferlebnispfad === undefined) {
      layerDorferlebnispfad = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: iconDorferlebnispfad});
        }
      });
      
      layerDorferlebnispfad.bindTooltip(function(layer){
        var content;
        if (ObjectCompare(layer, "feature.properties.tags.tourism", "information")) {
          content = layer.feature.properties.tags.name;
        }
        return content;
      });
      
      layerDorferlebnispfad.bindPopup(function(layer){
        var content;
        if (ObjectCompare(layer, "feature.properties.tags.tourism", "information")) {
          content = '<b>' + layer.feature.properties.tags.name + '</b><br>';
          content = content + layer.feature.properties.tags.description + '<br>';
          content = content + '<br>';
          content = content + 'Weitere Details unter <a href="' + layer.feature.properties.tags.website + '">'+ layer.feature.properties.tags.website + '</a>';
        }
        return content
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


var showFlohmarkt = function(show) {
  if (show) {
    if (layerFlohmarkt === undefined) {
      layerFlohmarkt = L.geoJSON(null, {
        style: {
          "color": "#ff0000",
          "weight": 5,
          "opacity": 0.65
        },
        pointToLayer: function (feature, latlng) {
          var icon=iconDefault;
          return L.marker(latlng, {icon: icon});
        }
      });
      
      layerFlohmarkt.bindPopup(function(layer){
        var content ="";
        content = content + '<b>' + layer.feature.properties.name + '</b>';
//        if (layer.feature.properties.tags.description){
//          content = content + '<br>';
//          content = content + layer.feature.properties.tags.description + '<br>';
//        }

        return content
      });
      
      //Pfad
      $.getJSON( "data/flohmarkt.geojson", function(geojson ) {
          //var geojson = osmtogeojson(json_data);
          layerFlohmarkt.addData(geojson);
      });
      
    }
    map.addLayer(layerFlohmarkt);
  } else {
    if (layerFlohmarkt !== undefined) {
      map.removeLayer(layerFlohmarkt);
    }
  }
}

var iconDefault = L.icon({
  iconUrl: 'images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -32]
});
var iconFlohmarkt = L.icon({
  iconUrl: 'images/marker-flohmarkt.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -32]
});
var iconParking = L.icon({
  iconUrl: 'images/marker-parking.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [0, -32]
});
var iconCafe = L.icon({
  iconUrl: 'images/marker-cafe.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
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
  //return "" + bounds.getSouthWest().lat + ', ' + bounds.getSouthWest().lng + ', ' + bounds.getNorthEast().lat + ', ' + bounds.getNorthEast().lng;
  return "52.40021943419403, 10.158920288085938, 52.423726814004645, 10.202608108520508"
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


var createOverpassMetaSearch = function(searchstring) {
  var base_url= "https://overpass-api.de/api/interpreter?data="
  var area = getMapBounds();
  var query ='[out:json][timeout:25];';
  
  query = query + "("
  if ( searchstring == "Restaurant" ) {
      query = query + 'node["amenity"="restaurant"](' + area + ');'
      query = query + 'way["amenity"="restaurant"](' + area + ');'
  } else if  ( searchstring == "Spielplatz" ) {
      query = query + 'node["leisure"="playground"](' + area + ');'
      query = query + 'way["leisure"="playground"](' + area + ');'
  } else if  ( searchstring == "Briefkasten" ) {
      query = query + 'node["amenity"="post_box"](' + area + ');'
      query = query + 'way["amenity"="post_box"](' + area + ');'
  }
  query = query + ");"
 
  query = query + 'out;>;out skel qt;';
  return base_url+query;
}


var metasearch = function(searchstring) {
  
  $.getJSON( createOverpassSearchQuery(searchstring), function(json_data ) {
    var geojson = osmtogeojson(json_data);
    searchresultlayer.addData(geojson);
    map.fitBounds(searchresultlayer.getBounds(), {maxZoom: 19, padding: [20,20], animate: true, duration: 2.0});
  });
  var query;

  
    $.getJSON( createOverpassMetaSearch(searchstring), function(json_data ) {
      var geojson = osmtogeojson(json_data);
      searchresultlayer.addData(geojson);
      map.fitBounds(searchresultlayer.getBounds(), {maxZoom: 19, padding: [20,20], animate: true, duration: 2.0});
    });
    
  
  

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
  
  
  metasearch(searchstring);
}


var setSearchString = function(string) {
  var element=document.getElementById("txtSearch");
  element.value=string;
   document.getElementById('btnSearch').click();
}

document.getElementById('flohmarkt').checked=true;
showFlohmarkt(true);
  
