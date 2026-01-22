

// ChatSidebar.jsx
import React, { useState, useMemo, useEffect } from 'react';
import ChatSidebarHeader from './ChatSidebarHeader';
import ChatSearch from './ChatSearch';
import ChatList from './ChatList';
import ChatSidebarSkeleton from './ChatSidebarSkeleton';
import axios from "axios"
function ChatSidebar({
    chats = [],
    activeChatId,
    loading = false,
    isVisible = true,
    onChatSelect,
    setActiveTab,
    user,
    isOnline,
    onlineUsers,
    typingUsers,
    messages
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const [userchatids, setuserchatids] = useState([])

    const fetchchatids = async () => {
        try {
            const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/all/chats/id/${user?._id}`)
            if (res.status == 200) {
                setuserchatids(res.data.allchatsId)
                console.log('====================================');
                console.log(userchatids);
                console.log('====================================');
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchchatids()
    }, [user])

    // Filter chats based on search query (name or last message)
    const filteredChats = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return chats;

        return chats.filter(chat =>
            chat.name.toLowerCase().includes(query) ||
            chat.lastMessage?.toLowerCase().includes(query)
        );
    }, [chats, searchQuery]);

    return (
        <aside
            className={`eur-chat-sidebar ${isVisible ? 'eur-chat-sidebar--visible' : 'eur-chat-sidebar--hidden'}`}
            role="complementary"
            aria-label="Chat list sidebar"
        >
            {/* Header with user info and optional settings */}
            <ChatSidebarHeader setActiveTab={setActiveTab} user={user} />

            {/* Search input */}
            <ChatSearch value={searchQuery} onChange={setSearchQuery} />

            {/* Chat list or skeleton loader */}
            {loading ? (
                <ChatSidebarSkeleton count={5} />
            ) : (
                <ChatList
                    chats={filteredChats}
                    activeChatId={activeChatId}
                    onChatSelect={onChatSelect}
                    isOnline={isOnline}
                    user={user}
                    onlineUsers={onlineUsers}
                    typingUsers={typingUsers}
                    messages={messages}
                />
            )}
        </aside>
    );
}

export default ChatSidebar;
