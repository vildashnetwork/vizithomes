







import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatMain from './ChatMain/ChatMain';
import VideoCallPage from "../../../Chats/components/ChatMain/Videocall/Videocall"
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
    const remoteUserId = localStorage.getItem("remoteUserId")
    const remoteUserName = localStorage.getItem("remoteUserName")

    return (
        <div className="usd-chat-layout">

            <VideoCallPage
                remoteUserId={remoteUserId}
                remoteUserName={remoteUserName}
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
