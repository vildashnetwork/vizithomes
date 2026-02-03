// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { io } from "socket.io-client";
// import VideoPlayer from "./VideoPlayer";
// import "./VideoCall.css";

// import CallEndIcon from "@mui/icons-material/CallEnd";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import CallIcon from "@mui/icons-material/Call";
// import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

// const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";


// class PeerService {
//     constructor() {
//         this.peer = null;
//         this.localStream = null;
//         this.remoteStream = new MediaStream();
//         this.pendingCandidates = [];
//         this.iceHandler = null;
//         this.trackHandler = null;
//         this.stateHandler = null;
//     }

//     createPeer() {
//         if (this.peer) this.close();

//         this.remoteStream = new MediaStream();

//         // this.peer = new RTCPeerConnection({
//         //     iceServers: [
//         //         { urls: "stun:stun.l.google.com:19302" },
//         //         {
//         //             urls: [
//         //                 "turn:openrelay.metered.ca:80?transport=udp",
//         //                 "turn:openrelay.metered.ca:443?transport=tcp",
//         //                 "turns:openrelay.metered.ca:443",
//         //             ],
//         //             username: "openrelayproject",
//         //             credential: "openrelayproject",
//         //         },
//         //     ],
//         // });
//         this.peer = new RTCPeerConnection({
//             iceServers: [
//                 { urls: "stun:stun.l.google.com:19302" },
//                 {
//                     urls: [
//                         "stun:stun.relay.metered.ca:80",
//                         "turn:global.relay.metered.ca:80",
//                         "turn:global.relay.metered.ca:80?transport=tcp",
//                         "turn:global.relay.metered.ca:443",
//                         "turns:global.relay.metered.ca:443?transport=tcp"
//                     ],
//                     username: "23dd2c881c792610daaef11f",
//                     credential: "J2wwbRWdLWsRYv5T",
//                 },
//             ],
//         });




//         this.peer.onicecandidate = (e) => {
//             if (!e.candidate) return;
//             this.iceHandler
//                 ? this.iceHandler(e.candidate)
//                 : this.pendingCandidates.push(e.candidate);
//         };

//         this.peer.ontrack = (e) => {
//             e.streams[0].getTracks().forEach((t) => {
//                 if (!this.remoteStream.getTracks().some((x) => x.id === t.id)) {
//                     this.remoteStream.addTrack(t);
//                 }
//             });
//             this.trackHandler?.(this.remoteStream);
//         };

//         this.peer.oniceconnectionstatechange = () => {
//             this.stateHandler?.(this.peer.iceConnectionState);
//         };
//     }

//     setIceCandidateHandler(fn) {
//         this.iceHandler = fn;
//     }

//     setTrackHandler(fn) {
//         this.trackHandler = fn;
//         if (this.remoteStream.getTracks().length) fn(this.remoteStream);
//     }

//     setIceStateHandler(fn) {
//         this.stateHandler = fn;
//     }

//     async addLocalStream(stream) {
//         this.localStream = stream;
//         stream.getTracks().forEach((t) => {
//             if (!this.peer.getSenders().some((s) => s.track?.id === t.id)) {
//                 this.peer.addTrack(t, stream);
//             }
//         });
//     }

//     async getOffer() {
//         const offer = await this.peer.createOffer();
//         await this.peer.setLocalDescription(offer);
//         return offer;
//     }

//     async getAnswer(offer) {
//         if (offer) {
//             await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//         }
//         const answer = await this.peer.createAnswer();
//         await this.peer.setLocalDescription(answer);
//         await this.flushCandidates();
//         return answer;
//     }

//     async setLocalDescription(desc) {
//         await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
//         await this.flushCandidates();
//     }

//     async addIceCandidate(candidate) {
//         if (this.peer.remoteDescription) {
//             await this.peer.addIceCandidate(candidate);
//         } else {
//             this.pendingCandidates.push(candidate);
//         }
//     }

//     async flushCandidates() {
//         for (const c of this.pendingCandidates) {
//             await this.peer.addIceCandidate(c);
//         }
//         this.pendingCandidates = [];
//     }

//     toggleAudio() {
//         this.localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
//     }

//     toggleVideo() {
//         this.localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
//     }

//     close() {
//         this.localStream?.getTracks().forEach((t) => t.stop());
//         this.peer?.close();
//         this.peer = null;
//         this.localStream = null;
//         this.remoteStream = new MediaStream();
//         this.pendingCandidates = [];
//     }
// }

// const peerService = new PeerService();

// /* =========================
//    React Component
//    ========================= */
// const VideoCallPage = ({ remoteUserId, remoteUserName, setiscall }) => {
//     const socketRef = useRef(null);
//     const [isSwapped, setIsSwapped] = useState(false);


//     const [smallscreencall, setsmallscreencall] = useState(false)

//     const [myStream, setMyStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [incomingCall, setIncomingCall] = useState(false);
//     const [callerInfo, setCallerInfo] = useState(null);
//     const [callActive, setCallActive] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);

//     useEffect(() => {
//         socketRef.current = io(SOCKET_SERVER_URL, {
//             query: { userId: localStorage.getItem("userId") },
//         });
//         return () => socketRef.current.disconnect();
//     }, []);

//     useEffect(() => {
//         peerService.setIceCandidateHandler((candidate) => {
//             socketRef.current.emit("ice-candidate", {
//                 toUserId: remoteUserId || callerInfo?.userId,
//                 candidate,
//             });
//         });

//         peerService.setTrackHandler(setRemoteStream);

//         peerService.setIceStateHandler((state) => {
//             if (state === "connected" || state === "completed") setCallActive(true);
//         });
//     }, [remoteUserId, callerInfo]);

//     // const prepare = async () => {
//     //     peerService.createPeer();
//     //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//     //     await peerService.addLocalStream(stream);
//     //     setMyStream(stream);
//     //     setRemoteStream(peerService.remoteStream);
//     // };


//     const prepare = async () => {
//         peerService.createPeer();

//         // Add these specific audio constraints
//         const constraints = {
//             audio: {
//                 echoCancellation: true,      // Removes echo from speakers
//                 noiseSuppression: true,      // Filters out background hums/fans
//                 autoGainControl: true,       // Stabilizes volume levels
//                 typingNoiseDetection: true,  // Specifically for keyboard clicks
//             },
//             video: true
//         };

//         try {
//             const stream = await navigator.mediaDevices.getUserMedia(constraints);
//             await peerService.addLocalStream(stream);
//             setMyStream(stream);
//             setRemoteStream(peerService.remoteStream);
//         } catch (err) {
//             console.error("Error accessing media devices:", err);
//         }
//     };

//     useEffect(() => {
//         const s = socketRef.current;

//         s.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
//             setCallerInfo({ userId: fromUserId, name: callerName });
//             setIncomingCall(true);
//             await prepare();
//             await peerService.setLocalDescription(JSON.parse(offer));
//         });

//         s.on("call:accepted", async ({ answer }) => {
//             await peerService.setLocalDescription(JSON.parse(answer));
//         });

//         s.on("ice-candidate", ({ candidate }) => {
//             peerService.addIceCandidate(candidate);
//         });

//         s.on("call:end", endLocal);

//         return () => s.removeAllListeners();
//     }, []);

//     const startCall = async () => {
//         await prepare();
//         const offer = await peerService.getOffer();
//         socketRef.current.emit("user:call", {
//             toUserId: remoteUserId,
//             offer: JSON.stringify(offer),
//             callerName: localStorage.getItem("userName") || "User",
//         });
//     };

//     const acceptCall = async () => {
//         const answer = await peerService.getAnswer();
//         socketRef.current.emit("call:accepted", {
//             toUserId: callerInfo.userId,
//             answer: JSON.stringify(answer),
//         });
//         setIncomingCall(false);
//     };

//     const rejectCall = () => {
//         socketRef.current.emit("call:rejected", { toUserId: callerInfo.userId });
//         setIncomingCall(false);
//     };

//     const endLocal = () => {
//         peerService.close();
//         setCallActive(false);
//         setIncomingCall(false);
//         setMyStream(null);
//         setRemoteStream(null);
//     };

//     const endCall = () => {
//         socketRef.current.emit("call:end", {
//             toUserId: remoteUserId || callerInfo?.userId,
//         });
//         endLocal();
//     };

//     const toggleMute = () => {
//         peerService.toggleAudio();
//         setIsMuted(!myStream?.getAudioTracks()[0]?.enabled);
//     };

//     const toggleVideo = () => {
//         peerService.toggleVideo();
//         setIsVideoOff(!myStream?.getVideoTracks()[0]?.enabled);
//     };
//     const largeStream = isSwapped ? myStream : remoteStream;
//     const smallStream = isSwapped ? remoteStream : myStream;

//     const largeName = isSwapped ? "Me" : remoteUserName;
//     const smallName = isSwapped ? remoteUserName : "Me";

//     const gotosmall = () => {
//         setsmallscreencall(!smallscreencall)
//     }
//     useEffect(() => {
//         if (typeof setiscall === "function") {
//             setiscall(callActive);
//         }
//     }, [callActive]);









//     /* ===== DRAG SETUP ===== */
//     /* ===== DRAG SETUP ===== */
//     const containerRef = useRef(null);
//     const dragData = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
//     const [position, setPosition] = useState({ x: 20, y: 80 });

//     const startDrag = (e) => {
//         if (!smallscreencall) return;

//         e.preventDefault();
//         e.stopPropagation(); // stop button click bubbling

//         const point = e.touches ? e.touches[0] : e;

//         dragData.current = {
//             dragging: true,
//             offsetX: point.clientX - position.x,
//             offsetY: point.clientY - position.y,
//         };
//     };

//     useEffect(() => {
//         const onMove = (e) => {
//             if (!dragData.current.dragging) return;

//             const point = e.touches ? e.touches[0] : e;

//             setPosition({
//                 x: point.clientX - dragData.current.offsetX,
//                 y: point.clientY - dragData.current.offsetY,
//             });
//         };

//         const onStop = () => {
//             dragData.current.dragging = false;
//         };

//         window.addEventListener("mousemove", onMove);
//         window.addEventListener("mouseup", onStop);
//         window.addEventListener("touchmove", onMove, { passive: false });
//         window.addEventListener("touchend", onStop);

//         return () => {
//             window.removeEventListener("mousemove", onMove);
//             window.removeEventListener("mouseup", onStop);
//             window.removeEventListener("touchmove", onMove);
//             window.removeEventListener("touchend", onStop);
//         };
//     }, []);



//     return (
//         <div
//             ref={containerRef}
//             className={!smallscreencall ? "video-call-container" : "small-screen"}
//             style={
//                 smallscreencall
//                     ? {
//                         position: "fixed",
//                         left: position.x,
//                         top: position.y,
//                         zIndex: 9999,
//                         cursor: dragData.current.dragging ? "grabbing" : "default",
//                     }
//                     : undefined
//             }
//         >






//             {incomingCall && (
//                 <div className="incoming-call-overlay">
//                     <div className="incoming-call-modal">
//                         <h2>{callerInfo?.name}</h2>
//                         <p>Incoming video call</p>
//                         <div className="incoming-call-actions">
//                             <button className="accept-call-btn" onClick={acceptCall}>
//                                 <CallIcon />
//                             </button>
//                             <button className="reject-call-btn" onClick={rejectCall}>
//                                 <PhoneDisabledIcon />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {callActive && (
//                 <div className="video-call-interface">

//                     {/* <div className="remote-video-container">
//                         {largeStream && (
//                             <VideoPlayer
//                                 stream={largeStream}
//                                 name={largeName}
//                                 muted={isSwapped}
//                             />
//                         )}
//                     </div>


//                     <div
//                         className="local-video-container"
//                         onClick={() => setIsSwapped(prev => !prev)}
//                     >
//                         {smallStream && (
//                             <VideoPlayer
//                                 stream={smallStream}
//                                 name={smallName}
//                                 isSmall
//                                 muted={!isSwapped}
//                             />
//                         )}
//                     </div> */}


//                     {/* LARGE VIDEO */}
//                     <div className="remote-video-container">
//                         {largeStream && (
//                             <VideoPlayer
//                                 stream={largeStream}
//                                 name={largeName}
//                                 // Logic: Mute if the stream belongs to "Me"
//                                 muted={largeStream === myStream}
//                                 isVideoOff={largeStream === myStream ? isVideoOff : false}
//                             />
//                         )}
//                     </div>

//                     {/* SMALL VIDEO */}
//                     <div className="local-video-container" onClick={() => setIsSwapped(prev => !prev)}>
//                         {smallStream && (
//                             <VideoPlayer
//                                 stream={smallStream}
//                                 name={smallName}
//                                 isSmall
//                                 // Logic: Mute if the stream belongs to "Me"
//                                 muted={smallStream === myStream}
//                                 isVideoOff={smallStream === myStream ? isVideoOff : false}
//                             />
//                         )}
//                     </div>

//                     <div className="call-controls">
//                         <button
//                             className="end-call-btn"
//                             style={{ background: "#918989ff" }}
//                             onClick={toggleMute}
//                         >
//                             {isMuted ? <MicOffIcon /> : <MicIcon />}
//                         </button>
//                         {/* <button
//                             className="end-call-btn"
//                             style={{ background: "#374151", cursor: "grab" }}
//                             onMouseDown={startDrag}
//                             onTouchStart={startDrag}
//                         >
//                             Move
//                         </button> */}




//                         <button
//                             className="end-call-btn"
//                             style={{ background: "rgba(41, 107, 91, 1)" }}
//                             onClick={toggleVideo}
//                         >
//                             {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
//                         </button>
//                         <button
//                             className="end-call-btn"
//                             style={{ background: "rgba(41, 107, 91, 1)", fontSize: 25 }}
//                             onClick={gotosmall}
//                         >
//                             {smallscreencall ? <ion-icon name="expand-outline"></ion-icon> :
//                                 <ion-icon name="arrow-redo-circle-outline"></ion-icon>}
//                         </button>
//                         <button className="end-call-btn" onClick={endCall}>
//                             <CallEndIcon />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {!callActive && !incomingCall && remoteUserId && (
//                 <button className="start-call-btn" onClick={startCall}>
//                     <ion-icon name="videocam-outline"></ion-icon>
//                 </button>
//             )}
//         </div>
//     );
// };

// export default VideoCallPage;





























import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import VideoPlayer from "./VideoPlayer";
import "./VideoCall.css";

import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallIcon from "@mui/icons-material/Call";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

/* =========================
   PeerService
   ========================= */
class PeerService {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.pendingCandidates = [];
        this.iceHandler = null;
        this.trackHandler = null;
        this.stateHandler = null;
    }

    createPeer() {
        if (this.peer) this.close();
        this.remoteStream = new MediaStream();
        this.peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                {
                    urls: [
                        "stun:stun.relay.metered.ca:80",
                        "turn:global.relay.metered.ca:80",
                        "turn:global.relay.metered.ca:80?transport=tcp",
                        "turn:global.relay.metered.ca:443",
                        "turns:global.relay.metered.ca:443?transport=tcp"
                    ],
                    username: "23dd2c881c792610daaef11f",
                    credential: "J2wwbRWdLWsRYv5T",
                },
            ],
        });

        this.peer.onicecandidate = (e) => {
            if (!e.candidate) return;
            this.iceHandler ? this.iceHandler(e.candidate) : this.pendingCandidates.push(e.candidate);
        };

        this.peer.ontrack = (e) => {
            e.streams[0].getTracks().forEach((t) => {
                if (!this.remoteStream.getTracks().some((x) => x.id === t.id)) {
                    this.remoteStream.addTrack(t);
                }
            });
            this.trackHandler?.(new MediaStream(this.remoteStream.getTracks()));
        };

        this.peer.oniceconnectionstatechange = () => {
            this.stateHandler?.(this.peer.iceConnectionState);
        };
    }

    setIceCandidateHandler(fn) { this.iceHandler = fn; }
    setTrackHandler(fn) { this.trackHandler = fn; }
    setIceStateHandler(fn) { this.stateHandler = fn; }

    async addLocalStream(stream) {
        this.localStream = stream;
        stream.getTracks().forEach((t) => {
            if (!this.peer.getSenders().some((s) => s.track?.id === t.id)) {
                this.peer.addTrack(t, stream);
            }
        });
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    async getAnswer(offer) {
        if (offer) await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        await this.flushCandidates();
        return answer;
    }

    async setLocalDescription(desc) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
        await this.flushCandidates();
    }

    async addIceCandidate(candidate) {
        if (this.peer?.remoteDescription) {
            await this.peer.addIceCandidate(candidate);
        } else {
            this.pendingCandidates.push(candidate);
        }
    }

    async flushCandidates() {
        for (const c of this.pendingCandidates) {
            await this.peer.addIceCandidate(c);
        }
        this.pendingCandidates = [];
    }

    toggleAudio() { this.localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled)); }
    toggleVideo() { this.localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled)); }

    close() {
        this.localStream?.getTracks().forEach((t) => t.stop());
        this.peer?.close();
        this.peer = null;
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.pendingCandidates = [];
    }
}

const peerService = new PeerService();

/* =========================
   React Component
   ========================= */
const VideoCallPage = ({ remoteUserId, remoteUserName, setiscall }) => {
    const socketRef = useRef(null);
    const [isSwapped, setIsSwapped] = useState(false);
    const [smallscreencall, setsmallscreencall] = useState(false);

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);
    const [callActive, setCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Position for draggable small screen
    const [position, setPosition] = useState({ x: 20, y: 80 });
    const dragData = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId: localStorage.getItem("userId") },
        });
        return () => socketRef.current.disconnect();
    }, []);

    useEffect(() => {
        peerService.setIceCandidateHandler((candidate) => {
            socketRef.current.emit("ice-candidate", {
                toUserId: remoteUserId || callerInfo?.userId,
                candidate,
            });
        });

        peerService.setTrackHandler(setRemoteStream);

        peerService.setIceStateHandler((state) => {
            if (state === "connected" || state === "completed") setCallActive(true);
        });
    }, [remoteUserId, callerInfo]);

    // CORRECTED: Added Audio constraints to fix noise and echo
    const prepare = async () => {
        peerService.createPeer();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: true
            });
            await peerService.addLocalStream(stream);
            setMyStream(stream);
            setRemoteStream(peerService.remoteStream);
        } catch (err) {
            console.error("Mic/Camera access denied", err);
        }
    };

    useEffect(() => {
        const s = socketRef.current;
        s.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
            setCallerInfo({ userId: fromUserId, name: callerName });
            setIncomingCall(true);
            await prepare();
            await peerService.setLocalDescription(JSON.parse(offer));
        });

        s.on("call:accepted", async ({ answer }) => {
            await peerService.setLocalDescription(JSON.parse(answer));
        });

        s.on("ice-candidate", ({ candidate }) => {
            peerService.addIceCandidate(candidate);
        });

        s.on("call:end", endLocal);
        return () => s.removeAllListeners();
    }, []);

    const startCall = async () => {
        await prepare();
        const offer = await peerService.getOffer();
        socketRef.current.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
            callerName: localStorage.getItem("userName") || "User",
        });
    };

    const acceptCall = async () => {
        const answer = await peerService.getAnswer();
        socketRef.current.emit("call:accepted", {
            toUserId: callerInfo.userId,
            answer: JSON.stringify(answer),
        });
        setIncomingCall(false);
    };

    const rejectCall = () => {
        socketRef.current.emit("call:rejected", { toUserId: callerInfo.userId });
        setIncomingCall(false);
    };

    const endLocal = () => {
        peerService.close();
        setCallActive(false);
        setIncomingCall(false);
        setMyStream(null);
        setRemoteStream(null);
    };

    const endCall = () => {
        socketRef.current.emit("call:end", { toUserId: remoteUserId || callerInfo?.userId });
        endLocal();
    };

    const toggleMute = () => {
        peerService.toggleAudio();
        setIsMuted(!myStream?.getAudioTracks()[0]?.enabled);
    };

    const toggleVideo = () => {
        peerService.toggleVideo();
        setIsVideoOff(!myStream?.getVideoTracks()[0]?.enabled);
    };

    const largeStream = isSwapped ? myStream : remoteStream;
    const smallStream = isSwapped ? remoteStream : myStream;
    const largeName = isSwapped ? "Me" : remoteUserName;
    const smallName = isSwapped ? remoteUserName : "Me";

    useEffect(() => {
        if (typeof setiscall === "function") setiscall(callActive);
    }, [callActive, setiscall]);

    /* DRAG LOGIC */
    const startDrag = (e) => {
        if (!smallscreencall) return;
        const point = e.touches ? e.touches[0] : e;
        dragData.current = {
            dragging: true,
            offsetX: point.clientX - position.x,
            offsetY: point.clientY - position.y,
        };
    };

    useEffect(() => {
        const onMove = (e) => {
            if (!dragData.current.dragging) return;
            const point = e.touches ? e.touches[0] : e;
            setPosition({
                x: point.clientX - dragData.current.offsetX,
                y: point.clientY - dragData.current.offsetY,
            });
        };
        const onStop = () => { dragData.current.dragging = false; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onStop);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onStop);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onStop);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onStop);
        };
    }, [position, smallscreencall]);

    return (
        <div
            className={!smallscreencall ? "video-call-container" : "small-screen"}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            style={smallscreencall ? {
                position: "fixed", left: position.x, top: position.y, zIndex: 9999,
                cursor: dragData.current.dragging ? "grabbing" : "default",
            } : undefined}
        >
            {incomingCall && (
                <div className="incoming-call-overlay">
                    <div className="incoming-call-modal">
                        <h2>{callerInfo?.name}</h2>
                        <p>Incoming video call</p>
                        <div className="incoming-call-actions">
                            <button className="accept-call-btn" onClick={acceptCall}><CallIcon /></button>
                            <button className="reject-call-btn" onClick={rejectCall}><PhoneDisabledIcon /></button>
                        </div>
                    </div>
                </div>
            )}

            {callActive && (
                <div className="video-call-interface">
                    <div className="remote-video-container">
                        {largeStream && (
                            <VideoPlayer
                                stream={largeStream}
                                name={largeName}
                                // CORRECTED: Local stream should always be muted for the player
                                muted={largeStream === myStream}
                                isVideoOff={largeStream === myStream ? isVideoOff : false}
                            />
                        )}
                    </div>

                    <div className="local-video-container" onClick={() => setIsSwapped(prev => !prev)}>
                        {smallStream && (
                            <VideoPlayer
                                stream={smallStream}
                                name={smallName}
                                // CORRECTED: Local stream should always be muted for the player
                                muted={smallStream === myStream}
                                isVideoOff={smallStream === myStream ? isVideoOff : false}
                            />
                        )}
                    </div>

                    <div className="call-controls">
                        <button className="end-call-btn" style={{ background: "#918989ff" }} onClick={toggleMute}>
                            {isMuted ? <MicOffIcon /> : <MicIcon />}
                        </button>
                        <button className="end-call-btn" style={{ background: "rgba(41, 107, 91, 1)" }} onClick={toggleVideo}>
                            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                        </button>
                        <button className="end-call-btn" style={{ background: "rgba(41, 107, 91, 1)" }} onClick={() => setsmallscreencall(!smallscreencall)}>
                            {smallscreencall ? <ion-icon name="expand-outline"></ion-icon> : <ion-icon name="arrow-redo-circle-outline"></ion-icon>}
                        </button>
                        <button className="end-call-btn" onClick={endCall}><CallEndIcon /></button>
                    </div>
                </div>
            )}

            {!callActive && !incomingCall && remoteUserId && (
                <button className="start-call-btn" onClick={startCall}>
                    <ion-icon name="videocam-outline"></ion-icon>
                </button>
            )}
        </div>
    );
};

export default VideoCallPage;