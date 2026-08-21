const API_URL = "http://127.0.0.1:3000";


export function getToken(){
    return localStorage.getItem("token");
}

export function logout(){
    localStorage.removeItem("token")
    window.location.href = "login.html";
}

export async function getCurrentUser(){
    const token = getToken();

    if (!token){
        window.location.href = "login.html";
    }

    const response = await fetch(API_URL + "/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok){
        logout();
        return null;
    }
    return await response.json();


}

export async function loginRequest(email, password){
    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (!response.ok){
        alert(data.detail);
        return;
    }

    localStorage.setItem("token", data.access_token);

    window.location.href = "/chat.html";
}

export async function registerRequest(username, email, password) {
    const response = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })

    const data = await response.json();

    if (!response.ok){
        throw new Error(data.detail || "Registration failed");
        return;
    }

    return data;
}