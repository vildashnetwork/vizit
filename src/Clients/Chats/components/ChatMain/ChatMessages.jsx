import React from 'react';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';

function ChatMessages({ messages, loading, messagesEndRef }) {
    const renderDateSeparator = (date) => (
        <div className="ngn-chat-messages__date">
            <span className="ngn-chat-messages__date-label">{date}</span>
        </div>
    );

    if (loading) {
        return (
            <div className="ngn-chat-messages">
                {renderDateSeparator('Today')}
                <MessageSkeleton type="received" />
                <MessageSkeleton type="sent" />
                <MessageSkeleton type="received" count={2} />
                <MessageSkeleton type="sent" count={3} />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="ngn-chat-messages">
                <div className="ngn-chat-empty-state">
                    <div className="ngn-chat-empty-state__icon">💬</div>
                    <h3 className="ngn-chat-empty-state__title">No messages yet</h3>
                    <p className="ngn-chat-empty-state__description">
                        Send your first message to start the conversation!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="ngn-chat-messages">
            {renderDateSeparator('Today')}

            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    type={message.sender === 'me' ? 'sent' : 'received'}
                />
            ))}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages;