// components/ReelActions.js
import React from 'react';

const ReelActions = ({ likes, comments, shares, liked, onLike, onComment, onShare, hasshared, islike, checklike, getall, likesnumber }) => {

    function runmany() {
        onLike()
        checklike(likesnumber)
        getall()

    }
    function runinr() {
        onComment()
        getall()

    }

    function runall() {
        onShare()
        getall()
    }
    return (
        <div className="butter-chicken-actions">
            <div className="kebab-action-group">
                <button className={`korma-action-btn ${islike ? 'liked' : ''}`} onClick={runmany}>
                    <span className="korma-icon"><ion-icon name="heart-outline"></ion-icon></span>
                    <span className="ajwain-count">{likes}</span>
                </button>

                <button className="korma-action-btn" onClick={runinr}>
                    <span className="korma-icon"><ion-icon name="chatbubble-outline"></ion-icon></span>
                    <span className="ajwain-count">{comments}</span>
                </button>

                <button className="korma-action-btn" onClick={runall}>
                    <span className={`korma-icon ${islike ? 'liked' : ''}`}><ion-icon name="share-social-outline"></ion-icon></span>
                    <span className="ajwain-count">{shares}</span>
                </button>
            </div>

            {/* <div className="lassi-audio-info">
                <span className="badam-icon">🎵</span>
                <span className="kesar-text">Original Audio</span>
            </div> */}
        </div>
    );
};

export default ReelActions;