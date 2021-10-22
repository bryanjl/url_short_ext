// const baseUrl = 'http://localhost:5000';
const baseUrl = 'https://urlshortenapi.herokuapp.com';

window.onload = function() {
    let submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', (e) => {
        let email = document.getElementById('form-email').value;
        submitForm(email);
        e.preventDefault();
    });
}

const submitForm = (email) => {
    // console.log(email);
    fetch(`${baseUrl}/auth/forgotpassword`, {
        method: 'POST',

        body: JSON.stringify({
            email 
        }),

        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if(response.ok){
            return response.json()
        } else {
            if(response.status === 404){
                throw new Error('User Not found')
            } else {
                throw new Error('Server Error')
            }
        }
    })
    .then(json => {
        alert(`Email sent to ${email}, please check your email`)
    })
    .catch(err => {
        console.log(err);
        alert(err);
    });
}