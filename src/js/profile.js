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
  setLogBtnTxt()

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
   const aucListDesc = listing?.description
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
    <div class="content-bottom">
      <p class="content-desc">${aucListDesc}</p>
    </div>
    </div>
    <div class="content-controls">
      <button id="edit-btn" class="btn btn-warning auc-listing-control"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-1.5 -1.5 48 48" height="20" width="20"><g id="pencil-square--change-document-edit-modify-paper-pencil-write-writing"><path id="Rectangle 62" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M39.269062500000004 15.407812499999999c1.816875 -1.816875 2.50875 -4.47375 0.958125 -6.525A21.15 21.15 0 0 0 38.30625 6.69375a21.1359375 21.1359375 0 0 0 -2.19 -1.9209375c-2.0503125 -1.5496875 -4.7071875 -0.85875 -6.525 0.9590624999999999L15.119062499999998 20.203125c-0.51 0.51 -0.8596875 1.1559375 -0.928125 1.8740625000000002 -0.11812500000000001 1.2178125 -0.22593749999999999 3.4921875 0.020624999999999998 7.02375a1.8187499999999999 1.8187499999999999 0 0 0 1.6865625 1.685625c3.530625 0.2475 5.8059375 0.13874999999999998 7.02375 0.0215625 0.7171875 -0.06937499999999999 1.3640625000000002 -0.418125 1.8740625000000002 -0.928125l14.473125000000001 -14.473125000000001Z" stroke-width="3"></path><path id="Intersect" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M37.075312499999995 17.600625c-0.5353125 -1.1859374999999999 -1.695 -3.1968750000000004 -4.0875 -5.5893749999999995 -2.3915625 -2.3925 -4.4034375 -3.55125 -5.5893749999999995 -4.0875" stroke-width="3"></path><path id="Rectangle 1096" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M40.3059375 21.5625c0.0046875 0.6065625 0.0065625 1.2309375 0.0065625 1.875 0 6.433125 -0.23625000000000002 10.974375 -0.4659375 13.8675 -0.19031250000000002 2.39625 -2.02125 4.22625 -4.4165625 4.415625 -2.893125 0.230625 -7.434374999999999 0.466875 -13.8675 0.466875s-10.974375 -0.23625000000000002 -13.8675 -0.4659375c-2.39625 -0.19031250000000002 -4.22625 -2.02125 -4.415625 -4.4165625C3.0478125 34.411875 2.8125 29.870624999999997 2.8125 23.4375s0.23625000000000002 -10.974375 0.4659375 -13.8675C3.46875 7.17375 5.29875 5.34375 7.695 5.154375 10.588125 4.9228125 15.129375000000001 4.6875 21.5625 4.6875c0.6440625000000001 0 1.2684374999999999 0.0028125 1.875 0.0065625" stroke-width="3"></path></g></svg></button>
      <button id="delete-btn" class="btn btn-danger auc-listing-control"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-1.5 -1.5 48 48" height="20" width="20"><g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage"><path id="Subtract" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M5.795625 14.851875c0.8315625 12.9515625 1.6275 19.689375 2.1 22.896562499999998 0.24 1.621875 1.305 2.94375 2.8996874999999998 3.32625C12.965625 41.596875 16.7034375 42.1875 22.501875 42.1875c5.7984374999999995 0 9.5353125 -0.590625 11.7065625 -1.111875 1.59375 -0.38249999999999995 2.65875 -1.704375 2.89875 -3.32625 0.4734375 -3.2081250000000003 1.2684374999999999 -9.9459375 2.1 -22.9003125" stroke-width="3"></path><path id="Union" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="M29.09625 6.7275c3.3375 0.061875 5.938124999999999 0.163125 7.801874999999999 0.2578125 2.240625 0.11249999999999999 4.321875 1.3059375 4.948124999999999 3.4603124999999997 0.09375 0.3234375 0.181875 0.6656249999999999 0.25875000000000004 1.0284375 0.369375 1.725 -0.9215625 3.2071875 -2.6793750000000003 3.35625 -2.83125 0.2390625 -8.0128125 0.5109375 -16.947187500000002 0.5109375 -8.9334375 0 -14.115937500000001 -0.271875 -16.94625 -0.5109375 -1.7587499999999998 -0.148125 -3.0571875 -1.640625 -2.6025 -3.345 0.1640625 -0.6140625000000001 0.36562500000000003 -1.1746874999999999 0.5775 -1.6725 0.7621874999999999 -1.7840625 2.596875 -2.7046875 4.53375 -2.8115625 1.7887499999999998 -0.09749999999999999 4.3921874999999995 -0.208125 7.8628125 -0.27375A6.5625 6.5625 0 0 1 21.909375 2.8125h1.183125a6.5625 6.5625 0 0 1 6.0046875 3.915Z" stroke-width="3"></path><path id="Vector 831" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="m16.875 23.4375 0.9375 9.375" stroke-width="3"></path><path id="Vector 832" stroke="#000" stroke-linecap="round" stroke-linejoin="round" d="m28.125 23.4375 -0.9375 9.375" stroke-width="3"></path></g></svg></button>
    </div>`    
    
    userAucList.appendChild(aucListLi)
    
  })
}
}