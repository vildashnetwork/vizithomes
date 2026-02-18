// // components/ReelsContainer.js
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import ReelItem from './ReelItem';
// import axios from 'axios';

// const ReelsContainer = ({ setActiveTab }) => {
//     const [reels, setReels] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const containerRef = useRef(null);
//     const observerRef = useRef(null);




//     const [user, setuser] = useState(null)
//     const [loadinguser, setLoadinguser] = useState(true)

//     // Simulate loading data
//     useEffect(() => {
//         const decoding = async () => {
//             try {
//                 const token = localStorage.getItem("token")
//                 if (!token) {
//                     console.warn("No token found")
//                     setLoadinguser(false)
//                     return
//                 }

//                 const data = await axios.get(
//                     `https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 )
//                 if (data.status === 200) {
//                     setuser(data.data.res)
//                     console.log(loading ? "loading..." : user);

//                 }
//             } catch (error) {
//                 console.error("Failed to decode token:", error)
//             } finally {
//                 setLoadinguser(false)
//             }
//         }
//         decoding()

//         const fetchreels = async () => {
//             try {
//                 const res = await axios.get("https://vizit-backend-hubw.onrender.com/api/reels/reels")
//                 if (res.status == 200) {
//                     setReels(res.data.reels)
//                 } else {
//                     console.log(res.data.message)
//                 }

//             } catch (error) {
//                 console.log('====================================');
//                 console.log(error);
//                 console.log('====================================');
//                 console.log(error)
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchreels()
//     }, []);

//     // Setup intersection observer for lazy loading and video autoplay
//     useEffect(() => {
//         if (!containerRef.current) return;

//         const options = {
//             root: containerRef.current,
//             rootMargin: '0px',
//             threshold: 0.7 // When 70% of video is visible
//         };

//         observerRef.current = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 const videoElement = entry.target.querySelector('.biryani-video');
//                 if (entry.isIntersecting) {
//                     videoElement?.play();
//                 } else {
//                     videoElement?.pause();
//                 }
//             });
//         }, options);

//         // Observe each reel item
//         const reelItems = containerRef.current.querySelectorAll('.samosa-reel-item');
//         reelItems.forEach(item => observerRef.current.observe(item));

//         return () => {
//             if (observerRef.current) {
//                 observerRef.current.disconnect();
//             }
//         };
//     }, [reels]);

//     // Handle like action
//     const handleLike = async (id) => {

//         try {
//             const res = await axios.post(`https://vizit-backend-hubw.onrender.com/api/reels/reel/${id}/like`, {
//                 id: user?._id,
//                 name: user?.name,
//                 email: user?.email,
//                 profile: user?.profile
//             });
//             if (res.status == 201) {
//                 console.log(res.data.message)
//             } else {
//                 console.log(res.data.message)
//             }
//         } catch (error) {
//             console.log('====================================');
//             console.log(error);
//             console.log(error)
//             console.log('====================================');
//         }


//     }

//     // Handle scroll to next reel
//     const handleScroll = useCallback((direction) => {
//         if (!containerRef.current) return;

//         const container = containerRef.current;
//         const scrollAmount = window.innerHeight;

//         if (direction === 'down') {
//             container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
//         } else {
//             container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
//         }
//     }, []);

//     return (
//         <div className="biryani-container" ref={containerRef}>
//             {/* Scroll indicator */}

//             <div className="papad-scroll-indicator">
//                 {/* <button className="papad-scroll-btn down" style={{ background: "transparent", border: "none" }} onClick={() => setActiveTab("properties")}>
//                     <span className="korma-icon">c</span>

//                 </button> */}
//                 <button className="papad-scroll-btn up" style={{ visibility: "hidden" }} onClick={() => handleScroll('up')}>
//                     <span className="korma-icon">↑</span>
//                 </button>
//                 <button className="papad-scroll-btn down" style={{ visibility: "hidden" }} onClick={() => handleScroll('down')}>
//                     <span className="korma-icon">↓</span>
//                 </button>


//             </div>

//             {loading ? (
//                 // Loading shimmers
//                 Array.from({ length: 3 }).map((_, index) => (
//                     <div className="samosa-reel-item loading" key={index}>
//                         <div className="biryani-video-shimmer"></div>
//                         <div className="paneer-tikka-header-shimmer"></div>
//                         <div className="butter-chicken-actions-shimmer"></div>
//                     </div>
//                 ))
//             ) : (
//                 reels.map(reel => (
//                     <ReelItem
//                         key={reel?._id}
//                         reel={reel}
//                         onLike={handleLike}
//                         user={user}
//                     />
//                 ))
//             )}
//         </div>
//     );
// };

// export default ReelsContainer;



































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
                if (!token) return;

                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 200) {
                    setUser(res.data.res);
                }
            } catch (err) {
                console.error(err);
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
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        decoding();
        fetchReels();
    }, []);

    /* =======================
       AUTO PLAY + URL UPDATE
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
                const reelId = entry.target.dataset.reelId; // ✅ safer

                if (entry.isIntersecting) {
                    video?.play();

                    // ✅ HARD GUARD AGAINST NULL / UNDEFINED
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

        const items = containerRef.current.querySelectorAll('.samosa-reel-item');
        items.forEach(item => observerRef.current.observe(item));

        return () => observerRef.current.disconnect();
    }, [reels, setSearchParams]);

    /* =======================
       SCROLL TO REEL FROM URL
    ======================== */
    useEffect(() => {
        if (!containerRef.current || reels.length === 0) return;

        const reelIdFromUrl = searchParams.get('reel');

        // ✅ GUARD AGAINST ?reel=null
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
        } catch (err) {
            console.error(err);
        }
    };

    /* =======================
       SCROLL BUTTONS
    ======================== */
    const handleScroll = useCallback((direction) => {
        if (!containerRef.current) return;

        const height = window.innerHeight;

        containerRef.current.scrollBy({
            top: direction === 'down' ? height : -height,
            behavior: 'smooth'
        });
    }, []);

    /* =======================
       RENDER
    ======================== */
    return (
        <div className="biryani-container" ref={containerRef}>
            <div className="papad-scroll-indicator">
                <button
                    className="papad-scroll-btn up"
                    style={{ visibility: "hidden" }}
                    onClick={() => handleScroll('up')}
                >
                    <span className="korma-icon">↑</span>
                </button>

                <button
                    className="papad-scroll-btn down"
                    style={{ visibility: "hidden" }}
                    onClick={() => handleScroll('down')}
                >
                    <span className="korma-icon">↓</span>
                </button>
            </div>

            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div className="samosa-reel-item loading" key={i}>
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
                        data-reel-id={reel._id} // ✅ REQUIRED
                    >
                        <ReelItem
                            reel={reel}
                            onLike={handleLike}
                            user={user}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default ReelsContainer;
