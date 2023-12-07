const BASE_URL = 'https://api.noroff.dev/api/v1/';
const LISTING_URL_ID = 'auction/listings/{id}';
import {logout, setLogBtnTxt} from "./logout.js";



function getSpecificPost() {
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    console.log(id);
    specificPost(id);
}

async function specificPost(id) {
    try {
        const data = await getPostData(id);
        const specificPostContainer = document.getElementById("post-details");
        specificPostContainer.innerHTML = buildSpecificPost(data);
    } catch (err) {
        console.error(err.status);
    }
}

async function getPostData(id) {
    const res = await fetch(
        BASE_URL + LISTING_URL_ID.replace('{id}', id), // Replace {id} with the actual id
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json; charset=UTF-8",
            },
        }
    );
    return res.json();
}

function buildSpecificPost(data) {
    return `
    <h1 class="card-title">${data.title}</h1>
    <img class="card-img-top feed-img" src="${data.media}" alt="Post Image">'
    <h4 class="card-text">${data.description}</h4>

    <p class="card-text">Lising created: ${data.created}</p>
    <p class="card-text">Bidding ends: ${data.endsAt}</p>
    `;
}

setLogBtnTxt()

const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){
  logout()
})

getSpecificPost();