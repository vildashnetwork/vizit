import React from "react";
import "./style/osner.css";

const GoogleLoginButton = ({ onClick }) => {
    return (
        <button className="google-btn" onClick={onClick}>
            <div className="google-btn__icon">
                <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google Logo"
                />
            </div>
            <span className="google-btn__text">Continue with Google</span>
        </button>
    );
};

export default GoogleLoginButton;
