

import React, { useState, useRef, useEffect } from "react";

function ChatInput({ onSend }) {
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUploading, setVideoUploading] = useState(false);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !imageFile && !videoFile) return;

        // Upload video first if selected
        if (videoFile) {
            setVideoUploading(true);
            // Simulate upload delay, replace with real upload
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setVideoUploading(false);
        }

        // Send everything together
        onSend({ text: message.trim(), imageFile, videoFile });

        // Reset inputs
        setMessage("");
        setImageFile(null);
        setVideoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <form className="jpy-chat-input" onSubmit={handleSubmit} aria-label="Message input">
            <div className="jpy-chat-input__container">
                <div className="jpy-chat-input__actions">
                    {/* Emoji button */}
                    <button type="button" className="jpy-chat-input__action" aria-label="Emoji picker">
                        <ion-icon name="happy-outline"></ion-icon>
                    </button>

                    {/* File attach button */}
                    <button
                        type="button"
                        className="jpy-chat-input__action"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Attach file"
                    >
                        <ion-icon name="cloud-upload-outline"></ion-icon>
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*,video/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (file.type.startsWith("image/")) setImageFile(file);
                            else if (file.type.startsWith("video/")) setVideoFile(file);
                        }}
                    />
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
                    disabled={!message.trim() && !imageFile && !videoFile}
                    aria-label="Send message"
                >
                    <ion-icon name="send-outline"></ion-icon>
                </button>
            </div>

            {/* Preview attached image */}
            {imageFile && (
                <div className="jpy-chat-input__image-preview">
                    <img src={URL.createObjectURL(imageFile)} alt="preview" style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        display: 'block',
                        marginTop: '4px',
                    }} />
                    <button type="button" onClick={() => setImageFile(null)}>✕</button>
                </div>
            )}

            {/* Preview attached video */}
            {videoFile && (
                <div className="jpy-chat-input__video-preview" style={{ position: "relative" }}>
                    {videoUploading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(0,0,0,0.5)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                zIndex: 2,
                            }}
                        >
                            Uploading...
                        </div>
                    )}
                    <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        style={{
                            width: "100px",
                            height: "150px",
                            borderRadius: "8px",
                            display: "block",
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "#f44336",
                            border: "none",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </form>
    );
}

export default ChatInput;
