





















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

const VideoCallPage = ({ remoteUserId, remoteUserName }) => {
    const socketRef = useRef(null);
    const pcRef = useRef(null);

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const [incomingCall, setIncomingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState(null);
    const [callActive, setCallActive] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    /* -------------------- INIT SOCKET -------------------- */
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId: localStorage.getItem("userId") }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    /* -------------------- PEER CONNECTION -------------------- */
    const createPeerConnection = useCallback(async () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        setMyStream(stream);

        const remote = new MediaStream();
        setRemoteStream(remote);

        pc.ontrack = e => {
            e.streams[0].getTracks().forEach(track => remote.addTrack(track));
        };

        pc.onicecandidate = e => {
            if (e.candidate && remoteUserId) {
                socketRef.current.emit("ice-candidate", {
                    toUserId: remoteUserId,
                    candidate: e.candidate
                });
            }
        };

        pcRef.current = pc;
    }, [remoteUserId]);

    /* -------------------- SOCKET EVENTS -------------------- */
    useEffect(() => {
        const socket = socketRef.current;

        socket.on("incoming:call", async ({ fromUserId, offer, callerName }) => {
            setCallerInfo({ userId: fromUserId, name: callerName });
            setIncomingCall(true);
            await createPeerConnection();
            await pcRef.current.setRemoteDescription(JSON.parse(offer));
        });

        socket.on("call:accepted", async ({ answer }) => {
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
            setCallActive(true);
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            try {
                await pcRef.current.addIceCandidate(candidate);
            } catch { }
        });

        socket.on("call:end", endCall);

        return () => {
            socket.off("incoming:call");
            socket.off("call:accepted");
            socket.off("ice-candidate");
            socket.off("call:end");
        };
    }, [createPeerConnection]);

    /* -------------------- CALL ACTIONS -------------------- */
    const startCall = async () => {
        await createPeerConnection();
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        socketRef.current.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
            callerName: localStorage.getItem("userName") || "User"
        });

        setCallActive(true);
    };

    const acceptCall = async () => {
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        socketRef.current.emit("call:accepted", {
            toUserId: callerInfo.userId,
            answer: JSON.stringify(answer)
        });

        setIncomingCall(false);
        setCallActive(true);
    };

    const rejectCall = () => {
        socketRef.current.emit("call:rejected", {
            toUserId: callerInfo.userId
        });
        setIncomingCall(false);
    };

    const endCall = () => {
        pcRef.current?.close();
        pcRef.current = null;

        myStream?.getTracks().forEach(t => t.stop());
        setMyStream(null);
        setRemoteStream(null);

        socketRef.current.emit("call:end", {
            toUserId: remoteUserId || callerInfo?.userId
        });

        setCallActive(false);
        setIncomingCall(false);
    };

    /* -------------------- CONTROLS -------------------- */
    const toggleMute = () => {
        const track = myStream?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        }
    };

    const toggleVideo = () => {
        const track = myStream?.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setIsVideoOff(!track.enabled);
        }
    };

    /* -------------------- UI -------------------- */
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
                        {remoteStream && <VideoPlayer stream={remoteStream} name={remoteUserName} />}
                    </div>

                    <div className="local-video-container">
                        {myStream && (
                            <VideoPlayer stream={myStream} name={"Me"} muted isSmall />
                        )}
                    </div>

                    <div className="call-controls">
                        <button className="end-call-btn" style={{ background: "#918989ff" }} onClick={toggleMute}>
                            {isMuted ? <MicOffIcon /> : <MicIcon />}
                        </button>

                        <button className="end-call-btn" style={{ background: "rgba(41, 107, 91, 1)" }} onClick={toggleVideo}>
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