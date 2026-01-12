// App.js
import React, { useEffect } from 'react';
import ReelsContainer from './ReelsContainer';
import './style.css';
import VideoCallPage from "../Chats/components/ChatMain/Videocall/Videocall"
function UserReelsApp({ setActiveTab }) {
    const role = localStorage.getItem("role");


    useEffect(() => {
        if (role !== "user") {
            window.location.href = "/"
        }
        return
    }, [role])

    const remoteUserId = localStorage.getItem("remoteUserId")
    const remoteUserName = localStorage.getItem("remoteUserName")

    return (
        <div className="tandoori-app">
            <VideoCallPage
                remoteUserId={remoteUserId}
                remoteUserName={remoteUserName}
            />
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