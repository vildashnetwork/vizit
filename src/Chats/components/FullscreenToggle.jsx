import React from 'react';

function FullscreenToggle({ isFullscreen, onToggle }) {
    return (
        <div className="cad-fullscreen-toggle">
            <button
                className="cad-fullscreen-toggle__button"
                onClick={onToggle}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
                {isFullscreen ? '↘' : '↗'}
            </button>
        </div>
    );
}

export default FullscreenToggle;