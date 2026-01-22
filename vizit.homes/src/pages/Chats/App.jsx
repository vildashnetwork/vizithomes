

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ChatLayout from "./components/ChatLayout";
import "./chat.css";
import { connectSocket, disconnectSocket } from "../../realTimeConnect/socketconnect";

function UserChatApp({ setActiveTab }) {
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({});
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState({});
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredOwners, setFilteredOwners] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [typingUsers, setTypingUsers] = useState({});





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
                localStorage.setItem('userId', userId);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingChats(false);
        }
    }, []);









    useEffect(() => {
        if (!user?._id) return;

        const socket = connectSocket(user._id, setOnlineUsers);
        window.socket = socket; // ensure global reference

        socket.on("typingStatus", ({ byUserId, isTyping }) => {
            setTypingUsers(prev => ({
                ...prev,
                [byUserId]: isTyping
            }));
        });

        return () => {
            socket.off("typingStatus");
            disconnectSocket();
        };
    }, [user?._id]);
    useEffect(() => {
        if (!user?._id || !window.socket) return;

        // Register user for rooms
        window.socket.emit("registerUser", user._id);
    }, [user?._id]);



















    //mark read



    const emitMarkAsRead = useCallback(
        (chatUserId) => {
            if (!user?._id || !chatUserId) return;

            // Emit socket event
            if (window.socket) {
                window.socket.emit("markMessagesRead", {
                    chatUserId,
                    readerId: user._id,
                });
            }
        },
        [user?._id]
    );


    /* =======================
       LOAD MESSAGES
    ======================= */
    // const loadMessages = async (chatId) => {
    //     if (!chatId || !user?._id) return;

    //     setLoadingMessages((prev) => ({ ...prev, [chatId]: true }));

    //     try {
    //         const res = await axios.get(
    //             `https://vizit-backend-hubw.onrender.com/api/messages/${chatId}`,
    //             { params: { myId: user._id } }
    //         );

    //         setMessages((prev) => ({
    //             ...prev,
    //             [chatId]: res.data
    //         }));
    //     } catch (error) {
    //         console.error("Failed to load messages:", error);
    //     } finally {
    //         setLoadingMessages((prev) => ({ ...prev, [chatId]: false }));
    //     }
    // };


    const loadMessages = async (chatId) => {
        if (!chatId || !user?._id) return;

        setLoadingMessages(prev => ({ ...prev, [chatId]: true }));

        try {
            // 1️⃣ Load messages
            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/messages/${chatId}`,
                { params: { myId: user._id } }
            );

            setMessages(prev => ({
                ...prev,
                [chatId]: res.data
            }));

            // 2️⃣ Mark messages as read via API
            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/messages/read/${chatId}`,
                { readerId: user._id }
            );

            // 3️⃣ Emit socket event for real-time blue ticks
            emitMarkAsRead(chatId);

            // 4️⃣ Reload messages to reflect updated read status
            const updated = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/messages/${chatId}`,
                { params: { myId: user._id } }
            );

            setMessages(prev => ({
                ...prev,
                [chatId]: updated.data
            }));

        } catch (err) {
            console.error("Load messages failed:", err);
        } finally {
            setLoadingMessages(prev => ({ ...prev, [chatId]: false }));
        }
    };





    /* =======================
       SEND MESSAGE
    ======================= */
    const sendMessage = async (chatId, { text = '', imageFile = null, videoFile = null }) => {
        if (!text.trim() && !imageFile && !videoFile) return;
        if (!user?._id) return;

        const tempMessage = {
            senderId: user._id,
            receiverId: chatId,
            text: text || '',
            image: imageFile ? URL.createObjectURL(imageFile) : null,
            video: videoFile ? URL.createObjectURL(videoFile) : null,
            createdAt: new Date().toISOString(),
            temp: true,
        };

        // Optimistic update
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
                // Replace temp message with server message
                setMessages(prev => ({
                    ...prev,
                    [chatId]: prev[chatId].map(msg =>
                        msg === tempMessage ? res.data : msg
                    ),
                }));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => ({
                ...prev,
                [chatId]: prev[chatId].map(msg =>
                    msg === tempMessage ? { ...msg, failed: true } : msg
                ),
            }));
        }
    };

    /* =======================
       SOCKET.IO
    ======================= */
    useEffect(() => {
        if (!user?._id) return;

        const socket = connectSocket(user._id, setOnlineUsers);

        // Deduplicate incoming messages
        // socket.on("newMessage", (msg) => {
        //     const chatId = msg.senderId === user._id ? msg.receiverId : msg.senderId;

        //     setMessages(prev => {
        //         const existing = prev[chatId] || [];
        //         // Skip if message already exists (by _id)
        //         if (existing.some(m => m._id === msg._id)) return prev;

        //         return {
        //             ...prev,
        //             [chatId]: [...existing, msg],
        //         };
        //     });
        // });

        socket.on("newMessage", (msg) => {
            const chatId =
                msg.senderId === user._id ? msg.receiverId : msg.senderId;

            setMessages(prev => {
                const existing = prev[chatId] || [];

                // 🔴 REMOVE optimistic temp message from same sender
                const filtered = existing.filter(
                    m => !(m.temp && m.senderId === msg.senderId)
                );

                // 🔴 Prevent true duplicates
                if (filtered.some(m => m._id === msg._id)) return prev;

                return {
                    ...prev,
                    [chatId]: [...filtered, msg],
                };
            });
        });

        socket.on("messagesRead", ({ byUserId }) => {
            setMessages(prev => {
                const updated = { ...prev };

                // Iterate all chats
                Object.keys(updated).forEach(chatId => {
                    updated[chatId] = updated[chatId].map(msg => {
                        // Only mark messages as read that are sent by me to the user who read them
                        if (msg.senderId === user._id && msg.receiverId === byUserId) {
                            return { ...msg, readistrue: true };
                        }
                        return msg;
                    });
                });

                return updated;
            });
        });


        // Listen for online users
        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });



        return () => disconnectSocket();
    }, [user?._id]);


    useEffect(() => {
        if (!activeChatId || !messages[activeChatId] || !user?._id) return;

        const unreadMessages = messages[activeChatId].filter(
            msg => msg.receiverId === user._id && !msg.readistrue
        );

        if (unreadMessages.length === 0) return;

        // 1️⃣ Optimistic update in local state
        setMessages(prev => ({
            ...prev,
            [activeChatId]: prev[activeChatId].map(msg =>
                msg.receiverId === user._id ? { ...msg, readistrue: true } : msg
            )
        }));

        // 2️⃣ Emit socket event to notify sender
        if (window.socket) {
            unreadMessages.forEach(msg => {
                window.socket.emit("markMessagesRead", {
                    chatUserId: msg.senderId, // sender
                    readerId: user._id        // current user
                });
            });
        }

        // 3️⃣ Optional: update backend API
        axios.put(
            `https://vizit-backend-hubw.onrender.com/api/messages/read/${activeChatId}`,
            { readerId: user._id }
        ).catch(err => console.error("Failed to mark messages read:", err));

    }, [activeChatId, messages, user?._id]);


    /* =======================
       INITIAL FLOW

    ======================= */
    useEffect(() => { decodeToken(); }, [decodeToken]);
    useEffect(() => { if (user?._id) fetchUsers(user._id); }, [user, fetchUsers]);


    /* =======================
       RENDER
    ======================= */
    return (
        <div className="App">
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
                reload={loadMessages}
                onActiveChatChange={(chatId) => setActiveChatId(chatId)}
                typingUsers={typingUsers}
            />
        </div>
    );
}

export default UserChatApp;











