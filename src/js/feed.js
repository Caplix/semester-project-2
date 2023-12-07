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

      postElement.innerHTML = `
        <h1 class="card-title">${post.title}</h1>
        <img class="card-img-top feed-img" src="${post.media}" alt="Post Image">
        <h4 class="card-text">${post.description}</h4>

        <p class="card-text">Lising created: ${post.created}</p>
        <p class="card-text">Bidding ends: ${post.endsAt}</p>

        <a href="post-specific-page.html?id=${post.id}" class="btn btn-primary mb-3">View item</a>
        <a href="post-specific-page.html" class="btn btn-primary mb-3">Bid on item</a>
    `;

      feedContainer.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Call the function to fetch and display posts
getPosts();
