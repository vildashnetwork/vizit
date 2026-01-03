


import { io } from "socket.io-client";

const SOCKET_URL = "https://vizit-backend-hubw.onrender.com";

let socket = null;

/**
 * Connect socket ONCE per user
 * @param {string} userId - current logged-in user ID
 * @param {function} onOnlineUsersUpdate - callback when online users change
 */
export const connectSocket = (userId, onOnlineUsersUpdate) => {
    if (!userId) {
        console.warn("❌ Socket connection blocked: userId missing");
        return null;
    }

    if (socket) return socket; // already connected

    socket = io(SOCKET_URL, {
        query: { userId },
        withCredentials: true,
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
    });

    // Listen for online users updates
    if (onOnlineUsersUpdate) {
        socket.on("getOnlineUsers", (onlineIds) => {
            console.log("🌐 Online users:", onlineIds);
            onOnlineUsersUpdate(onlineIds);
        });
    }

    return socket;
};

/**
 * Disconnect socket (logout / app close)
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Access existing socket inside components
 */
export const getSocket = () => socket;
