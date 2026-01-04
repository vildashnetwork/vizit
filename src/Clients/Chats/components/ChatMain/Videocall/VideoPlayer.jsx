
import React, { useEffect, useRef } from "react";

const VideoPlayer = ({
    stream,
    name,
    isRemote = false,
    isVideoOff = false,
    isSmall = false
}) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!stream) return;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        if (isRemote && audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.muted = false;
            audioRef.current.volume = 1;

            audioRef.current
                .play()
                .catch(err =>
                    console.warn("Remote audio autoplay blocked:", err)
                );
        }
    }, [stream, isRemote]);

    return (
        <div className={`video-player ${isRemote ? "remote" : "local"} ${isSmall ? "small" : ""}`}>
            <div className="video-wrapper">
                {isVideoOff ? (
                    <div className="video-off-placeholder">
                        <div className="placeholder-avatar">
                            {name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <p>Camera Off</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={!isRemote}
                        className="video-element"
                    />
                )}
            </div>

            {isRemote && <audio ref={audioRef} autoPlay playsInline />}

            <div className="video-overlay">
                <span className="user-name">{name}</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
