





// // ChatLayout.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import ChatSidebar from './ChatSidebar/ChatSidebar';
// import ChatMain from './ChatMain/ChatMain';
// import VideoCallPage from './ChatMain/Videocall/Videocall';
// import axios from 'axios';


// function ChatLayout({
//     chats = [],
//     messages = {},
//     loadingChats = false,
//     loadingMessages = {},
//     onSelectChat = () => { },
//     onSendMessage = () => { },
//     setActiveTab,
//     user,
//     isOnline,
//     onlineUsers = [],
//     reload
// }) {
//     const [activeChatId, setActiveChatId] = useState(null);
//     const [isMobileView, setIsMobileView] = useState(false);
//     const [sidebarVisible, setSidebarVisible] = useState(true);

//     // Ref to track whether we've already synced URL once
//     const hasSyncedUrlRef = useRef(false);

//     // ---------- Helpers ----------
//     const getAuthFromUrl = useCallback(() => {
//         if (typeof window === 'undefined') return null;
//         try {
//             const url = new URL(window.location.href);
//             const authParam = url.searchParams.get('auth');
//             return authParam?.trim() || null;
//         } catch {
//             return null;
//         }
//     }, []);

//     const setAuthInUrl = useCallback((chatId, { replace = false } = {}) => {
//         if (typeof window === 'undefined') return;
//         try {
//             const url = new URL(window.location.href);
//             if (chatId) url.searchParams.set('auth', chatId);
//             else url.searchParams.delete('auth');
//             if (replace) window.history.replaceState({}, '', url.toString());
//             else window.history.pushState({}, '', url.toString());
//         } catch { }
//     }, []);

//     // ---------- Responsive layout ----------
//     useEffect(() => {
//         const handleResize = () => {
//             const mobile = window.innerWidth <= 768;
//             setIsMobileView(mobile);
//             if (mobile && activeChatId) setSidebarVisible(false);
//             else setSidebarVisible(true);
//         };
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [activeChatId]);

//     // ---------- Sync chat from URL param once ----------
//     useEffect(() => {
//         if (hasSyncedUrlRef.current) return; // already synced
//         if (!chats.length) return; // wait until chats are loaded

//         const authId = getAuthFromUrl();
//         if (authId && chats.some(c => (c._id || c.id) === authId)) {
//             setActiveChatId(authId);
//             try { onSelectChat(authId); } catch { }
//             hasSyncedUrlRef.current = true; // mark as synced
//         }
//     }, [chats, getAuthFromUrl, onSelectChat]);

//     // ---------- Handle browser back/forward ----------
//     useEffect(() => {
//         const handlePopState = () => {
//             const authId = getAuthFromUrl();
//             if (authId && chats.some(c => (c._id || c.id) === authId)) {
//                 setActiveChatId(authId);
//                 try { onSelectChat(authId); } catch { }
//                 // Don't toggle sidebar, let user control it
//             } else {
//                 setActiveChatId(null);
//             }
//         };
//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [chats, getAuthFromUrl, onSelectChat]);

//     // ---------- User selects a chat ----------
//     const handleChatSelect = useCallback(
//         (chatId) => {
//             if (!chatId || chatId === activeChatId) return;
//             setActiveChatId(chatId);
//             setAuthInUrl(chatId); // update URL param
//             try { onSelectChat(chatId); } catch { }
//             if (isMobileView) setSidebarVisible(false);
//         },
//         [activeChatId, onSelectChat, isMobileView, setAuthInUrl]
//     );

//     const handleBackToChats = () => {
//         setActiveChatId(null);
//         setAuthInUrl(null); // remove auth from URL
//         setSidebarVisible(true);
//     };

//     // ---------- Active chat & messages ----------
//     const activeChat = chats.find(c => (c._id || c.id) === activeChatId) || null;
//     const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
//     const chatLoading = activeChatId ? loadingMessages[activeChatId] || false : false;
//     const storedRole = localStorage.getItem("role");

//     const [loading, setLoading] = useState(true);
//     const [usern, setuser] = useState([])
//     useEffect(() => {

//         async function decodeTokenAndConnect() {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token || !storedRole) {
//                     setLoading(false);
//                     return;
//                 }

//                 const endpoint =
//                     storedRole === "owner"
//                         ? "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner"
//                         : "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user";

//                 const response = await axios.get(endpoint, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.status === 200) {
//                     const userna =
//                         storedRole === "owner"
//                             ? response.data?.res
//                             : response.data?.user;
//                     setuser(userna)

//                 }
//             } catch (err) {
//                 console.error("Token decode failed:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         decodeTokenAndConnect();
//     }, [storedRole]);


//     const [iscall, setiscall] = useState(false)

//     let remoteUserId = localStorage.getItem("remoteUserId")
//     let remoteUserName = localStorage.getItem("remoteUserName")



//     // In ChatLayout or ChatMain
//     // useEffect(() => {
//     //     if (!activeChatId || !messages[activeChatId] || !user?._id) return;

//     //     const unreadMessages = messages[activeChatId].filter(
//     //         msg => msg.receiverId === user._id && !msg.readistrue
//     //     );

//     //     if (unreadMessages.length === 0) return;

//     //     // Optimistic update in local state
//     //     setMessages(prev => ({
//     //         ...prev,
//     //         [activeChatId]: prev[activeChatId].map(msg =>
//     //             msg.receiverId === user._id ? { ...msg, readistrue: true } : msg
//     //         )
//     //     }));

//     //     // Emit socket event to notify sender in real-time
//     //     if (window.socket) {
//     //         unreadMessages.forEach(msg => {
//     //             window.socket.emit("markMessagesRead", {
//     //                 chatUserId: msg.senderId, // sender of message
//     //                 readerId: user._id        // current user
//     //             });
//     //         });
//     //     }
//     // }, [activeChatId, messages, user?._id]);


//     return (
//         <div className="usd-chat-layout">
//             {/* {iscall && <VideoCallPage
//                 remoteUserId={remoteUserId}
//                 remoteUserName={remoteUserName}
//                 setiscall={setiscall}
//             />
//             } */}
//             <ChatSidebar
//                 chats={chats}
//                 activeChatId={activeChatId}
//                 loading={loadingChats}
//                 isVisible={sidebarVisible}
//                 onChatSelect={handleChatSelect}
//                 setActiveTab={setActiveTab}
//                 user={user}
//                 isOnline={isOnline}
//                 onlineUsers={onlineUsers}
//             />

//             <ChatMain
//                 chat={activeChat}
//                 messages={chatMessages}
//                 loading={chatLoading}
//                 isMobileView={isMobileView}
//                 isVisible={!sidebarVisible || !isMobileView}
//                 onBack={handleBackToChats}
//                 onSendMessage={({ text, imageFile, videoFile }) =>
//                     onSendMessage(activeChatId, { text, imageFile, videoFile })
//                 }
//                 onlineUsers={onlineUsers}
//                 currentUserId={user?._id}
//                 user={user}
//                 reload={reload}

//             />
//         </div>
//     );
// }

// export default ChatLayout;























// ChatLayout.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatMain from './ChatMain/ChatMain';

function ChatLayout({
    chats = [],
    messages = {},
    loadingChats = false,
    loadingMessages = {},
    onSelectChat = () => { },
    onSendMessage = () => { },
    setActiveTab,
    user,
    isOnline,
    onlineUsers = [],
    reload,
    onActiveChatChange = () => { }
}) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const hasSyncedUrlRef = useRef(false);

    // ---------- Helpers for URL ----------
    const getAuthFromUrl = useCallback(() => {
        if (typeof window === 'undefined') return null;
        try {
            const url = new URL(window.location.href);
            return url.searchParams.get('auth')?.trim() || null;
        } catch {
            return null;
        }
    }, []);

    const setAuthInUrl = useCallback((chatId, { replace = false } = {}) => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            if (chatId) url.searchParams.set('auth', chatId);
            else url.searchParams.delete('auth');
            if (replace) window.history.replaceState({}, '', url.toString());
            else window.history.pushState({}, '', url.toString());
        } catch { }
    }, []);

    // ---------- Responsive layout ----------
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);
            if (mobile && activeChatId) setSidebarVisible(false);
            else setSidebarVisible(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeChatId]);

    // ---------- Sync chat from URL param once ----------
    useEffect(() => {
        if (hasSyncedUrlRef.current) return;
        if (!chats.length) return;

        const authId = getAuthFromUrl();
        if (authId && chats.some(c => (c._id || c.id) === authId)) {
            setActiveChatId(authId);
            try { onSelectChat(authId); } catch { }
            onActiveChatChange(authId);
            hasSyncedUrlRef.current = true;
        }
    }, [chats, getAuthFromUrl, onSelectChat, onActiveChatChange]);

    // ---------- Handle browser back/forward ----------
    useEffect(() => {
        const handlePopState = () => {
            const authId = getAuthFromUrl();
            if (authId && chats.some(c => (c._id || c.id) === authId)) {
                setActiveChatId(authId);
                try { onSelectChat(authId); } catch { }
                onActiveChatChange(authId);
            } else {
                setActiveChatId(null);
                onActiveChatChange(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [chats, getAuthFromUrl, onSelectChat, onActiveChatChange]);

    // ---------- User selects a chat ----------
    const handleChatSelect = useCallback(
        (chatId) => {
            if (!chatId || chatId === activeChatId) return;
            setActiveChatId(chatId);
            setAuthInUrl(chatId);
            try { onSelectChat(chatId); } catch { }
            onActiveChatChange(chatId);
            if (isMobileView) setSidebarVisible(false);
        },
        [activeChatId, onSelectChat, isMobileView, setAuthInUrl, onActiveChatChange]
    );

    const handleBackToChats = () => {
        setActiveChatId(null);
        setAuthInUrl(null);
        onActiveChatChange(null);
        setSidebarVisible(true);
    };

    // ---------- Active chat & messages ----------
    const activeChat = chats.find(c => (c._id || c.id) === activeChatId) || null;
    const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
    const chatLoading = activeChatId ? loadingMessages[activeChatId] || false : false;

    return (
        <div className="usd-chat-layout">
            <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                loading={loadingChats}
                isVisible={sidebarVisible}
                onChatSelect={handleChatSelect}
                setActiveTab={setActiveTab}
                user={user}
                isOnline={isOnline}
                onlineUsers={onlineUsers}
            />

            <ChatMain
                chat={activeChat}
                messages={chatMessages}
                loading={chatLoading}
                isMobileView={isMobileView}
                isVisible={!sidebarVisible || !isMobileView}
                onBack={handleBackToChats}
                onSendMessage={({ text, imageFile, videoFile }) =>
                    onSendMessage(activeChatId, { text, imageFile, videoFile })
                }
                onlineUsers={onlineUsers}
                currentUserId={user?._id}
                user={user}
                reload={reload}
            />
        </div>
    );
}

export default ChatLayout;
