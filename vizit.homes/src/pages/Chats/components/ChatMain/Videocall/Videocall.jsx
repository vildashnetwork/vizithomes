





















// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import CallIcon from '@mui/icons-material/Call';
// import VideoCallIcon from '@mui/icons-material/VideoCall';
// import VideoPlayer from './VideoPlayer';
// import "./VideoCall.css"
// const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

// const VideoCallPage = ({ remoteUserId }) => {
//     const [remoteStream, setRemoteStream] = useState(null);
//     const [myStream, setMyStream] = useState(null);
//     const [callActive, setCallActive] = useState(false);
//     const [callButtonVisible, setCallButtonVisible] = useState(true);

//     const pcRef = useRef(null);
//     const socketRef = useRef(null);

//     // Initialize socket and local stream
//     useEffect(() => {
//         socketRef.current = io(SOCKET_SERVER_URL, {
//             query: { userId: localStorage.getItem('userId') }
//         });

//         const init = async () => {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             setMyStream(stream);

//             const pc = new RTCPeerConnection();
//             pcRef.current = pc;

//             // Add local tracks
//             stream.getTracks().forEach(track => pc.addTrack(track, stream));

//             // Handle remote tracks
//             const remote = new MediaStream();
//             setRemoteStream(remote);
//             pc.ontrack = event => {
//                 event.streams[0].getTracks().forEach(track => remote.addTrack(track));
//             };

//             // Handle ICE candidates
//             pc.onicecandidate = event => {
//                 if (event.candidate && remoteUserId) {
//                     socketRef.current.emit('ice-candidate', {
//                         toUserId: remoteUserId,
//                         candidate: event.candidate
//                     });
//                 }
//             };
//         };

//         init();

//         return () => {
//             if (pcRef.current) pcRef.current.close();
//             if (socketRef.current) socketRef.current.disconnect();
//         };
//     }, [remoteUserId]);

//     /** ===== SOCKET EVENTS ===== **/
//     useEffect(() => {
//         if (!socketRef.current) return;

//         const socket = socketRef.current;

//         // Incoming call
//         socket.on('incoming:call', async ({ fromUserId, offer }) => {
//             setCallActive(true);
//             setCallButtonVisible(false);

//             if (!pcRef.current) return;
//             await pcRef.current.setRemoteDescription(JSON.parse(offer));
//             const answer = await pcRef.current.createAnswer();
//             await pcRef.current.setLocalDescription(answer);

//             socket.emit('call:accepted', {
//                 toUserId: fromUserId,
//                 answer: JSON.stringify(answer)
//             });
//         });

//         // Call accepted
//         socket.on('call:accepted', async ({ fromUserId, answer }) => {
//             setCallActive(true);
//             if (!pcRef.current) return;
//             await pcRef.current.setRemoteDescription(JSON.parse(answer));
//         });

//         // ICE candidate received
//         socket.on('ice-candidate', async ({ fromUserId, candidate }) => {
//             if (!pcRef.current) return;
//             try {
//                 await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//             } catch (err) {
//                 console.error("Error adding received ICE candidate:", err);
//             }
//         });

//         // Call ended
//         socket.on('call:end', () => {
//             endCall();
//         });

//         return () => {
//             socket.off('incoming:call');
//             socket.off('call:accepted');
//             socket.off('ice-candidate');
//             socket.off('call:end');
//         };
//     }, [remoteUserId]);

//     const [iscall, setiscall] = useState(false)

//     /** ===== CALL HANDLERS ===== **/
//     const startCall = useCallback(async () => {
//         if (!pcRef.current || !remoteUserId) return;
//         setiscall(!iscall)

//         const offer = await pcRef.current.createOffer();
//         await pcRef.current.setLocalDescription(offer);

//         socketRef.current.emit('user:call', {
//             toUserId: remoteUserId,
//             offer: JSON.stringify(offer)
//         });

//         setCallButtonVisible(false);
//         setCallActive(true);
//     }, [remoteUserId]);

//     const endCall = useCallback(() => {
//         setCallActive(false);
//         setCallButtonVisible(true);

//         if (pcRef.current) {
//             pcRef.current.close();
//             pcRef.current = null;
//         }

//         if (myStream) {
//             myStream.getTracks().forEach(track => track.stop());
//             setMyStream(null);
//         }

//         setRemoteStream(null);

//         if (remoteUserId) {
//             socketRef.current.emit('call:end', { toUserId: remoteUserId });
//         }
//     }, [remoteUserId, myStream]);


//     return (
//         <div className="">

//             {callButtonVisible && remoteUserId && (
//                 <button
//                     onClick={startCall}
//                     className="gbp-chat-sidebar-header__icon green"
//                 >
//                     <ion-icon name="videocam-outline"></ion-icon>
//                 </button>
//             )}
//             {iscall &&
//                 <div className="call-container">
//                     {myStream && <VideoPlayer stream={myStream} cal="local-video" name="My Stream" />}
//                     {remoteStream && <VideoPlayer stream={remoteStream} cal="remote-video" name="Remote Stream" />}
//                 </div>
//             }
//             {callActive && (
//                 <button
//                     onClick={endCall}
//                     className="bg-red-500 hover:bg-red-600 mt-4 px-6 py-2 rounded-lg"
//                 >
//                     End Call
//                 </button>
//             )}
//         </div>
//     );
// };

// export default VideoCallPage;



















import React, { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import VideoPlayer from "./VideoPlayer";
import "./VideoCall.css";

// MUI Icons
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallIcon from "@mui/icons-material/Call";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

/**
 * PeerService: follows the method names you provided:
 * - setLocalDescription(ans)  <- NOTE: kept the same name but it sets remoteDescription (matches your original)
 * - getAnswer(offer)
 * - getOffer()
 * - toggleAudio(), toggleVideo()
 *
 * Added utilities:
 * - createPeer(iceServers)
 * - addLocalStream(stream)
 * - addIceCandidate(candidate)
 * - flushPendingCandidates()
 * - set handlers: setIceCandidateHandler, setTrackHandler, setIceStateHandler
 */
class PeerService {
    constructor() {
        if (typeof window !== "undefined") {
            this.peer = null;
            this.localStream = null;
            this.remoteStream = new MediaStream();
            this.pendingCandidates = [];
            this.iceCandidateHandler = null;
            this.trackHandler = null;
            this.iceStateHandler = null;
        }
    }

    createPeer(iceServers = null) {
        // Close existing peer if present
        if (this.peer) {
            try {
                this.peer.close();
            } catch (e) { }
            this.peer = null;
        }

        this.remoteStream = new MediaStream();
        const defaultIce = [
            { urls: "stun:stun.l.google.com:19302" },
            // Metered OpenRelay (limited free testing)
            {
                urls: [
                    "turn:openrelay.metered.ca:80",
                    "turn:openrelay.metered.ca:443",
                    "turns:openrelay.metered.ca:443",
                ],
                username: "openrelayproject",
                credential: "openrelayproject",
            },
        ];

        this.peer = new RTCPeerConnection({ iceServers: iceServers || defaultIce });

        // ICE candidate event
        this.peer.onicecandidate = (e) => {
            if (e.candidate) {
                // if handler present, call it; else stash
                if (this.iceCandidateHandler) {
                    this.iceCandidateHandler(e.candidate);
                } else {
                    this.pendingCandidates.push(e.candidate);
                }
            }
        };

        // Track event - append to remoteStream
        this.peer.ontrack = (e) => {
            try {
                e.streams[0].getTracks().forEach((t) => {
                    // avoid adding duplicates
                    const exists = this.remoteStream.getTracks().some((tt) => tt.id === t.id);
                    if (!exists) this.remoteStream.addTrack(t);
                });
            } catch (err) {
                // fallback: add tracks from event directly
                e.track && this.remoteStream.addTrack(e.track);
            }
            if (this.trackHandler) this.trackHandler(this.remoteStream);
        };

        // ICE state changes
        this.peer.oniceconnectionstatechange = () => {
            if (this.iceStateHandler) this.iceStateHandler(this.peer.iceConnectionState);
        };

        return this.peer;
    }

    // set callbacks
    setIceCandidateHandler(fn) {
        this.iceCandidateHandler = fn;
        // flush any previously queued outgoing candidates
    }
    setTrackHandler(fn) {
        this.trackHandler = fn;
        // if remote stream already has tracks, notify immediately
        if (this.remoteStream && this.remoteStream.getTracks().length > 0) {
            fn(this.remoteStream);
        }
    }
    setIceStateHandler(fn) {
        this.iceStateHandler = fn;
        if (this.peer) fn(this.peer.iceConnectionState);
    }

    async addLocalStream(stream) {
        if (!this.peer) throw new Error("Peer not created");
        this.localStream = stream;
        // add tracks; avoid duplicates
        stream.getTracks().forEach((track) => {
            try {
                // addTrack expects the stream param; add sender only if not added
                const exists = this.peer.getSenders().some((s) => s.track && s.track.id === track.id);
                if (!exists) this.peer.addTrack(track, stream);
            } catch (e) { }
        });
    }

    // Keep the original name the code you gave used (it actually sets remote description).
    // So we preserve semantics: setLocalDescription will setRemoteDescription.
    async setLocalDescription(ans) {
        if (!this.peer) throw new Error("Peer not created");
        // ans might be JSON-stringified or object with sdp/type
        const desc = typeof ans === "string" ? JSON.parse(ans) : ans;
        await this.peer.setRemoteDescription(new RTCSessionDescription(desc));
    }

    // getAnswer: accepts an optional offer (RTCSessionDescriptionInit or object).
    // If offer provided, it will setRemoteDescription(offer), then createAnswer -> setLocalDescription(answer) and return answer object.
    async getAnswer(offer = null) {
        if (!this.peer) throw new Error("Peer not created");
        if (offer) {
            const o = typeof offer === "string" ? JSON.parse(offer) : offer;
            await this.peer.setRemoteDescription(new RTCSessionDescription(o));
        }
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        // flush any pending remote candidates after we've set remote description
        await this.flushPendingCandidates();
        return answer;
    }

    // getOffer: createOffer + setLocalDescription -> return offer
    async getOffer() {
        if (!this.peer) throw new Error("Peer not created");
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        // flush outgoing candidates if any queued (not typical)
        return offer;
    }

    // allow adding remote ICE candidates safely
    async addIceCandidate(candidate) {
        if (!this.peer) {
            // buffer them until peer is ready
            this.pendingCandidates.push(candidate);
            return;
        }
        try {
            // If remoteDescription exists add candidate immediately, else buffer
            if (this.peer.remoteDescription && this.peer.remoteDescription.type) {
                await this.peer.addIceCandidate(candidate);
            } else {
                this.pendingCandidates.push(candidate);
            }
        } catch (e) {
            // ignore individual add errors
        }
    }

    async flushPendingCandidates() {
        if (!this.peer) return;
        for (const c of this.pendingCandidates) {
            try {
                await this.peer.addIceCandidate(c);
            } catch (e) {
                // ignore
            }
        }
        this.pendingCandidates = [];
    }

    toggleAudio() {
        // toggle senders if present, fallback to localStream tracks
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
        }
        try {
            this.peer.getSenders().forEach((s) => {
                if (s.track && s.track.kind === "audio") s.track.enabled = !s.track.enabled;
            });
        } catch (e) { }
    }

    toggleVideo() {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
        }
        try {
            this.peer.getSenders().forEach((s) => {
                if (s.track && s.track.kind === "video") s.track.enabled = !s.track.enabled;
            });
        } catch (e) { }
    }

    close() {
        try {
            this.localStream?.getTracks().forEach((t) => t.stop());
        } catch (e) { }
        try {
            this.remoteStream?.getTracks().forEach((t) => t.stop());
        } catch (e) { }

        try {
            this.peer?.close();
        } catch (e) { }

        this.peer = null;
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.pendingCandidates = [];
    }
}

// single shared instance (like your example)
const peerService = new PeerService();

/* ===================
   React component (uses peerService)
   =================== */
const VideoCallPage = ({ remoteUserId, remoteUserName }) => {
    const socketRef = useRef(null);

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const [incomingCall, setIncomingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);
    const [callActive, setCallActive] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    // Initialize socket once
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId: localStorage.getItem("userId") },
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // Wire peerService handlers (only once)
    useEffect(() => {
        // outgoing ICE candidate -> send via signaling
        peerService.setIceCandidateHandler((candidate) => {
            if (candidate && remoteUserId) {
                socketRef.current.emit("ice-candidate", {
                    toUserId: remoteUserId,
                    candidate,
                });
            }
        });

        // remote tracks -> update state
        peerService.setTrackHandler((rs) => {
            setRemoteStream(rs);
        });

        // ICE state
        peerService.setIceStateHandler((state) => {
            if (state === "connected" || state === "completed") setCallActive(true);
            if (state === "disconnected" || state === "failed" || state === "closed") {
                setCallActive(false);
            }
        });

        return () => {
            // Clear handlers on unmount
            peerService.setIceCandidateHandler(null);
            peerService.setTrackHandler(null);
            peerService.setIceStateHandler(null);
        };
    }, [remoteUserId]);

    // Signaling handlers
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
            setCallerInfo({ userId: fromUserId, name: callerName });
            setIncomingCall(true);

            // prepare peer and local stream
            await preparePeerAndMedia();

            // set remote description (keeps method name as in your original)
            await peerService.setLocalDescription(JSON.parse(offer));
            await peerService.flushPendingCandidates();
        });

        socket.on("call:accepted", async ({ answer }) => {
            // remote party answered our offer
            await peerService.setLocalDescription(JSON.parse(answer));
            await peerService.flushPendingCandidates();
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            if (!candidate) return;
            await peerService.addIceCandidate(candidate);
        });

        socket.on("call:end", () => {
            onEndCallLocalCleanup();
        });

        return () => {
            socket.off("incoming:call");
            socket.off("call:accepted");
            socket.off("ice-candidate");
            socket.off("call:end");
        };
    }, []);

    // helper to prepare peer & local media
    const preparePeerAndMedia = useCallback(async () => {
        // create the RTCPeerConnection with ICE servers (keeps your default STUN+Metered openrelay)
        peerService.createPeer();

        // get media (note: will fail on non-secure context unless localhost)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        await peerService.addLocalStream(stream);
        setMyStream(stream);

        // attach any already-received remote tracks
        setRemoteStream(peerService.remoteStream);

        // flush any candidates that arrived before remoteDescription
        await peerService.flushPendingCandidates();
    }, []);

    /* -------------------- CALL ACTIONS -------------------- */
    const startCall = async () => {
        // create peer and attach local media
        await preparePeerAndMedia();

        // create offer using PeerService
        const offer = await peerService.getOffer();

        // send offer to remote via signaling
        socketRef.current.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
            callerName: localStorage.getItem("userName") || "User",
        });

        // Do NOT setCallActive(true) here; ice state handler will update it when connected
    };

    const acceptCall = async () => {
        // the incoming offer should already have been set via the incoming:call handler
        // create answer (PeerService will create and setLocalDescription)
        const answer = await peerService.getAnswer();

        socketRef.current.emit("call:accepted", {
            toUserId: callerInfo.userId,
            answer: JSON.stringify(answer),
        });

        setIncomingCall(false);
        // callActive will be set when ICE transitions to connected/completed
    };

    const rejectCall = () => {
        socketRef.current.emit("call:rejected", {
            toUserId: callerInfo.userId,
        });
        setIncomingCall(false);
    };

    const endCall = () => {
        // notify remote
        socketRef.current.emit("call:end", {
            toUserId: remoteUserId || callerInfo?.userId,
        });
        onEndCallLocalCleanup();
    };

    const onEndCallLocalCleanup = () => {
        peerService.close();
        setCallActive(false);
        setIncomingCall(false);
        setMyStream(null);
        setRemoteStream(null);
    };

    /* -------------------- CONTROLS -------------------- */
    const toggleMute = () => {
        peerService.toggleAudio();
        // reflect new state based on localStream
        const audioEnabled = myStream?.getAudioTracks()[0]?.enabled ?? false;
        setIsMuted(!audioEnabled);
    };

    const toggleVideo = () => {
        peerService.toggleVideo();
        const videoEnabled = myStream?.getVideoTracks()[0]?.enabled ?? false;
        setIsVideoOff(!videoEnabled);
    };

    /* -------------------- UI (unchanged) -------------------- */
    return (
        <div className="video-call-container">
            {incomingCall && (
                <div className="incoming-call-overlay">
                    <div className="incoming-call-modal">
                        <h2>{callerInfo?.name}</h2>
                        <p>Incoming video call</p>
                        <div className="incoming-call-actions">
                            <button className="accept-call-btn" onClick={acceptCall}>
                                <CallIcon />
                            </button>
                            <button className="reject-call-btn" onClick={rejectCall}>
                                <PhoneDisabledIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {callActive && (
                <div className="video-call-interface">
                    <div className="remote-video-container">
                        {remoteStream && (
                            <VideoPlayer stream={remoteStream} name={remoteUserName} />
                        )}
                    </div>

                    <div className="local-video-container">
                        {myStream && <VideoPlayer stream={myStream} name={"Me"} isSmall muted />}
                    </div>

                    <div className="call-controls">
                        <button
                            className="end-call-btn"
                            style={{ background: "#918989ff" }}
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOffIcon /> : <MicIcon />}
                        </button>

                        <button
                            className="end-call-btn"
                            style={{ background: "rgba(41, 107, 91, 1)" }}
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                        </button>

                        <button className="end-call-btn" onClick={endCall}>
                            <CallEndIcon />
                        </button>
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
