var layerFlohmarkt;

var showFlohmarkt = function(show) {
  if (show) {
    if (layerFlohmarkt === undefined) {
      
      var icon_flohmarkt_cafe = L.icon({
        iconUrl: 'images/marker-cafe.png',
        iconSize: [25, 40],
        iconAnchor: [13, 40],
        popupAnchor: [0, -42],
        shadowUrl: 'images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 41]
      });
      
      var icon_flohmarkt_parking = L.icon({
        iconUrl: 'images/marker-parking.png',
        iconSize: [25, 40],
        iconAnchor: [13, 40],
        popupAnchor: [0, -42],
        shadowUrl: 'images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 41]
      });
      
      var icon_roadclosed = L.icon({
        iconUrl: 'images/marker_einfahrtverboten.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      });

      var icon_noparking = L.icon({
        iconUrl: 'images/marker_halteverbot.png',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
      });

      layerFlohmarkt = L.geoJSON(null, {
        style: function (feature) {
          var style = {};
          if (feature.properties.type && feature.properties.type=="parking") {
            style.color = "#8888ff";
            style.weight= 3
            style.opacity= 0.65
            style.fillColor ="#aaaaff"
            style.fillOpacity =0.65
          }
          else {
            style.color= "#ff0000"
            style.weight= 8
            style.opacity= 0.65
          }
          return style;
        },
        
        pointToLayer: function (feature, latlng) {

          var marker;
          
          if (feature.properties.type && feature.properties.type=="essen") {
            marker=L.marker(latlng, {icon: icon_flohmarkt_cafe});
          }
          else if (feature.properties.type && feature.properties.type=="parking") {
            marker=L.marker(latlng, {icon: icon_flohmarkt_parking});
          }
          else if (feature.properties.type && feature.properties.type=="noparking") {
            marker=L.marker(latlng, {icon: icon_noparking});
          }
          else if (feature.properties.type && feature.properties.type=="roadclosed") {
            marker=L.marker(latlng, {icon: icon_roadclosed});
          }
          else {
            var geojsonMarkerOptions = {
              radius: 8,
              fillColor: "#ff0000",
              fillOpacity: 0.7
            };
            var marker=L.circleMarker(latlng, geojsonMarkerOptions);
          }

          if (feature.properties.description) {
            marker.bindPopup(feature.properties.description);
          }
          
          return marker;

        }
      });
      
//       layerFlohmarkt.bindPopup(function(layer){
//         return '<b>' + layer.feature.properties.name + '</b>';
//       });
      
      $.getJSON( "data/flohmarkt_infos.geojson", function(geojson ) {
          //var geojson = osmtogeojson(json_data);
          layerFlohmarkt.addData(geojson);
      });

      if (typeof flohmarkt_data == "undefined") {
        flohmarkt_data="flohmarkt_streets.geojson";
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


  
