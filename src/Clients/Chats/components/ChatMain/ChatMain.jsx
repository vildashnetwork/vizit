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
    onSendMessage
}) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!chat) {
        return (
            <div className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}>
                <ChatEmptyState />
            </div>
        );
    }

    const handleSendMessage = (text) => {
        onSendMessage(text);
    };

    return (
        <div
            className={`gbp-chat-main ${isVisible ? 'gbp-chat-main--visible' : 'gbp-chat-main--hidden'}`}
            role="main"
            aria-label="Chat conversation"
        >
            <ChatHeader
                chat={chat}
                isMobileView={isMobileView}
                onBack={onBack}
            />

            <ChatMessages
                messages={messages}
                loading={loading}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput onSend={handleSendMessage} />
        </div>
    );
}

export default ChatMain;