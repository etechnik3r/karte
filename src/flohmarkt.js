var layerFlohmarkt;

var showFlohmarkt = function(show) {
  if (show) {
    if (layerFlohmarkt === undefined) {
      layerFlohmarkt = L.geoJSON(null, {
        style: {
          "color": "#ff0000",
          "weight": 5,
          "opacity": 0.65
        },
      });
      
      layerFlohmarkt.bindPopup(function(layer){
        return '<b>' + layer.feature.properties.name + '</b>';
      });
      
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

document.getElementById('flohmarkt').checked=true;
showFlohmarkt(true);
  
