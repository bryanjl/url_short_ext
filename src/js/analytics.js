let baseUrl = `http://localhost:5000`;
// const baseUrl = 'https://urlshortenapi.herokuapp.com';

window.onload = function() {
    let token; 
    chrome.storage.sync.get(['jwt'], (result) => {
        token = result.jwt;
    });
    
    
    //Message for when user clicks on link to be displayed
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request.linkID, token);
            getAnalyticsData(request.linkID, token);
        }
    );
}

//API call for analytic using link ID
const getAnalyticsData = (linkID, token) => {
    let aboutPage = document.getElementById('about-page');
    aboutPage.style.display = 'none';


    let url = `${baseUrl}/link/${linkID}`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if(response.ok){
            return response.json();
        } else {
            throw new Error(response);
        }
    })
    .then(json => {
        disposeCharts();
        loadWorldMap(json.data.country_code);
        loadNumberOfClicks(json.data.visits);
        loadLinkUrl(json.data.title, json.data.url, `${baseUrl}/${json.data.short}`);
        loadRefererChart(json.data.referer);
        loadVisitsPerDay(json.data.visitsPerDay);
    })
    .catch(err => {
        console.log(err);
    });
}

//dispose all charts - prevent memory leak
const disposeCharts = () => {
    
    am4core.disposeAllCharts();
}

//world map graph 
const loadWorldMap = (myJSON) => {

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
}

//number of total visits
const loadNumberOfClicks = (visits) => {
    
    let numOfVisits = document.getElementById('number-of-visits');
    numOfVisits.innerHTML = visits;
}

//Load URL data
const loadLinkUrl = (websiteTitle, originUrl, shortUrl) => {
    
    let webTitle = document.getElementById('website-title');
    webTitle.innerHTML = websiteTitle;

    let linkUrl = document.getElementById('short-link-url');
    linkUrl.innerHTML = shortUrl;

    let originalUrl = document.getElementById('original-url');
    originalUrl.innerHTML = originUrl
}

//referer host charts
const loadRefererChart = (refererObj) => {
    // Create chart instance
    var chart = am4core.create("referer-chart", am4charts.PieChart);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "visits";
    pieSeries.dataFields.category = "referer";

    let keys = Object.keys(refererObj)
    let chartData = [];
    keys.forEach((key) => {
      chartData.push({
          referer: key,
          visits: refererObj[key]
      })  
    })

    chart.data = chartData;
}

//visits per day line graph
const loadVisitsPerDay = (visitsPerDay) => {

    let chartData = [];
    if(!visitsPerDay){
        chartData = [];
    } else {
        let datesArr = Object.keys(visitsPerDay);
        datesArr.forEach(result => {
            chartData.push({
                date: result,
                value: visitsPerDay[result]
            });
        });
    }

    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("visits-per-day-graph", am4charts.XYChart);
        
        // Add data
        chart.data = chartData;
        
        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
        
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
        series.strokeWidth = 2;
        series.minBulletDistance = 15;
        
        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        
        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        
        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
        
        // Make a panning cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panXY";
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;
        
        // Create vertical scrollbar and place it before the value axis
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarY.parent = chart.leftAxesContainer;
        chart.scrollbarY.toBack();
        
        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        
        dateAxis.start = 0.79;
        dateAxis.keepSelection = true;
    });
}