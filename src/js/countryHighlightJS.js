const shortenUrl = () => {
    let url = 'https://urlshortenapi.herokuapp.com/link/ThOFabU';

    // let originUrl = document.getElementById('origin-url').value;

    // console.log(originUrl);

    // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDk4NDgxMWQ5MjNlMDAwNGE3YjMxNiIsImlhdCI6MTYzMjIwODQ0M30.QKGyPCK3sh1ZIM46-CPmTAAcLJfYYbRPsxK78idv1Wc';
    
    //authorization header > dynamic build > add to headers object

    // let headers = {
    //     "Content-Type": "application/json"
    // }

    fetch(url, {
        method: 'GET',


    })
    .then(response => response.json())

    .then(json => {
        myJSON = json.data.country_code;
        
        // Themes begin
   am4core.useTheme(am4themes_animated);
   // Themes end
   var continents = {
       "AF": 0,
       "AN": 1,
       "AS": 2,
       "EU": 3,
       "NA": 4,
       "OC": 5,
       "SA": 6
   }
   // Create map instance
   var chart = am4core.create("chartdiv", am4maps.MapChart);
   chart.projection = new am4maps.projections.Miller();
   // Create map polygon series for world map
   var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
   worldSeries.useGeodata = true;
   worldSeries.geodata = am4geodata_worldLow;
   worldSeries.exclude = ["AQ"];
   var worldPolygon = worldSeries.mapPolygons.template;
   worldPolygon.tooltipText = "{name}";
   worldPolygon.nonScalingStroke = true;
   worldPolygon.strokeOpacity = 0.5;
   worldPolygon.fill = am4core.color("#eee");
   worldPolygon.propertyFields.fill = "color";
   // Create country specific series (but hide it for now)
   var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
   countrySeries.useGeodata = true;
   countrySeries.hide();
   countrySeries.geodataSource.events.on("done", function (ev) {
       worldSeries.hide();
       countrySeries.show();
   });
   var countryPolygon = countrySeries.mapPolygons.template;
   countryPolygon.tooltipText = "{name}";
   countryPolygon.nonScalingStroke = true;
   countryPolygon.strokeOpacity = 0.5;
   countryPolygon.fill = am4core.color("#eee");
   var hs = countryPolygon.states.create("hover");
   hs.properties.fill = chart.colors.getIndex(9);
   // Set up click events
   worldPolygon.events.on("hit", function (ev) {
       ev.target.series.chart.zoomToMapObject(ev.target);
       var map = ev.target.dataItem.dataContext.map;
       var mapID = ev.target.dataItem.dataContext.id;
       if (map) {
           ev.target.isHover = false;
           countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
           countrySeries.geodataSource.load();
       }
   });
   // Set up data for countries
   var data = [];
   for (var id in am4geodata_data_countries2) {
       if (am4geodata_data_countries2.hasOwnProperty(id)) {
           var country = am4geodata_data_countries2[id];
           for (let i = 0; i < myJSON.length; i++) {     //var i in myJSON
               if (id === myJSON[i]) { //.Country_Coded 
                   data.push({
                       id: id,
                       color: chart.colors.getIndex(continents[country.continent_code]),
                       map: country.maps[0]
                   });
               }
           }
       }
   }
   console.log(data);
   worldSeries.data = data;
   // Zoom control
   chart.zoomControl = new am4maps.ZoomControl();
   var homeButton = new am4core.Button();
   homeButton.events.on("hit", function () {
       worldSeries.show();
       countrySeries.hide();
       chart.goHome();
   });
   homeButton.icon = new am4core.Sprite();
   homeButton.padding(7, 5, 7, 5);
   homeButton.width = 30;
   homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
   homeButton.marginBottom = 10;
   homeButton.parent = chart.zoomControl;
   homeButton.insertBefore(chart.zoomControl.plusButton);


      // Create chart instance
  var chart = am4core.create("piechartdiv", am4charts.PieChart);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
  });



  
        
    // Add data
    chart.data = [{
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czech Republic",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }, {
      "country": "Germany",
      "litres": 165.8
    }, {
      "country": "Australia",
      "litres": 139.9
    }, {
      "country": "Austria",
      "litres": 128.3
    }, {
      "country": "UK",
      "litres": 99
    }, {
      "country": "Belgium",
      "litres": 60
    }, {
      "country": "The Netherlands",
      "litres": 50
    }];
    

}
let myJSON;
shortenUrl();

// am4core.ready(function () {
    
//     // var myJSON = [
//     //     {
//     //         "IP_Number": "16909059",
//     //         "IP_Version": 4,
//     //         "IP_Address": "1.2.3.3",
//     //         "Country_Code": "AU",
//     //         "Country_Name": "Australia",
//     //         "Region_Name": "Queensland",
//     //         "City_Name": "Brisbane"
//     //     },
//     //     {
//     //         "IP_Number": "33907478",
//     //         "IP_Version": 4,
//     //         "IP_Address": "2.5.99.22",
//     //         "Country_Code": "FR",
//     //         "Country_Name": "France",
//     //         "Region_Name": "Hauts-de-France",
//     //         "City_Name": "Lille"
//     //     },
//     //     {
//     //         "IP_Number": "553784885",
//     //         "IP_Version": 4,
//     //         "IP_Address": "33.2.22.53",
//     //         "Country_Code": "VN",
//     //         "Country_Name": "United States of America",
//     //         "Region_Name": "Ohio",
//     //         "City_Name": "Columbus"
//     //     },
//     //     {
//     //         "IP_Number": "721947651",
//     //         "IP_Version": 4,
//     //         "IP_Address": "43.8.12.3",
//     //         "Country_Code": "JP",
//     //         "Country_Name": "Japan",
//     //         "Region_Name": "Tokyo",
//     //         "City_Name": "Tokyo"
//     //     },
//     //     {
//     //         "IP_Number": "891958082",
//     //         "IP_Version": 4,
//     //         "IP_Address": "53.42.51.66",
//     //         "Country_Code": "DE",
//     //         "Country_Name": "Germany",
//     //         "Region_Name": "Baden-Wurttemberg",
//     //         "City_Name": "Stuttgart"
//     //     }];
//    // Themes begin
//    am4core.useTheme(am4themes_animated);
//    // Themes end
//    var continents = {
//        "AF": 0,
//        "AN": 1,
//        "AS": 2,
//        "EU": 3,
//        "NA": 4,
//        "OC": 5,
//        "SA": 6
//    }
//    // Create map instance
//    var chart = am4core.create("chartdiv", am4maps.MapChart);
//    chart.projection = new am4maps.projections.Miller();
//    // Create map polygon series for world map
//    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
//    worldSeries.useGeodata = true;
//    worldSeries.geodata = am4geodata_worldLow;
//    worldSeries.exclude = ["AQ"];
//    var worldPolygon = worldSeries.mapPolygons.template;
//    worldPolygon.tooltipText = "{name}";
//    worldPolygon.nonScalingStroke = true;
//    worldPolygon.strokeOpacity = 0.5;
//    worldPolygon.fill = am4core.color("#eee");
//    worldPolygon.propertyFields.fill = "color";
//    // Create country specific series (but hide it for now)
//    var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
//    countrySeries.useGeodata = true;
//    countrySeries.hide();
//    countrySeries.geodataSource.events.on("done", function (ev) {
//        worldSeries.hide();
//        countrySeries.show();
//    });
//    var countryPolygon = countrySeries.mapPolygons.template;
//    countryPolygon.tooltipText = "{name}";
//    countryPolygon.nonScalingStroke = true;
//    countryPolygon.strokeOpacity = 0.5;
//    countryPolygon.fill = am4core.color("#eee");
//    var hs = countryPolygon.states.create("hover");
//    hs.properties.fill = chart.colors.getIndex(9);
//    // Set up click events
//    worldPolygon.events.on("hit", function (ev) {
//        ev.target.series.chart.zoomToMapObject(ev.target);
//        var map = ev.target.dataItem.dataContext.map;
//        var mapID = ev.target.dataItem.dataContext.id;
//        if (map) {
//            ev.target.isHover = false;
//            countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
//            countrySeries.geodataSource.load();
//        }
//    });
//    // Set up data for countries
//    var data = [];
//    for (var id in am4geodata_data_countries2) {
//        if (am4geodata_data_countries2.hasOwnProperty(id)) {
//            var country = am4geodata_data_countries2[id];
//            for (let i = 0; i < myJSON.length; i++) {     //var i in myJSON
//                if (id === myJSON[i]) { //.Country_Coded 
//                    data.push({
//                        id: id,
//                        color: chart.colors.getIndex(continents[country.continent_code]),
//                        map: country.maps[0]
//                    });
//                }
//            }
//        }
//    }
//    console.log(data);
//    worldSeries.data = data;
//    // Zoom control
//    chart.zoomControl = new am4maps.ZoomControl();
//    var homeButton = new am4core.Button();
//    homeButton.events.on("hit", function () {
//        worldSeries.show();
//        countrySeries.hide();
//        chart.goHome();
//    });
//    homeButton.icon = new am4core.Sprite();
//    homeButton.padding(7, 5, 7, 5);
//    homeButton.width = 30;
//    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
//    homeButton.marginBottom = 10;
//    homeButton.parent = chart.zoomControl;
//    homeButton.insertBefore(chart.zoomControl.plusButton);
// }); // end am4core.ready()