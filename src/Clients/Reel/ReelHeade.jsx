// components/ReelHeader.js
import React from 'react';

const ReelHeader = ({ username, caption, avatar, timestamp }) => {
    return (
        <div className="paneer-tikka-header">
            <div className="naan-avatar-container">
                <img src={avatar} alt={username} className="naan-avatar" />
            </div>
            <div className="raita-user-info">
                <h3 className="tikka-username">@{username}</h3>
                <p className="masala-caption">{caption}</p>
                <span className="chutney-timestamp">{timestamp}</span>
            </div>
            <button className="papri-follow-btn"> Chat Now</button>
        </div>
    );
};

export default ReelHeader;