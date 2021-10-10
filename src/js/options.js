import { loadAnalyticsPage } from './countryHighlightJS.mjs';


const baseUrl = 'http://localhost:5000';
// const baseUrl = 'https://urlshortenapi.herokuapp.com';

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
                // console.log(link);
                let linkListItem = document.createElement('li');
                let aLinkItem = document.createElement('a');
                aLinkItem.classList.add('nav-list__item');
                aLinkItem.setAttribute('id', link._id);
                aLinkItem.onclick = displayAnalytics;
                //!!!regex the https:// out of links for display
                aLinkItem.innerText = link.url;
                
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

    loadAnalyticsPage(event.target.id);
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