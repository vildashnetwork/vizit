import React from 'react';

function ChatHeader({ chat, isMobileView, onBack }) {
    return (
        <div className="gbp-chat-header">
            {isMobileView && (
                <button
                    className="gbp-chat-header__back"
                    onClick={onBack}
                    aria-label="Back to chat list"
                >
                    ←
                </button>
            )}

            <div className="gbp-chat-header__info">
                <div
                    className="gbp-chat-header__avatar"
                    role="img"
                    aria-label={`${chat.name}'s avatar`}
                >
                    {chat.avatarText}
                </div>
                <div className="gbp-chat-header__details">
                    <h2 className="gbp-chat-header__name">{chat.name}</h2>
                    <div className="gbp-chat-header__status">
                        {chat.online ? 'Online' : 'Last seen recently'}
                    </div>
                </div>
            </div>

            <div className="gbp-chat-header__actions">
                <button
                    className="gbp-chat-sidebar-header__icon"
                    aria-label="Search conversation"
                    role="button"
                >
                    <ion-icon name="search-outline"></ion-icon>
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

export default ChatHeader;