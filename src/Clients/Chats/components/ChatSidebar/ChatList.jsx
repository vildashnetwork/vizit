import React from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ chats, activeChatId, onChatSelect }) {
    if (chats.length === 0) {
        return (
            <div
                className="chf-chat-list"
                role="listbox"
                aria-label="Chat list"
            >
                <div className="chf-chat-list__empty">
                    No chats found. Start a new conversation!
                </div>
            </div>
        );
    }

    return (
        <div
            className="chf-chat-list"
            role="listbox"
            aria-label="Chat list"
            tabIndex={0}
        >
            {chats.map(chat => (
                <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={() => onChatSelect(chat.id)}
                />
            ))}
        </div>
    );
}

export default ChatList;