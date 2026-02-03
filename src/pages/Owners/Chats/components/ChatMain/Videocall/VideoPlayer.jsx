
// import React, { useEffect, useRef } from 'react';

// const VideoPlayer = ({ stream, name, isRemote = false, isVideoOff = false }) => {
//     const videoRef = useRef(null);

//     useEffect(() => {
//         if (videoRef.current && stream) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);

//     const handleVideoError = (e) => {
//         console.error("Video error:", e);
//         // Handle video error (show placeholder, retry, etc.)
//     };

//     return (
//         <div className={`video-player ${isRemote ? 'remote' : 'local'}`}>
//             <div className="video-wrapper">
//                 {isVideoOff ? (
//                     <div className="video-off-placeholder">
//                         <div className="placeholder-avatar">
//                             {name?.charAt(0).toUpperCase() || 'U'}
//                         </div>
//                         <p className="placeholder-text">Camera is off</p>
//                     </div>
//                 ) : (
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted={isRemote ? false : true}
//                         onError={handleVideoError}
//                         className="video-element"
//                         style={{ pointerEvents: "none", }}
//                     />
//                 )}
//             </div>

//             <div className="video-overlay">
//                 <div className="user-info">
//                     <span className="user-name">{name}</span>
//                     {!isRemote && (
//                         <span className="video-status">
//                             {/* {isVideoOff ? 'Camera off' : 'Camera on'} */}
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VideoPlayer;



















import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, name, isRemote = false, isVideoOff = false, isSmall = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!stream || !videoRef.current) return;

        const videoEl = videoRef.current;

        // mute local video, unmute remote
        videoEl.muted = !isRemote;

        // attach the stream
        videoEl.srcObject = stream;

        // play audio/video (browser may block if autoplay is not allowed)
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn("Autoplay blocked. User must interact first.", err);
            });
        }
    }, [stream, isRemote]);

    return (
        <div className={`video-player ${isRemote ? "remote" : "local"} ${isSmall ? "small" : ""}`}>
            <div className="video-wrapper">
                {isVideoOff ? (
                    <div className="video-off-placeholder">
                        <div className="placeholder-avatar">
                            {name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <p>Camera Off</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="video-element"
                        style={{ pointerEvents: "none" }}
                    />
                )}
            </div>
            <div className="video-overlay">
                <span className="user-name">{name}</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
