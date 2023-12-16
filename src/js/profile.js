import {logout, setLogBtnTxt} from "./logout.js";
import {dateConverter, norwegianEndDate} from "./feed.js"

document.addEventListener("DOMContentLoaded", async function() {
  const userData = await getUserData()
  console.log(userData);
  const BASE_URL = `https://api.noroff.dev/api/v1/`;
  const POST_LISTING = `auction/listings/`;
  const GET_PROFILE = `auction/profiles/`;
  
  setUpSite(userData, BASE_URL, POST_LISTING, GET_PROFILE)
});

function setUpSite(userData, BASE_URL, POST_LISTING, GET_PROFILE) {
/*   setLogBtnTxt()
 */
  const userNameElem = document.querySelector(".profile-user-name");
  userNameElem.innerHTML = userData?.name || `no user logged in`;

  const profileAvatar = document.querySelector(".card-img-top")
  profileAvatar.src = userData?.avatar || `/Images/no-profile-picture.jpg`

  const profileCredits = document.querySelector(".show-profile-credit");
  const displayCredits = document.querySelector(".display-profile-credits")
  profileCredits.addEventListener("click", function(){
    displayCredits.textContent = `Credits: ${userData.credits}`
  })

  const editProfileForm = document.getElementById("editProfileForm");

  editProfileForm.addEventListener("submit", async function (event) {
    await editProfile(event, userData, BASE_URL, profileAvatar)
  });

const createPostForm = document.getElementById("listingForm");
createPostForm.addEventListener("submit",async function  (event) {
  await createPost(event,BASE_URL, POST_LISTING, userData, GET_PROFILE)
});

const logInLogOutBtn = document.getElementById("login-logout");
  logInLogOutBtn.addEventListener("click", function(){
    logout()
  })

  //Get users auction listings
  

  /* if (userAucList) { */
    getUserListings(BASE_URL, userData, GET_PROFILE)
 /*  } */
 
}

async function editProfile(event, userData, BASE_URL, profileAvatar) {
  event.preventDefault();
  const newProfilePictureInput = document.getElementById("newProfilePicture");
  const newAvatarURL = newProfilePictureInput.value.trim();
  

  if (newAvatarURL) {
    const editProfileUrl = BASE_URL + `auction/profiles/${userData.name}/media`;

    const requestBody = {
      avatar: newAvatarURL,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    await fetch(editProfileUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile picture changed successfully", data);

        userData.avatar = data.avatar;
        localStorage.setItem("user", JSON.stringify(userData));

        profileAvatar.src = userData.avatar;
      })
      .catch((error) => {
        console.error("Error changing profile picture", error);
      });
  }
}


async function createPost(event, BASE_URL, POST_LISTING, userData, GET_PROFILE) {
  event.preventDefault();

  const itemName = document.getElementById("itemName").value.trim();
  const description = document.getElementById("description").value.trim();
  const endsAt = document.getElementById("endDate").value.trim();
  const listingTags = document.getElementById("tags").value.trim();
  const listingMedia = document.getElementById("listing-picture").value.trim();

  if (itemName && description) {
    const createPostUrl = BASE_URL + POST_LISTING ; 
    const requestBody = {
      title: itemName,
      description: description,
      endsAt: endsAt,
      tags: [listingTags],
      media: [listingMedia], 
    };

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    fetch(createPostUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Post created successfully", data);

        // Handle success, e.g., show a success message
      })
      .catch((error) => {
        console.error("Error creating post", error);
        // Handle error, e.g., show an error message
      });
  }
}

async function getUserData(){
  
  return await JSON.parse(localStorage.getItem("user"));
}

async function getUserListings(BASE_URL, userData, GET_PROFILE) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userData.accessToken}`,
      "Content-Type": "application/json",
    }
  };

  const response = await fetch(BASE_URL + GET_PROFILE + userData?.name + "/listings", requestOptions)
  const listings = await response.json()

  console.log(listings, "ALL LISTINGS")

  const userAucList = document.querySelector("#listingContainer")
  if (listings.length < 1 && !userAucList) {
    userAucList.innerHTML = ""
  } else {
    listings.forEach((listing) => {
      const aucListTitle = listing?.title;
      const aucListImage = listing?.media[0];
    
      const aucListLi = document.createElement("li");
      aucListLi.classList.add("list-item", "row", "mb-3");
    
      aucListLi.innerHTML = `
        <div class="list-item-imagecontainer col-6 col-md-4 col-lg-3">
          <img class="list-item-image img-fluid" src="${aucListImage}" alt="Listing Image"/>
        </div>
        <div class="list-item-content col-6 col-md-8 col-lg-9">
        <div class="content-top d-none d-md-block">
        <h4 class="content-title text-truncate">${aucListTitle}</h4>
      </div>
          <div class="content-middle">
            <a href="post-specific-page.html?id=${listing.id}" class="btn btn-primary col-12">View Item</a>
          </div>
        </div>
      `;
      //the post-specific-page dosnt work if the post dosnt have a amount bid on it(only occurs on personal posts for some reason)// 
    
    userAucList.appendChild(aucListLi)
    
  })
}
}