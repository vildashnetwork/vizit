import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
    query: { userId: localStorage.getItem("userId") },
});

const VideoCall = ({ remoteUserId }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const [callActive, setCallActive] = useState(false);
    const localStreamRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            localVideoRef.current.srcObject = stream;

            // create PeerConnection
            pcRef.current = new RTCPeerConnection();

            // add local tracks
            stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

            // receive remote tracks
            const remoteStream = new MediaStream();
            remoteVideoRef.current.srcObject = remoteStream;
            pcRef.current.ontrack = (event) => {
                event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
            };

            // send ICE candidates
            pcRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", {
                        toUserId: remoteUserId,
                        candidate: event.candidate,
                    });
                }
            };
        };

        init();

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
            });
        });

        // call accepted
        socket.on("call:accepted", async ({ fromUserId, answer }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
        });

        // ICE candidate received
        socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
            try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Error adding received ICE candidate", err);
            }
        });

        // call ended
        socket.on("call:end", () => {
            endCall();
        });

        return () => {
            socket.off("incoming:call");
            socket.off("call:accepted");
            socket.off("ice-candidate");
            socket.off("call:end");
        };
    }, [remoteUserId]);

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

    const endCall = () => {
        setCallActive(false);
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        socket.emit("call:end", { toUserId: remoteUserId });
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "200px" }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "200px" }} />
            {!callActive && <button onClick={startCall}>Call</button>}
            {callActive && <button onClick={endCall}>End Call</button>}
        </div>
    );
};

export default VideoCall;
