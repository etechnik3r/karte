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
        pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff0000",
            fillOpacity: 0.7
          };

          var marker=L.circleMarker(latlng, geojsonMarkerOptions);
          
          if (feature.properties.hasOwnProperty("type")) {
            if (feature.properties.type=="POI") {
              marker=L.marker(latlng);
              marker.bindPopup(function(layer){
                return '<b>' + layer.feature.properties.name + '</b>';
              });
            }
          }
          
          return marker;
        }
      });
      
//       layerFlohmarkt.bindPopup(function(layer){
//         return '<b>' + layer.feature.properties.name + '</b>';
//       });
      
      if (typeof flohmarkt_data == "undefined") {
        flohmarkt_data="flohmarkt.geojson";
      }
      
      $.getJSON( "data/" + flohmarkt_data, function(geojson ) {
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


  
