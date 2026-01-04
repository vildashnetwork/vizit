

// ChatSidebar.jsx
import React, { useState, useMemo } from 'react';
import ChatSidebarHeader from './ChatSidebarHeader';
import ChatSearch from './ChatSearch';
import ChatList from './ChatList';
import ChatSidebarSkeleton from './ChatSidebarSkeleton';

function ChatSidebar({
    chats = [],
    activeChatId,
    loading = false,
    isVisible = true,
    onChatSelect,
    setActiveTab,
    user,
    isOnline,
    onlineUsers
}) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter chats based on search query (name or last message)
    const filteredChats = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return chats;

        return chats.filter(chat =>
            chat.name.toLowerCase().includes(query) ||
            chat.lastMessage?.toLowerCase().includes(query)
        );
    }, [chats, searchQuery]);

    return (
        <aside
            className={`eur-chat-sidebar ${isVisible ? 'eur-chat-sidebar--visible' : 'eur-chat-sidebar--hidden'}`}
            role="complementary"
            aria-label="Chat list sidebar"
        >
            {/* Header with user info and optional settings */}
            <ChatSidebarHeader setActiveTab={setActiveTab} user={user} />

            {/* Search input */}
            <ChatSearch value={searchQuery} onChange={setSearchQuery} />

            {/* Chat list or skeleton loader */}
            {loading ? (
                <ChatSidebarSkeleton count={5} />
            ) : (
                <ChatList
                    chats={filteredChats}
                    activeChatId={activeChatId}
                    onChatSelect={onChatSelect}
                    isOnline={isOnline}
                    user={user}
                    onlineUsers={onlineUsers}
                />
            )}
        </aside>
    );
}

export default ChatSidebar;
