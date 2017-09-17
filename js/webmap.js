// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

// add these tiles to our map
map.addLayer(Stamen_Toner);

var zoningchgGeoJSON;

var neighborhoodsGeoJSON;



// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

   // console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use % foreign born to color the neighborhood map
    var forbornStyle = function (feature){
        var value = feature.properties.ForBornPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#f1eef6";
        }
        if(value >0.1 && value <=0.2){
            fillColor = "#d0d1e6";
        }
        if(value >0.2 && value<=0.3){
            fillColor = "#a6bddb";
        }
        if(value > 0.3 && value <=0.5){
            fillColor = "#74a9cf";
        }
        if(value > 0.5 && value <=0.75) { 
            fillColor = "#2b8cbe";
        }
        if(value > 0.75) { 
            fillColor = "#045a8d";
        }
 

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.9,
            fillColor: fillColor
        };

        return style;
    }

    var forbornClick = function (feature, layer) {
        var forborn = feature.properties.ForBornPer * 100;
        forborn = forborn.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent Foreign Born: </strong>" + forborn + "%");
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: forbornStyle,
        onEachFeature: forbornClick
    }).addTo(map);

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the zoning changes
$.getJSON( "geojson/zoningamendments.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var zoningchg = data;
//console.log(zoningchg)

    // style for zoning changes
    var zoningStyle = {
        "color": "#ff6419",
       "weight": 0,
       "fillOpacity": 0.7

    };

    // function that binds popup data to subway lines
    var zoningClick = function (feature, layer) {
        console.log('feature: ', feature);
        console.log('layer: ', layer);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Zoning Change</strong>: " + feature.properties.PROJECT_NAME);
    }

    // using L.geojson add zoning changes to map
    zoningchgGeoJSON = L.geoJson(zoningchg, {
        style: zoningStyle,
        onEachFeature: zoningClick
    }).addTo(map);





    // create layer controls
    createLayerControls(); 

});

function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "Stamen": Stamen_Toner,
    };

    var overlayMaps = {
        "Foreign Born": neighborhoodsGeoJSON,
        "Zoning Changes": zoningchgGeoJSON
    };

    // add control 
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}


});


