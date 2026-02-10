

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PeerServiceClass from './PeerService';
import { connectSocket, getSocket } from '../realTimeConnect/socketconnect';

const container = {
  position: 'fixed', inset: 0, background: '#000', color: '#fff', zIndex: 99999,
  display: 'flex', flexDirection: 'column'
};
const videoWrap = { position: 'relative', flex: 1, background: '#000' };
const remoteVideo = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
const localVideo = { position: 'absolute', right: 12, bottom: 12, width: 160, height: 110, borderRadius: 8, objectFit: 'cover', background: '#111', border: '1px solid rgba(255,255,255,0.12)' };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(17,24,39,0.85)' };
const controls = { display: 'flex', gap: 10, padding: 12, background: 'rgba(17,24,39,0.85)', borderTop: '1px solid rgba(255,255,255,0.06)' };
const pill = (bg) => ({ padding: '8px 14px', borderRadius: 999, border: 'none', background: bg, color: '#fff', cursor: 'pointer' });

export default function CallWindow() {
  const { remoteId } = useParams();
  const [search] = useSearchParams();
  const role = search.get('role') || 'caller'; // 'caller' | 'callee'
  const remoteName = decodeURIComponent(search.get('name') || 'User');

  const userId = useMemo(() => localStorage.getItem('userId') || localStorage.getItem('ownerId') || localStorage.getItem('uid'), []);
  const selfName = useMemo(() => localStorage.getItem('userName') || localStorage.getItem('ownerName') || 'Me', []);

  const peer = useMemo(() => PeerServiceClass.getInstance(), []);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [hasIncoming, setHasIncoming] = useState(false);
  const [pendingFromId, setPendingFromId] = useState(null);
  const [pendingFromName, setPendingFromName] = useState('');
  const ringRef = useRef(null);

  // Ensure socket is connected inside popup
  useEffect(() => {
    let s = getSocket();
    if (!s && userId) s = connectSocket(userId);
  }, [userId]);

  // Prepare peer and media
  const preparePeer = useCallback(async () => {
    peer.createPeer();
    peer.setHandlers({
      onIceCandidate: (candidate) => {
        let s = getSocket();
        if (!s && userId) s = connectSocket(userId);
        if (!remoteId) return;
        const payload = { toUserId: remoteId, candidate };
        if (s) {
          if (s.connected) s.emit('ice-candidate', payload);
          else s.once('connect', () => s.emit('ice-candidate', payload));
        }
      },
      onRemoteStream: (rs) => setRemoteStream(rs),
      onIceStateChange: (state) => {
        if (state === 'connected' || state === 'completed') setCallActive(true);
      }
    });

    const ls = await peer.setLocalMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 }, video: true });
    setLocalStream(ls);
    setRemoteStream(peer.remoteStream);
  }, [peer, remoteId]);

  // Caller: start or re-start (on refresh) by sending a fresh offer
  const startAsCaller = useCallback(async () => {
    await preparePeer();
    const offer = await peer.createOffer();

    let s = getSocket();
    if (!s && userId) s = connectSocket(userId);

    const payloadStd = { toUserId: remoteId, offer: JSON.stringify(offer), fromUserId: userId, fromName: selfName };
    const payloadLegacy = { toUserId: remoteId, offer: JSON.stringify(offer), callerName: selfName };

    const emitNow = () => {
      s.emit('outgoing:call', payloadStd);
      s.emit('user:call', payloadLegacy);
      setIsRinging(true);
    };
    if (s?.connected) emitNow(); else if (s) s.once('connect', emitNow);
  }, [preparePeer, peer, remoteId, selfName, userId]);

  // Callee: accept incoming (canonical payload)
  const acceptIncoming = useCallback(async () => {
    if (accepting || !incomingOffer) return;
    setAccepting(true);
    try {
      const offerObj = typeof incomingOffer === 'string' ? JSON.parse(incomingOffer) : incomingOffer;
      await peer.applyRemoteDescription(offerObj);
      const answer = await peer.createAnswer();
      let s = getSocket();
      if (!s && userId) s = connectSocket(userId);
      const payload = {
        toUserId: pendingFromId || remoteId,
        to: pendingFromId || remoteId,
        answer: JSON.stringify(answer),
        sdp: JSON.stringify(answer),
        fromUserId: userId,
        from: userId,
      };
      if (s) {
        if (s.connected) s.emit('call:accepted', payload);
        else s.once('connect', () => s.emit('call:accepted', payload));
      }
      setIncomingOffer(null);
      setCallActive(true);
      setIsRinging(false);
      setHasIncoming(false);
    } catch (e) {
      console.error('Accept call failed', e);
    } finally {
      setAccepting(false);
    }
  }, [incomingOffer, accepting, peer, remoteId, pendingFromId, userId]);

  const endCall = useCallback(() => {
    try { peer.dispose(); } catch (_) { }
    const s = getSocket();
    // Explicit end
    s?.emit('call:end', { toUserId: remoteId });
    window.close();
  }, [peer, remoteId]);

  // Socket listeners in popup
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const onIncoming = async (payload = {}) => {
      const fromId = payload.fromUserId || payload.from || payload.callerId || payload.userId || payload.senderId || remoteId;
      const fromName = payload.fromName || payload.callerName || payload.name || 'User';
      const offerRaw = payload.offer || payload.sdp || null;
      // Relaxed check: accept and show UI even if ID is missing or mismatched
      setHasIncoming(true);
      setPendingFromId(fromId);
      setPendingFromName(fromName);
      // Prepare media early to minimize delays
      await preparePeer();
      if (offerRaw) {
        const offerObj = typeof offerRaw === 'string' ? (() => { try { return JSON.parse(offerRaw); } catch (_) { return null; } })() : offerRaw;
        if (offerObj) {
          await peer.applyRemoteDescription(offerObj);
          setIncomingOffer(offerObj);
        }
      }
      setIsRinging(true);
    };

    const onAccepted = async (payload = {}) => {
      if (role !== 'caller') return; // Only the original caller should handle this
      const answerRaw = payload.answer || payload.sdp || null;
      if (!answerRaw) return;
      const answerObj = typeof answerRaw === 'string' ? (() => { try { return JSON.parse(answerRaw); } catch (_) { return null; } })() : answerRaw;
      if (!answerObj) return;
      try { await peer.applyRemoteDescription(answerObj); setCallActive(true); setIsRinging(false); } catch (_) { }
    };

    const onRejected = () => {
      setIsRinging(false);
      try { peer.dispose(); } catch (_) { }
      window.close();
    };

    const onIce = async ({ candidate }) => { if (candidate) { try { await peer.addRemoteIce(candidate); } catch (_) { } } };

    const onEnded = () => {
      setIsRinging(false);
      try { peer.dispose(); } catch (_) { }
      window.close();
    };

    s.on('incoming:call', onIncoming);
    s.on('call:accepted', onAccepted);
    s.on('call:rejected', onRejected);
    s.on('ice-candidate', onIce);
    s.on('call:end', onEnded);

    return () => {
      s.off('incoming:call', onIncoming);
      s.off('call:accepted', onAccepted);
      s.off('call:rejected', onRejected);
      s.off('ice-candidate', onIce);
      s.off('call:end', onEnded);
    };
  }, [peer, preparePeer, remoteId]);

  // Start by role
  useEffect(() => {
    if (role === 'caller') startAsCaller();
    if (role === 'callee') {
      // Force-show incoming UI for callee popup so Accept is always visible
      setHasIncoming(true);
      // Keep a safety timer to ensure overlay remains visible for a short period
      const t = setTimeout(() => setHasIncoming((v) => v || true), 2000);
      return () => clearTimeout(t);
    }
    // Callee waits for incoming:call; optionally auto-accept if query ?auto=1
  }, [role, startAsCaller]);


  // Attempt auto-accept if requested
  useEffect(() => {
    const auto = search.get('auto');
    if (role === 'callee' && auto === '1' && incomingOffer) {
      acceptIncoming();
    }
  }, [role, search, incomingOffer, acceptIncoming]);

  // Ringtone control
  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    if (isRinging) {
      const tryPlay = () => el.play().catch(() => { });
      el.currentTime = 0;
      tryPlay();
    } else {
      try { el.pause(); el.currentTime = 0; } catch (_) { }
    }
  }, [isRinging]);

  useEffect(() => { if (callActive) setIsRinging(false); }, [callActive]);

  // Avoid ending the call on refresh: do not emit call:end on beforeunload when it's a reload
  useEffect(() => {
    const onBeforeUnload = (e) => {
      // Intentionally do not end the call on refresh; peer.dispose() will happen and renegotiation will re-establish
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const toggleMute = () => { peer.toggleAudio(); const enabled = localStream?.getAudioTracks?.()[0]?.enabled; setIsMuted(!enabled); };
  const toggleVideo = () => { peer.toggleVideo(); const enabled = localStream?.getVideoTracks?.()[0]?.enabled; setIsVideoOff(!enabled); };

  return (
    <div style={container}>
      <div style={header}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <strong>{remoteName}</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{callActive ? 'Live' : (role === 'caller' ? 'Calling…' : (incomingOffer ? 'Incoming…' : 'Waiting…'))}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={pill('#374151')} onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
          <button style={pill('#374151')} onClick={toggleVideo}>{isVideoOff ? 'Start Video' : 'Stop Video'}</button>
          <button style={pill('#b91c1c')} onClick={endCall}>End</button>
        </div>
      </div>

      <div style={videoWrap}>
        <video style={remoteVideo} autoPlay playsInline ref={(el) => { if (el && remoteStream) { el.srcObject = remoteStream; el.muted = false; el.play().catch(() => { }); } }} />
        <video style={localVideo} autoPlay playsInline muted ref={(el) => { if (el && localStream) { el.srcObject = localStream; el.muted = true; el.play().catch(() => { }); } }} />

        {/* Caller ringing overlay */}
        {role === 'caller' && !callActive && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#0b1220', padding: 20, borderRadius: 10, minWidth: 280, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{remoteName}</div>
              <div style={{ opacity: 0.8, marginBottom: 14 }}>Calling…</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button style={pill('#b91c1c')} onClick={endCall}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {role === 'callee' && hasIncoming && !callActive && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0b1220', padding: 20, borderRadius: 10, minWidth: 280, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{remoteName}</div>
            <div style={{ opacity: 0.8, marginBottom: 14 }}>Incoming video call</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button style={pill('#065f46')} onClick={acceptIncoming}>Accept</button>
              <button style={pill('#b91c1c')} onClick={endCall}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {callActive && (
        <div style={controls}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Connected</div>
        </div>
      )}
      <audio ref={ringRef} src="https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg" loop preload="auto" />
    </div>
  );
}
