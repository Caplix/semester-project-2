const BASE_URL = `https://api.noroff.dev/api/v1/`;
const NEW_USER_URL = `auction/auth/register`;


document.addEventListener('DOMContentLoaded', function () {
/*     const invalidAlert = document.querySelector("#alert-message");
 */    let form = document.getElementById('signupForm');
/*     const invalidAlert = document.querySelector("#alert-message");
 */    /* invalidAlert.textContent = `RETARD` */

    form.addEventListener('submit', async (event) => {
        
        event.preventDefault(); // Prevent the default form submission

        const newUserName = document.getElementById('username').value;
        const newEmail = document.getElementById('email').value;
        const newPassword = document.getElementById('password').value;

        
        

        try {
            console.log('Submitting registration:', newUserName, newEmail, newPassword);
            await registerUser(newUserName, newEmail, newPassword);    


        } catch (e){
            if (e.errors){
                console.error('Registration failed:', e);
                
            }
            
        }
        
    });
});



async function registerUser(newUserName, newEmail, newPassword){
    console.log(newUserName, newEmail, newPassword);
    
try {
        const res = await fetch(BASE_URL + NEW_USER_URL,{

            method: "POST",
            body: JSON.stringify({
                name: newUserName,
                email: newEmail,
                password: newPassword
            }),
            headers: {"content-type": "application/json; charset=UTF-8"},
        });
        const alertMessage = document.querySelector("#alert-message");
        const alertContainer = document.querySelector(".alert-container");

        

        if(res.ok){
            window.location.href = "logIn.html";
            console.log("cool")
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
        console.error('Error:', error);
    }

}

