import React from 'react';
import MessageBubble from './MessageBubble';
import MessageSkeleton from './MessageSkeleton';


function ChatMessages({ messages, loading, messagesEndRef, myUserId }) {
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
            </div>
        );
    }

    if (!messages || messages.length === 0) {
        return (
            <div className="ngn-chat-messages">
                <div className="ngn-chat-empty-state">
                    <div className="ngn-chat-empty-state__icon">💬</div>
                    <h3>No messages yet</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="ngn-chat-messages">
            {renderDateSeparator('Today')}

            {messages.map((message) => {
                const isMine = message.senderId === myUserId;

                return (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        type={isMine ? 'sent' : 'received'}
                    />
                );
            })}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages;






