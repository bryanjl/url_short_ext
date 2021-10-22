// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

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
            aLinkItem.onclick = function(e) {
                // let mainContent = document.getElementById('main-content');
                // mainContent.src = 'index.html';
                displayAnalytics(e);
                e.preventDefault();
            }
            
            aLinkItem.innerText = link.title;
            //append elements
            linkListItem.appendChild(aLinkItem);
            document.getElementById('nav-list').appendChild(linkListItem);
        });
    })
    .catch(err => {
        console.log(err);
        //could have error page -> 404 page
    });
}

const displayAnalytics = (event) => {
    // console.log(event.target.id);
    //send message to Iframe analytics page -> load analytics
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {linkID: event.target.id});
    });
}

//Login
const login = () => {

    let username = document.getElementById('login-form__email').value;
    let password = document.getElementById('login-form__password').value;

    if(!username || !password) {
        alert('Please enter email and password');
        return;
    } 

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
            if(response.status === 404){
                throw new Error('User not found');
            } else if(response.status === 400) {
                throw new Error('Incorrect Password');
            } else {
                throw new Error('Server Error');
            }
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
        alert(err);
    }); 
}

//logout and refresh
const logout = () => {

    chrome.storage.sync.clear();
    loadUser();
}

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
