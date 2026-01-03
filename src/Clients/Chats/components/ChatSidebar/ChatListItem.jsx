import React from 'react';

function ChatListItem({ chat, isActive, onSelect }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onSelect();
        }
    };

    return (
        <div
            className={`nok-chat-list-item ${isActive ? 'nok-chat-list-item--active' : ''}`}
            onClick={onSelect}
            onKeyPress={handleKeyPress}
            role="option"
            aria-selected={isActive}
            tabIndex={0}
            aria-label={`Chat with ${chat.name}. Last message: ${chat.lastMessage}`}
        >
            <div className="nok-chat-list-item__avatar">
                {chat.avatarText}
            </div>
            <div className="nok-chat-list-item__content">
                <div className="nok-chat-list-item__header">
                    <span className="nok-chat-list-item__name">
                        {chat.name}
                    </span>
                    <span className="nok-chat-list-item__time">
                        {chat.timestamp}
                    </span>
                </div>
                <div className="nok-chat-list-item__message">
                    <span className="nok-chat-list-item__text">
                        {chat.lastMessage}
                    </span>
                    {chat.unread > 0 && (
                        <span className="nok-chat-list-item__unread">
                            {chat.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;