// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

const registration = () => {
    let username = document.getElementById('form-email').value;
    let password = document.getElementById('form-password').value;

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
    .then(response => {
        if(response.ok){
            return response.json();
        } else {
            throw new Error(response);
        }
    })
    .then(json => {

        let userObj = {
            username: json.username,
            jwt: json.token
        };
 
        chrome.storage.sync.set(userObj);
    })
    .catch(err => {
        console.log(err);
    });
}

window.onload = function() {
    let regBtn = document.getElementById('reg-form-btn');
    regBtn.addEventListener('click', registration);
}


