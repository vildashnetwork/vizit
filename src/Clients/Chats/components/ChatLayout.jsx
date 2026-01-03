import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatMain from './ChatMain/ChatMain';

function ChatLayout({
    chats,
    messages,
    loadingChats,
    loadingMessages,
    onSelectChat,
    onSendMessage,
    setActiveTab
}) {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);
            if (mobile && activeChatId) {
                setSidebarVisible(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [activeChatId]);

    const handleChatSelect = (chatId) => {
        setActiveChatId(chatId);
        onSelectChat(chatId);

        if (isMobileView) {
            setSidebarVisible(false);
        }
    };

    const handleBackToChats = () => {
        setSidebarVisible(true);
    };

    const activeChat = chats.find(chat => chat.id === activeChatId);

    return (
        <div className="usd-chat-layout">
            <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                loading={loadingChats}
                isVisible={sidebarVisible}
                onChatSelect={handleChatSelect}
                setActiveTab={setActiveTab}
            />

            <ChatMain
                chat={activeChat}
                messages={messages[activeChatId] || []}
                loading={loadingMessages[activeChatId]}
                isMobileView={isMobileView}
                isVisible={!sidebarVisible || !isMobileView}
                onBack={handleBackToChats}
                onSendMessage={(text) => onSendMessage(activeChatId, text)}
            />
        </div>
    );
}

export default ChatLayout;