// import React, { useEffect, useRef } from 'react';

// const VideoPlayer = ({ stream, name, cal }) => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//         if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);

//     return (
//         <div>
//             <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted={name === "My Stream"}
//                 style={{ width: "300px", borderRadius: "8px" }}
//             />
//             <p className="text-center">{name}</p>
//         </div>
//     );
// };

// export default VideoPlayer;


import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, name, isRemote = false, isVideoOff = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleVideoError = (e) => {
        console.error("Video error:", e);
        // Handle video error (show placeholder, retry, etc.)
    };

    return (
        <div className={`video-player ${isRemote ? 'remote' : 'local'}`}>
            <div className="video-wrapper">
                {isVideoOff ? (
                    <div className="video-off-placeholder">
                        <div className="placeholder-avatar">
                            {name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <p className="placeholder-text">Camera is off</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={!isRemote}
                        onError={handleVideoError}
                        className="video-element"
                    />
                )}
            </div>

            <div className="video-overlay">
                <div className="user-info">
                    <span className="user-name">{name}</span>
                    {!isRemote && (
                        <span className="video-status">
                            {isVideoOff ? 'Camera off' : 'Camera on'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;