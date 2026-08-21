import {
    getCurrentUser,
    getToken,
    logout,
    API_URL
} from "./auth.js";


const logOutBtn = document.getElementById("log-out-btn");
const chat = document.getElementById("chat");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const onlineCount = document.getElementById("online-count");


let currentUser = null;
let ws = null;


/* =========================
   INITIALIZE CHAT
   ========================= */

async function init() {

    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }


    try {

        /*
         * Ask FastAPI:
         *
         * GET /auth/me
         *
         * This tells us who is logged in.
         */

        currentUser = await getCurrentUser();

        if (!currentUser) {
            return;
        }


        /*
         * Load messages already stored
         * in SQLite.
         */

        await loadPreviousMessages();


        /*
         * Only after authentication and
         * history loading do we open WS.
         */

        connectWebSocket();


    } catch (error) {

        console.error(error);

        chat.textContent =
            "Failed to initialize chat.";
    }
}


/* =========================
   LOAD OLD MESSAGES
   ========================= */

async function loadPreviousMessages() {

    const response = await fetch(
        `${API_URL}/chat/previous_messages`
    );


    if (!response.ok) {

        throw new Error(
            "Failed to load previous messages."
        );
    }


    const messages = await response.json();


    for (const message of messages) {

        renderMessage(message);
    }


    scrollToBottom();
}


/* =========================
   WEBSOCKET
   ========================= */

function connectWebSocket() {

    const token = getToken();


    /*
     * Convert:
     *
     * http://127.0.0.1:3000
     *
     * into:
     *
     * ws://127.0.0.1:3000
     */

    const wsURL =
        API_URL
            .replace("http://", "ws://")
            .replace("https://", "wss://")
        + "/chat/ws";


    ws = new WebSocket(wsURL);


    /* =====================
       CONNECTED
       ===================== */

    ws.onopen = () => {

        console.log("WebSocket connected");


        /*
         * Authenticate the WebSocket.
         *
         * We DO NOT send user_id.
         *
         * FastAPI gets user_id from JWT.
         */

        ws.send(JSON.stringify({
            type: "auth",
            token: token
        }));
    };


    /* =====================
       MESSAGE RECEIVED
       ===================== */

    ws.onmessage = (event) => {

        const data = JSON.parse(event.data);

        console.log("WS message:", data);


        /*
         * Normal chat message
         */

        if (data.type === "message") {

            renderMessage(data);

            scrollToBottom();

            return;
        }


        /*
         * Number of connected users
         */

        if (data.type === "new-connection") {

            if (onlineCount) {

                onlineCount.textContent =
                    `${data.content} online`;
            }

            return;
        }
    };


    /* =====================
       ERROR
       ===================== */

    ws.onerror = (error) => {

        console.error(
            "WebSocket error:",
            error
        );
    };


    /* =====================
       CLOSED
       ===================== */

    ws.onclose = () => {

        console.log("WebSocket disconnected");

        if (onlineCount) {

            onlineCount.textContent =
                "Disconnected";
        }
    };
}


/* =========================
   SEND MESSAGE
   ========================= */

messageForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const content =
            messageInput.value.trim();


        if (!content) {
            return;
        }


        /*
         * Make sure WS is actually connected.
         */

        if (
            !ws ||
            ws.readyState !== WebSocket.OPEN
        ) {

            console.error(
                "WebSocket is not connected."
            );

            return;
        }


        /*
         * Send message to FastAPI.
         */

        ws.send(JSON.stringify({

            type: "message",

            content: content

        }));


        /*
         * Clear input.
         */

        messageInput.value = "";

        messageInput.focus();
    }
);


/* =========================
   RENDER MESSAGE
   ========================= */

function renderMessage(message) {

    const messageElement =
        document.createElement("div");


    /*
     * The server tells us the sender_id.
     *
     * We compare it to the authenticated
     * user's ID.
     */

    const isMine =
        Number(message.sender_id) ===
        Number(currentUser.user_id);


    messageElement.classList.add(
        "message"
    );


    if (isMine) {

        messageElement.classList.add(
            "mine"
        );

    } else {

        messageElement.classList.add(
            "other"
        );
    }


    /* Sender */

    const senderElement =
        document.createElement("div");

    senderElement.className =
        "message-sender";


    senderElement.textContent =
        isMine
            ? "You"
            : `${message.sender_name}`;


    /* Content */

    const contentElement =
        document.createElement("div");

    contentElement.className =
        "message-content";


    /*
     * IMPORTANT:
     *
     * textContent instead of innerHTML.
     *
     * This prevents someone from sending
     * HTML/JS and having the browser execute it.
     */

    contentElement.textContent =
        message.content;


    /* Time */

    const timeElement =
        document.createElement("div");

    timeElement.className =
        "message-time";


    timeElement.textContent =
        formatTime(message.time);


    messageElement.appendChild(
        senderElement
    );

    messageElement.appendChild(
        contentElement
    );

    messageElement.appendChild(
        timeElement
    );


    chat.appendChild(
        messageElement
    );
}


/* =========================
   FORMAT TIME
   ========================= */

function formatTime(time) {

    const date = new Date(time);


    if (Number.isNaN(date.getTime())) {

        return "";
    }


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================
   SCROLL
   ========================= */

function scrollToBottom() {

    chat.scrollTop =
        chat.scrollHeight;
}


/* =========================
   LOGOUT
   ========================= */

logOutBtn.addEventListener(
    "click",
    () => {

        /*
         * Close WS before logging out.
         */

        if (ws) {

            ws.close();
        }


        logout();
    }
);


/* =========================
   START
   ========================= */

init();