
// import React, { useEffect, useRef } from "react";

// const VideoPlayer = ({
//     stream,
//     name,
//     isRemote = false,
//     isVideoOff = false,
//     isSmall = false
// }) => {
//     const videoRef = useRef(null);
//     const audioRef = useRef(null);

//     useEffect(() => {
//         if (!stream) return;

//         if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//         }

//         if (isRemote && audioRef.current) {
//             audioRef.current.srcObject = stream;
//             audioRef.current.muted = false;
//             audioRef.current.volume = 1;

//             audioRef.current
//                 .play()
//                 .catch(err =>
//                     console.warn("Remote audio autoplay blocked:", err)
//                 );
//         }
//     }, [stream, isRemote]);

//     return (
//         <div className={`video-player ${isRemote ? "remote" : "local"} ${isSmall ? "small" : ""}`}>
//             <div className="video-wrapper">
//                 {isVideoOff ? (
//                     <div className="video-off-placeholder">
//                         <div className="placeholder-avatar">
//                             {name?.charAt(0)?.toUpperCase() || "U"}
//                         </div>
//                         <p>Camera Off</p>
//                     </div>
//                 ) : (
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted={!isRemote}
//                         className="video-element"
//                     />
//                 )}
//             </div>

//             {isRemote && <audio ref={audioRef} autoPlay playsInline />}

//             <div className="video-overlay">
//                 <span className="user-name">{name}</span>
//             </div>
//         </div>
//     );
// };

// export default VideoPlayer;



















// VideoPlayer.jsx
import React, { useEffect, useRef } from "react";

/**
 * Single-purpose video/audio player.
 * - For remote: pass videoStream (MediaStream) and audioStream (MediaStream) and isRemote={true}
 * - For local: pass videoStream only (muted)
 */
const VideoPlayer = ({
    videoStream = null,
    audioStream = null,
    name = "",
    isRemote = false,
    isSmall = false
}) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (videoStream) {
            // attach video stream
            videoRef.current.srcObject = videoStream;
            // attempt play (some browsers require user gesture)
            videoRef.current
                .play()
                .catch(() => {
                    /* ignore autoplay block */
                });
        } else {
            videoRef.current.srcObject = null;
        }
    }, [videoStream]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (audioStream) {
            audioRef.current.srcObject = audioStream;
            audioRef.current.muted = false;
            audioRef.current.volume = 1;
            audioRef.current
                .play()
                .catch(() => {
                    /* autoplay blocked -> will play after user gesture */
                });
        } else {
            audioRef.current.srcObject = null;
        }
    }, [audioStream]);

    return (
        <div className={`video-player ${isRemote ? "remote" : "local"} ${isSmall ? "small" : ""}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isRemote} // local should be muted locally to avoid echo
                className="video-element"
                style={{ width: isSmall ? 160 : "100%", height: "auto", borderRadius: 8 }}
                aria-label={isRemote ? `${name} remote video` : `${name} local video`}
            />

            {isRemote && (
                // Single dedicated audio element for remote audio (prevents double playback)
                <audio ref={audioRef} autoPlay playsInline aria-label={`${name} remote audio`} />
            )}

            <div className="video-overlay" aria-hidden>
                <span className="user-name">{name}</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
