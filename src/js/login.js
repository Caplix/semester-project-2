const BASE_URL = `https://api.noroff.dev/api/v1/`;
const LOGIN_URL = `auction/auth/login`;

document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const emailValue = document.getElementById('Email').value;
        const passwordValue = document.getElementById('password').value;
        userLogin(emailValue, passwordValue);
    });
});

 async function userLogin(email, password) {
    try {
        const res = await fetch(BASE_URL + LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        });
        const alertMessage = document.querySelector("#alert-message");
        const alertContainer = document.querySelector(".alert-container");
        
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.accessToken);
            window.location.href = './profile.html';
        } else {
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
    } catch (error) {
        console.error('Something went wrong', error);
    }
}
