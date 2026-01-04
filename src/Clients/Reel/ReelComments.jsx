






















import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "../../backendauth/socketconnect";

const ReelComments = ({ reelId, commentCount, onClose, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const holdTimeout = useRef(null);

    /* ---------------- FETCH COMMENTS (INITIAL LOAD ONLY) ---------------- */
    const fetchComments = async () => {
        try {
            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/reels/reel/${reelId}`
            );
            setComments(res.data.reel.comments || []);
        } catch (err) {
            console.error("FETCH COMMENTS ERROR:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [reelId]);

    /* ---------------- SOCKET: REAL-TIME LIKE UPDATES ---------------- */
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleLikeUpdate = ({ reelId: rId, commentId, likes }) => {
            if (rId !== reelId) return;

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, likes }
                        : comment
                )
            );
        };

        socket.on("commentLikeUpdated", handleLikeUpdate);

        return () => {
            socket.off("commentLikeUpdated", handleLikeUpdate);
        };
    }, [reelId]);

    /* ---------------- ADD COMMENT ---------------- */
    const handleAddComment = async () => {
        if (!newComment.trim() || !user?._id) return;

        try {
            await axios.post(
                `https://vizit-backend-hubw.onrender.com/api/reels/reel/${reelId}/comment`,
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    text: newComment,
                }
            );

            setNewComment("");
            fetchComments(); // OK for new comments
        } catch (err) {
            console.error("POST COMMENT ERROR:", err);
        }
    };

    /* ---------------- LIKE COMMENT (NO REFETCH) ---------------- */
    const toggleLikeComment = async (commentId) => {
        if (!user?._id) return;

        try {
            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/like/reel/${reelId}/comment/${commentId}/like`,
                { id: user._id }
            );
            // ❌ NO fetchComments here
            // Socket will update everyone in real time
        } catch (err) {
            console.error("LIKE COMMENT ERROR:", err.response?.data || err.message);
        }
    };

    /* ---------------- LONG PRESS ---------------- */
    const startHold = (commentId) => {
        holdTimeout.current = setTimeout(() => {
            toggleLikeComment(commentId);
        }, 500);
    };

    const cancelHold = () => {
        clearTimeout(holdTimeout.current);
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div className="gulab-jamun-comments">
            {/* Header */}
            <div className="jalebi-comments-header">
                <h4 className="rasgulla-title">Comments ({commentCount})</h4>
                {onClose && <button className="jalebi-close-btn" onClick={onClose}>×</button>}
            </div>

            {/* Comments List */}
            <div className="barfi-comments-list">
                {comments.length === 0 ? (
                    <div className="barfi-empty-comments">
                        <div className="kulfi-icon">💬</div>
                        <p className="besan-text">No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        // CORRECTED: Check if user has liked using comment._id
                        const hasLiked = comment.likes?.some(like =>
                            like.id.toString() === user?._id
                        );

                        return (
                            <div
                                key={comment._id} // Use comment._id as key
                                className="rasmalai-comment"
                                onMouseDown={(e) => startHold(e, comment._id)} // Use comment._id
                                onMouseUp={cancelHold}
                                onMouseLeave={cancelHold}
                                onTouchStart={(e) => startHold(e, comment._id)} // Use comment._id
                                onTouchEnd={cancelHold}
                            >
                                <div className="kheer-comment-content">
                                    <div className="phirni-user-info">
                                        <img
                                            src={comment.profile}
                                            alt={comment.name}
                                            className="sandesh-profile"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                marginRight: '8px'
                                            }}
                                        />
                                        <h5 className="phirni-username">@{comment.name}</h5>
                                    </div>
                                    <p className="halwa-text">{comment.text}</p>
                                    <div className="modak-comment-meta">
                                        <span className="sandesh-time">
                                            {comment.date ? new Date(comment.date).toLocaleDateString() : ""}
                                        </span>
                                        <button
                                            className={`peda-like-btn ${hasLiked ? "liked" : ""}`}
                                            onClick={() => toggleLikeComment(comment._id)} // Use comment._id
                                        >
                                            <span className="icon"><ion-icon name="heart-outline"></ion-icon></span>    {comment.likes?.length || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Comment */}
            <div className="chhena-add-comment">
                <input
                    type="text"
                    className="ghevar-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <button
                    className="rabri-post-btn"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default ReelComments;
