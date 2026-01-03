import React from 'react';

function MessageSkeleton({ type = 'received', count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`zar-message-skeleton zar-message-skeleton--${type}`}
                    aria-hidden="true"
                >
                    <div className="zar-message-skeleton__text zar-chat-skeleton"></div>
                    <div className="zar-message-skeleton__text zar-chat-skeleton"></div>
                    <div className="zar-message-skeleton__meta zar-chat-skeleton"></div>
                </div>
            ))}
        </>
    );
}

export default MessageSkeleton;