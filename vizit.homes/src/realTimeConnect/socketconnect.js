


// import { io } from "socket.io-client";

// const SOCKET_URL = "https://vizit-backend-hubw.onrender.com";
// // const SOCKET_URL = "http://localhost:6300";

// let socket = null;

// /**
//  * Connect socket ONCE per user
//  * @param {string} userId - current logged-in user ID
//  * @param {function} onOnlineUsersUpdate - callback when online users change
//  */
// export const connectSocket = (userId, onOnlineUsersUpdate) => {
//     if (!userId) {
//         console.warn("❌ Socket connection blocked: userId missing");
//         return null;
//     }

//     if (socket) return socket; // already connected

//     socket = io(SOCKET_URL, {
//         query: { userId },
//         withCredentials: true,
//         transports: ["websocket"],
//     });

//     socket.on("connect", () => {
//         console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("disconnect", () => {
//         console.log("❌ Socket disconnected");
//     });

//     socket.on("connect_error", (err) => {
//         console.error("⚠️ Socket connection error:", err.message);
//     });

//     // Listen for online users updates
//     if (onOnlineUsersUpdate) {
//         socket.on("getOnlineUsers", (onlineIds) => {
//             console.log("🌐 Online users:", onlineIds);
//             onOnlineUsersUpdate(onlineIds);
//         });
//     }

//     return socket;
// };

// /**
//  * Disconnect socket (logout / app close)
//  */
// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//     }
// };

// /**
//  * Access existing socket inside components
//  */
// export const getSocket = () => socket;






// socketconnect.js (frontend)
import { io } from "socket.io-client";

const SOCKET_URL = "https://vizit-backend-hubw.onrender.com";

let socket = null;

export const connectSocket = (userId, onOnlineUsersUpdate) => {
    if (!userId) return null;
    if (socket) return socket; // already connected

    socket = io(SOCKET_URL, {
        auth: { userId }, // prefer handshake.auth
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: 5,
        timeout: 10000,
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.error("⚠️ Socket error:", err?.message || err);
    });

    if (onOnlineUsersUpdate) {
        socket.on("getOnlineUsers", onOnlineUsersUpdate);
    }

    return socket;
};

export const disconnectSocket = () => {
    if (!socket) return;
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
};

export const getSocket = () => socket;
