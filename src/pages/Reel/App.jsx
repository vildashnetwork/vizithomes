// App.js
import React, { useEffect, useState } from 'react';
import ReelsContainer from './ReelsContainer';
import './style.css';
import VideoCallPage from "../Chats/components/ChatMain/Videocall/Videocall"
import axios from 'axios';
function UserReelsApp({ setActiveTab }) {
    const role = localStorage.getItem("role");


    const [loading, setLoading] = useState(true);
    const [user, setuser] = useState([])
    useEffect(() => {
        if (role !== "user") {
            window.location.href = "/"
        }
        return
    }, [role])

    useEffect(() => {
        const storedRole = localStorage.getItem("role");

        async function decodeTokenAndConnect() {
            try {
                const token = localStorage.getItem("token");
                if (!token || !storedRole) {
                    setLoading(false);
                    return;
                }

                const endpoint =
                    storedRole === "owner"
                        ? "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner"
                        : "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user";

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const userna =
                        storedRole === "owner"
                            ? response.data?.res
                            : response.data?.user;
                    setuser(userna)

                }
            } catch (err) {
                console.error("Token decode failed:", err);
            } finally {
                setLoading(false);
            }
        }

        decodeTokenAndConnect();
    }, [role]);

    return (
        <div className="tandoori-app">
            {/* <VideoCallPage
                remoteUserId={user?._id}
                remoteUserName={user?.name}
            /> */}
            <header className="naan-header">
                <h1 className="masala-title">Indian Food Reels</h1>
                <p className="chai-description">Scroll vertically to watch cooking videos</p>
            </header>
            <main className="rajma-main">
                <ReelsContainer setActiveTab={setActiveTab} />
            </main>
            <footer className="puri-footer">
                <p className="kulfi-text">Made with ❤️ using Indian dish CSS class names</p>
            </footer>
        </div>
    );
}

export default UserReelsApp;