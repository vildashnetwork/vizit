// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import CallIcon from '@mui/icons-material/Call';
// import VideoCallIcon from '@mui/icons-material/VideoCall';
// import VideoPlayer from './VideoPlayer'; // simple component: <video srcObject={stream} />

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

//     /** ===== CALL HANDLERS ===== **/
//     const startCall = useCallback(async () => {
//         if (!pcRef.current || !remoteUserId) return;

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
//         <div className="flex flex-col items-center justify-center w-screen h-screen">
//             <h1 className="text-3xl mb-4">
//                 Video Call Test <VideoCallIcon sx={{ fontSize: 40, color: 'green' }} />
//             </h1>

//             {callButtonVisible && remoteUserId && (
//                 <button
//                     onClick={startCall}
//                     className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
//                 >
//                     Call <CallIcon />
//                 </button>
//             )}

//             <div className="flex gap-4 mt-4">
//                 {myStream && <VideoPlayer stream={myStream} name="My Stream" />}
//                 {remoteStream && <VideoPlayer stream={remoteStream} name="Remote Stream" />}
//             </div>

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
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import "./VideoCall.css";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

const CALL_STATE = {
    IDLE: "IDLE",
    OUTGOING: "OUTGOING",
    INCOMING: "INCOMING",
    IN_CALL: "IN_CALL",
};

const VideoCallPage = ({ remoteUserId }) => {
    const [callState, setCallState] = useState(CALL_STATE.IDLE);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callerId, setCallerId] = useState(null);

    const pcRef = useRef(null);
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    /** ================= SOCKET INIT ================= **/
    useEffect(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            query: { userId: localStorage.getItem("userId") },
        });

        return () => socketRef.current.disconnect();
    }, []);

    /** ================= WEBRTC INIT ================= **/
    const createPeerConnection = async (stream) => {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const remote = new MediaStream();
        setRemoteStream(remote);

        pc.ontrack = (e) => {
            e.streams[0].getTracks().forEach((t) => remote.addTrack(t));
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit("ice-candidate", {
                    toUserId: remoteUserId || callerId,
                    candidate: e.candidate,
                });
            }
        };
    };

    /** ================= SOCKET EVENTS ================= **/
    useEffect(() => {
        const socket = socketRef.current;

        socket.on("incoming:call", ({ fromUserId, offer }) => {
            setCallerId(fromUserId);
            setCallState(CALL_STATE.INCOMING);
            socket.offer = offer;
        });

        socket.on("call:accepted", async ({ answer }) => {
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
            setCallState(CALL_STATE.IN_CALL);
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            await pcRef.current.addIceCandidate(candidate);
        });

        socket.on("call:end", endCall);

        return () => socket.removeAllListeners();
    }, []);

    /** ================= CALL ACTIONS ================= **/
    const startCall = async () => {
        setCallState(CALL_STATE.OUTGOING);

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        setMyStream(stream);
        localVideoRef.current.srcObject = stream;

        await createPeerConnection(stream);

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        socketRef.current.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
        });
    };

    const acceptCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        setMyStream(stream);
        localVideoRef.current.srcObject = stream;

        await createPeerConnection(stream);

        await pcRef.current.setRemoteDescription(
            JSON.parse(socketRef.current.offer)
        );

        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        socketRef.current.emit("call:accepted", {
            toUserId: callerId,
            answer: JSON.stringify(answer),
        });

        setCallState(CALL_STATE.IN_CALL);
    };

    const endCall = useCallback(() => {
        pcRef.current?.close();
        pcRef.current = null;

        myStream?.getTracks().forEach((t) => t.stop());

        setMyStream(null);
        setRemoteStream(null);
        setCallerId(null);
        setCallState(CALL_STATE.IDLE);

        socketRef.current.emit("call:end", {
            toUserId: remoteUserId || callerId,
        });
    }, [myStream, remoteUserId, callerId]);

    /** ================= UI ================= **/
    return (
        <div className="call-container">
            {callState === CALL_STATE.IDLE && (
                <button className="call-btn" onClick={startCall}>
                    <CallIcon /> Start Call
                </button>
            )}

            {callState === CALL_STATE.INCOMING && (
                <div className="incoming-call">
                    <h2>Incoming Video Call</h2>
                    <div className="incoming-actions">
                        <button className="accept" onClick={acceptCall}>
                            <CallIcon />
                        </button>
                        <button className="reject" onClick={endCall}>
                            <CallEndIcon />
                        </button>
                    </div>
                </div>
            )}

            {callState === CALL_STATE.IN_CALL && (
                <>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="remote-video"
                        srcObject={remoteStream}
                    />

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="local-video"
                    />

                    <div className="call-controls">
                        <button><MicIcon /></button>
                        <button><VideocamIcon /></button>
                        <button className="end" onClick={endCall}>
                            <CallEndIcon />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoCallPage;
