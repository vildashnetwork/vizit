import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./VideoCall.css";

const SOCKET_URL = "https://vizit-backend-hubw.onrender.com";
const API_BASE = "https://vizit-backend-hubw.onrender.com/api/call";

const iceConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoCall({ user, activeUserEmail }) {
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [incomingCall, setIncomingCall] = useState(null);
    const [callActive, setCallActive] = useState(false);

    /* ---------------- SOCKET INIT ---------------- */
    useEffect(() => {
        if (!user?.email) return;

        socketRef.current = io(SOCKET_URL, {
            query: { userId: user._id },
            transports: ["websocket"],
        });

        socketRef.current.emit("room:join", {
            email: user.email,
            room: user.email,
        });

        socketRef.current.on("incoming:call", handleIncomingCall);
        socketRef.current.on("call:accepted", handleCallAccepted);
        socketRef.current.on("peer:nego:needed", handleNegoNeeded);
        socketRef.current.on("peer:nego:final", handleNegoFinal);
        socketRef.current.on("call:end", endCall);

        return () => socketRef.current.disconnect();
    }, [user]);

    /* ---------------- MEDIA ---------------- */
    const getMedia = async () =>
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    /* ---------------- PEER ---------------- */
    const createPeer = () => {
        const peer = new RTCPeerConnection(iceConfig);

        peer.ontrack = (e) => {
            remoteVideoRef.current.srcObject = e.streams[0];
        };

        peer.onnegotiationneeded = async () => {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socketRef.current.emit("peer:nego:needed", {
                to: activeUserEmail,
                offer,
            });
        };

        return peer;
    };

    /* ---------------- CALL INIT ---------------- */
    const startCall = async () => {
        await axios.post(`${API_BASE}/initiate`, {
            from: user.email,
            to: activeUserEmail,
        });

        const stream = await getMedia();
        localVideoRef.current.srcObject = stream;

        peerRef.current = createPeer();
        stream.getTracks().forEach((t) =>
            peerRef.current.addTrack(t, stream)
        );

        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);

        socketRef.current.emit("user:call", {
            to: activeUserEmail,
            offer,
        });

        setCallActive(true);
    };

    /* ---------------- INCOMING ---------------- */
    const handleIncomingCall = ({ from, offer }) => {
        setIncomingCall({ from, offer });
    };

    const acceptCall = async () => {
        await axios.post(`${API_BASE}/accept`, {
            from: incomingCall.from,
            to: user.email,
        });

        const stream = await getMedia();
        localVideoRef.current.srcObject = stream;

        peerRef.current = createPeer();
        stream.getTracks().forEach((t) =>
            peerRef.current.addTrack(t, stream)
        );

        await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(incomingCall.offer)
        );

        const ans = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(ans);

        socketRef.current.emit("call:accepted", {
            to: incomingCall.from,
            ans,
        });

        setIncomingCall(null);
        setCallActive(true);
    };

    /* ---------------- ACCEPTED ---------------- */
    const handleCallAccepted = async ({ ans }) => {
        await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(ans)
        );
    };

    /* ---------------- NEGOTIATION ---------------- */
    const handleNegoNeeded = async ({ from, offer }) => {
        await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
        );
        const ans = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(ans);

        socketRef.current.emit("peer:nego:final", {
            to: from,
            ans,
        });
    };

    const handleNegoFinal = async ({ ans }) => {
        await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(ans)
        );
    };

    /* ---------------- END CALL ---------------- */
    const endCall = async () => {
        await axios.post(`${API_BASE}/end`, {
            from: user.email,
            to: activeUserEmail,
        });

        peerRef.current?.close();
        peerRef.current = null;
        setIncomingCall(null);
        setCallActive(false);
    };

    /* ---------------- UI ---------------- */
    return (
        <>
            {!callActive && activeUserEmail && (
                <button className="dior-call-btn" onClick={startCall}>
                    📞 Call
                </button>
            )}

            {incomingCall && (
                <div className="chanel-popup">
                    <p>Incoming video call</p>
                    <div className="versace-actions">
                        <button className="gucci-accept" onClick={acceptCall}>
                            Accept
                        </button>
                        <button className="armani-reject" onClick={endCall}>
                            Reject
                        </button>
                    </div>
                </div>
            )}

            {callActive && (
                <div className="tomford-overlay">
                    <video ref={remoteVideoRef} autoPlay className="ysl-remote" />
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="prada-local"
                    />
                    <button className="givenchy-end" onClick={endCall}>
                        End Call
                    </button>
                </div>
            )}
        </>
    );
}

export default VideoCall;
