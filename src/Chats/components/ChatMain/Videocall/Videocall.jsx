import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://vizit-backend-hubw.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
    query: { userId: localStorage.getItem('userId') }
});

const VideoCall = ({ remoteUserId }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const [callActive, setCallActive] = useState(false);

    useEffect(() => {
        // get local media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                pcRef.current = new RTCPeerConnection();

                // add tracks to peer connection
                stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

                // remote stream
                pcRef.current.ontrack = (event) => {
                    remoteVideoRef.current.srcObject = event.streams[0];
                };

                // ICE candidates
                pcRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('peer:nego:needed', {
                            toUserId: remoteUserId,
                            offer: JSON.stringify(pcRef.current.localDescription),
                            roomId: null
                        });
                    }
                };
            });

        /** ===== SOCKET EVENTS ===== **/

        socket.on('incoming:call', async ({ fromUserId, offer }) => {
            setCallActive(true);
            await pcRef.current.setRemoteDescription(JSON.parse(offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);

            socket.emit('call:accepted', {
                toUserId: fromUserId,
                answer: JSON.stringify(answer),
                roomId: null
            });
        });

        socket.on('call:accepted', async ({ fromUserId, answer }) => {
            setCallActive(true);
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
        });

        socket.on('peer:nego:needed', async ({ fromUserId, offer }) => {
            await pcRef.current.setRemoteDescription(JSON.parse(offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit('peer:nego:done', {
                toUserId: fromUserId,
                answer: JSON.stringify(answer),
                roomId: null
            });
        });

        socket.on('peer:nego:final', async ({ fromUserId, answer }) => {
            await pcRef.current.setRemoteDescription(JSON.parse(answer));
        });

        socket.on('call:end', () => {
            setCallActive(false);
            pcRef.current.close();
            pcRef.current = null;
        });

        return () => {
            socket.off('incoming:call');
            socket.off('call:accepted');
            socket.off('peer:nego:needed');
            socket.off('peer:nego:final');
            socket.off('call:end');
        };
    }, [remoteUserId]);

    const startCall = async () => {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socket.emit('user:call', {
            toUserId: remoteUserId,
            offer: JSON.stringify(offer)
        });
    };

    const endCall = () => {
        socket.emit('call:end', { toUserId: remoteUserId, roomId: null });
        setCallActive(false);
        pcRef.current.close();
        pcRef.current = null;
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted style={{ width: '200px' }} />
            <video ref={remoteVideoRef} autoPlay style={{ width: '200px' }} />
            {!callActive && <button onClick={startCall}>Call</button>}
            {callActive && <button onClick={endCall}>End Call</button>}
        </div>
    );
};

export default VideoCall;
