export const API_URL = "http://127.0.0.1:3000";


/* =========================
   TOKEN
   ========================= */

export function getToken() {
    return localStorage.getItem("token");
}


/* =========================
   LOGOUT
   ========================= */

export function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}


/* =========================
   CURRENT USER
   ========================= */

export async function getCurrentUser() {

    const token = getToken();

    if (!token) {

        window.location.href = "login.html";

        return null;
    }


    try {

        const response = await fetch(
            `${API_URL}/auth/me`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            logout();

            return null;
        }


        return await response.json();

    } catch (error) {

        console.error(
            "Failed to get current user:",
            error
        );

        throw new Error(
            "Could not connect to the server."
        );
    }
}


/* =========================
   LOGIN
   ========================= */

export async function loginRequest(
    email,
    password
) {

    try {

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "Server returned an invalid response."
            );
        }


        if (!response.ok) {

            throw new Error(
                data.detail || "Login failed."
            );
        }


        /*
         * JWT received from FastAPI
         */

        localStorage.setItem(
            "token",
            data.access_token
        );


        /*
         * Authentication succeeded.
         */

        window.location.href = "chat.html";


    } catch (error) {

        /*
         * Re-throw the error so login.js
         * can display it to the user.
         */

        throw error;
    }
}


/* =========================
   REGISTER
   ========================= */

export async function registerRequest(
    username,
    email,
    password
) {

    try {

        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );


        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "Server returned an invalid response."
            );
        }


        if (!response.ok) {

            throw new Error(
                data.detail || "Registration failed."
            );
        }


        return data;

    } catch (error) {

        throw error;
    }
}