
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


















import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, name, isRemote = false, isVideoOff = false, muted = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleVideoError = (e) => {
        console.error("Video playback error:", e);
    };

    return (
        <div className={`video-player ${isRemote ? 'remote' : 'local'}`}>
            <div className="video-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>

                {/* CRITICAL FIX: The video element must ALWAYS remain in the DOM.
                    If it is unmounted, the audio tracks stop playing.
                */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    // Local stream must be muted to prevent echo; remote must be unmuted to hear them.
                    muted={muted}
                    onError={handleVideoError}
                    className="video-element"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: isVideoOff ? 'none' : 'block', // Hide visually, but keep logic active
                        pointerEvents: 'none',
                    }}
                />

                {/* Show placeholder ONLY when video is toggled off */}
                {isVideoOff && (
                    <div className="video-off-placeholder" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        background: '#2c2c2c',
                        color: 'white'
                    }}>
                        <div className="placeholder-avatar">
                            {name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <p className="placeholder-text">Camera is off</p>
                    </div>
                )}
            </div>

            <div className="video-overlay">
                <div className="user-info">
                    <span className="user-name">{name}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;