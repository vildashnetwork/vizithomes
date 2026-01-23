import React, { useEffect, useRef, useState } from 'react';
import ReelHeader from './ReelHeade';
import ReelActions from './ReelActions';
import ReelComments from './ReelComments';
import { formatTime } from './formatTime';
import axios from 'axios';
import { getSocket } from "../../../realTimeConnect/socketconnect";

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
                    reelId={reel.postownerId}
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
