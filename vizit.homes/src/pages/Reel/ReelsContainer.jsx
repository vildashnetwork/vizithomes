
// components/ReelsContainer.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReelItem from './ReelItem';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ReelsContainer = ({ setActiveTab }) => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const containerRef = useRef(null);
    const observerRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const activeReelRef = useRef(null);

    /* =======================
       LOAD USER + REELS
    ======================== */
    useEffect(() => {
        const decoding = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoadingUser(false);
                    return;
                }

                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (res.status === 200) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        const fetchReels = async () => {
            try {
                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/reels/reels"
                );

                if (res.status === 200) {
                    setReels(res.data.reels);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        decoding();
        fetchReels();
    }, []);

    /* =======================
       AUTOPLAY + URL UPDATE
    ======================== */
    useEffect(() => {
        if (!containerRef.current || reels.length === 0) return;

        const options = {
            root: containerRef.current,
            threshold: 0.7
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('.biryani-video');
                const reelId = entry.target.dataset.reelId;

                if (entry.isIntersecting) {
                    video?.play();

                    // ✅ HARD GUARD
                    if (!reelId) return;

                    if (activeReelRef.current !== reelId) {
                        activeReelRef.current = reelId;
                        setSearchParams({ reel: reelId }, { replace: true });
                    }
                } else {
                    video?.pause();
                }
            });
        }, options);

        const reelItems = containerRef.current.querySelectorAll('.samosa-reel-item');
        reelItems.forEach(item => observerRef.current.observe(item));

        return () => observerRef.current.disconnect();
    }, [reels, setSearchParams]);

    /* =======================
       SCROLL TO REEL FROM URL
    ======================== */
    useEffect(() => {
        if (!containerRef.current || reels.length === 0) return;

        const reelIdFromUrl = searchParams.get('reel');

        // ✅ guard against ?reel=null
        if (!reelIdFromUrl || reelIdFromUrl === "null") return;

        const target = containerRef.current.querySelector(
            `[data-reel-id="${reelIdFromUrl}"]`
        );

        if (target) {
            target.scrollIntoView({ behavior: 'instant' });
        }
    }, [reels, searchParams]);

    /* =======================
       LIKE HANDLER
    ======================== */
    const handleLike = async (id) => {
        if (!user) return;

        try {
            await axios.post(
                `https://vizit-backend-hubw.onrender.com/api/reels/reel/${id}/like`,
                {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    /* =======================
       SCROLL BUTTONS
    ======================== */
    const handleScroll = useCallback((direction) => {
        if (!containerRef.current) return;

        const scrollAmount = window.innerHeight;

        containerRef.current.scrollBy({
            top: direction === 'down' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    }, []);

    /* =======================
       RENDER
    ======================== */
    return (
        <div className="biryani-container" ref={containerRef}>
            <div className="papad-scroll-indicator">
                {/* intentionally left commented as in original */}
            </div>

            {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <div className="samosa-reel-item loading" key={index}>
                        <div className="biryani-video-shimmer" />
                        <div className="paneer-tikka-header-shimmer" />
                        <div className="butter-chicken-actions-shimmer" />
                    </div>
                ))
            ) : (
                reels.map(reel => (
                    <div
                        key={reel._id}
                        className="samosa-reel-item"
                        data-reel-id={reel._id}   // ✅ REQUIRED
                    >
                        <ReelItem
                            reel={reel}
                            onLike={handleLike}
                            user={user}
                            reels={reels}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default ReelsContainer;
