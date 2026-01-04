
import React, { useState, useEffect } from "react";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import defaultProfile from "../assets/images/default-profile.png";
import "./ReviewRatingSection.css";

/* =======================
   STAR COMPONENTS
   (unchanged tags/classNames)
======================= */
function StarDisplay({ value, size = "small" }) {
    return (
        <div className="chopin-stars">
            {[1, 2, 3, 4, 5].map((n) =>
                n <= value ? (
                    <StarIcon key={n} fontSize={size} className="chopin-star-filled" />
                ) : (
                    <StarOutlineOutlinedIcon key={n} fontSize={size} />
                )
            )}
        </div>
    );
}

function StarInput({ value, onChange }) {
    return (
        <div className="chopin-stars-input">
            {[1, 2, 3, 4, 5].map((n) =>
                n <= value ? (
                    <StarIcon
                        key={n}
                        className="chopin-star-filled clickable"
                        onClick={() => onChange(n)}
                    />
                ) : (
                    <StarOutlineOutlinedIcon
                        key={n}
                        className="clickable"
                        onClick={() => onChange(n)}
                    />
                )
            )}
        </div>
    );
}

/* =======================
   MAIN REVIEW COMPONENT
   (full refined version)
======================= */
export default function ReviewSection({
    propertyId,
    currentUser,
    isAdmin,
    allowalladmins
}) {
    const [reviews, setReviews] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isrightuser, setisrightuser] = useState(false);

    const API_BASE = "https://vizit-backend-hubw.onrender.com/api/house/houses";

    console.log("User", currentUser);





    const [checkadminid, setcheckadmin] = useState(false)

    useEffect(() => {
        if (!propertyId) {
            console.warn("Ownership check skipped: propertyId missing");
            return;
        }

        if (!currentUser || !currentUser._id) {
            console.warn("Ownership check skipped: currentUser._id missing");
            return;
        }

        console.log("Checking ownership with:", {
            propertyId,
            ownerId: currentUser._id
        });

        const checking = async () => {
            try {


                const res = await axios.post(
                    `https://vizit-backend-hubw.onrender.com/api/house/check/${propertyId}/${currentUser._id}`
                );

                setcheckadmin(Boolean(res.data.isOwner));
                console.log('====================================');
                console.log("is it true: ", checkadminid);
                console.log('====================================');

            } catch (error) {
                console.error(
                    "Ownership check failed:",
                    error.response?.data || error.message
                );
            }
        };

        checking();
    }, [propertyId, currentUser?._id]);



    /* ---------- utility ---------- */
    const calculateOverallRating = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return 0;
        const sum = arr.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        return Number((sum / arr.length).toFixed(1));
    };

    const safeEntriesFromResponse = (res) => {
        // handle multiple possible shapes returned by backend
        if (!res || !res.data) return [];
        if (res.data.reviews && Array.isArray(res.data.reviews.entries)) return res.data.reviews.entries;
        if (res.data.house && res.data.house.reviews && Array.isArray(res.data.house.reviews.entries)) return res.data.house.reviews.entries;
        if (Array.isArray(res.data)) return res.data; // fallback
        return [];
    };

    /* ---------- fetch reviews ---------- */
    useEffect(() => {
        if (!propertyId) return;

        let mounted = true;
        async function load() {

            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(`${API_BASE}/${propertyId}`);

                const entries = safeEntriesFromResponse(res);

                if (!mounted) return;

                setReviews(entries);
                setOverallRating(calculateOverallRating(entries));

                // check if current user already has a review
                const userId = currentUser?._id ? currentUser._id.toString() : null;
                const hasUser = entries.some((e) => {
                    const authorId = e.id ? e.id.toString() : (e.userId ? e.userId.toString() : null);
                    return userId && authorId && userId === authorId;
                });
                setisrightuser(Boolean(hasUser));
            } catch (err) {
                console.error("Fetch reviews error:", err);
                setError("Failed to load reviews");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => { mounted = false; };
    }, [propertyId, currentUser]);

    /* ---------- submit (create or update) ---------- */
    async function submitReview() {
        if (!rating || !comment.trim()) {
            alert("Please provide a rating and comment");
            return;
        }

        if (!propertyId) {
            setError("Missing property id");
            return;
        }

        const userId = currentUser?._id;
        if (!userId) {
            setError("User not authenticated");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (editingId) {
                // update review (backend route: PUT /houses/review/:propertyId/:reviewId)
                const payload = {
                    reviewdata: {
                        userId: userId,
                        rating,
                        comment: comment.trim(),
                    },
                };
                const res = await axios.put(`${API_BASE}/review/${propertyId}/${editingId}`, payload);
                // expect res.data.reviews.entries or res.data.reviews
                const entries = res.data?.reviews?.entries ?? res.data?.reviews ?? safeEntriesFromResponse(res);
                setReviews(entries);
                setOverallRating(calculateOverallRating(entries));
            } else {
                // create review (backend route: POST /houses/review/:propertyId)
                const payload = {
                    reviewdata: {
                        userId,
                        name: currentUser?.name || "Anonymous",
                        profileImg: currentUser?.profile || "",
                        rating,
                        comment: comment.trim(),
                    },
                };
                console.log('====================================');
                console.log("playload", payload);
                console.log('====================================');
                const res = await axios.post(`${API_BASE}/review/post/${propertyId}`, payload);
                const entries = res.data?.reviews?.entries ?? res.data?.reviews ?? safeEntriesFromResponse(res);
                setReviews(entries);
                setOverallRating(calculateOverallRating(entries));
                setisrightuser(true);
            }

            // reset form
            setRating(0);
            setComment("");
            setEditingId(null);
        } catch (err) {
            console.error("Submit review error:", err);
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    }

    /* ---------- delete review ---------- */
    async function deleteReview(reviewId) {
        if (!reviewId) return;
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const res = await axios.delete(`${API_BASE}/review/${propertyId}/${reviewId}`);
            // expect res.data.reviews.entries
            const entries = res.data?.reviews?.entries ?? res.data?.reviews ?? safeEntriesFromResponse(res);
            setReviews(entries);
            setOverallRating(calculateOverallRating(entries));

            // update isrightuser (if the deleted review belonged to this user)
            const userId = currentUser?._id ? currentUser._id.toString() : null;
            const hasUser = entries.some((e) => (e.id ? e.id.toString() : (e.userId ? e.userId.toString() : null)) === userId);
            setisrightuser(Boolean(hasUser));
        } catch (err) {
            console.error("Delete review error:", err);
            setError(err.response?.data?.message || "Failed to delete review");
        }
    }

    /* ---------- submit reply (admin) ---------- */
    // async function submitReply(reviewId, text, isAdminReply = false) {
    //     if (!reviewId || !text || !text.trim()) return false;
    //     try {
    //         const payload = {
    //             replydata: {
    //                 reviewId,
    //                 userId: currentUser?._id,
    //                 isAdmin: Boolean(isAdminReply),
    //                 text: text.trim(),
    //                 name: currentUser?.name || "",
    //                 email: currentUser?.email || "",
    //                 profileImg: currentUser?.profile || "",
    //             },
    //         };

    //         const res = await axios.post(`${API_BASE}/review/${propertyId}`, payload);
    //         // update reviews from response
    //         const entries = res.data?.reviews?.entries ?? res.data?.reviews ?? safeEntriesFromResponse(res);
    //         setReviews(entries);
    //         setOverallRating(calculateOverallRating(entries));
    //         return true;
    //     } catch (err) {
    //         console.error("Submit reply error:", err);
    //         setError(err.response?.data?.message || "Failed to submit reply");
    //         return false;
    //     }
    // }
    async function submitReply(reviewId, text, isAdminReply = false) {
        if (!reviewId || !text?.trim()) return false;
        try {
            const payload = {
                reviewId,
                userId: currentUser?._id,
                isAdmin: Boolean(isAdminReply),
                text: text.trim(),
                name: currentUser?.name || "",
                email: currentUser?.email || "",
                profileImg: currentUser?.profile || "",
            };

            const res = await axios.post(`${API_BASE}/review/reply/${propertyId}`, payload);

            // Update the specific review in state
            setReviews(prev =>
                prev.map(r => (r._id === reviewId ? res.data.review : r))
            );

            return true;
        } catch (err) {
            console.error("Submit reply error:", err);
            setError(err.response?.data?.message || "Failed to submit reply");
            return false;
        }
    }

    /* ---------- derived values ---------- */
    const userIdStr = currentUser?._id ? currentUser._id.toString() : null;
    const userReview = reviews.find((r) => {
        const authorId = r.id ? r.id.toString() : (r.userId ? r.userId.toString() : null);
        return userIdStr && authorId && userIdStr === authorId;
    });

    if (loading) {
        return (
            <div className="mozart-review-section">
                <div className="loading-review"></div>
                <div className="loading-review"></div>
                <div className="loading-review"></div>
            </div>
        );
    }

    return (
        <div className="mozart-review-section">
            <h4>Ratings & Reviews</h4>

            {error && (
                <div className="mozart-error">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Overall Rating */}
            <div className="beethoven-overall">
                <StarDisplay value={overallRating} size="large" />
                <div className="rating-stats">
                    <p className="rating-number">{overallRating} / 5</p>
                    <p className="review-count">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</p>
                </div>
            </div>

            {/* Review Form — always visible */}
            {!isAdmin && <div className="vivaldi-review-form">
                <div className="form-header">
                    <h5>{editingId ? "Edit Your Review" : "Share Your Experience"}</h5>
                    <StarInput value={rating} onChange={setRating} />
                </div>

                <textarea
                    placeholder="Share your thoughts about this property..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                />

                <div className="form-actions">
                    <button onClick={submitReview} disabled={submitting}>
                        {editingId ? "Update Review" : "Submit Review"}
                        <SendIcon className="icon" />
                    </button>

                    {editingId && (
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setEditingId(null);
                                setRating(0);
                                setComment("");
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {isrightuser && !editingId && (
                    <div className="mozart-info">
                        <span className="info-icon">✓</span>
                        You have already submitted a review. You can edit it below.
                    </div>
                )}
            </div>}

            {/* Review List */}
            <div className="bach-review-list">
                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎵</div>
                        <h5>No Reviews Yet</h5>
                        <p>Be the first to share your experience!</p>
                    </div>
                ) : (
                    reviews.map((entry) => (
                        <ReviewCard
                            key={entry._id || entry.id || JSON.stringify(entry)}
                            entry={entry}
                            currentUser={currentUser}
                            isAdmin={isAdmin}
                            isrightuser={isrightuser}
                            checkadminid={checkadminid}
                            allowalladmins={allowalladmins}
                            onEdit={() => {
                                // prepare form for editing the selected review
                                setEditingId(entry._id || entry.id);
                                setRating(Number(entry.rating) || 0);
                                setComment(entry.comment || "");
                            }}
                            onDelete={() => deleteReview(entry._id || entry.id)}
                            onReply={submitReply}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

/* =======================
   REVIEW CARD
   (keeps your classNames & html)
======================= */
function ReviewCard({ entry, isAdmin, currentUser, onEdit, onDelete, onReply, isrightuser, checkadminid, allowalladmins }) {
    const [replyText, setReplyText] = useState("");
    const [showReplyBox, setShowReplyBox] = useState(false);

    // entry.id = author user id (per your schema), entry._id = review id (mongoose)
    const entryAuthorId = entry.id ? entry.id.toString() : (entry.userId ? entry.userId.toString() : null);
    const currentUserId = currentUser?._id ? currentUser._id.toString() : null;

    const canEdit = currentUserId && entryAuthorId && currentUserId === entryAuthorId;
    const canDelete = Boolean(isAdmin) || canEdit;

    const formattedDate = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : "";

    async function handleReplySubmit() {
        if (!replyText.trim()) return;
        const ok = await onReply(entry._id || entry.id, replyText, isAdmin);
        if (ok) {
            setReplyText("");
            setShowReplyBox(false);
        }
    }

    return (
        <div className="bach-review-card">
            {/* Header */}
            <div className="bach-review-header">
                <img
                    src={entry.profileImg || defaultProfile}
                    alt={entry.name || "Reviewer"}
                    className="profile-image"
                />
                <div className="header-content">
                    <div className="name-date">
                        <h5>{entry.name || "Anonymous"}</h5>
                        <span className="review-date">{formattedDate}</span>
                    </div>
                    <StarDisplay value={Number(entry.rating) || 0} />
                    {entry.editedAt && (
                        <span className="edited-badge">(Edited)</span>
                    )}
                </div>

                {/* Actions: only show if current user is reviewer or admin and isrightuser is true */}
                {isrightuser && (canEdit || canDelete) && (
                    <div className="review-actions">
                        {canEdit && (
                            <button
                                className="action-btn edit"
                                onClick={onEdit}
                                title="Edit review"
                            >
                                <EditIcon />
                            </button>
                        )}

                        {canDelete && (
                            <button
                                className="action-btn delete"
                                onClick={onDelete}
                                title="Delete review"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Review Text */}
            <div className="bach-review-text">
                <p>{entry.comment}</p>
            </div>

            {/* Replies */}
            {Array.isArray(entry.replies) && entry.replies.length > 0 && (
                <div className="handel-replies-section">
                    <h6 className="replies-title">Replies</h6>

                    {entry.replies.map((reply) => (
                        <div
                            key={reply._id || reply.id || reply.createdAt}
                            className={`handel-reply ${reply.isAdmin ? "admin" : ""}`}
                        >
                            <div className="reply-header">
                                <strong>{reply.name || reply.author || "Owner"}</strong>
                                <span className="reply-date">
                                    {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                            <p>{reply.text}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Box Toggle — only admin allowed to reply */}
            {

                checkadminid
                && (
                    <div className="reply-toggle">
                        <button
                            className="toggle-reply-btn"
                            onClick={() => setShowReplyBox(!showReplyBox)}
                        >
                            <ReplyIcon />
                            {showReplyBox ? "Cancel Reply" : "Write a Reply"}
                        </button>
                    </div>
                )}

            {/* Reply Box */}
            {showReplyBox && (
                <div className="debussy-reply-box">
                    <textarea
                        placeholder={isAdmin ? "Write an admin reply..." : "Write your reply..."}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows="3"
                    />
                    <div className="reply-actions">
                        <button onClick={handleReplySubmit}>
                            Post Reply
                            <SendIcon className="icon" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
