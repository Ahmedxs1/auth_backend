import { getCurrentUser, getToken, logout } from "./auth.js"

const logOutBtn = document.getElementById("log-out-btn");
const chat = document.getElementById("chat");

async function init() {
    const token = getToken();
    if (!token){
        alert("U must login first")
        window.location.href = "login.html"
        return;
    }

    const currentUser = await getCurrentUser();
    
    const message = `Hello ${currentUser.username}`;
    chat.textContent = message;
    
}


init()

// webSocket Logic


logOutBtn.addEventListener("click", () => {
    logout()
});
