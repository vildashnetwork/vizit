import React, { useEffect, useState } from 'react';

function ChatListItem({ chat, isActive, onSelect, onlineUsers }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
    };

    const [online, setOnline] = useState(false);

    useEffect(() => {
        setOnline(onlineUsers.includes(chat._id));
    }, [chat._id, onlineUsers]);

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
            <div
                className="nok-chat-list-item__avatar"
                style={{
                    backgroundImage: `url(${chat?.profile})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <div className="nok-chat-list-item__content">
                <div className="nok-chat-list-item__header">
                    <span className="nok-chat-list-item__name">{chat.name}</span>

                    {online ? <span className="nok-chat-list-item__time" style={{ color: "#0a6114" }}>online</span> :
                        <span className="nok-chat-list-item__time" style={{ color: "#fd0d55" }}>offline</span>}

                </div>
                <div className="nok-chat-list-item__message">
                    <span className="nok-chat-list-item__text">{chat.email}</span>
                    {chat.unread > 0 && (
                        <span className="nok-chat-list-item__unread">{chat?.email}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatListItem;
