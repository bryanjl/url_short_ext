// import { loadAnalyticsPage } from './countryHighlightJS.mjs';


// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

const loadUser = () => {
    let welcomeLogout = document.getElementById('welcome-logout');
    let welcomeLogin = document.getElementById('welcome-login');
    let reigisterForAcct = document.getElementById('register');
    let usernameWelcome = document.getElementById('username-welcome');

    //do global and save to memory!!!
    chrome.storage.sync.get(['jwt', 'username'], (result) => {
        if(Object.keys(result).length === 0){
            welcomeLogin.style.display = 'flex';
            welcomeLogout.style.display = 'none';
            // console.log('no username');
        } else {
            welcomeLogin.style.display = 'none';
            welcomeLogout.style.display = 'flex';
            reigisterForAcct.style.display = 'none';
            usernameWelcome.innerHTML = ' ' + result.username;
            getLinks();
        }
    });
}

//styling idea -> every other box is a different shade to distinguish between each link

const getLinks = () => {
    let token;
    chrome.storage.sync.get(['jwt'], (result) => {
        token = result.jwt;    //token should be global -> one request
        
        fetch(`${baseUrl}/auth/getme`, {
            method: 'GET',
    
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(json => {
            json.data.links.forEach((link) => {
                console.log(link);
                let linkListItem = document.createElement('li');
                let aLinkItem = document.createElement('a');
                aLinkItem.classList.add('nav-list__item');
                aLinkItem.setAttribute('id', link._id);
                aLinkItem.onclick = displayAnalytics;
                //!!!regex the https:// out of links for display
                aLinkItem.innerText = link.title;
                
                // console.log(aLinkItem);
                linkListItem.appendChild(aLinkItem);
                document.getElementById('nav-list').appendChild(linkListItem);
            });
        })
        //catch the error here
    });
}

const displayAnalytics = (event) => {
    // console.log(event.target.id);

    // loadAnalyticsPage(event.target.id);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {linkID: event.target.id});
      });

    // chrome.tabs.sendMessage(tabs[0].id, {linkID: event.target.id});
}



//Login
const login = () => {
    console.log('here');

    let username = document.getElementById('login-form__email').value;
    let password = document.getElementById('login-form__password').value;

    fetch(`${baseUrl}/auth/login`, {
        method: 'POST',

        body: JSON.stringify({
            username: username,
            password: password
        }),

        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())

        .then(json => {

            let userObj = {};
            userObj.username = json.username;
            userObj.jwt = json.token;

            console.log(userObj);
            chrome.storage.sync.set(userObj, () => {
                loadUser();
            });
        });
}

const logout = () => {
    chrome.storage.sync.clear();
    loadUser();
}

//run iFrame JS
// const iFrameJS = () => {
//     let iFrame = document.getElementById('main-content');
//     iFrame.onload = function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this);
// }


//do this onload
window.onload = loadUser();


// loadUser();

//event listeners
let loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', login);

let logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', logout);

// let registerBtn = document.getElementById('register-btn');
// registerBtn.addEventListener('click', getJwt);




// padding on one link causes the iframe to shift













// const loadAnalyticsPage = (linkID) => {
//     let token;
//     chrome.stroage.sync.get(['jwt'], (result) => {
//         token = result.data.jwt;
//     });


//     let url = `${baseUrl}/link/${linkID}`;

//     fetch(url, {
//         method: 'GET',

//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(response => response.json())

//     .then(json => {


//         am4core.useTheme(am4themes_animated);
// // Themes end
// var continents = {
//    "AF": 0,
//    "AN": 1,
//    "AS": 2,
//    "EU": 3,
//    "NA": 4,
//    "OC": 5,
//    "SA": 6
// }
// // Create map instance
// var chart = am4core.create("chartdiv", am4maps.MapChart);
// chart.projection = new am4maps.projections.Miller();
// // Create map polygon series for world map
// var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
// worldSeries.useGeodata = true;
// worldSeries.geodata = am4geodata_worldLow;
// worldSeries.exclude = ["AQ"];
// var worldPolygon = worldSeries.mapPolygons.template;
// worldPolygon.tooltipText = "{name}";
// worldPolygon.nonScalingStroke = true;
// worldPolygon.strokeOpacity = 0.5;
// worldPolygon.fill = am4core.color("#eee");
// worldPolygon.propertyFields.fill = "color";
// // Create country specific series (but hide it for now)
// var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
// countrySeries.useGeodata = true;
// countrySeries.hide();
// countrySeries.geodataSource.events.on("done", function (ev) {
//    worldSeries.hide();
//    countrySeries.show();
// });
// var countryPolygon = countrySeries.mapPolygons.template;
// countryPolygon.tooltipText = "{name}";
// countryPolygon.nonScalingStroke = true;
// countryPolygon.strokeOpacity = 0.5;
// countryPolygon.fill = am4core.color("#eee");
// var hs = countryPolygon.states.create("hover");
// hs.properties.fill = chart.colors.getIndex(9);
// // Set up click events
// worldPolygon.events.on("hit", function (ev) {
//    ev.target.series.chart.zoomToMapObject(ev.target);
//    var map = ev.target.dataItem.dataContext.map;
//    var mapID = ev.target.dataItem.dataContext.id;
//    if (map) {
//        ev.target.isHover = false;
//        countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
//        countrySeries.geodataSource.load();
//    }
// });
// // Set up data for countries
// var data = [];
// for (var id in am4geodata_data_countries2) {
//    if (am4geodata_data_countries2.hasOwnProperty(id)) {
//        var country = am4geodata_data_countries2[id];
//        for (let i = 0; i < myJSON.length; i++) {     //var i in myJSON
//            if (id === myJSON[i]) { //.Country_Coded 
//                data.push({
//                    id: id,
//                    color: chart.colors.getIndex(continents[country.continent_code]),
//                    map: country.maps[0]
//                });
//            }
//        }
//    }
// }
// console.log(data);
// worldSeries.data = data;
// // Zoom control
// chart.zoomControl = new am4maps.ZoomControl();
// var homeButton = new am4core.Button();
// homeButton.events.on("hit", function () {
//    worldSeries.show();
//    countrySeries.hide();
//    chart.goHome();
// });
// homeButton.icon = new am4core.Sprite();
// homeButton.padding(7, 5, 7, 5);
// homeButton.width = 30;
// homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
// homeButton.marginBottom = 10;
// homeButton.parent = chart.zoomControl;
// homeButton.insertBefore(chart.zoomControl.plusButton);


//     })

//     .catch(err => {
//         console.log(err);
//     });
// }




// // INDEX PAGE IFRAME

// // let url = 'https://urlshortenapi.herokuapp.com/link/ThOFabU';c
// let url = 'http://localhost:5000/link/6163a9523573e60004f8cdcb';

// // let originUrl = document.getElementById('origin-url').value;

// // console.log(originUrl);

// // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDk4NDgxMWQ5MjNlMDAwNGE3YjMxNiIsImlhdCI6MTYzMjIwODQ0M30.QKGyPCK3sh1ZIM46-CPmTAAcLJfYYbRPsxK78idv1Wc';

// //authorization header > dynamic build > add to headers object

// // let headers = {
// //     "Content-Type": "application/json"
// // }

// fetch(url, {
//     method: 'GET',


// })
// .then(response => response.json())

// .then(json => {
//     myJSON = json.data.country_code;
    
//     // Themes begin


//   // Create chart instance
//   var chart = am4core.create("piechartdiv", am4charts.PieChart);

//    // Add and configure Series
//    var pieSeries = chart.series.push(new am4charts.PieSeries());
//    pieSeries.dataFields.value = "litres";
//    pieSeries.dataFields.category = "country";
// });




    
// // Add data
// chart.data = [{
//   "country": "Lithuania",
//   "litres": 501.9
// }, {
//   "country": "Czech Republic",
//   "litres": 301.9
// }, {
//   "country": "Ireland",
//   "litres": 201.1
// }, {
//   "country": "Germany",
//   "litres": 165.8
// }, {
//   "country": "Australia",
//   "litres": 139.9
// }, {
//   "country": "Austria",
//   "litres": 128.3
// }, {
//   "country": "UK",
//   "litres": 99
// }, {
//   "country": "Belgium",
//   "litres": 60
// }, {
//   "country": "The Netherlands",
//   "litres": 50
// }];
