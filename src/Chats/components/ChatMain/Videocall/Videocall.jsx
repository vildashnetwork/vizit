import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
    query: { userId: localStorage.getItem("userId") },
});

const VideoCall = ({ remoteUserId }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null); // PeerConnection reference
    const [callActive, setCallActive] = useState(false);

    // store local stream globally
    const localStreamRef = useRef(null);

    useEffect(() => {
        // initialize media
        const initMedia = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            // initialize PeerConnection
            pcRef.current = new RTCPeerConnection();

            // add tracks to connection
            stream.getTracks().forEach((track) =>
                pcRef.current.addTrack(track, stream)
            );

            // receive remote stream
            pcRef.current.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            // handle ICE candidates
            pcRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    // send candidate to the other peer
                    socket.emit("peer:nego:needed", {
                        toUserId: remoteUserId,
                        offer: JSON.stringify(pcRef.current.localDescription),
                        roomId: null,
                    });
                }
            };
        };

        initMedia();

        /** ===== SOCKET EVENTS ===== **/

        // incoming call
        socket.on("incoming:call", async ({ fromUserId, offer }) => {
            setCallActive(true);
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(JSON.parse(offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit("call:accepted", {
                toUserId: fromUserId,
                answer: JSON.stringify(answer),
                roomId: null,
            });
        });

        // call accepted
        socket.on("call:accepted", async ({ fromUserId, answer }) => {
            setCallActive(true);
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
        });

        // negotiation needed (ICE/offer)
        socket.on("peer:nego:needed", async ({ fromUserId, offer }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(JSON.parse(offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit("peer:nego:done", {
                toUserId: fromUserId,
                answer: JSON.stringify(answer),
                roomId: null,
            });
        });

        // negotiation final
        socket.on("peer:nego:final", async ({ fromUserId, answer }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
        });

        // call ended
        socket.on("call:end", () => {
            endCall();
        });

        return () => {
            socket.off("incoming:call");
            socket.off("call:accepted");
            socket.off("peer:nego:needed");
            socket.off("peer:nego:final");
            socket.off("call:end");
        };
    }, [remoteUserId]);

    // start call
    const startCall = async () => {
        if (!pcRef.current) return;
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socket.emit("user:call", {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer),
        });
        setCallActive(true);
    };

    // end call
    const endCall = () => {
        setCallActive(false);
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        socket.emit("call:end", { toUserId: remoteUserId, roomId: null });
    };

    return (
        <div>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: "200px" }}
            />
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: "200px" }}
            />
            {!callActive && <button onClick={startCall}>Call</button>}
            {callActive && <button onClick={endCall}>End Call</button>}
        </div>
    );
};

export default VideoCall;
