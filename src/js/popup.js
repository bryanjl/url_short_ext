// let url = 'https://urlshortenapi.herokuapp.com/'; //production server
let url = 'http://localhost:5000';

//get the user from storage and keep in memory
let token;
window.onload = loadUser => {

    chrome.storage.sync.get(['jwt'], (result) => {

        token = result.jwt;

        if(!token){
            let popupContainer = document.getElementById('popup__container');
            let signInRegister = document.createElement('p');
    
            signInRegister.classList.add('popup__links');
            signInRegister.innerHTML = 'Already a member? <a href="index.html" target="_blank" class="popup__links--style">Sign in</a>. New user? <a href="registration.html" class="popup__links--style" target="_blank">Register</a> for free.';
    
            popupContainer.appendChild(signInRegister);      
        }
    })
}


//Get current URL from tab
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // console.log(url);
    document.getElementById('origin-url').value = url;
});


const shortenUrl = () => {  

    let originUrl = document.getElementById('origin-url').value;

    if(!token) {
        headers = {
            "Content-Type": "application/json"
        }
    } else {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    let loader = document.getElementById('loader-container-popup');
    let successContainer = document.getElementById('success-container');
    successContainer.style.display = 'none';
    loader.style.display = 'flex';

    fetch(url, {
        method: 'POST',

        body: JSON.stringify({
            url: originUrl
        }),

        headers 
    })
    .then(response => response.json())

    .then(json => {
        // console.log(`https://urlshortenapi.herokuapp.com/${json.data.short}`);
        document.getElementById('copy-url').value = `https://urlshortenapi.herokuapp.com/${json.data.short}`;
        loader.style.display = 'none';
        successContainer.style.display = 'flex';

        // fetch(url).then((response) => {
        //     if (response.ok) {
        //       return response.json();
        //     } else {
        //       throw new Error('Something went wrong');
        //     }
        //   })
        //   .then((responseJson) => {
        //     // Do something with the response
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   });


        
    })
    .catch(err => {
        console.log(err);
        let fail = document.getElementById('')
    });
}

const copyToClipboard = () => {
    let urlToCopy = document.getElementById('copy-url').value;

    navigator.clipboard.writeText(urlToCopy);
}

//copy to clipboard button event listener
let copyUrlToClipBtn = document.getElementById('copyToClipBtn');
copyUrlToClipBtn.addEventListener('click', copyToClipboard);

//shorten url btn event listener
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', shortenUrl);


