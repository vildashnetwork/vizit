import React from 'react';

function ChatSearch({ value, onChange }) {
    return (
        <div className="jpy-chat-search">
            <div className="jpy-chat-search__container">
                <span
                    className="jpy-chat-search__icon"
                    aria-hidden="true"
                >
                    <ion-icon name="search-outline"></ion-icon>
                </span>
                <input
                    type="text"
                    className="jpy-chat-search__input"
                    placeholder="Search or start new chat"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-label="Search chats"
                />
            </div>
        </div>
    );
}

export default ChatSearch;