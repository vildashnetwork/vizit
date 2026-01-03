import React from 'react';

function ChatSidebarHeader({ setActiveTab }) {

    return (
        <div className="gbp-chat-sidebar-header">
            <div className="gbp-chat-sidebar-header__profile">
                <div
                    className="gbp-chat-sidebar-header__avatar"
                    role="img"
                    aria-label="User avatar"
                >
                    JS
                </div>
                <span className="gbp-chat-sidebar-header__name">John Smith</span>
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
                    onClick={() => setActiveTab("feed")}
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