
import {logout, setLogBtnTxt} from "./logout.js";
setLogBtnTxt()

const logInLogOutBtn = document.getElementById("login-logout");

logInLogOutBtn.addEventListener("click", function(){
  logout()
})

