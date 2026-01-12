







// import React, { useState, useEffect } from 'react';
// import ChatSidebar from './ChatSidebar/ChatSidebar';
// import ChatMain from './ChatMain/ChatMain';
// import VideoCallPage from "../../../Chats/components/ChatMain/Videocall/Videocall"
// import axios from 'axios';
// function ChatLayout({
//     chats,
//     messages,
//     loadingChats,
//     loadingMessages,
//     onSelectChat,
//     onSendMessage,
//     setActiveTab,
//     user,
//     isOnline,
//     onlineUsers
// }) {
//     const [activeChatId, setActiveChatId] = useState(null);
//     const [isMobileView, setIsMobileView] = useState(false);
//     const [sidebarVisible, setSidebarVisible] = useState(true);

//     // Responsive layout handler
//     useEffect(() => {
//         const handleResize = () => {
//             const mobile = window.innerWidth <= 768;
//             setIsMobileView(mobile);

//             // Auto-hide sidebar in mobile when a chat is active
//             if (mobile && activeChatId) setSidebarVisible(false);
//         };

//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [activeChatId]);

//     const handleChatSelect = (chatId) => {
//         setActiveChatId(chatId);
//         onSelectChat(chatId);

//         if (isMobileView) setSidebarVisible(false);
//     };

//     const handleBackToChats = () => setSidebarVisible(true);

//     const activeChat = chats.find(chat => chat._id === activeChatId);
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

//     return (
//         <div className="usd-chat-layout">

//             <VideoCallPage
//                 remoteUserId={usern?._id}
//                 remoteUserName={usern?.name}
//             />
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

//             {/* <ChatMain
//                 chat={activeChat}
//                 messages={messages[activeChatId] || []}
//                 loading={loadingMessages[activeChatId]}
//                 isMobileView={isMobileView}
//                 isVisible={!sidebarVisible || !isMobileView}
//                 onBack={handleBackToChats}
//                 onSendMessage={(text) => onSendMessage(activeChatId, text)}
//                 onlineUsers={onlineUsers}
//             /> */}

//             <ChatMain
//                 chat={activeChat}
//                 messages={messages[activeChatId] || []}
//                 loading={loadingMessages[activeChatId]}
//                 isMobileView={isMobileView}
//                 isVisible={!sidebarVisible || !isMobileView}
//                 onBack={handleBackToChats}

//                 // onSendMessage={(text, imageFile) => onSendMessage(activeChatId, text, imageFile)}
//                 onSendMessage={({ text, imageFile, videoFile }) =>
//                     onSendMessage(activeChatId, { text, imageFile, videoFile })
//                 }

//                 onlineUsers={onlineUsers}
//                 currentUserId={user?._id}
//                 user={user}
//             />

//         </div>
//     );
// }

// export default ChatLayout;























// import React, { useState, useEffect } from 'react';
// import ChatSidebar from './ChatSidebar/ChatSidebar';
// import ChatMain from './ChatMain/ChatMain';
// function ChatLayout({
//     chats,
//     messages,
//     loadingChats,
//     loadingMessages,
//     onSelectChat,
//     onSendMessage,
//     setActiveTab,
//     user,
//     isOnline,
//     onlineUsers
// }) {
//     const [activeChatId, setActiveChatId] = useState(null);
//     const [isMobileView, setIsMobileView] = useState(false);
//     const [sidebarVisible, setSidebarVisible] = useState(true);

//     // Responsive layout handler
//     useEffect(() => {
//         const handleResize = () => {
//             const mobile = window.innerWidth <= 768;
//             setIsMobileView(mobile);

//             // Auto-hide sidebar in mobile when a chat is active
//             if (mobile && activeChatId) setSidebarVisible(false);
//         };

//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [activeChatId]);

//     const handleChatSelect = (chatId) => {
//         setActiveChatId(chatId);
//         onSelectChat(chatId);

//         if (isMobileView) setSidebarVisible(false);
//     };

//     const handleBackToChats = () => setSidebarVisible(true);

//     const activeChat = chats.find(chat => chat._id === activeChatId);
//     return (
//         <div className="usd-chat-layout">
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

//             {/* <ChatMain
//                 chat={activeChat}
//                 messages={messages[activeChatId] || []}
//                 loading={loadingMessages[activeChatId]}
//                 isMobileView={isMobileView}
//                 isVisible={!sidebarVisible || !isMobileView}
//                 onBack={handleBackToChats}
//                 onSendMessage={(text) => onSendMessage(activeChatId, text)}
//                 onlineUsers={onlineUsers}
//             /> */}

//             <ChatMain
//                 chat={activeChat}
//                 messages={messages[activeChatId] || []}
//                 loading={loadingMessages[activeChatId]}
//                 isMobileView={isMobileView}
//                 isVisible={!sidebarVisible || !isMobileView}
//                 onBack={handleBackToChats}

//                 // onSendMessage={(text, imageFile) => onSendMessage(activeChatId, text, imageFile)}
//                 onSendMessage={({ text, imageFile, videoFile }) =>
//                     onSendMessage(activeChatId, { text, imageFile, videoFile })
//                 }

//                 onlineUsers={onlineUsers}
//                 currentUserId={user?._id}
//                 user={user}
//             />

//         </div>
//     );
// }

// export default ChatLayout;























// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import ChatSidebar from './ChatSidebar/ChatSidebar';
// import ChatMain from './ChatMain/ChatMain';

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
//     onlineUsers = []
// }) {
//     const [activeChatId, setActiveChatId] = useState(null);
//     const [isMobileView, setIsMobileView] = useState(false);
//     const [sidebarVisible, setSidebarVisible] = useState(true);

//     const hasSyncedUrlRef = useRef(false); // ensure URL is read only once

//     // ---------- Helpers ----------
//     const getAuthFromUrl = useCallback(() => {
//         if (typeof window === 'undefined') return null;
//         try {
//             const url = new URL(window.location.href);
//             const authParam = url.searchParams.get('auth');
//             return authParam?.trim() || null;
//         } catch { return null; }
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

//     // ---------- Initial URL sync (once) ----------
//     useEffect(() => {
//         if (hasSyncedUrlRef.current) return;
//         const authId = getAuthFromUrl();
//         if (authId && chats.some(c => (c._id || c.id) === authId)) {
//             setActiveChatId(authId);
//             try { onSelectChat(authId); } catch { }
//         }
//         hasSyncedUrlRef.current = true;
//     }, [chats, getAuthFromUrl, onSelectChat]);

//     // ---------- Browser back/forward ----------
//     useEffect(() => {
//         const handlePopState = () => {
//             const authId = getAuthFromUrl();
//             if (authId && chats.some(c => (c._id || c.id) === authId)) {
//                 setActiveChatId(authId);
//                 try { onSelectChat(authId); } catch { }
//             } else {
//                 setActiveChatId(null);
//             }
//         };
//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [chats, getAuthFromUrl, onSelectChat]);

//     // ---------- User selects chat ----------
//     const handleChatSelect = useCallback((chatId) => {
//         if (!chatId || chatId === activeChatId) return;
//         setActiveChatId(chatId);
//         setAuthInUrl(chatId);
//         try { onSelectChat(chatId); } catch { }
//         if (isMobileView) setSidebarVisible(false);
//     }, [activeChatId, onSelectChat, isMobileView, setAuthInUrl]);

//     const handleBackToChats = () => {
//         setActiveChatId(null);
//         setAuthInUrl(null);
//         setSidebarVisible(true);
//     };

//     // ---------- Active chat & messages ----------
//     const activeChat = chats.find(c => (c._id || c.id) === activeChatId) || null;
//     const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
//     const chatLoading = activeChatId ? loadingMessages[activeChatId] || false : false;

//     return (
//         <div className="usd-chat-layout">
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
//             />
//         </div>
//     );
// }

// export default ChatLayout;













// ChatLayout.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatMain from './ChatMain/ChatMain';
import VideoCallPage from '../../Chats/components/ChatMain/Videocall/Videocall';
import axios from 'axios';


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
    onlineUsers = []
}) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Ref to track whether we've already synced URL once
    const hasSyncedUrlRef = useRef(false);

    // ---------- Helpers ----------
    const getAuthFromUrl = useCallback(() => {
        if (typeof window === 'undefined') return null;
        try {
            const url = new URL(window.location.href);
            const authParam = url.searchParams.get('auth');
            return authParam?.trim() || null;
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
        if (hasSyncedUrlRef.current) return; // already synced
        if (!chats.length) return; // wait until chats are loaded

        const authId = getAuthFromUrl();
        if (authId && chats.some(c => (c._id || c.id) === authId)) {
            setActiveChatId(authId);
            try { onSelectChat(authId); } catch { }
            hasSyncedUrlRef.current = true; // mark as synced
        }
    }, [chats, getAuthFromUrl, onSelectChat]);

    // ---------- Handle browser back/forward ----------
    useEffect(() => {
        const handlePopState = () => {
            const authId = getAuthFromUrl();
            if (authId && chats.some(c => (c._id || c.id) === authId)) {
                setActiveChatId(authId);
                try { onSelectChat(authId); } catch { }
                // Don't toggle sidebar, let user control it
            } else {
                setActiveChatId(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [chats, getAuthFromUrl, onSelectChat]);

    // ---------- User selects a chat ----------
    const handleChatSelect = useCallback(
        (chatId) => {
            if (!chatId || chatId === activeChatId) return;
            setActiveChatId(chatId);
            setAuthInUrl(chatId); // update URL param
            try { onSelectChat(chatId); } catch { }
            if (isMobileView) setSidebarVisible(false);
        },
        [activeChatId, onSelectChat, isMobileView, setAuthInUrl]
    );

    const handleBackToChats = () => {
        setActiveChatId(null);
        setAuthInUrl(null); // remove auth from URL
        setSidebarVisible(true);
    };

    // ---------- Active chat & messages ----------
    const activeChat = chats.find(c => (c._id || c.id) === activeChatId) || null;
    const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
    const chatLoading = activeChatId ? loadingMessages[activeChatId] || false : false;
    const storedRole = localStorage.getItem("role");
    const [iscall, setiscall] = useState(false)
    const [loading, setLoading] = useState(true);
    const [usern, setuser] = useState([])
    useEffect(() => {

        async function decodeTokenAndConnect() {
            try {
                const token = localStorage.getItem("token");
                if (!token || !storedRole) {
                    setLoading(false);
                    return;
                }

                const endpoint =
                    storedRole === "owner"
                        ? "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner"
                        : "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user";

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const userna =
                        storedRole === "owner"
                            ? response.data?.res
                            : response.data?.user;
                    setuser(userna)

                }
            } catch (err) {
                console.error("Token decode failed:", err);
            } finally {
                setLoading(false);
            }
        }

        decodeTokenAndConnect();
    }, [storedRole]);


    let remoteUserId = localStorage.getItem("remoteUserId")
    let remoteUserName = localStorage.getItem("remoteUserName")


    return (
        <div className="usd-chat-layout">

            {/* {iscall && <VideoCallPage
                remoteUserId={remoteUserId}
                remoteUserName={remoteUserName}
                setiscall={setiscall}
            />
            } */}
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
            />
        </div>
    );
}

export default ChatLayout;
