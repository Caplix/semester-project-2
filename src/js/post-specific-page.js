const BASE_URL = 'https://api.noroff.dev/api/v1/';
const LISTING_URL_ID = 'auction/listings/{id}';
const BIDDING_URL_ID = 'auction/listings/{id}/bids';

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
    const sortedBids = bids.sort((a,b)=> b.amount - a.amount)
    return sortedBids;
}

 function getSpecificPost() {
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    console.log(id);
    specificPost(id);
    confirmBid(id)
}

async function specificPost(id) {
    try {
        const data = await getPostData(id);
        console.log(data)
        const specificPostContainer = document.getElementById("post-details");
        specificPostContainer.innerHTML = buildSpecificPost(data);    
        applyItemDetails(data)  
        

    } catch (err) {
        console.log(err);
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
    let creditText = ""
    if (sortHighest(data.bids)[0]?.amount) {
    creditText = " Credits"
    } else {
        creditText = ""
    }
    console.log(data)
    return `
    <div class="place-seller-name mb-3 mt-3">
        <img class="profile-img-feed" src="${data.seller.avatar}" alt="Post Image">
        <h1 class="card-title">${data.seller.name}</h1>
      </div>
        <img class="card-img-top feed-img" src="${data.media[0]}" alt="Post Image">
        <h2 class="card-text">${data.title}</h2>
        <h4 class="card-text">${data.description}</h4>
        <p class="card-text">Listing created: ${createdDate}</p>
        <p class="card-text">Bidding ends: ${endsAtDate}</p>
        <p class="card-text">Current highest bid: ${sortHighest(data.bids)[0]?.amount || "No bids"}${creditText}</p>
        <button class="btn btn-success mb-3" data-toggle="modal" data-target="#bidding-modal">Bid on item</button>
    `;

}

async function applyItemDetails(data){9
    const highestBid = sortHighest(data.bids);
    console.log(data, "dette er data")
     console.log(highestBid)
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
    let creditText = ""
    if (highestBid[0]?.amount) {
    creditText = " Credits"
    } else {
        creditText = ""
    }

    highestBidElem.innerText = `Current highest bid: ${(highestBid)[0]?.amount || "No bids"} ${creditText} `
}



const placeBidBtn = document.getElementById("place-bid"); // replace "your-form-id" with the actual ID of your form

async function confirmBid(id){

    placeBidBtn.addEventListener("click", async (e) => {
        e.preventDefault(); // prevent the default form submission behavior

        const userBid = parseInt(document.getElementById("bid-amount").value.trim());

        const bidData = {
            amount: userBid,
        };

        const biddingId = id;

        try {
            const result = await bidOnItem(biddingId, bidData);
            console.log(result); // handle the result as needed
        } catch (error) {
            console.error("Error:", error);
        }
    });
}

async function bidOnItem(id, bidData) {
    try{
    const res = await fetch(
        (BASE_URL + BIDDING_URL_ID + "?_seller=true" + "&_bids=true").replace('{id}', id),
        {
            method: "POST",
            body: JSON.stringify(bidData),
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json; charset=UTF-8",
            },
        }
        
        
    );
        const alertMessage = document.querySelector("#alert-message");
        const alertContainer = document.querySelector(".alert-container");
    if(res.ok) {
        return res.json();
    } else{
        const errorData = await res.json();
            /* alert("signup failed." + errorData.message) */
            console.log(errorData)
            
            alertContainer.innerHTML = ""
            const alertHeading = document.createElement("h4")
            alertHeading.innerText = "Errors"
            alertContainer.append(alertHeading)
            
            errorData.errors.forEach((error) => {
                const alertText = document.createElement("p")
                alertText.classList.add("alert-text")
                alertText.innerText = `${error.message}`

                alertContainer.append(alertText)
            })

            alertContainer.classList.remove("hidden")
    }

}
    catch (error) {
        console.error('Error:', error);
    }

}



setLogBtnTxt()

const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){
  logout()
})

getSpecificPost();

