




// // ChatListItem.jsx
// import React, { useEffect, useState } from 'react';

// function useLatestMessages(chats, userId) {
//     const [latestMessages, setLatestMessages] = useState({}); // { chatId: message }

//     useEffect(() => {
//         if (!chats || !chats.length || !userId) return;

//         const fetchLatest = async () => {
//             try {
//                 const newLatest = {};

//                 await Promise.all(
//                     chats.map(async (chat) => {
//                         try {
//                             const res = await axios.get(
//                                 `https://vizit-backend-hubw.onrender.com/api/messages/${chat._id}`,
//                                 { params: { myId: userId, limit: 1 } } // optional: add limit=1 in backend for optimization
//                             );

//                             if (res.status === 200 && res.data?.length) {
//                                 newLatest[chat._id] = res.data[res.data.length - 1];
//                             }
//                         } catch (err) {
//                             console.error("Failed to fetch latest message for chat:", chat._id, err);
//                         }
//                     })
//                 );

//                 setLatestMessages(newLatest);
//             } catch (err) {
//                 console.error("Error fetching latest messages:", err);
//             }
//         };

//         fetchLatest();
//     }, [chats, userId]);

//     return latestMessages;
// }
// function ChatListItem({ chat, isActive, onSelect, onlineUsers = [], typingUsers, messages }) {
//     const [online, setOnline] = useState(false);

//     useEffect(() => {
//         setOnline(onlineUsers.includes(chat._id));
//     }, [chat._id, onlineUsers]);

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' || e.key === ' ') onSelect(chat._id);
//     };

//     return (
//         <div
//             className={`nok-chat-list-item ${isActive ? 'nok-chat-list-item--active' : ''}`}
//             onClick={() => onSelect(chat._id)}
//             onKeyPress={handleKeyPress}
//             role="option"
//             aria-selected={isActive}
//             tabIndex={0}
//             aria-label={`Chat with ${chat.name}. Last message: ${chat.lastMessage}`}
//         >
//             <div
//                 className="nok-chat-list-item__avatar"
//                 style={{
//                     backgroundImage: `url(${chat?.profile})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                 }}
//             />
//             <div className="nok-chat-list-item__content">
//                 <div className="nok-chat-list-item__header">
//                     <span className="nok-chat-list-item__name">{chat.name}</span>
//                     {
//                         !typingUsers[chat?._id || chat?.id] ?
//                             (
//                                 online ? (
//                                     <span className="nok-chat-list-item__time" style={{ color: "#0a6114" }}>online</span>
//                                 ) : (
//                                     <span className="nok-chat-list-item__time" style={{ color: "#fd0d55" }}>offline</span>
//                                 )
//                             )
//                             :
//                             (
//                                 <div className="typing-indicator">
//                                     {chat?.name || "User"} is typing...
//                                 </div>
//                             )
//                     }

//                 </div>
//                 <div className="nok-chat-list-item__message">
//                     <span className="nok-chat-list-item__text">{useLatestMessages(chat?.id || chat?._id,
//                         localStorage.getItem("userId")
//                     )}</span>
//                     {chat.unread > 0 && (
//                         <span className="nok-chat-list-item__unread">{chat?.email}</span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ChatListItem;











// ChatListItem.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RedVerificationBadge from "./Badge"

function ChatListItem({ chat, isActive, onSelect, onlineUsers = [], typingUsers = {} }) {
    const [online, setOnline] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const userId = localStorage.getItem("userId");

    // Online status
    useEffect(() => {
        setOnline(onlineUsers.includes(chat._id));
    }, [chat._id, onlineUsers]);



    // Fetch last message + unread count
    useEffect(() => {
        if (!chat?._id || !userId) return;
        const fetchChatMeta = async () => {
            try {
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/messages/${chat._id}`,
                    { params: { myId: userId } }
                );

                if (res.status === 200 && Array.isArray(res.data)) {
                    const messages = res.data;

                    // last message
                    if (messages.length) {
                        setLastMessage(messages[messages.length - 1]);
                    }

                    // unread count (ONLY messages sent TO me)
                    const unread = messages.filter(
                        (m) =>
                            m.receiverId === userId &&
                            m.readistrue === false
                    ).length;

                    setUnreadCount(unread);
                }
            } catch (err) {
                console.error("Chat meta fetch failed:", err);
            }
        };
        fetchChatMeta();
    }, [chat._id, userId]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(chat._id);

    };

    const lastMessageText = lastMessage
        ? lastMessage.text
            ? lastMessage.text
            : lastMessage.image
                ? "📷 Image"
                : lastMessage.video
                    ? "🎥 Video"
                    : lastMessage.audio
                        ? "🎧 Audio"
                        : "Message"
        : "No messages yet";

    return (
        <div
            className={`nok-chat-list-item ${isActive ? "nok-chat-list-item--active" : ""}`}
            onClick={() => onSelect(chat._id)}
            onKeyPress={handleKeyPress}
            role="option"
            aria-selected={isActive}
            tabIndex={0}
        >
            <div
                className="nok-chat-list-item__avatar"
                style={{
                    backgroundImage: `url(${chat.profile})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            <div className="nok-chat-list-item__content">
                <div className="nok-chat-list-item__header">
                    <span className="nok-chat-list-item__name">{chat.name}
                        {
                            chat?.role == "owner" (
                        chat?.verified &&
                        <RedVerificationBadge/>


                            )
                        }
                    </span>

                    {!typingUsers[chat._id] ? (
                        online ? (
                            <span className="nok-chat-list-item__time" style={{ color: "#0a6114" }}>
                                online
                            </span>
                        ) : (
                            <span className="nok-chat-list-item__time" style={{ color: "#fd0d55" }}>
                                offline
                            </span>
                        )
                    ) : (
                        <span className="typing-indicator">typing...</span>
                    )}
                </div>

                <div className="nok-chat-list-item__message">
                    <span className="nok-chat-list-item__text">{lastMessageText?.slice(0, 40) + ".."}</span>

                    {unreadCount > 0 && (
                        <span className="nok-chat-list-item__unread">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;
