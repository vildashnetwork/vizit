import React, { useEffect, useState } from 'react';
import VideoCall from "./Videocall/Videocall"

function ChatHeader({ chat, isMobileView, onBack, onlineUsers }) {
    // user

    const [online, setOnline] = useState(false);

    useEffect(() => {
        setOnline(onlineUsers.includes(chat._id));
    }, [chat._id, onlineUsers]);

    return (
        <div className="gbp-chat-header">
            {isMobileView && (
                <button
                    className="gbp-chat-header__back"
                    onClick={onBack}
                    aria-label="Back to chat list"
                >
                    ←
                </button>
            )}
            {console.log("my chat id", chat?._id)
            }




            <div className="gbp-chat-header__info">
                <div
                    className="gbp-chat-header__avatar"
                    role="img"
                    style={{
                        backgroundImage: `url(${chat?.profile})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                    aria-label={`${chat.name}'s avatar`}
                >

                </div>
                <div className="gbp-chat-header__details">
                    <h2 className="gbp-chat-header__name">{chat.name}</h2>
                    {online ? <span className="nok-chat-list-item__time" style={{ color: "#0a6114" }}>online</span> :
                        <span className="nok-chat-list-item__time" style={{ color: "#fd0d55" }}>offline</span>}
                </div>
            </div>

            <div className="gbp-chat-header__actions">

                <VideoCall
                    remoteUserId={chat?._id}
                    remoteUserName={chat.name}
                />
                <button
                    className="gbp-chat-sidebar-header__icon"
                    aria-label="Menu"
                    role="button"
                >
                    ⋮
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;