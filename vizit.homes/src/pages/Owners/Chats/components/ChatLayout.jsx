




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
    onActiveChatChange = () => { },
    typingUsers
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
                typingUsers={typingUsers}
            />
        </div>
    );
}

export default ChatLayout;
