const baseUrl = 'http://localhost:5000';
// const baseUrl = 'https://urlshortenapi.herokuapp.com';

const loadUser = () => {
    let welcomeLogout = document.getElementById('welcome-logout');
    let welcomeLogin = document.getElementById('welcome-login');
    let reigisterForAcct = document.getElementById('register');
    let usernameWelcome = document.getElementById('username-welcome');

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
            // getLinks();
        }
    });
}

const getLinks = () => {
    let token;
    chrome.storage.sync.get(['jwt'], (result) => {
        token = result.jwt;
    
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
                //!!!regex the https:// out of links for display
                aLinkItem.innerText = link.url;
                linkListItem.appendChild(aLinkItem);
                document.getElementById('link-list').appendChild(linkListItem);
            });
        })
    });
}


//Login
const login = () => {
    let username = document.getElementById('email-input').value;
    let password = document.getElementById('password-input').value;

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

//do this onload
window.onload = loadUser();
// loadUser();

//event listeners
// let loginBtn = document.getElementById('login-btn');
// loginBtn.addEventListener('click', login);

// let logoutBtn = document.getElementById('logout-btn');
// logoutBtn.addEventListener('click', logout);

// let registerBtn = document.getElementById('register-btn');
// registerBtn.addEventListener('click', getJwt);