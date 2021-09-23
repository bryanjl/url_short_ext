//Get current URL from tab
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // console.log(url);
    document.getElementById('origin-url').value = url;
});


const shortenUrl = () => {
    let url = 'https://urlshortenapi.herokuapp.com/';

    let originUrl = document.getElementById('origin-url').value;

    // console.log(originUrl);

    // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDk4NDgxMWQ5MjNlMDAwNGE3YjMxNiIsImlhdCI6MTYzMjIwODQ0M30.QKGyPCK3sh1ZIM46-CPmTAAcLJfYYbRPsxK78idv1Wc';
    
    //authorization header > dynamic build > add to headers object

    let headers = {
        "Content-Type": "application/json"
    }

    fetch(url, {
        method: 'POST',

        body: JSON.stringify({
            url: originUrl
        }),

        headers: {
            "Content-Type": "application/json", 
        }
    })
    .then(response => response.json())

    .then(json => {
        // console.log(`https://urlshortenapi.herokuapp.com/${json.data.short}`);
        document.getElementById('copy-url').value = `https://urlshortenapi.herokuapp.com/${json.data.short}`;
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


