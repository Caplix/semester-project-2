const BASE_URL = 'https://api.noroff.dev/api/v1/';
const LISTING_URL = 'auction/listings/';
import {logout, setLogBtnTxt} from "./logout.js";


setLogBtnTxt()
const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){

  logout()
})

window.addEventListener("scroll", (e)=>{
  loadMorePosts()
  console.log("STOP IT")
})

let postsLoaded = 0

function loadMorePosts() {
  const isAtBottom = (window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight
 if (isAtBottom){
  getPosts()
  postsLoaded += 5
      console.log(postsLoaded, "POSTSLOADED")
 }
}

async function getPosts() {
  try {
    const response = await fetch(BASE_URL+ LISTING_URL +"?sort=created" + "&_seller=true" + "&limit=5" + `&offset=${postsLoaded}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Posts:', data);

    const feedContainer = document.getElementById('feed-item');
    data.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('feed-item');

      const createdDate = dateConverter(post.created);
      const endsAtDate = norwegianEndDate(post.endsAt);

      postElement.innerHTML = `
      <div class="place-seller-name mb-3">
        <img class="profile-img-feed" src="${post.seller.avatar}" alt="Post Image">
        <h1 class="card-title">${post.seller.name}</h1>
      </div>
        <img class="card-img-top feed-img" src="${post.media[0]}" alt="Post Image">
        <h2 class="card-text">${post.title}</h2>

        <h4 class="card-te  xt">${post.description}</h4>

        <p class="card-text">Listing created: ${createdDate}</p>
        <p class="card-text">Bidding ends: ${endsAtDate}</p>

        <a href="post-specific-page.html?id=${post.id}" class="btn btn-primary mb-3">View item</a>
    `;

      feedContainer.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}


getPosts();


export const dateConverter = (date) => {

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
 export const norwegianEndDate = (endDate) => {
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