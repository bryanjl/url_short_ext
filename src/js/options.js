<<<<<<< Updated upstream
import { loadAnalyticsPage } from './countryHighlightJS.mjs';


const baseUrl = 'http://localhost:5000';
// const baseUrl = 'https://urlshortenapi.herokuapp.com';
=======
// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';
>>>>>>> Stashed changes

const loadUser = () => {

    let welcomeLogout = document.getElementById('welcome-logout');
    let welcomeLogin = document.getElementById('welcome-login');
    let reigisterForAcct = document.getElementById('register');
    let usernameWelcome = document.getElementById('username-welcome');

    if(!user){
        welcomeLogin.style.display = 'flex';
        welcomeLogout.style.display = 'none';
    } else {
        welcomeLogin.style.display = 'none';
        welcomeLogout.style.display = 'flex';
        reigisterForAcct.style.display = 'none';
        usernameWelcome.innerHTML = ' ' + user.username;
        getLinks();
    }
}

const getLinks = () => {
<<<<<<< Updated upstream
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
=======

    fetch(`${baseUrl}/auth/getme`, {
        method: 'GET',

        headers: {
            "Authorization": `Bearer ${user.jwt}`
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
        json.data.links.forEach((link) => {
            //create list items for each link
            let linkListItem = document.createElement('li');
            let aLinkItem = document.createElement('a');
            //set classes and id=linkID for requests
            aLinkItem.classList.add('nav-list__item');
            aLinkItem.setAttribute('id', link._id);
            aLinkItem.onclick = displayAnalytics;
            aLinkItem.innerText = link.title;
            //append elements
            linkListItem.appendChild(aLinkItem);
            document.getElementById('nav-list').appendChild(linkListItem);
        });
    })
    .catch(err => {
        console.log(err);
        //could have error page -> 404 page
>>>>>>> Stashed changes
    });
}

const displayAnalytics = (event) => {
<<<<<<< Updated upstream
    // console.log(event.target.id);

    loadAnalyticsPage(event.target.id);
=======
    //send message to Iframe analytics page -> load analytics
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {linkID: event.target.id});
      });
>>>>>>> Stashed changes
}

//Login
const login = () => {

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
    .then(response => {
        if(response.ok){
            return response.json();
        } else {
            throw new Error(response);
        }
    })     
    .then(json => {
        user = {
            username: json.username,
            jwt: json.token
        };
        //save the username, jwt to chrome storage
        chrome.storage.sync.set(user, () => {
            loadUser();
        });
    })
    .catch(err => {
        console.log(err);
    });
}

//logout and refresh
const logout = () => {

    chrome.storage.sync.clear();
    loadUser();
}

<<<<<<< Updated upstream
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
=======
window.onload = function() {
    
    chrome.storage.sync.get(['jwt', 'username'], (result) => {
        if(Object.keys(result).length === 0){
            user = null;
        } else {
            user = result;
        }
        //load user links/settings
        loadUser();
    });
    
    //event listeners
    loginBtn.addEventListener('click', (e) => {
        login();
        e.preventDefault();
    });

    logoutBtn.addEventListener('click', logout);

    

}
//user object
let user;
let logoutBtn = document.getElementById('logout-btn');
let loginBtn = document.getElementById('login-btn');
>>>>>>> Stashed changes
