


// ChatList.jsx
import React from 'react';
import ChatListItem from './ChatListItem';

function ChatList({ chats = [], activeChatId, onChatSelect, isOnline, user, onlineUsers }) {
    // Show empty state if no chats
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
            {chats.map(chat => {
                // Use _id consistently for selection
                const chatId = chat._id || chat.id;
                return (
                    <ChatListItem
                        key={chatId}
                        chat={chat}
                        isActive={chatId === activeChatId}
                        onSelect={() => onChatSelect(chatId)}
                        isOnline={isOnline}
                        onlineUsers={onlineUsers}
                    />
                );
            })}
        </div>
    );
}

export default ChatList;
