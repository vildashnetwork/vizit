import React, { useState } from 'react';
import ChatSidebarHeader from './ChatSidebarHeader';
import ChatSearch from './ChatSearch';
import ChatList from './ChatList';
import ChatSidebarSkeleton from './ChatSidebarSkeleton';

function ChatSidebar({
    chats,
    activeChatId,
    loading,
    isVisible,
    onChatSelect,
    setActiveTab
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`eur-chat-sidebar ${isVisible ? 'eur-chat-sidebar--visible' : 'eur-chat-sidebar--hidden'}`}
            role="complementary"
            aria-label="Chat list sidebar"
        >
            <ChatSidebarHeader setActiveTab={setActiveTab} />
            <ChatSearch
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {loading ? (
                <ChatSidebarSkeleton count={5} />
            ) : (
                <ChatList
                    chats={filteredChats}
                    activeChatId={activeChatId}
                    onChatSelect={onChatSelect}
                />
            )}
        </div>
    );
}

export default ChatSidebar;