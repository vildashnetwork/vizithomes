// Singleton PeerService to manage RTCPeerConnection, media tracks, and ICE
class PeerService {
  static instance;
  static getInstance() {
    if (!this.instance) this.instance = new PeerService();
    return this.instance;
  }

  constructor() {
    this.pc = null;
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.pendingCandidates = [];
    this.onIceCandidate = null;
    this.onRemoteStream = null;
    this.onIceStateChange = null;
  }

  createPeer() {
    if (this.pc) this.dispose();
    this.remoteStream = new MediaStream();

    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: [
            'stun:stun.relay.metered.ca:80',
            'turn:global.relay.metered.ca:80',
            'turn:global.relay.metered.ca:80?transport=tcp',
            'turn:global.relay.metered.ca:443',
            'turns:global.relay.metered.ca:443?transport=tcp',
          ],
          username: '23dd2c881c792610daaef11f',
          credential: 'J2wwbRWdLWsRYv5T',
        },
      ],
    });

    this.pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      if (this.onIceCandidate) this.onIceCandidate(e.candidate);
      else this.pendingCandidates.push(e.candidate);
    };

    this.pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => {
        if (!this.remoteStream.getTracks().some((x) => x.id === t.id)) {
          this.remoteStream.addTrack(t);
        }
      });
      this.onRemoteStream?.(new MediaStream(this.remoteStream.getTracks()));
    };

    this.pc.oniceconnectionstatechange = () => {
      this.onIceStateChange?.(this.pc.iceConnectionState);
    };
  }

  setHandlers({ onIceCandidate, onRemoteStream, onIceStateChange }) {
    this.onIceCandidate = onIceCandidate || null;
    this.onRemoteStream = onRemoteStream || null;
    this.onIceStateChange = onIceStateChange || null;
    if (this.remoteStream && this.remoteStream.getTracks().length && this.onRemoteStream) {
      this.onRemoteStream(new MediaStream(this.remoteStream.getTracks()));
    }
  }

  async setLocalMedia(constraints = { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 }, video: true }) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.localStream = stream;
    stream.getTracks().forEach((t) => {
      if (!this.pc.getSenders().some((s) => s.track?.id === t.id)) this.pc.addTrack(t, stream);
    });
    return stream;
  }

  optimizeSDP(sdp) {
    return typeof sdp === 'string' ? sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=0; sprop-maxcapturerate=16000') : sdp;
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    offer.sdp = this.optimizeSDP(offer.sdp);
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(remoteOffer) {
    if (remoteOffer) await this.pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await this.pc.createAnswer();
    answer.sdp = this.optimizeSDP(answer.sdp);
    await this.pc.setLocalDescription(answer);
    await this._flushPending();
    return answer;
  }

  async applyRemoteDescription(desc) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(desc));
    await this._flushPending();
  }

  async addRemoteIce(candidate) {
    if (this.pc?.remoteDescription) await this.pc.addIceCandidate(candidate);
    else this.pendingCandidates.push(candidate);
  }

  async _flushPending() {
    for (const c of this.pendingCandidates) await this.pc.addIceCandidate(c);
    this.pendingCandidates = [];
  }

  toggleAudio(enabled) {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled ?? !t.enabled));
  }

  toggleVideo(enabled) {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled ?? !t.enabled));
  }

  dispose() {
    try {
      this.localStream?.getTracks().forEach((t) => t.stop());
      this.pc?.getSenders().forEach((s) => s.track && this.pc.removeTrack(s));
      this.pc?.close();
    } catch (_) {}
    this.pc = null;
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.pendingCandidates = [];
    this.onIceCandidate = null;
    this.onRemoteStream = null;
    this.onIceStateChange = null;
  }
}

export default PeerService;