
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { io } from "socket.io-client";
// import VideoPlayer from "./VideoPlayer";
// import "./VideoCall.css";

// // MUI Icons
// import CallEndIcon from "@mui/icons-material/CallEnd";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import CallIcon from "@mui/icons-material/Call";
// import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

// const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

// const VideoCallPage = ({ remoteUserId, remoteUserName }) => {
//     const socketRef = useRef(null);
//     const pcRef = useRef(null);

//     const [myStream, setMyStream] = useState(null);
//     const [remoteStream, setRemoteStream] = useState(null);

//     const [incomingCall, setIncomingCall] = useState(false);
//     const [callerInfo, setCallerInfo] = useState(null);
//     const [callActive, setCallActive] = useState(false);

//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);

//     /* -------------------- INIT SOCKET -------------------- */
//     useEffect(() => {
//         socketRef.current = io(SOCKET_SERVER_URL, {
//             query: { userId: localStorage.getItem("userId") }
//         });

//         return () => {
//             socketRef.current.disconnect();
//         };
//     }, []);

//     /* -------------------- PEER CONNECTION -------------------- */
//     const createPeerConnection = useCallback(async () => {
//         const pc = new RTCPeerConnection({
//             iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
//         });

//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         });

//         stream.getTracks().forEach(track => pc.addTrack(track, stream));
//         setMyStream(stream);

//         const remote = new MediaStream();
//         setRemoteStream(remote);

//         pc.ontrack = e => {
//             e.streams[0].getTracks().forEach(track => remote.addTrack(track));
//         };

//         pc.onicecandidate = e => {
//             if (e.candidate && remoteUserId) {
//                 socketRef.current.emit("ice-candidate", {
//                     toUserId: remoteUserId,
//                     candidate: e.candidate
//                 });
//             }
//         };

//         pcRef.current = pc;
//     }, [remoteUserId]);

//     /* -------------------- SOCKET EVENTS -------------------- */
//     useEffect(() => {
//         const socket = socketRef.current;

//         socket.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
//             setCallerInfo({ userId: fromUserId, name: callerName });
//             setIncomingCall(true);
//             await createPeerConnection();
//             await pcRef.current.setRemoteDescription(JSON.parse(offer));
//         });

//         socket.on("call:accepted", async ({ answer }) => {
//             await pcRef.current.setRemoteDescription(JSON.parse(answer));
//             setCallActive(true);
//         });

//         socket.on("ice-candidate", async ({ candidate }) => {
//             try {
//                 await pcRef.current.addIceCandidate(candidate);
//             } catch { }
//         });

//         socket.on("call:end", endCall);

//         return () => {
//             socket.off("incoming:call");
//             socket.off("call:accepted");
//             socket.off("ice-candidate");
//             socket.off("call:end");
//         };
//     }, [createPeerConnection]);

//     /* -------------------- CALL ACTIONS -------------------- */
//     const startCall = async () => {
//         await createPeerConnection();
//         const offer = await pcRef.current.createOffer();
//         await pcRef.current.setLocalDescription(offer);

//         socketRef.current.emit("user:call", {
//             toUserId: remoteUserId,
//             offer: JSON.stringify(offer),
//             callerName: localStorage.getItem("userName") || "User"
//         });

//         setCallActive(true);
//     };

//     const acceptCall = async () => {
//         const answer = await pcRef.current.createAnswer();
//         await pcRef.current.setLocalDescription(answer);

//         socketRef.current.emit("call:accepted", {
//             toUserId: callerInfo.userId,
//             answer: JSON.stringify(answer)
//         });

//         setIncomingCall(false);
//         setCallActive(true);
//     };

//     const rejectCall = () => {
//         socketRef.current.emit("call:rejected", {
//             toUserId: callerInfo.userId
//         });
//         setIncomingCall(false);
//     };

//     const endCall = () => {
//         pcRef.current?.close();
//         pcRef.current = null;

//         myStream?.getTracks().forEach(t => t.stop());
//         setMyStream(null);
//         setRemoteStream(null);

//         socketRef.current.emit("call:end", {
//             toUserId: remoteUserId || callerInfo?.userId
//         });

//         setCallActive(false);
//         setIncomingCall(false);
//     };

//     /* -------------------- CONTROLS -------------------- */
//     const toggleMute = () => {
//         const track = myStream?.getAudioTracks()[0];
//         if (track) {
//             track.enabled = !track.enabled;
//             setIsMuted(!track.enabled);
//         }
//     };

//     const toggleVideo = () => {
//         const track = myStream?.getVideoTracks()[0];
//         if (track) {
//             track.enabled = !track.enabled;
//             setIsVideoOff(!track.enabled);
//         }
//     };

//     /* -------------------- UI -------------------- */
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
//                     {/* <div className="remote-video-container">
//                         {remoteStream && <VideoPlayer stream={remoteStream} name={remoteUserName} />}
//                     </div>

//                     <div className="local-video-container">
//                         {myStream && (
//                             <VideoPlayer stream={myStream} name={"Me"} isSmall />
//                         )}
//                     </div> */}

//                     <div className="remote-video-container">
//                         {remoteStream && (
//                             <VideoPlayer
//                                 stream={remoteStream}
//                                 name={remoteUserName}
//                                 isRemote={true}
//                             />
//                         )}
//                     </div>

//                     <div className="local-video-container">
//                         {myStream && (
//                             <VideoPlayer
//                                 stream={myStream}
//                                 name="Me"
//                                 isRemote={false}
//                                 isSmall
//                             />
//                         )}
//                     </div>

//                     <div className="call-controls">
//                         <button className="end-call-btn" style={{ background: "#918989ff" }} onClick={toggleMute}>
//                             {isMuted ? <MicOffIcon /> : <MicIcon />}
//                         </button>

//                         <button className="end-call-btn" style={{ background: "rgba(41, 107, 91, 1)" }} onClick={toggleVideo}>
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















// VideoCallPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import VideoPlayer from "./VideoPlayer";
import "./VideoCall.css";

// icons (you already import in your app - placeholders here)
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallIcon from "@mui/icons-material/Call";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";
const ICE_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCallPage = ({ remoteUserId, remoteUserName = "Remote" }) => {
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    // other side id (callee for caller, caller for callee)
    const otherUserRef = useRef(null);
    // cached incoming offer for callee
    const incomingOfferRef = useRef(null);

    // local and remote streams (remote split into video/audio)
    const [localStream, setLocalStream] = useState(null);
    const [remoteVideoStream, setRemoteVideoStream] = useState(null);
    const [remoteAudioStream, setRemoteAudioStream] = useState(null);

    const [incomingCall, setIncomingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);
    const [callActive, setCallActive] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    /* ---------- Socket init ---------- */
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            query: { userId: localStorage.getItem("userId") }
        });

        const s = socketRef.current;
        // incoming call signal (callee receives)
        s.on("incoming:call", ({ fromUserId, offer, callerName }) => {
            incomingOfferRef.current = offer;
            otherUserRef.current = fromUserId;
            setCallerInfo({ userId: fromUserId, name: callerName });
            setIncomingCall(true);
        });

        // caller receives this after callee accepts
        s.on("call:accepted", async ({ fromUserId, answer }) => {
            // ensure pc exists
            if (!pcRef.current) return;
            try {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
                setCallActive(true);
            } catch (e) {
                console.error("Error setting remote description on call:accepted", e);
            }
        });

        s.on("ice-candidate", async ({ fromUserId, candidate }) => {
            try {
                if (!pcRef.current || !candidate) return;
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.warn("Failed to add ICE candidate", err);
            }
        });

        s.on("call:end", ({ fromUserId } = {}) => {
            // other side ended the call
            teardown();
        });

        return () => {
            s.removeAllListeners();
            s.disconnect();
        };
    }, []);

    /* ---------- helpers ---------- */
    const createPeerConnection = useCallback((otherUserId) => {
        // do not recreate if exists
        if (pcRef.current) return pcRef.current;

        const pc = new RTCPeerConnection(ICE_CONFIG);
        pcRef.current = pc;
        otherUserRef.current = otherUserId || otherUserRef.current;

        // create remote media containers
        const rVideo = new MediaStream();
        const rAudio = new MediaStream();
        setRemoteVideoStream(rVideo);
        setRemoteAudioStream(rAudio);

        pc.ontrack = (event) => {
            // attach tracks to proper streams (video vs audio)
            event.track && event.track.kind === "video" && !rVideo.getVideoTracks().some(t => t.id === event.track.id) && rVideo.addTrack(event.track);
            event.track && event.track.kind === "audio" && !rAudio.getAudioTracks().some(t => t.id === event.track.id) && rAudio.addTrack(event.track);
        };

        pc.onicecandidate = (evt) => {
            if (evt.candidate && otherUserRef.current) {
                socketRef.current.emit("ice-candidate", {
                    toUserId: otherUserRef.current,
                    candidate: evt.candidate
                });
            }
        };

        pc.onconnectionstatechange = () => {
            const st = pc.connectionState;
            if (st === "failed" || st === "disconnected" || st === "closed") {
                teardown();
            }
        };

        return pc;
    }, []);

    const addLocalTracksToPc = useCallback((pc, stream) => {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }, []);

    const ensureLocalStream = useCallback(async () => {
        if (localStream) return localStream;
        const s = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        setLocalStream(s);
        return s;
    }, [localStream]);

    /* ---------- caller flow: startCall ---------- */
    const startCall = useCallback(async () => {
        if (!remoteUserId) return;
        try {
            // ensure local media
            const s = await ensureLocalStream();
            // create pc and attach local tracks
            const pc = createPeerConnection(remoteUserId);
            addLocalTracksToPc(pc, s);

            // create offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // remember other user
            otherUserRef.current = remoteUserId;

            // emit offer
            socketRef.current.emit("user:call", {
                toUserId: remoteUserId,
                offer: JSON.stringify(offer),
                callerName: localStorage.getItem("userName") || "Caller"
            });

            // caller waits for call:accepted event to set remote desc
        } catch (e) {
            console.error("startCall error", e);
        }
    }, [remoteUserId, ensureLocalStream, createPeerConnection, addLocalTracksToPc]);

    /* ---------- callee flow: acceptCall ---------- */
    const acceptCall = useCallback(async () => {
        try {
            if (!incomingOfferRef.current || !otherUserRef.current) return;

            // get local media (only when user accepts)
            const s = await ensureLocalStream();

            // create pc and attach local tracks
            const pc = createPeerConnection(otherUserRef.current);
            addLocalTracksToPc(pc, s);

            // set remote offer, create and send answer
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(incomingOfferRef.current)));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socketRef.current.emit("call:accepted", {
                toUserId: otherUserRef.current,
                answer: JSON.stringify(answer)
            });

            // now in call
            setIncomingCall(false);
            setCallActive(true);
            incomingOfferRef.current = null;
        } catch (err) {
            console.error("acceptCall error", err);
        }
    }, [ensureLocalStream, createPeerConnection, addLocalTracksToPc]);

    /* ---------- reject/cancel/end ---------- */
    const rejectCall = useCallback(() => {
        if (otherUserRef.current) {
            socketRef.current.emit("call:rejected", { toUserId: otherUserRef.current });
        }
        incomingOfferRef.current = null;
        setIncomingCall(false);
        teardown();
    }, []);

    const endCall = useCallback(() => {
        if (otherUserRef.current) {
            socketRef.current.emit("call:end", { toUserId: otherUserRef.current });
        }
        teardown();
    }, []);

    const teardown = useCallback(() => {
        setCallActive(false);
        setIncomingCall(false);
        incomingOfferRef.current = null;
        otherUserRef.current = null;

        try { pcRef.current?.close(); } catch (e) { }
        pcRef.current = null;

        if (localStream) {
            localStream.getTracks().forEach(t => t.stop());
            setLocalStream(null);
        }
        if (remoteVideoStream) {
            remoteVideoStream.getTracks().forEach(t => t.stop());
            setRemoteVideoStream(null);
        }
        if (remoteAudioStream) {
            remoteAudioStream.getTracks().forEach(t => t.stop());
            setRemoteAudioStream(null);
        }
    }, [localStream, remoteVideoStream, remoteAudioStream]);

    /* ---------- controls ---------- */
    const toggleMute = useCallback(() => {
        if (!localStream) return;
        const t = localStream.getAudioTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsMuted(!t.enabled);
    }, [localStream]);

    const toggleVideo = useCallback(() => {
        if (!localStream) return;
        const t = localStream.getVideoTracks()[0];
        if (!t) return;
        t.enabled = !t.enabled;
        setIsVideoOff(!t.enabled);
    }, [localStream]);

    /* ---------- render ---------- */
    return (
        <div className="video-call-container" role="region" aria-label="video call">
            {/* Incoming modal */}
            {incomingCall && callerInfo && (
                <div className="incoming-call-overlay">
                    <div className="incoming-call-modal">
                        <h2>{callerInfo.name}</h2>
                        <p>Incoming video call</p>
                        <div className="incoming-call-actions">
                            <button className="accept-call-btn" onClick={acceptCall} aria-label="Accept call">
                                <CallIcon />
                            </button>
                            <button className="reject-call-btn" onClick={rejectCall} aria-label="Reject call">
                                <PhoneDisabledIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call UI */}
            {callActive && (
                <>
                    {/* Remote: pass remoteVideoStream and remoteAudioStream separately */}
                    <VideoPlayer
                        videoStream={remoteVideoStream}
                        audioStream={remoteAudioStream}
                        name={remoteUserName}
                        isRemote
                    />

                    {/* Local small preview (muted) */}
                    <VideoPlayer
                        videoStream={localStream}
                        name="You"
                        isRemote={false}
                        isSmall
                    />

                    <div className="call-controls">
                        <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                            {isMuted ? <MicOffIcon /> : <MicIcon />}
                        </button>

                        <button onClick={toggleVideo} aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}>
                            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                        </button>

                        <button onClick={endCall} aria-label="End call">
                            <CallEndIcon />
                        </button>
                    </div>
                </>
            )}

            {/* Idle: show start call button */}
            {!callActive && !incomingCall && remoteUserId && (
                <button className="start-call-btn" onClick={startCall} aria-label="Start call">
                    <CallIcon />
                </button>
            )}
        </div>
    );
};

export default VideoCallPage;
