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
    const addUserChat = async (chatId) => {
        if (!chatId) {
            toast.error("User not found");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Please login again");
            return;
        }

        try {
            setChatLoading(true);

            const res = await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/user/add/chat/id/${userId}`,
                { chatId }
            );

            if (res.status === 200) {
                toast.success(res.data?.message || "Chat opened");
                navigate(`/user/chat?auth=${chatId}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to open chat");
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
                {caption && (
                    <p className="masala-caption">{caption}</p>
                )}
                {timestamp && (
                    <span className="chutney-timestamp">
                        {timestamp}
                    </span>
                )}
            </div>
            {console.log(reelId)}
            <button
                className="papri-follow-btn"
                onClick={() => addUserChat(reelId)}
                disabled={chatLoading || decoding}
            >
                {chatLoading
                    ? "Opening chat..."
                    : "Chat Now"}
            </button>
        </div>
    );
};

export default ReelHeader;
