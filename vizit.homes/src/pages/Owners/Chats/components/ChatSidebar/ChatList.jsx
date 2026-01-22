



// ChatList.jsx
import React from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ chats = [], activeChatId, onChatSelect, onlineUsers = [], typingUsers }) {
    if (!chats.length) {
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
            {chats.map(chat => {
                const chatId = chat._id || chat.id;
                return (
                    <ChatListItem
                        key={chatId}
                        chat={chat}
                        isActive={chatId === activeChatId}
                        onSelect={onChatSelect}
                        onlineUsers={onlineUsers}
                        typingUsers={typingUsers}
                    />
                );
            })}
        </div>
    );
}

export default ChatList;
