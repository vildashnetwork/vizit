






import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatEmptyState from './ChatEmptyState';

function ChatMain({
    chat,
    messages,
    loading,
    isMobileView,
    isVisible,
    onBack,
    onSendMessage,
    onlineUsers,
    user
}) {
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!chat) {
        return (
            <div
                className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}
            >
                <ChatEmptyState />
            </div>
        );
    }

    // const handleSendMessage = (text, imageFile) => {
    //     if (!text.trim() && !imageFile) return;
    //     onSendMessage(text, imageFile); // pass both
    // };


    const handleSendMessage = ({ text = '', imageFile = null, videoFile = null }) => {
        // Require at least one type of content
        if (!text.trim() && !imageFile && !videoFile) return;

        // Pass all data to the parent handler
        onSendMessage({ text, imageFile, videoFile });
    };



    return (
        <div
            className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}
            role="main"
            aria-label="Chat conversation"
        >
            <ChatHeader user={user} chat={chat} isMobileView={isMobileView} onBack={onBack} onlineUsers={onlineUsers} />

            <ChatMessages messages={messages} loading={loading} messagesEndRef={messagesEndRef} myUserId={user?._id} />

            <ChatInput onSend={handleSendMessage} />
        </div>
    );
}

export default ChatMain;
