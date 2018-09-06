var overpass = {};

overpass.base_url = "https://overpass-api.de/api/interpreter?data=";
overpass.query_prefix = '[out:json][timeout:25];(';
overpass.query_suffix =  ');out;>;out skel qt;';  
overpass.area = "52.40021943419403, 10.158920288085938, 52.423726814004645, 10.202608108520508";

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


overpass.query_dorferlebnispfad = function(callback) {
  var query = overpass.base_url + overpass.query_prefix;
  query = query + 'relation["name"="Dorferlebnispfad Dollbergen"](' + overpass.area + ');'
  query = query + 'node(r);'
  query = query + overpass.query_suffix
  
  $.getJSON(query, function(json_data) {
    var geojson = osmtogeojson(json_data);
    callback(geojson)
  });
}


overpass.search_name = function(searchstring, callback) {
  var query = overpass.base_url + overpass.query_prefix;

  query = query + 'node["name"~"' + searchstring + '",i](' + overpass.area + ');'
  query = query + 'way["name"~"' + searchstring + '",i](' + overpass.area + ');'

  query = query + overpass.query_suffix
  
  $.getJSON(query, function(json_data) {
    var geojson = osmtogeojson(json_data);
    callback(geojson)
  });
}


overpass.search_meta = function(searchstring, callback) {
  var query = overpass.base_url + overpass.query_prefix;
  var match=false;

  if ( searchstring == "Restaurant" ) {
      query = query + 'node["amenity"="restaurant"](' + overpass.area + ');'
      query = query + 'way["amenity"="restaurant"](' + overpass.area + ');'
      match=true;
  } else if ( searchstring == "Spielplatz" ) {
      query = query + 'node["leisure"="playground"](' + overpass.area + ');'
      query = query + 'way["leisure"="playground"](' + overpass.area + ');'
      match=true;
  } else if ( searchstring == "Briefkasten" ) {
      query = query + 'node["amenity"="post_box"](' + overpass.area + ');'
      query = query + 'way["amenity"="post_box"](' + overpass.area + ');'
      match=true;
  } else if ( searchstring == "Parkplatz" ) {
      query = query + 'node["amenity"="parking"](' + overpass.area + ');'
      query = query + 'way["amenity"="parking"](' + overpass.area + ');'
      match=true;
  }

  query = query + overpass.query_suffix

  if ( match==true) {
    $.getJSON(query, function(json_data) {
      var geojson = osmtogeojson(json_data);
      callback(geojson)
    });
  }
}


overpass.parse_opening_hours =  function(osmdata) {
  return osmdata
}
