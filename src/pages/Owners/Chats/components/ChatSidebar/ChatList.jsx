import React from "react";
import ChatListItem from "./ChatListItem";

/**
 * ChatList Component
 * Renders a list of chat conversations, filtered by the IDs present in the user's profile.
 */
function ChatList({
    chats = [],
    activeChatId,
    user,
    onChatSelect,
    onlineUsers = [],
    typingUsers = {},
    messages = {}
}) {
    // 1. Resolve the ID array, checking for both lowercase and uppercase casing
    // This ensures that the filter doesn't fail due to MongoDB schema variations
    const rawIds = user?.allchatsId || user?.allChatsId || [];
    
    const userChatIds = Array.isArray(rawIds)
        ? [...new Set(rawIds.map(id => String(id)))]
        : [];

    // 2. Handle Empty State
    // We only show "No chats found" if the backend returned an empty array
    if (!chats || chats.length === 0) {
        return (
            <div className="chf-chat-list" role="listbox" aria-label="Chat list">
                <div className="chf-chat-list__empty">
                    No chats found. Start a new conversation!
                </div>
            </div>
        );
    }

    return (
        <div className="chf-chat-list" role="listbox" aria-label="Chat list">
            {chats
                .filter(chat => {
                    // Safety check: if userChatIds is empty but chats exists, 
                    // it might be a sync delay. In that case, we show the chats 
                    // the backend sent us anyway to prevent a blank screen.
                    if (userChatIds.length === 0 && chats.length > 0) return true;

                    const chatId = String(chat?._id || chat?.id);
                    return userChatIds.includes(chatId);
                })
                .map(chat => {
                    const chatId = String(chat._id || chat.id);

                    return (
                        <ChatListItem
                            key={chatId}
                            chat={chat}
                            isActive={chatId === String(activeChatId)}
                            onSelect={onChatSelect}
                            onlineUsers={onlineUsers}
                            typingUsers={typingUsers}
                            messages={messages}
                        />
                    );
                })}
        </div>
    );
}

export default ChatList;