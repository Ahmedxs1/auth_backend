import { registerRequest } from "./auth.js";

const usernameField = document.getElementById("username");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    if (username.length < 5 || password.length < 8 || !email){
        alert("invalid input");
        return;
    }

    try{
        const data = await registerRequest(username, email, password);

        alert(data)

    } catch (error){
        alert(error.message);
    }
});