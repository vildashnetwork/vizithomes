







import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatMain from './ChatMain/ChatMain';
import VideoCallPage from "../../../Chats/components/ChatMain/Videocall/Videocall"
import axios from 'axios';
function ChatLayout({
    chats,
    messages,
    loadingChats,
    loadingMessages,
    onSelectChat,
    onSendMessage,
    setActiveTab,
    user,
    isOnline,
    onlineUsers
}) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Responsive layout handler
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);

            // Auto-hide sidebar in mobile when a chat is active
            if (mobile && activeChatId) setSidebarVisible(false);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeChatId]);

    const handleChatSelect = (chatId) => {
        setActiveChatId(chatId);
        onSelectChat(chatId);

        if (isMobileView) setSidebarVisible(false);
    };

    const handleBackToChats = () => setSidebarVisible(true);

    const activeChat = chats.find(chat => chat._id === activeChatId);
    const storedRole = localStorage.getItem("role");

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

    return (
        <div className="usd-chat-layout">

            <VideoCallPage
                remoteUserId={usern?._id}
                remoteUserName={usern?.name}
            />
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

            {/* <ChatMain
                chat={activeChat}
                messages={messages[activeChatId] || []}
                loading={loadingMessages[activeChatId]}
                isMobileView={isMobileView}
                isVisible={!sidebarVisible || !isMobileView}
                onBack={handleBackToChats}
                onSendMessage={(text) => onSendMessage(activeChatId, text)}
                onlineUsers={onlineUsers}
            /> */}

            <ChatMain
                chat={activeChat}
                messages={messages[activeChatId] || []}
                loading={loadingMessages[activeChatId]}
                isMobileView={isMobileView}
                isVisible={!sidebarVisible || !isMobileView}
                onBack={handleBackToChats}

                // onSendMessage={(text, imageFile) => onSendMessage(activeChatId, text, imageFile)}
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
