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
    });
}


//Get current URL from tab
let documentTitle;
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    documentTitle = tabs[0].title;
    // console.log(url);
    document.getElementById('origin-url').value = url;
});


const shortenUrl = () => {  
    //get data for server
    let originUrl = document.getElementById('origin-url').value;
    //get document title
    // let documentTitle;
    // await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //     documentTitle = tabs[0].title;
    //     console.log(documentTitle);
    // });

    console.log(documentTitle);

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

    //animation for loading
    let loader = document.getElementById('loader-container-popup');
    let successContainer = document.getElementById('success-container');
    let finishPulse = document.getElementById('popup__container--short')
    let fail = document.getElementById('fail-container');
    finishPulse.classList.remove('short_output_animation');
    fail.style.display = 'none';
    successContainer.style.display = 'none';
    loader.style.display = 'flex';

    fetch(url, {
        method: 'POST',

        body: JSON.stringify({
            url: originUrl,
            title: documentTitle
        }),

        headers 
    })
    .then((response) => {
        if(response.ok){
            return response.json();
        } else {
            throw new error();
        }
    })
    .then(json => {
        document.getElementById('copy-url').value = `https://urlshortenapi.herokuapp.com/${json.data.short}`;
        loader.style.display = 'none';
        successContainer.style.display = 'flex';       
        finishPulse.classList.add('short_output_animation');
    })
    .catch(err => {
        console.log(err);
        
        loader.style.display = 'none';
        fail.style.display = 'flex';
    });
}

const copyToClipboard = () => {
    let urlToCopy = document.getElementById('copy-url').value;

    navigator.clipboard.writeText(urlToCopy);

    // alert('copied');
}

//copy to clipboard button event listener
let copyUrlToClipBtn = document.getElementById('copyToClipBtn');
copyUrlToClipBtn.addEventListener('click', copyToClipboard);

//shorten url btn event listener
let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', shortenUrl);


