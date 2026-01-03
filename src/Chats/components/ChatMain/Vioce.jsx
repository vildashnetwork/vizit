import React, { useState, useRef, useEffect } from "react";

function InlineVoiceRecorder({ onSend, onCancel }) {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [time, setTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!recording) clearInterval(timerRef.current);
    }, [recording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
            };

            mediaRecorder.start();
            setRecording(true);
            setTime(0);

            timerRef.current = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Microphone access denied", err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const sendRecording = () => {
        if (audioBlob) onSend(audioBlob);
        resetRecorder();
    };

    const cancelRecording = () => {
        mediaRecorderRef.current?.stop();
        resetRecorder();
        if (onCancel) onCancel();
    };

    const resetRecorder = () => {
        setAudioBlob(null);
        setTime(0);
        setRecording(false);
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "25px",
                background: "#fff",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                maxWidth: "400px",
            }}
        >
            {!recording && !audioBlob && (
                <button
                    onClick={startRecording}
                    style={{
                        border: "none",
                        background: "#0b93f6",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                    }}
                >
                    🎤
                </button>
            )}

            {recording && (
                <>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Recording {formatTime(time)}
                    </span>
                    <button
                        onClick={stopRecording}
                        style={{
                            border: "none",
                            background: "#f44336",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                        }}
                    >
                        ⏹️
                    </button>
                </>
            )}

            {audioBlob && (
                <>
                    <audio controls src={URL.createObjectURL(audioBlob)} />
                    <button
                        onClick={sendRecording}
                        style={{
                            border: "none",
                            background: "#0b93f6",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                        }}
                    >
                        ✅
                    </button>
                    <button
                        onClick={cancelRecording}
                        style={{
                            border: "none",
                            background: "#f44336",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                        }}
                    >
                        ❌
                    </button>
                </>
            )}
        </div>
    );
}

export default InlineVoiceRecorder;
