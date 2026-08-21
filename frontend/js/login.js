import { loginRequest } from "./auth.js";


const from = document.querySelector("form");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");

from.addEventListener("submit", async (event) => {
    event.preventDefault();


    const email = emailField.value;
    const password = passwordField.value;

    if (email == "" || password.length < 8){
        alert("invalid input");
        return;
    }

    await loginRequest(email, password);

});
