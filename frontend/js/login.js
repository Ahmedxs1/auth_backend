import { loginRequest } from "./auth.js";

const form = document.querySelector("form");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const loginButton = form.querySelector("button[type='submit']");


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}


function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearError();

    const email = emailField.value.trim();
    const password = passwordField.value;

    // Client-side validation
    if (!email) {
        showError("Please enter your email.");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters.");
        return;
    }

    try {

        // Prevent double-clicking login
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        await loginRequest(email, password);

        /*
         * loginRequest() should store the JWT
         * and redirect to chat.html after
         * successful authentication.
         */

    } catch (error) {

        console.error("Login failed:", error);

        showError(
            error.message || "Login failed. Please try again."
        );

        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});