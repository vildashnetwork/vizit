


import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ChatLayout from "./components/ChatLayout";
import "./chat.css";
import { connectSocket, disconnectSocket } from "../../backendauth/socketconnect";

function AdminChatApp({ setActiveTab }) {
    /* =======================
       CORE STATE
    ======================= */
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({});
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState({});
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredOwners, setFilteredOwners] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Check if a user is online
    const isOnline = (userId) => onlineUsers.includes(userId);

    /* =======================
       DECODE TOKEN / SET USER
    ======================= */
    const decodeToken = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(
                "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                setUser(res.data.user);
            }
        } catch (error) {
            console.error("Token decode failed:", error);
        }
    }, []);

    /* =======================
       FETCH CHAT USERS
    ======================= */
    const fetchUsers = useCallback(async (userId) => {
        try {
            setLoadingChats(true);
            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/messages/users/${userId}`
            );

            if (res.status === 200) {
                const { filteredUsers, filteredOwners } = res.data;
                setFilteredUsers(filteredUsers);
                setFilteredOwners(filteredOwners);
                setChats([...filteredOwners, ...filteredUsers]);
                localStorage.setItem('userId', userId)

            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingChats(false);
        }
    }, []);

    /* =======================
       LOAD MESSAGES FOR CHAT
    ======================= */
    const loadMessages = async (chatId) => {
        if (!chatId || !user?._id) return;

        setLoadingMessages((prev) => ({ ...prev, [chatId]: true }));

        try {
            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/messages/${chatId}`,
                {
                    params: { myId: user._id }
                }
            );

            setMessages((prev) => ({
                ...prev,
                [chatId]: res.data
            }));
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages((prev) => ({ ...prev, [chatId]: false }));
        }
    };


    /* =======================
       SEND MESSAGE
    ======================= */

    // const sendMessage = async (chatId, text, imageFile = null) => {
    //     if ((!text || !text.trim()) && !imageFile) return; // require text or image
    //     if (!user?._id) return;

    //     // Optimistic message (temporary)
    //     const tempMessage = {
    //         senderId: user._id,
    //         receiverId: chatId,
    //         text: text || '',
    //         image: imageFile ? URL.createObjectURL(imageFile) : null, // local preview
    //         createdAt: new Date().toISOString(),
    //         temp: true, // mark as temporary
    //     };

    //     // Optimistic UI update
    //     setMessages(prev => ({
    //         ...prev,
    //         [chatId]: [...(prev[chatId] || []), tempMessage],
    //     }));

    //     try {
    //         const formData = new FormData();
    //         formData.append('senderId', user._id);
    //         formData.append('text', text || '');
    //         if (imageFile) formData.append('image', imageFile);

    //         const res = await axios.post(
    //             `https://vizit-backend-hubw.onrender.com/api/messages/send/${chatId}`,
    //             formData,
    //             { headers: { 'Content-Type': 'multipart/form-data' } }
    //         );

    //         if (res.status === 201) {
    //             // Replace temporary message with server message
    //             setMessages(prev => ({
    //                 ...prev,
    //                 [chatId]: prev[chatId].map(msg =>
    //                     msg === tempMessage ? res.data : msg
    //                 ),
    //             }));
    //         }
    //     } catch (error) {
    //         console.error("Failed to send message:", error);
    //         // Optionally remove temporary message or mark as failed
    //         setMessages(prev => ({
    //             ...prev,
    //             [chatId]: prev[chatId].map(msg =>
    //                 msg === tempMessage ? { ...msg, failed: true } : msg
    //             ),
    //         }));
    //     }
    // };



    const sendMessage = async (chatId, { text = '', imageFile = null, videoFile = null }) => {
        // Require at least one type of content
        if (!text.trim() && !imageFile && !videoFile) return;
        if (!user?._id) return;

        // Optimistic message (temporary)
        const tempMessage = {
            senderId: user._id,
            receiverId: chatId,
            text: text || '',
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            video: videoFile ? URL.createObjectURL(videoFile) : null,
            createdAt: new Date().toISOString(),
            temp: true, // mark as temporary
        };

        // Optimistic UI update
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), tempMessage],
        }));

        try {
            const formData = new FormData();
            formData.append('senderId', user._id);
            formData.append('text', text || '');
            if (imageFile) formData.append('image', imageFile);
            if (videoFile) formData.append('video', videoFile);

            const res = await axios.post(
                `https://vizit-backend-hubw.onrender.com/api/messages/send/${chatId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (res.status === 201) {
                // Replace temporary message with server message
                setMessages(prev => ({
                    ...prev,
                    [chatId]: prev[chatId].map(msg =>
                        msg === tempMessage ? res.data : msg
                    ),
                }));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally mark the temporary message as failed
            setMessages(prev => ({
                ...prev,
                [chatId]: prev[chatId].map(msg =>
                    msg === tempMessage ? { ...msg, failed: true } : msg
                ),
            }));
        }
    };




    /* =======================
       SOCKET.IO: ONLINE USERS & NEW MESSAGES
    ======================= */
    useEffect(() => {
        if (!user?._id) return;

        disconnectSocket(); // disconnect any existing socket
        const socket = connectSocket(user._id, setOnlineUsers);

        // Listen for incoming messages
        socket.on("newMessage", (msg) => {
            const chatId = msg.senderId === user._id ? msg.receiverId : msg.senderId;

            setMessages((prev) => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), msg],
            }));
        });

        return () => disconnectSocket();
    }, [user?._id]);

    /* =======================
       INITIAL FLOW
    ======================= */
    useEffect(() => {
        decodeToken();
    }, [decodeToken]);

    useEffect(() => {
        if (user?._id) fetchUsers(user._id);
    }, [user, fetchUsers]);

    /* =======================
       RENDER
    ======================= */
    return (
        <div className="App">
            {/* <ChatLayout
                chats={chats}
                messages={messages}
                loadingChats={loadingChats}
                loadingMessages={loadingMessages}
                onSelectChat={loadMessages}
                onSendMessage={sendMessage}
                setActiveTab={setActiveTab}
                isOnline={isOnline}
                user={user}
                onlineUsers={onlineUsers}
            /> */}

            <ChatLayout
                chats={chats}
                messages={messages}
                loadingChats={loadingChats}
                loadingMessages={loadingMessages}
                onSelectChat={loadMessages}
                onSendMessage={sendMessage}
                setActiveTab={setActiveTab}
                isOnline={isOnline}
                user={user}
                onlineUsers={onlineUsers}
            />

        </div>
    );
}

export default AdminChatApp;
