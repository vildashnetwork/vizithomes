import React from 'react';
import RedVerificationBadge from "./Badge"

function ChatSidebarHeader({ setActiveTab, user }) {


    return (
        <div className="gbp-chat-sidebar-header">
            <div className="gbp-chat-sidebar-header__profile">
                <div
                    className="gbp-chat-sidebar-header__avatar"
                    role="img"
                    style={{
                        backgroundImage: `url(${user?.profile})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                    aria-label="User avatar"
                >

                </div>
                <span className="gbp-chat-sidebar-header__name">
                    {/* {user?.name} */}
               {/* 1. Safe slice: prevent error if user or name is undefined */}
{user?.name ? (user.name.length > 6 ? user.name.slice(0, 6) + "..." : user.name) : "Guest"}

{/* 2. Verification check */}
{
  user?.role === "owner" && user?.verified && (
    <RedVerificationBadge />
  )
}
                    </span>
            </div>
            <div className="gbp-chat-sidebar-header__actions">
                <button
                    className="gbp-chat-sidebar-header__icon"
                    aria-label="Status"
                    role="button"
                >
                    <ion-icon name="chatbox-outline"></ion-icon>
                </button>
                <button
                    className="gbp-chat-sidebar-header__icon"
                    aria-label="New chat"
                    role="button"
                    onClick={() => setActiveTab("properties")}
                >
                    <ion-icon name="add-circle-outline"></ion-icon>
                </button>
                <button
                    className="gbp-chat-sidebar-header__icon"
                    aria-label="Menu"
                    role="button"
                >
                    ⋮
                </button>
            </div>
        </div>
    );
}

export default ChatSidebarHeader;