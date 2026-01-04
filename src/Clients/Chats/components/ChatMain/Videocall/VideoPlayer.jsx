
// import React, { useEffect, useRef } from 'react';

// const VideoPlayer = ({ stream, name, isRemote = false, isVideoOff = false }) => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//         if (videoRef.current && stream) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);

//     const handleVideoError = (e) => {
//         console.error("Video error:", e);
//         // Handle video error (show placeholder, retry, etc.)
//     };

//     return (
//         <div className={`video-player ${isRemote ? 'remote' : 'local'}`}>
//             <div className="video-wrapper">
//                 {isVideoOff ? (
//                     <div className="video-off-placeholder">
//                         <div className="placeholder-avatar">
//                             {name?.charAt(0).toUpperCase() || 'U'}
//                         </div>
//                         <p className="placeholder-text">Camera is off</p>
//                     </div>
//                 ) : (
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted={!isRemote}
//                         onError={handleVideoError}
//                         className="video-element"
//                     />
//                 )}
//             </div>

//             <div className="video-overlay">
//                 <div className="user-info">
//                     <span className="user-name">{name}</span>
//                     {!isRemote && (
//                         <span className="video-status">
//                             {isVideoOff ? 'Camera off' : 'Camera on'}
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoPlayer;



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

        // Attach stream to video
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        // Attach stream to audio ONLY for remote user
        if (isRemote && audioRef.current) {
            audioRef.current.srcObject = stream;
            audioRef.current.muted = false;

            // Required for some browsers
            audioRef.current
                .play()
                .catch(err => console.warn("Audio autoplay blocked:", err));
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
                        muted={!isRemote}   // 🔑 Local muted, remote NOT muted
                        className="video-element"
                    />
                )}
            </div>

            {/* 🔊 Dedicated audio element for REMOTE stream */}
            {isRemote && <audio ref={audioRef} autoPlay playsInline />}

            <div className="video-overlay">
                <span className="user-name">{name}</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
