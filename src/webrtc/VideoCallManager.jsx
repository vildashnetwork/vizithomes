import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PeerServiceClass from './PeerService';
import { connectSocket, getSocket } from '../realTimeConnect/socketconnect';

const EVENT_TRIGGER_OUTGOING_CALL = 'TRIGGER_OUTGOING_CALL';

const containerStyle = {
  position: 'fixed',
  right: 16,
  bottom: 16,
  width: 360,
  maxWidth: '94vw',
  height: 260,
  zIndex: 9999,
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  borderRadius: 12,
  overflow: 'hidden',
  background: '#0b1220',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(17,24,39,0.85)'
};

const videosStyle = {
  position: 'relative',
  flex: 1,
  background: '#111827',
};

const remoteVideoStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  background: '#000'
};

const localVideoStyle = {
  position: 'absolute',
  right: 8,
  bottom: 8,
  width: 120,
  height: 80,
  objectFit: 'cover',
  borderRadius: 8,
  background: '#000',
  border: '1px solid rgba(255,255,255,0.1)'
};

const controlsStyle = {
  display: 'flex',
  gap: 8,
  padding: 8,
  background: 'rgba(17,24,39,0.85)',
  borderTop: '1px solid rgba(255,255,255,0.06)'
};

const pillBtn = (bg) => ({
  padding: '8px 10px',
  borderRadius: 999,
  border: 'none',
  color: '#fff',
  background: bg,
  cursor: 'pointer'
});

export default function VideoCallManager() {
  const peer = useMemo(() => PeerServiceClass.getInstance(), []);

  const [incomingCall, setIncomingCall] = useState(null); // kept for compatibility, but UI is moved to popup
  const [callActive, setCallActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [remoteUser, setRemoteUser] = useState(null); // { id, name }

  // Local UI states removed (popup owns media/UI)
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const userId = useMemo(() => localStorage.getItem('userId') || localStorage.getItem('ownerId') || localStorage.getItem('uid'), []);
  const selfName = useMemo(() => localStorage.getItem('userName') || localStorage.getItem('ownerName') || 'Me', []);

  const lastRemoteOffer = useRef(null);
  const callWinRef = useRef(null);
  const callWinRemoteIdRef = useRef(null);
  const callWinPollRef = useRef(null);

  // Ensure socket connection
  useEffect(() => {
    let s = getSocket();
    if (!s && userId) s = connectSocket(userId);
  }, [userId]);

  // Configure Peer handlers once
  useEffect(() => {
    peer.setHandlers({
      onIceCandidate: (candidate) => {
        const s = getSocket();
        if (s && remoteUser?.id) {
          s.emit('ice-candidate', { toUserId: remoteUser.id, candidate });
        }
      },
      onRemoteStream: (rs) => setRemoteStream(rs),
      onIceStateChange: (state) => {
        if (state === 'connected' || state === 'completed') setCallActive(true);
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          // allow some time for renegotiation before tearing down for 'disconnected'
          setTimeout(() => {
            if (!document.hidden) return; // if tab visible and quick flake, keep
            cleanupCall();
          }, 3000);
        }
      },
    });
  }, [peer, remoteUser]);

  // In popup flow, we don't create peer/media in the main window anymore
  const preparePeer = useCallback(async () => {}, []);

  const openCallWindow = useCallback((remoteId, name, role, auto='0') => {
    if (window.location.pathname.startsWith('/call/')) return;
    if (callWinRef.current && !callWinRef.current.closed) {
      try { callWinRef.current.focus(); } catch (_) {}
      return;
    }
    const url = `/call/${encodeURIComponent(remoteId)}?name=${encodeURIComponent(name || 'User')}&role=${role}${role==='callee' ? `&auto=${auto}` : ''}`;
    const features = 'popup=yes,width=900,height=650,noopener,noreferrer';
    const w = window.open(url, '_blank', features);
    if (w) {
      callWinRef.current = w;
      callWinRemoteIdRef.current = remoteId;
      try { w.focus(); } catch (_) {}
      if (callWinPollRef.current) clearInterval(callWinPollRef.current);
      callWinPollRef.current = setInterval(() => {
        if (!callWinRef.current || callWinRef.current.closed) {
          clearInterval(callWinPollRef.current);
          callWinPollRef.current = null;
          callWinRef.current = null;
          callWinRemoteIdRef.current = null;
        }
      }, 1000);
    } else {
      const key = `call:nav-fallback:${remoteId}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.href = url;
      }
    }
  }, []);

  const startOutgoingCall = useCallback(async ({ remoteUserId, remoteUserName }) => {
    setIncomingCall(null);
    setRemoteUser({ id: remoteUserId, name: remoteUserName });
    setIsMinimized(false);
    openCallWindow(remoteUserId, remoteUserName, 'caller');
  }, [openCallWindow]);

  // Window global event listener for triggers
  useEffect(() => {
    const handler = (e) => {
      const { remoteUserId, remoteUserName } = e.detail || {};
      if (!remoteUserId) return;
      startOutgoingCall({ remoteUserId, remoteUserName });
    };
    window.addEventListener(EVENT_TRIGGER_OUTGOING_CALL, handler);
    return () => window.removeEventListener(EVENT_TRIGGER_OUTGOING_CALL, handler);
  }, [startOutgoingCall]);

  // Socket signaling listeners
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const onIncoming = (payload = {}) => {
      const fromId = payload.fromUserId || payload.from || payload.callerId || payload.userId || payload.senderId;
      const name = payload.fromName || payload.callerName || payload.name || 'User';
      if (!fromId) return;
      openCallWindow(fromId, name, 'callee', '1');
    };

    const onEnded = () => {
      if (callWinRef.current && !callWinRef.current.closed) {
        try { callWinRef.current.close(); } catch (_) {}
      }
      if (callWinPollRef.current) { clearInterval(callWinPollRef.current); callWinPollRef.current = null; }
      callWinRef.current = null;
      callWinRemoteIdRef.current = null;
    };

    s.on('incoming:call', onIncoming);
    s.on('call:end', onEnded);
    return () => { s.off('incoming:call', onIncoming); s.off('call:end', onEnded); };
  }, [openCallWindow]);

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    const answer = await peer.createAnswer(JSON.parse(incomingCall.offer));
    const s = getSocket();
    s?.emit('call:accepted', {
      toUserId: incomingCall.fromUserId,
      answer: JSON.stringify(answer),
      fromUserId: userId,
    });
    setIncomingCall(null);
    setCallActive(true);
  }, [incomingCall, peer, userId]);

  const rejectCall = useCallback(() => {
    // No dedicated event in spec; just cleanup locally
    cleanupCall();
    setIncomingCall(null);
  }, []);

  const cleanupCall = useCallback(() => {
    try {
      peer.dispose();
    } catch (_) {}
    setCallActive(false);
    setLocalStream(null);
    setRemoteStream(null);
    setRemoteUser(null);
  }, [peer]);

  const endCall = useCallback(() => {
    cleanupCall();
  }, [cleanupCall]);

  const toggleMute = () => {
    peer.toggleAudio();
    const enabled = localStream?.getAudioTracks?.()[0]?.enabled;
    setIsMuted(!enabled);
  };

  const toggleVideo = () => {
    peer.toggleVideo();
    const enabled = localStream?.getVideoTracks?.()[0]?.enabled;
    setIsVideoOff(!enabled);
  };

  // Global unmount cleanup
  useEffect(() => cleanupCall, [cleanupCall]);

  // Clear popup poll timer on unmount
  useEffect(() => () => { if (callWinPollRef.current) clearInterval(callWinPollRef.current); }, []);

  // Manager no longer renders any call UI in main window
  return null;
}
