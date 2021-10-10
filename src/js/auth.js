// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

const registration = () => {
    let username = document.getElementById('form-email').value;
    let password = document.getElementById('form-password').value;

    // console.log(username, password);
    // console.log('hello');

    fetch(`${baseUrl}/auth/register`, {
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
            chrome.storage.sync.set(userObj);
        });
}

let regBtn = document.getElementById('reg-form-btn');
regBtn.addEventListener('click', registration);