const axios = require('axios');

const register = () => {
    let url = 'https://urlshortenapi.herokuapp.com/auth/register';
    let userData = {
        username: 'abryanja1',
        password: 123456
    }
    axios.post(url, userData)
        .then((res) => {
            console.log(res.data.token);
        });
}

const login = () => {
    let url = 'https://urlshortenapi.herokuapp.com/auth/login';
    let userData = {
        username: 'bryanja1',
        password: "123456"
    }
    // userData = JSON.stringify(userData);
    axios.post(url, userData)
        .then((res) => {
            console.log(res);
        });
}

const getCurrentUser = () => {
    let url = 'https://urlshortenapi.herokuapp.com/auth/getme';
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDk4NDgxMWQ5MjNlMDAwNGE3YjMxNiIsImlhdCI6MTYzMjIwODQ0M30.QKGyPCK3sh1ZIM46-CPmTAAcLJfYYbRPsxK78idv1Wc';

    axios.get(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then((res) => {
            console.log(res);
        })
}

const shortenUrl = () => {
    let url = 'https://urlshortenapi.herokuapp.com/';
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDk4NDgxMWQ5MjNlMDAwNGE3YjMxNiIsImlhdCI6MTYzMjIwODQ0M30.QKGyPCK3sh1ZIM46-CPmTAAcLJfYYbRPsxK78idv1Wc';
    let originalUrl = {
            url: "www.google.com"
        }

    let headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }

    axios.post(url, originalUrl,{
        headers: headers
    })
        .then((res) => {
            console.log(res);
        })
}

// register();
// login();
getCurrentUser();
// shortenUrl();