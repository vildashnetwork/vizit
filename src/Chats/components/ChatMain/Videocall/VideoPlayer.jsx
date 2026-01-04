import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, name }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={name === "My Stream"}
                style={{ width: "300px", borderRadius: "8px" }}
            />
            <p className="text-center">{name}</p>
        </div>
    );
};

export default VideoPlayer;
