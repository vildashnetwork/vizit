import React, { useState, useRef, useEffect } from 'react';

function ChatInput({ onSend }) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <form
            className="jpy-chat-input"
            onSubmit={handleSubmit}
            aria-label="Message input"
        >
            <div className="jpy-chat-input__container">
                <div className="jpy-chat-input__actions">
                    <button
                        type="button"
                        className="jpy-chat-input__action"
                        aria-label="Emoji picker"
                    >
                        <ion-icon name="bag-remove-outline"></ion-icon>
                    </button>
                    <button
                        type="button"
                        className="jpy-chat-input__action"
                        aria-label="Attach file"
                    >
                        <ion-icon name="cloud-upload-outline"></ion-icon>
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    className="jpy-chat-input__field"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    aria-label="Message text"
                />

                <button
                    type="submit"
                    className="jpy-chat-input__send"
                    disabled={!message.trim()}
                    aria-label="Send message"
                >
                    <ion-icon name="send-outline"></ion-icon>
                </button>
            </div>
        </form>
    );
}

export default ChatInput;