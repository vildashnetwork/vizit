

import React from 'react';

function MessageBubble({ message, type }) {
    return (
        <div className={`ngn-message-bubble ngn-message-bubble--${type}`}>
            <div className="ngn-message-bubble__text">
                {message.text}
            </div>

            {/* Image preview */}
            {message.image && (
                <img
                    src={message.image}
                    alt="message attachment"
                    style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        display: 'block',
                        marginTop: '4px',
                    }}
                />
            )}

            {/* Video preview */}
            {message.video && (
                <div style={{ position: 'relative', marginTop: '4px' }}>
                    <video
                        src={message.video}
                        controls
                        style={{
                            maxWidth: '150px',
                            borderRadius: '8px',
                            display: 'block',
                        }}
                    />
                </div>
            )}

            <div className="ngn-message-bubble__meta">
                <span className="ngn-message-bubble__time">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </div>
    );
}

export default MessageBubble;
