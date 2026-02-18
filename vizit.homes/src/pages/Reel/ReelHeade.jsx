// // components/ReelHeader.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import RedVerificationBadge from "./Badge.jsx"

// const ReelHeader = ({ username, caption, avatar, timestamp, reelId }) => {
//     const [user, setUser] = useState(null);
//     const [decoding, setDecoding] = useState(false);
//     const [chatLoading, setChatLoading] = useState(false);

//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//     /* ---------------- decode logged-in user ---------------- */
//     const decodeToken = async () => {
//         if (!token) return;

//         try {
//             setDecoding(true);

//             const res = await axios.get(
//                 "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             if (res.status === 200) {
//                 setUser(res.data?.user || null);
//             }
//         } catch (error) {
//             console.error("Token decode failed:", error);
//         } finally {
//             setDecoding(false);
//         }
//     };

//     useEffect(() => {
//         decodeToken();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     const [loadadd, setloadadd] = useState(false)
//     /* ---------------- open chat ---------------- */
//     const adduserchat = async (chatId) => {
//         if (!chatId) return;

//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//             toast.error("User not authenticated");
//             return;
//         }

//         try {
//             setChatLoading(true);

//             // 1️⃣ Add chat to logged-in user
//             const resUser = await axios.put(
//                 `https://vizit-backend-hubw.onrender.com/api/user/add/chat/id/${userId}`,
//                 { chatId }
//             );

//             // 2️⃣ Add chat to owner / second user
//             const resOwner = await axios.put(
//                 `https://vizit-backend-hubw.onrender.com/api/owner/add/chat/id/${chatId}`,
//                 { chatId: userId }
//             );

//             // 3️⃣ Success handling
//             if (resUser.status === 200 && resOwner.status === 200) {
//                 console.log("chatId", chatId)
//                 toast.success("Chat opened successfully");
//                 navigate(`/user/chat?auth=${chatId}`);
//             }

//         } catch (error) {
//             console.error("Add chat error:", error);

//             toast.error(
//                 error?.response?.data?.message || "Failed to open chat"
//             );
//         } finally {
//             setChatLoading(false);
//         }
//     };

//     /* ---------------- render ---------------- */
//     return (
//         <div className="paneer-tikka-header">
//             <div className="naan-avatar-container">
//                 <img
//                     src={avatar}
//                     alt={username}
//                     className="naan-avatar"
//                 />
//             </div>

//             <div className="raita-user-info">
//                 <h3 className="tikka-username">@{username} 
//                       {user.verified && <RedVerificationBadge/>}
//                 </h3>
//                 {caption && (
//                     <p className="masala-caption">{caption}</p>
//                 )}
//                 {timestamp && (
//                     <span className="chutney-timestamp">
//                         {timestamp}
//                     </span>
//                 )}
//             </div>
//             {console.log(reelId)}
//             <button
//                 className="papri-follow-btn"
//                 onClick={() => adduserchat(reelId)}
//                 disabled={chatLoading || decoding}
//             >
//                 {chatLoading
//                     ? "Opening chat..."
//                     : "Chat Now"}
//             </button>
//         </div>
//     );
// };

// export default ReelHeader;











import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import RedVerificationBadge from "./Badge.jsx";

const ReelHeader = ({ username, caption, avatar, timestamp, reelId , verified}) => {
    const [user, setUser] = useState(null);
    const [decoding, setDecoding] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    /* ---------------- decode logged-in user ---------------- */
    const decodeToken = async () => {
        if (!token) return;

        try {
            setDecoding(true);
            const res = await axios.get(
                "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 200) {
                setUser(res.data?.user || null);
            }
        } catch (error) {
            console.error("Token decode failed:", error);
        } finally {
            setDecoding(false);
        }
    };

    useEffect(() => {
        decodeToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    /* ---------------- open chat ---------------- */
    const adduserchat = async (chatId) => {
        if (!chatId) {
            toast.error("Invalid Reel ID");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Please login to chat");
            return;
        }

        try {
            setChatLoading(true);

            // 1️⃣ Add chat to logged-in user
            const resUser = await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/user/add/chat/id/${userId}`,
                { chatId }
            );

            // 2️⃣ Add chat to owner / second user
            const resOwner = await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/owner/add/chat/id/${chatId}`,
                { chatId: userId }
            );

            // 3️⃣ Success handling
            if (resUser.status === 200 && resOwner.status === 200) {
                toast.success("Chat opened successfully");
                navigate(`/user/chat?auth=${chatId}`);
            }

        } catch (error) {
            console.error("Add chat error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to open chat"
            );
        } finally {
            setChatLoading(false);
        }
    };

    /* ---------------- render ---------------- */
    return (
        <div className="paneer-tikka-header">
            <div className="naan-avatar-container">
                <img
                    src={avatar || "https://via.placeholder.com/150"}
                    alt={username}
                    className="naan-avatar"
                />
            </div>
            <div className="raita-user-info">
                <h3 className="tikka-username">
                    @{username}{" "}
                    {verified && <RedVerificationBadge />}
                </h3>
                
                {caption && (
                    <p className="masala-caption">{caption}</p>
                )}
                
                {timestamp && (
                    <span className="chutney-timestamp">
                        {timestamp}
                    </span>
                )}
            </div>

            <button
                className="papri-follow-btn"
                onClick={() => adduserchat(reelId)}
                disabled={chatLoading || decoding}
            >
                {chatLoading ? (
                    <span className="loading-spinner-text">Opening...</span>
                ) : (
                    "Chat Now"
                )}
            </button>
        </div>
    );
};

export default ReelHeader;