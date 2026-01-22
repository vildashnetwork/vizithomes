






import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatEmptyState from './ChatEmptyState';
import VideoCallPage from './Videocall/Videocall';

function ChatMain({
    chat,
    messages,
    loading,
    isMobileView,
    isVisible,
    onBack,
    onSendMessage,
    onlineUsers,
    user,
    reload,
    typingUsers
}) {
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!chat) {
        return (
            <div
                className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}
            >
                <ChatEmptyState />
            </div>
        );
    }
    // ChatInput.jsx


    const handleTyping = (text) => {
        if (!window.socket || !chat?._id) return;

        window.socket.emit("typing", {
            chatUserId: chat?._id,
            isTyping: text.length > 0, // true if typing
        });
    };



    // const handleSendMessage = (text, imageFile) => {
    //     if (!text.trim() && !imageFile) return;
    //     onSendMessage(text, imageFile); // pass both
    // };


    const handleSendMessage = ({ text = '', imageFile = null, videoFile = null }) => {
        // Require at least one type of content
        if (!text.trim() && !imageFile && !videoFile) return;

        // Pass all data to the parent handler
        onSendMessage({ text, imageFile, videoFile });


    };



    return (
        <div
            className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}
            role="main"
            aria-label="Chat conversation"
        >



            <ChatHeader typingUsers={typingUsers} user={user} chat={chat} isMobileView={isMobileView} onBack={onBack} onlineUsers={onlineUsers} />
            {/* <VideoCallPage
                remoteUserId={chat?._id}
                remoteUserName={chat.name}
            /> */}
            <ChatMessages reload={reload} messages={messages} loading={loading} messagesEndRef={messagesEndRef} myUserId={user?._id} />

            <ChatInput handleTyping={handleTyping} onSend={handleSendMessage} />
        </div>
    );
}

export default ChatMain;
