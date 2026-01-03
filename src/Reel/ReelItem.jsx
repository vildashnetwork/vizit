



// // components/ReelItem.js
// import React, { useEffect, useRef, useState } from 'react';
// import ReelHeader from './ReelHeade';
// import ReelActions from './ReelActions';
// import ReelComments from './ReelComments';
// import { formatTime } from './formatTime';
// import axios from 'axios';
// import { getSocket } from "../../src/backendauth/socketconnect";


// const ReelItem = ({ reel, onLike, user }) => {
//     const videoRef = useRef(null);

//     const [showComments, setShowComments] = useState(false);
//     const [videoLoaded, setVideoLoaded] = useState(false);
//     const [commentsnumber, setnumbercomments] = useState([]);
//     const [likesnumber, setnumberlikes] = useState([]);
//     const [islike, setislike] = useState(false);
//     const [share, setshare] = useState([])
//     const [hasshared, sethasshared] = useState(false);
//     const [issharing, setissharing] = useState(false);

//     const checklike = (likesArray) => {
//         if (!user?._id || !Array.isArray(likesArray)) return;

//         const hasLiked = likesArray.some(
//             (like) => String(like.id) === String(user._id)
//         );

//         setislike(hasLiked);
//     };

//     const getall = async () => {
//         try {
//             const res = await axios.get(
//                 `https://vizit-backend-hubw.onrender.com/api/reels/reel/${reel?._id}`
//             );

//             if (res.status === 200) {
//                 const likes = res.data?.reel?.likes || [];
//                 const comments = res.data?.reel?.comments || [];
//                 const shares = res.data?.reel?.shares || [];
//                 console.log(user)
//                 setnumberlikes(likes);
//                 setnumbercomments(comments);
//                 setshare(shares)
//                 checklike(likes);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         if (reel?._id && user?._id) {
//             getall();
//         }
//     }, [reel?._id, user?._id]);

//     const handleVideoClick = () => {
//         if (!videoRef.current) return;

//         videoRef.current.paused
//             ? videoRef.current.play()
//             : videoRef.current.pause();
//     };

//     const handleLikeClick = async () => {
//         // Optimistic UI update
//         setislike((prev) => !prev);

//         setnumberlikes((prev) =>
//             islike
//                 ? prev.filter((l) => String(l.id) !== String(user._id))
//                 : [...prev, { id: user._id }]
//         );

//         try {
//             await onLike(reel?._id);
//         } catch {
//             getall(); // rollback on failure
//         }
//     };

//     const handleCommentClick = () => {
//         setShowComments((prev) => !prev);
//     };
//     const handleShareClick = async () => {
//         if (!user?._id || issharing) return;

//         setissharing(true);

//         try {
//             // Optimistic UI update
//             sethasshared((prev) => !prev);
//             setshare((prev) => {
//                 if (hasshared) {
//                     // Remove share
//                     return prev.filter((s) => String(s.id) !== String(user._id));
//                 } else {
//                     // Add share
//                     return [...prev, { id: user._id, name: user.name }];
//                 }
//             });

//             // API call to share/unshare
//             const response = await axios.post(
//                 `https://vizit-backend-hubw.onrender.com/api/like/reel/${reel._id}/share`,
//                 {
//                     id: user._id,
//                     name: user.name
//                 }
//             );

//             console.log("Share response:", response.data);

//             // If you want to trigger share dialog after successful share
//             if (response.data.success && !hasshared) {
//                 // Trigger native share dialog if available
//                 if (navigator.share && window.innerWidth < 768) {
//                     try {
//                         await navigator.share({
//                             title: `Check out ${reel.username}'s reel!`,
//                             text: reel.caption,
//                             url: window.location.href,
//                         });
//                     } catch (shareError) {
//                         console.log("Native share cancelled:", shareError);
//                     }
//                 } else {
//                     // Fallback: Copy link to clipboard
//                     const reelUrl = `${window.location.origin}/reel/${reel._id}`;
//                     navigator.clipboard.writeText(reelUrl)
//                         .then(() => {
//                             // Show toast or alert
//                             alert('Link copied to clipboard!');
//                         })
//                         .catch(err => {
//                             console.error('Failed to copy:', err);
//                         });
//                 }
//             }

//         } catch (error) {
//             console.error("Share error:", error);
//             // Rollback on error
//             sethasshared((prev) => !prev);
//             setshare((prev) => {
//                 if (hasshared) {
//                     return [...prev, { id: user._id, name: user.name }];
//                 } else {
//                     return prev.filter((s) => String(s.id) !== String(user._id));
//                 }
//             });

//             // Show error message
//             alert('Failed to share. Please try again.');
//         } finally {
//             setissharing(false);
//         }
//     };


//     return (
//         <div className="samosa-reel-item">
//             {/* Video container */}
//             <div className="biryani-video-container">
//                 {!videoLoaded && (
//                     <div className="biryani-video-shimmer"></div>
//                 )}
//                 <video
//                     ref={videoRef}
//                     className="biryani-video"
//                     loop
//                     muted
//                     playsInline
//                     preload="metadata"
//                     onClick={handleVideoClick}
//                     onLoadedData={() => setVideoLoaded(true)}
//                 >
//                     <source src={reel.videoUrl} type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video>

//                 {/* Video overlay controls */}
//                 <div className="rogan-josh-overlay">
//                     <button
//                         className="tandoori-play-btn"
//                         onClick={handleVideoClick}
//                     >
//                         <span className="korma-icon">▶</span>
//                     </button>
//                 </div>

//                 {/* Video loading indicator */}
//                 {!videoLoaded && (
//                     <div className="dal-makhani-loading">
//                         <div className="malai-spinner"></div>
//                         <p className="jeera-text">Loading video...</p>
//                     </div>
//                 )}
//             </div>

//             {/* Reel content */}
//             <div className="paneer-content">
//                 <ReelHeader
//                     username={reel.username}
//                     caption={reel.caption}
//                     avatar={reel.avatar}
//                     timestamp={formatTime(reel.createdAt)}
//                 />

//                 <ReelActions
//                     likes={likesnumber.length}
//                     likesnumber={likesnumber}
//                     comments={commentsnumber.length}
//                     shares={share.length}
//                     liked={reel.liked}
//                     islike={islike}
//                     getall={getall}
//                     hasshared={hasshared}
//                     onLike={handleLikeClick}
//                     onComment={handleCommentClick}
//                     onShare={handleShareClick}
//                 />
//             </div>

//             {/* Comments section */}
//             {showComments && (
//                 <ReelComments
//                     reelId={reel._id}
//                     commentCount={commentsnumber.length}
//                     onClose={handleCommentClick}
//                     user={user}
//                 />
//             )}
//         </div>
//     );
// };

// export default ReelItem;
















// components/ReelItem.js
import React, { useEffect, useRef, useState } from 'react';
import ReelHeader from './ReelHeade';
import ReelActions from './ReelActions';
import ReelComments from './ReelComments';
import { formatTime } from './formatTime';
import axios from 'axios';
import { getSocket } from "../../src/backendauth/socketconnect";

const ReelItem = ({ reel, onLike, user, onReelDeleted }) => {
    const videoRef = useRef(null);
    const socket = getSocket();

    const [showComments, setShowComments] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [commentsnumber, setnumbercomments] = useState([]);
    const [likesnumber, setnumberlikes] = useState([]);
    const [islike, setislike] = useState(false);
    const [share, setshare] = useState([]);

    /* =========================
       INITIAL FETCH
    ========================= */
    const getall = async () => {
        try {
            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/reels/reel/${reel?._id}`
            );

            const { likes = [], comments = [], shares = [] } = res.data.reel || {};

            setnumberlikes(likes);
            setnumbercomments(comments);
            setshare(shares);

            setislike(likes.some(like => String(like.id) === String(user?._id)));
        } catch (err) {
            console.error("Failed to fetch reel data:", err);
        }
    };

    useEffect(() => {
        if (reel?._id && user?._id) {
            getall();
        }
    }, [reel?._id, user?._id]);

    /* =========================
       REAL-TIME SOCKET LISTENERS
    ========================= */
    useEffect(() => {
        if (!socket) return;

        // 🔥 Like updates
        const handleLikeUpdated = ({ reelId, likes }) => {
            if (reelId !== reel._id) return;
            setnumberlikes(likes);
            setislike(likes.some(like => String(like.id) === String(user?._id)));
        };

        // 🔥 New comment added
        const handleCommentAdded = ({ reelId, comment }) => {
            if (reelId !== reel._id) return;
            setnumbercomments(prev => [comment, ...prev]);
        };

        // 🔥 Reel deleted
        const handleSocketReelDeleted = ({ reelId }) => {
            if (reelId === reel._id && onReelDeleted) {
                onReelDeleted(reelId);
            }
        };

        socket.on("reel:likeUpdated", handleLikeUpdated);
        socket.on("reel:commentAdded", handleCommentAdded);
        socket.on("reel:deleted", handleSocketReelDeleted);

        return () => {
            socket.off("reel:likeUpdated", handleLikeUpdated);
            socket.off("reel:commentAdded", handleCommentAdded);
            socket.off("reel:deleted", handleSocketReelDeleted);
        };
    }, [socket, reel._id, user?._id, onReelDeleted]);

    /* =========================
       UI HANDLERS
    ========================= */
    const handleVideoClick = () => {
        if (!videoRef.current) return;
        videoRef.current.paused
            ? videoRef.current.play()
            : videoRef.current.pause();
    };

    const handleLikeClick = async () => {
        setislike(prev => !prev);
        setnumberlikes(prev =>
            islike
                ? prev.filter(l => String(l.id) !== String(user._id))
                : [...prev, { id: user._id, name: user.name }]
        );

        try {
            await onLike(reel._id);
        } catch {
            getall(); // rollback if API fails
        }
    };

    const handleCommentClick = () => {
        setShowComments(prev => !prev);
    };

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="samosa-reel-item">
            <div className="biryani-video-container">
                {!videoLoaded && <div className="biryani-video-shimmer"></div>}
                <video
                    ref={videoRef}
                    className="biryani-video"
                    loop
                    muted
                    playsInline
                    onClick={handleVideoClick}
                    onLoadedData={() => setVideoLoaded(true)}
                >
                    <source src={reel.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {!videoLoaded && (
                    <div className="dal-makhani-loading">
                        <div className="malai-spinner"></div>
                        <p className="jeera-text">Loading video...</p>
                    </div>
                )}
            </div>

            <div className="paneer-content">
                <ReelHeader
                    username={reel.username}
                    caption={reel.caption}
                    avatar={reel.avatar}
                    timestamp={formatTime(reel.createdAt)}
                />

                <ReelActions
                    likes={likesnumber.length}
                    comments={commentsnumber.length}
                    shares={share.length}
                    islike={islike}
                    onLike={handleLikeClick}
                    onComment={handleCommentClick}
                />
            </div>

            {showComments && (
                <ReelComments
                    reelId={reel._id}
                    commentCount={commentsnumber.length}
                    onClose={handleCommentClick}
                    user={user}
                />
            )}
        </div>
    );
};

export default ReelItem;
