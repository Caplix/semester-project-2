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


  function sortHighest(bids){
    console.log(bids, "heisann")
    const sortedBids = bids.sort((a,b)=> b.amount - a.amount)
    return sortedBids[0];
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
        applyItemDetails(data)  
    } catch (err) {
        console.error(err.status);
    }
}

async function getPostData(id) {
    const res = await fetch(
        (BASE_URL + LISTING_URL_ID + "?_seller=true" + "&_bids=true").replace('{id}', id), // Replace {id} with the actual id
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

function buildSpecificPost(data)   {
    const createdDate = dateConverter(data.created);
    const endsAtDate = norwegianEndDate(data.endsAt);
    console.log(data)
    return `
    <div class="place-seller-name mb-3">
        <img class="profile-img-feed" src="${data.seller.avatar}" alt="Post Image">
        <h1 class="card-title">${data.seller.name}</h1>
      </div>
        <img class="card-img-top feed-img" src="${data.media[0]}" alt="Post Image">
        <h2 class="card-text">${data.title}</h2>

        <h4 class="card-text">${data.description}</h4>

        <p class="card-text">Listing created: ${createdDate}</p>
        <p class="card-text">Bidding ends: ${endsAtDate}</p>
        <p class="card-text">Current highest bid: ${sortHighest(data.bids).amount}</p>

        <button class="btn btn-success" data-toggle="modal" data-target="#bidding-modal">Bid on item</button>
    `;

}

async function applyItemDetails(data){
    const highestBid = sortHighest(data.bids);
    console.log(data, "dette er data")
     console.log(highestBid, "halla balla!")
     const createdDate = dateConverter(data.created);
    const endsAtDate = norwegianEndDate(data.endsAt);
    const itemTitle = document.getElementById("item-title")
    const itemImg = document.getElementById("item-img")
    const profileImg = document.getElementById("profile-img")
    const profileName = document.getElementById("modal-profile-name")
    const itemDescription = document.getElementById("item-description")
    const auctionCreated = document.getElementById("auction-created")
    const auctionEnd = document.getElementById("auction-end")
     const highestBidElem = document.getElementById("auction-highest-bids")
 
    itemTitle.innerText = data.title;
    itemImg.src = data?.media[0]|| "/Images/no-profile-picture.jpg";
    profileImg.src = data.seller.avatar || "/Images/no-profile-picture.jpg";
    profileName.innerText = data.seller.name;
    itemDescription.innerText = data.description;
    auctionCreated.innerText = `Auction made: ${createdDate}`
    auctionEnd.innerHTML = `Auction ends: ${endsAtDate}`
    highestBidElem.innerText = `${(highestBid).amount}`
    
}



setLogBtnTxt()

const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){
  logout()
})

getSpecificPost();

