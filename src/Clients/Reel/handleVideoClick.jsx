// components/ReelItem.js
import React, { useRef, useState } from 'react';
import ReelHeader from './ReelHeader';
import ReelActions from './ReelActions';
import ReelComments from './ReelComments';


const ReelItem = ({ reel, onLike }) => {
    const videoRef = useRef(null);
    const [showComments, setShowComments] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handleLikeClick = () => {
        onLike(reel.id);
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
    };

    const handleShareClick = () => {
        // In a real app, this would trigger a share dialog
        console.log(`Sharing ${reel.username}'s video!`);
    };

    return (
        <div className="samosa-reel-item">
            {/* Video container */}
            <div className="biryani-video-container">
                {!videoLoaded && (
                    <div className="biryani-video-shimmer"></div>
                )}
                <video
                    ref={videoRef}
                    className="biryani-video"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onClick={handleVideoClick}
                    onLoadedData={() => setVideoLoaded(true)}
                >
                    <source src={reel.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Video overlay controls */}
                <div className="rogan-josh-overlay">
                    <button className="tandoori-play-btn" onClick={handleVideoClick}>
                        <span className="korma-icon">▶</span>
                    </button>
                </div>

                {/* Video loading indicator */}
                {!videoLoaded && (
                    <div className="dal-makhani-loading">
                        <div className="malai-spinner"></div>
                        <p className="jeera-text">Loading video...</p>
                    </div>
                )}
            </div>

            {/* Reel content */}
            <div className="paneer-content">
                <ReelHeader
                    username={reel.username}
                    caption={reel.caption}
                    avatar={reel.avatar}
                    timestamp={reel.timestamp}
                />

                <ReelActions
                    likes={reel.likes}
                    comments={reel.comments}
                    shares={reel.shares}
                    liked={reel.liked}
                    onLike={handleLikeClick}
                    onComment={handleCommentClick}
                    onShare={handleShareClick}
                />
            </div>

            {/* Comments section */}
            {showComments && (
                <ReelComments
                    reelId={reel.id}
                    commentCount={reel.comments}
                />
            )}
        </div>
    );
};

export default ReelItem;