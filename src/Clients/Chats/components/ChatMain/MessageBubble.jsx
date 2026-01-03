import React from 'react';

function MessageBubble({ message, type }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return '✓';
            case 'delivered':
                return '✓✓';
            case 'read':
                return '✓✓';
            default:
                return '';
        }
    };

    return (
        <div
            className={`ngn-message-bubble ngn-message-bubble--${type}`}
            role="article"
            aria-label={`Message ${type === 'sent' ? 'sent by you' : 'received'}: ${message.text}`}
        >
            <div className="ngn-message-bubble__text">
                {message.text}
            </div>
            <div className="ngn-message-bubble__meta">
                <span className="ngn-message-bubble__time">
                    {message.timestamp}
                </span>
                {type === 'sent' && (
                    <span className="ngn-message-bubble__status">
                        {getStatusIcon(message.status)}
                    </span>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;