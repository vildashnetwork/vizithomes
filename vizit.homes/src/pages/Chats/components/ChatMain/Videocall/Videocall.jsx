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

// /* =========================
//    PeerService (LOGIC FIXED)
//    ========================= */
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

//         this.peer = new RTCPeerConnection({
//             iceServers: [
//                 { urls: "stun:stun.l.google.com:19302" },
//                 {
//                     urls: [
//                         "turn:openrelay.metered.ca:80?transport=udp",
//                         "turn:openrelay.metered.ca:443?transport=tcp",
//                         "turns:openrelay.metered.ca:443",
//                     ],
//                     username: "openrelayproject",
//                     credential: "openrelayproject",
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
// const VideoCallPage = ({ remoteUserId, remoteUserName }) => {
//     const socketRef = useRef(null);
//     const [isSwapped, setIsSwapped] = useState(false);




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

//     const prepare = async () => {
//         peerService.createPeer();
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         await peerService.addLocalStream(stream);
//         setMyStream(stream);
//         setRemoteStream(peerService.remoteStream);
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

//     return (
//         <div className="video-call-container">
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
//                     {/* LARGE VIDEO */}
//                     <div className="remote-video-container">
//                         {largeStream && (
//                             <VideoPlayer
//                                 stream={largeStream}
//                                 name={largeName}
//                                 muted={isSwapped}
//                             />
//                         )}
//                     </div>

//                     {/* SMALL VIDEO (click to swap) */}
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
//                     </div>


//                     <div className="call-controls">
//                         <button
//                             className="end-call-btn"
//                             style={{ background: "#918989ff" }}
//                             onClick={toggleMute}
//                         >
//                             {isMuted ? <MicOffIcon /> : <MicIcon />}
//                         </button>

//                         <button
//                             className="end-call-btn"
//                             style={{ background: "rgba(41, 107, 91, 1)" }}
//                             onClick={toggleVideo}
//                         >
//                             {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
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
   PeerService (LOGIC FIXED)
   ========================= */
class PeerService {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.remoteStream = new MediaStream();

        // Separate buffers for clarity:
        // pendingRemoteCandidates: ICE candidates we received from the remote side
        //   before we've set remoteDescription (must be applied only after remoteDescription).
        // pendingLocalCandidates: local ICE candidates generated before an iceHandler was set
        //   (we need to send them via signaling once handler is available).
        this.pendingRemoteCandidates = [];
        this.pendingLocalCandidates = [];

        this.iceHandler = null; // function to send local ICE candidates over signaling
        this.trackHandler = null;
        this.stateHandler = null;
    }

    createPeer() {
        if (this.peer) this.close();

        this.remoteStream = new MediaStream();

        this.peer = new RTCPeerConnection({
            iceServers: [
                // Public Google STUN
                { urls: "stun:stun.l.google.com:19302" },
                // OpenRelay TURN (metered) - zero-cost project credentials suitable for demos/testing
                {
                    urls: [
                        "turn:openrelay.metered.ca:80?transport=udp",
                        "turn:openrelay.metered.ca:443?transport=tcp",
                        "turns:openrelay.metered.ca:443",
                    ],
                    username: "openrelayproject",
                    credential: "openrelayproject",
                },
            ],
        });

        // Local ICE candidates generated by this peer
        this.peer.onicecandidate = (e) => {
            if (!e.candidate) return;
            // If a handler is set, send immediately. Otherwise buffer outgoing candidates until handler is set.
            if (this.iceHandler) {
                try {
                    this.iceHandler(e.candidate);
                } catch (err) {
                    // If sending fails for some reason, keep it buffered to avoid losing candidates.
                    this.pendingLocalCandidates.push(e.candidate);
                }
            } else {
                this.pendingLocalCandidates.push(e.candidate);
            }
        };

        // Remote track handling: merge incoming tracks into one MediaStream and notify handler.
        this.peer.ontrack = (e) => {
            // Guard: some browsers provide multiple streams; we take first stream's tracks.
            const stream = e.streams && e.streams[0];
            if (stream) {
                stream.getTracks().forEach((t) => {
                    if (!this.remoteStream.getTracks().some((x) => x.id === t.id)) {
                        this.remoteStream.addTrack(t);
                    }
                });
            }
            this.trackHandler?.(this.remoteStream);
        };

        // Notify ICE connection state changes (connected/completed -> UI can show established)
        this.peer.oniceconnectionstatechange = () => {
            this.stateHandler?.(this.peer.iceConnectionState);
        };
    }

    // Set handler used to send local ICE candidates via signaling.
    // Flush any locally buffered candidates now that a handler exists.
    setIceCandidateHandler(fn) {
        this.iceHandler = fn;
        if (this.iceHandler && this.pendingLocalCandidates.length) {
            this.pendingLocalCandidates.forEach((c) => {
                try {
                    this.iceHandler(c);
                } catch (err) {
                    // ignore per-candidate send errors; candidates remain best-effort
                }
            });
            this.pendingLocalCandidates = [];
        }
    }

    setTrackHandler(fn) {
        this.trackHandler = fn;
        if (this.remoteStream.getTracks().length) fn(this.remoteStream);
    }

    setIceStateHandler(fn) {
        this.stateHandler = fn;
    }

    // Add local tracks to PeerConnection BEFORE creating an offer.
    async addLocalStream(stream) {
        this.localStream = stream;
        // Add tracks only if not already added (prevents duplicate senders on re-prepare)
        stream.getTracks().forEach((t) => {
            if (!this.peer.getSenders().some((s) => s.track?.id === t.id)) {
                this.peer.addTrack(t, stream);
            }
        });
    }

    // Create an offer - local tracks must be attached before calling this.
    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
    }

    // Generate an answer to a received offer.
    // Note: We call setRemoteDescription (via setLocalDescription API used elsewhere) first,
    // then createAnswer and setLocalDescription for our answer, and finally flush any buffered remote ICE candidates.
    async getAnswer(offer) {
        if (offer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            // After setting remote description, remote candidates that were buffered can be flushed.
            await this.flushRemoteCandidates();
        }
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return answer;
    }

    // NOTE: This method name is preserved (used across the app). It actually sets the REMOTE description
    // received from the other peer and then flushes any buffered remote ICE candidates so they are applied.
    // Comment added only where logic corrected.
    async setLocalDescription(desc) {
        // desc is actually the remote description object (offer/answer) received over signaling
        await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
        // Flush any candidates that arrived earlier from the remote peer before remoteDescription was set.
        await this.flushRemoteCandidates();
    }

    // Add a remote ICE candidate; buffer until remoteDescription exists.
    async addIceCandidate(candidate) {
        if (!candidate) return;
        // Ensure candidate is an RTCIceCandidate (some signaling systems send raw objects)
        const c = candidate instanceof RTCIceCandidate ? candidate : new RTCIceCandidate(candidate);
        // Only add remote candidates once remoteDescription has been set.
        if (this.peer.remoteDescription && this.peer.remoteDescription.type) {
            try {
                await this.peer.addIceCandidate(c);
            } catch (err) {
                // Some browsers may throw if candidate is duplicate or invalid; ignore to keep flow robust.
            }
        } else {
            // Buffer until remoteDescription is applied.
            this.pendingRemoteCandidates.push(c);
        }
    }

    // Apply buffered remote candidates (called after remoteDescription is set).
    async flushRemoteCandidates() {
        if (!this.pendingRemoteCandidates.length) return;
        for (const c of this.pendingRemoteCandidates) {
            try {
                await this.peer.addIceCandidate(c);
            } catch (err) {
                // ignore per-candidate errors
            }
        }
        this.pendingRemoteCandidates = [];
    }

    toggleAudio() {
        this.localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    }

    toggleVideo() {
        this.localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    }

    close() {
        // Stop local tracks (if any)
        try {
            this.localStream?.getTracks().forEach((t) => t.stop());
        } catch (e) {
            // ignore
        }
        // Close peer connection
        try {
            this.peer?.close();
        } catch (e) {
            // ignore
        }
        this.peer = null;
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.pendingRemoteCandidates = [];
        this.pendingLocalCandidates = [];
        this.iceHandler = null;
        this.trackHandler = null;
        this.stateHandler = null;
    }
}

const peerService = new PeerService();

/* =========================
   React Component
   ========================= */
const VideoCallPage = ({ remoteUserId, remoteUserName }) => {
    const socketRef = useRef(null);

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [incomingCall, setIncomingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);
    const [callActive, setCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId: localStorage.getItem("userId") },
        });
        return () => socketRef.current.disconnect();
    }, []);

    // Wire PeerService handlers. These are stable and won't be recreated per-call.
    useEffect(() => {
        peerService.setIceCandidateHandler((candidate) => {
            // send local ICE candidate to remote peer via signaling
            socketRef.current.emit("ice-candidate", {
                toUserId: remoteUserId || callerInfo?.userId,
                candidate,
            });
        });

        // when PeerService receives remote stream updates, update component state
        peerService.setTrackHandler(setRemoteStream);

        // update UI state once ICE connection is established
        peerService.setIceStateHandler((state) => {
            if (state === "connected" || state === "completed") setCallActive(true);
            // if disconnected/failed, we do not change UI here; endCall will be used by user to hang up.
        });
    }, [remoteUserId, callerInfo]);

    // Prepare PeerConnection + local media. Local tracks are attached before any offer creation.
    const prepare = async () => {
        peerService.createPeer();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        await peerService.addLocalStream(stream); // ensure tracks are added before creating offer
        setMyStream(stream);
        setRemoteStream(peerService.remoteStream);
    };

    useEffect(() => {
        const s = socketRef.current;

        // Incoming call: remote side sent an offer. We:
        // 1) prepare local media & peer
        // 2) set remote description (received offer) - important: set remoteDescription before adding remote ICEs
        // 3) create and send answer
        s.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
            setCallerInfo({ userId: fromUserId, name: callerName });
            setIncomingCall(true);
            await prepare();
            // setLocalDescription (keeps existing API) sets the remote description and flushes buffered remote ICE candidates
            await peerService.setLocalDescription(JSON.parse(offer));
            // Note: we wait for user action (accept) before producing and sending answer (UI flow unchanged)
        });

        // Remote accepted our call: they sent an answer. Apply it (setRemoteDescription) and flush buffered remote ICE candidates.
        s.on("call:accepted", async ({ answer }) => {
            await peerService.setLocalDescription(JSON.parse(answer));
        });

        // Remote sent ICE candidate. Buffer or apply depending on whether remoteDescription is set.
        s.on("ice-candidate", ({ candidate }) => {
            peerService.addIceCandidate(candidate);
        });

        s.on("call:end", endLocal);

        return () => s.removeAllListeners();
    }, []);

    const startCall = async () => {
        await prepare();
        // createOffer after local tracks attached
        const offer = await peerService.getOffer();
        socketRef.current.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
            callerName: localStorage.getItem("userName") || "User",
        });
    };

    const acceptCall = async () => {
        // When accepting, create answer to the already-applied remote offer.
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
        socketRef.current.emit("call:end", {
            toUserId: remoteUserId || callerInfo?.userId,
        });
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

    return (
        <div className="video-call-container">
            {incomingCall && (
                <div className="incoming-call-overlay">
                    <div className="incoming-call-modal">
                        <h2>{callerInfo?.name}</h2>
                        <p>Incoming video call</p>
                        <div className="incoming-call-actions">
                            <button onClick={acceptCall}><CallIcon /></button>
                            <button onClick={rejectCall}><PhoneDisabledIcon /></button>
                        </div>
                    </div>
                </div>
            )}

            {callActive && (
                <div className="video-call-interface">
                    <div className="remote-video-container">
                        {remoteStream && <VideoPlayer stream={remoteStream} name={remoteUserName} />}
                    </div>
                    <div className="local-video-container">
                        {myStream && <VideoPlayer stream={myStream} name="Me" muted isSmall />}
                    </div>
                    <div className="call-controls">
                        <button onClick={toggleMute}>{isMuted ? <MicOffIcon /> : <MicIcon />}</button>
                        <button onClick={toggleVideo}>{isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}</button>
                        <button onClick={endCall}><CallEndIcon /></button>
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