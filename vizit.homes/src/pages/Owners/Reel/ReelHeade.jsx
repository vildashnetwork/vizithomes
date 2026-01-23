// // components/ReelHeader.js
// import React from 'react';

// const ReelHeader = ({ username, caption, avatar, timestamp }) => {
//     return (
//         <div className="paneer-tikka-header">
//             <div className="naan-avatar-container">
//                 <img src={avatar} alt={username} className="naan-avatar" />
//             </div>
//             <div className="raita-user-info">
//                 <h3 className="tikka-username">@{username}</h3>
//                 <p className="masala-caption">{caption}</p>
//                 <span className="chutney-timestamp">{timestamp}</span>
//             </div>
//             <button className="papri-follow-btn"> Chat Now</button>
//         </div>
//     );
// };

// export default ReelHeader;





























// components/ReelHeader.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ReelHeader = ({ username, caption, avatar, timestamp, reelId }) => {
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
                "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 200) {
                setUser(res.data.res);
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


    const addUserChat = async (targetUserId) => {
        if (!targetUserId) return;

        const loggedInUserId = localStorage.getItem("userId");
        if (!loggedInUserId) {
            toast.error("User not authenticated");
            return;
        }

        try {
            setChatLoading(true);

            // 1️⃣ Add target user to logged-in user's chat list
            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/owner/add/chat/idnow/${loggedInUserId}`,
                { chatId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2️⃣ Add logged-in user to target user's chat list
            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/owner/add/chat/id/${targetUserId}`,
                { chatId: loggedInUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Chat Added successfully");
            // window.location.href = `/user/chat?auth=${targetUserId}`
            // navigate(`/user/chat?auth=${targetUserId}`);
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
                    src={avatar}
                    alt={username}
                    className="naan-avatar"
                />
            </div>

            <div className="raita-user-info">
                <h3 className="tikka-username">@{username}</h3>
                {caption && <p className="masala-caption">{caption}</p>}
                {timestamp && <span className="chutney-timestamp">{timestamp}</span>}
            </div>

            <button
                className="papri-follow-btn"
                onClick={() => addUserChat(reelId)}
                disabled={chatLoading || decoding}
            >
                {chatLoading ? "Adding chat..." : "Add To Chat "}
            </button>
        </div>
    );
};

export default ReelHeader;
