
import {logout, setLogBtnTxt} from "./logout.js";

document.addEventListener("DOMContentLoaded", function () {
  
  const BASE_URL = `https://api.noroff.dev/api/v1/`;
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(userData);
  const userName = document.querySelector(".profile-user-name");

  userName.innerHTML = userData?.name || `no user logged in`;

  const profileAvatar = document.querySelector(".card-img-top")

  profileAvatar.src = userData?.avatar || `/Images/no-profile-picture.jpg`

  const profileCredits = document.querySelector(".show-profile-credit");
  const displayCredits = document.querySelector(".display-profile-credits")

  profileCredits.addEventListener("click", function(){
    displayCredits.textContent = `Credits: ${userData.credits}`
  })
  setLogBtnTxt()
  const logInLogOutBtn = document.getElementById("login-logout");

  

  logInLogOutBtn.addEventListener("click", function(){

    logout()
  })
});



