const BASE_URL = 'https://api.noroff.dev/api/v1/';
const LISTING_URL = 'auction/listings';
import {logout, setLogBtnTxt} from "./logout.js";

setLogBtnTxt()
const logInLogOutBtn = document.getElementById("login-logout");



logInLogOutBtn.addEventListener("click", function(){

  logout()
})

async function getPosts() {
  try {
    const response = await fetch(`${BASE_URL}${LISTING_URL}`);
    
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
        <h1 class="card-title">${post.title}</h1>
        <img class="card-img-top feed-img" src="${post.media[0]}" alt="Post Image">
        <h4 class="card-text">${post.description}</h4>

        <p class="card-text">Listing created: ${createdDate}</p>
        <p class="card-text">Bidding ends: ${endsAtDate}</p>

        <a href="post-specific-page.html?id=${post.id}" class="btn btn-primary mb-3">View item</a>
        <a href="post-specific-page.html" class="btn btn-primary mb-3">Bid on item</a>
    `;

      feedContainer.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}


getPosts();


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