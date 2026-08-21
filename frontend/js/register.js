import { registerRequest } from "./auth.js";

const usernameField = document.getElementById("username");
const emailField = document.getElementById("email");
const password1Field = document.getElementById("password-1");
const password2Field = document.getElementById("password-2");
const form = document.querySelector("form");
const errorMessage = document.getElementById("error-message");

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

    const username = usernameField.value.trim();
    const email = emailField.value.trim();
    const password1 = password1Field.value;
    const password2 = password2Field.value;

    // Client-side validation
    if (username.length < 5) {
        showError("Username must be at least 5 characters.");
        return;
    }

    if (!email) {
        showError("Please enter your email.");
        return;
    }

    if (password1.length < 8) {
        showError("Password must be at least 8 characters.");
        return;
    }

    if (password1 !== password2) {
        showError("Passwords do not match.");
        return;
    }

    try {

        const data = await registerRequest(
            username,
            email,
            password1
        );

        console.log("Registration successful:", data);

        // Registration succeeded
        window.location.href = "login.html";

    } catch (error) {

        console.error("Registration failed:", error);

        showError(
            error.message || "Registration failed."
        );
    }
});