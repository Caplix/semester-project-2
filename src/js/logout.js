

/* export function checkToken (){
    const isLoggedIn = localStorage.getItem("token") === true
    return isLoggedIn
} */



export function logout(){
    const isLoggedIn = localStorage.getItem("token") !== null
    if(isLoggedIn){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = `index.html`
        
    } else {
        window.location.href = `login.html`
    }
}

export function setLogBtnTxt() {
    const logInLogOutBtn = document.querySelector("#login-logout");
    const navbarContent = document.querySelector("#navbar-content")

    const navbarItem = document.createElement("li")
    const navbarBtn = document.createElement("button")


    const isLoggedIn = (localStorage.getItem("token") && localStorage.getItem("user")) !== null
    if (isLoggedIn) {
        
        navbarItem.classList.add("nav-item", "active")
        navbarBtn.classList.add("btn", "btn-primary", "logout-btn")
        navbarBtn.id = "login-logout"

        navbarBtn.innerText = `log out`

        navbarContent.append(navbarItem)
        navbarItem.append(navbarBtn)
    } else {
        navbarItem.classList.add("nav-item", "active")
        navbarBtn.classList.add("btn", "btn-primary", "logout-btn")
        navbarBtn.id = "login-logout"

        navbarBtn.innerText = `log in`

        navbarContent.append(navbarItem)
        navbarItem.append(navbarBtn)
    }
}

