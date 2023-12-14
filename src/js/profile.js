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

  
  console.log(listings, "LISSSS")
  console.log(userAucList, "userAucList")
  listings.forEach((listing) => {
   const aucListTitle = listing?.title
   const aucListImage = listing?.media[0]
   const aucListCreateAt = dateConverter (listing?.created)
   const aucListEndAt = norwegianEndDate (listing?.endsAt)
   const aucListLi = document.createElement("li")
    /* aucListTags.innerText += listing?.tags */
    aucListLi.classList.add("list-item")
    aucListLi.innerHTML = `
    <div class="list-item-imagecontainer">
      <img class="list-item-image" src="${aucListImage}"/>
    </div>
    <div class="list-item-content">
      <div class="content-top">
      <p class="content-title">${aucListTitle}</p>
      <p class="content-time"> created: ${aucListCreateAt}</p>
      <p class="content-time"> ends in: ${aucListEndAt}</p>
    </div>
    </div>
`    
    
    userAucList.appendChild(aucListLi)
    
  })
}
}