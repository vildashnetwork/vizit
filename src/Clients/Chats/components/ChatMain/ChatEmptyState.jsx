import React from 'react';

function ChatEmptyState() {
    return (
        <div
            className="ngn-chat-empty-state"
            role="status"
            aria-label="No chat selected"
        >
            <div className="ngn-chat-empty-state__icon">💭</div>
            <h2 className="ngn-chat-empty-state__title">WhatsApp Web</h2>
            <p className="ngn-chat-empty-state__description">
                Select a chat from the sidebar to start messaging,<br />
                or start a new conversation.
            </p>
        </div>
    );
}

export default ChatEmptyState;