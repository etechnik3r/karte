var layerDorferlebnispfad;

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
      overpass.query_dorferlebnispfad(function(geojson) {
          layerDorferlebnispfad.addData(geojson);
      });
      
    }
    map.addLayer(layerDorferlebnispfad);
  } else if (layerDorferlebnispfad !== undefined) {
      map.removeLayer(layerDorferlebnispfad);
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
