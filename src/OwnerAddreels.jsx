






// ReelsApp.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ReelsApp.css';

const API_BASE = "https://vizit-backend-hubw.onrender.com/api/reels"; // backend endpoint

// Main ReelsPage Component
const ReelsPage = ({ userhere }) => {
    const [reels, setReels] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const reelsContainerRef = useRef(null);

    // Fetch reels from backend
    const fetchReels = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/reels`);
            setReels(res.data.reels || []);
        } catch (error) {
            console.error("Error fetching reels:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReels();
    }, []);

    const handleNewReel = (newReel) => {
        setReels([newReel, ...reels]);
        setShowUpload(false);
        setCurrentReelIndex(0);
    };

    const handleScroll = () => {
        if (reelsContainerRef.current) {
            const container = reelsContainerRef.current;
            const scrollTop = container.scrollTop;
            const viewportHeight = container.clientHeight;
            const index = Math.round(scrollTop / viewportHeight);
            setCurrentReelIndex(index);
        }
    };

    return (
        <div className="nike-container">
            <header className="burberry-header">
                <h1 className="tommy-title">Reels</h1>
                <button className="gucci-btn primary" onClick={() => setShowUpload(true)}>
                    <span className="versace-icon">+</span> New Reel
                </button>
            </header>

            {showUpload && (
                <div className="armani-overlay">
                    <div className="fendi-modal">
                        <ReelUpload onPost={handleNewReel} userhere={userhere} onClose={() => setShowUpload(false)} />
                    </div>
                </div>
            )}

            <div
                className="puma-feed"
                ref={reelsContainerRef}
                onScroll={handleScroll}
            >
                {loading ? (
                    <ReelsLoader />
                ) : reels.length === 0 ? (
                    <div className="diesel-empty">
                        <div className="versace-shimmer"></div>
                        <p className="levis-text">No reels yet. Create your first one!</p>
                    </div>
                ) : (
                    reels.map((reel, index) => (
                        <ReelCard
                            key={reel._id}
                            reel={reel}
                            isActive={index === currentReelIndex}
                            userhere={userhere}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Reel Upload Component
const ReelUpload = ({ onPost, onClose, userhere }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    const [loading, setloading] = useState(false)
    const handlePost = async () => {
        if (!videoFile) return;

        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('upload_preset', 'vizit-video');

        try {
            setloading(true)
            // Upload to Cloudinary
            const uploadRes = await axios.post(
                `https://api.cloudinary.com/v1_1/dgigs6v72/video/upload`,
                formData
            );

            const videoUrl = uploadRes.data.secure_url;
            console.log({
                username: userhere?.name,
                postownerId: userhere?._id,
                caption,
                videoUrl,
                avatar: userhere?.profile
            })
            // Post reel to backend
            const reelRes = await axios.post(`${API_BASE}/post/reel`, {
                username: userhere?.name,
                postownerId: userhere?._id,
                caption,
                videoUrl,
                avatar: userhere?.profile
            });

            if (reelRes.data.reel) {
                onPost(reelRes.data.reel);
                resetForm();
            }

        } catch (error) {
            console.error("Error posting reel:", error);
        } finally {
            setloading(false)
        }
    };

    const resetForm = () => {
        setVideoFile(null);
        setCaption('');
        setPreviewUrl('');
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    };

    return (
        <div className="ralph-lauren-upload">
            <div className="hermes-header">
                <h2 className="givenchy-heading">Create New Reel</h2>
                <button className="gucci-btn ghost" onClick={onClose}>×</button>
            </div>

            <div className="valentino-content">
                {!previewUrl ? (
                    <div className="chloe-dropzone" onClick={() => fileInputRef.current.click()}>
                        <div className="balenciaga-icons large"><span className="versace-icon">📁</span></div>
                        <p className="calvin-text">Click to select video</p>
                        <p className="diesel-small">MP4, MOV, AVI up to 100MB</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="louis-input"
                        />
                    </div>
                ) : (
                    <ReelPreview videoUrl={previewUrl} onRemove={() => setPreviewUrl('')} />
                )}

                <textarea
                    className="zara-caption"
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                />

                <div className="celine-actions">
                    <button className="gucci-btn secondary" onClick={onClose}>Cancel</button>
                    <button className="gucci-btn primary" onClick={handlePost} disabled={!videoFile}>{loading ? "loading... " : "Post Reel"}</button>
                </div>
            </div>
        </div>
    );
};

// Reel Preview Component
const ReelPreview = ({ videoUrl, onRemove }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="saint-laurent-preview">
            <div className="ysl-header">
                <h3 className="kenzo-subtitle">Preview</h3>
                <button className="gucci-btn ghost small" onClick={onRemove}>Remove</button>
            </div>
            <div className="bottega-video-container">
                <video ref={videoRef} src={videoUrl} className="bvlgari-video" loop muted />
                <div className="cartier-controls">
                    <button className="prada-action" onClick={handlePlayPause}>
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reel Card Component
const ReelCard = ({ reel, isActive, userhere }) => {
    const videoRef = useRef(null);
    const cardRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reel.likes?.length || 0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (videoRef.current) {
                        if (entry.isIntersecting && isActive) videoRef.current.play().catch(() => { });
                        else videoRef.current.pause();
                    }
                });
            },
            { threshold: 0.8 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
    }, [isActive]);

    const handleLike = async () => {
        try {
            const userId = userhere?._id; // replace with logged in user
            const res = await axios.post(`${API_BASE}/reel/${reel._id}/like`, {
                id: userhere?.email,
                name: userhere?.name,
                email: userhere?.email,
                profile: userhere?.profile
            });
            setIsLiked(!isLiked);
            setLikeCount(res.data.likesCount || 0);
        } catch (error) {
            console.error("Error liking reel:", error);
        }
    };

    return (
        <div className="adidas-reel" ref={cardRef}>
            <video ref={videoRef} src={reel.videoUrl} className="fendi-video" loop muted playsInline />
            <div className="balmain-content">
                <div className="prada-sidebar">
                    <ReelActions isLiked={isLiked} likeCount={likeCount} onLike={handleLike} />
                </div>
                <div className="chloe-details">
                    <p className="zara-caption-display">{reel.caption}</p>
                </div>
            </div>
        </div>
    );
};

// Reel Actions Component
const ReelActions = ({ isLiked, likeCount, onLike }) => (
    <div className="balenciaga-icons">
        <button className={`prada-action ${isLiked ? 'liked' : ''}`} onClick={onLike}>
            <span className="versace-icon">{isLiked ? '❤️' : '🤍'}</span>
            <span className="moschino-count">{likeCount}</span>
        </button>
    </div>
);

// Loader Component
const ReelsLoader = () => (
    <div className="burberry-loader">
        <div className="versace-shimmer"></div>
        <div className="versace-shimmer"></div>
        <div className="versace-shimmer"></div>
    </div>
);

export default ReelsPage;
