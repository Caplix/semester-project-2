const BASE_URL = 'https://api.noroff.dev/api/v1/';
const LISTING_URL_ID = 'auction/listings/{id}';
import {logout, setLogBtnTxt} from "./logout.js";


const dateConverter = (date) => {

    const options = {
        weekday:"long",
        year:"numeric", 
        month:"long",
        day:"numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",}
  
    const norwegianDate = new Date(date).toLocaleString("no-NO", options)
  
    return norwegianDate;
  }
  
  
   const norwegianEndDate = (endDate) => {
    const endDateTime = new Date(endDate).getTime();
    const now = new Date().getTime();
    const timeDifference = endDateTime - now;
  
    if (timeDifference <= 0) {
        return 'Utløpt';
    }
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${days}d, ${hours}t, ${minutes}m;`
  }


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
        console.log(data)
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
    const createdDate = dateConverter(data.created);
    const endsAtDate = norwegianEndDate(data.endsAt);

    return `
    <h1 class="card-title">${data.title}</h1>
    <img class="card-img-top feed-img" src="${data.media}" alt="Post Image">
    <h4 class="card-text">${data.description}</h4>

    <p class="card-text">Listing created: ${createdDate}</p>
    <p class="card-text">Bidding ends: ${endsAtDate}</p>
    `;
}


setLogBtnTxt()

const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){
  logout()
})

getSpecificPost();

