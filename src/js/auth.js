// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

const registration = () => {
    let username = document.getElementById('form-email').value;
    let password = document.getElementById('form-password').value;
    let confirmPassword = document.getElementById('form-password-confirm').value;

    if(password.length < 6){
        alert('Password must be atleast 6 characters');
        return;
    }

    if(password != confirmPassword) {
        alert("Passwords don't match");
        return;
    }

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
            console.log(response);
            if(response.status === 200){
                window.location.href = 'options.html';
            }
            return response.json();
        } else {
            throw new Error(response.status);
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
    regBtn.addEventListener('click', (e) => {
        registration();
        e.preventDefault();
    });
}


