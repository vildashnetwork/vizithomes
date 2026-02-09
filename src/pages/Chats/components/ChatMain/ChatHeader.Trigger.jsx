import React from 'react';

// Usage: <ChatHeaderTrigger remoteUserId={chat._id} remoteUserName={chat.name} />
export default function ChatHeaderTrigger({ remoteUserId, remoteUserName }) {
  const onCall = () => {
    const detail = { remoteUserId, remoteUserName };
    window.dispatchEvent(new CustomEvent('TRIGGER_OUTGOING_CALL', { detail }));
  };

  return (
    <button className="gbp-chat-sidebar-header__icon" aria-label="Start Call" onClick={onCall}>
      📹 Call
    </button>
  );
}
