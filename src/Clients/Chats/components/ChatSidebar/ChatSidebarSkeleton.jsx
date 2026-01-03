import React from 'react';

function ChatSidebarSkeleton({ count = 5 }) {
    return (
        <div className="chf-chat-list">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="zar-chat-sidebar-skeleton">
                    <div className="zar-chat-sidebar-skeleton__header">
                        <div className="zar-chat-sidebar-skeleton__avatar zar-chat-skeleton"></div>
                        <div className="zar-chat-sidebar-skeleton__content">
                            <div className="zar-chat-sidebar-skeleton__name zar-chat-skeleton"></div>
                            <div className="zar-chat-sidebar-skeleton__message zar-chat-skeleton"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatSidebarSkeleton;