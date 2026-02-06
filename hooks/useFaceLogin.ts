import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

export type LoginState =
    | "IDLE" // Initial state
    | "LOADING_MODELS" // Loading face-api models
    | "CAMERA_PERMISSION" // Requesting detection
    | "CAMERA_READY" // Camera active, waiting for user
    | "SCANNING" // Analyzing face
    | "SUCCESS" // Face verified
    | "FAILURE"; // Face mismatch or timeout

export type UseFaceLoginReturn = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    loginState: LoginState;
    error: string | null;
    distance: number | null;
    startCamera: () => Promise<void>;
    captureAndRegister: () => Promise<void>;
    captureAndLogin: () => Promise<void>;
    reset: () => void;
    isModelLoaded: boolean;
    logs: string[];
};

export function useFaceLogin(): UseFaceLoginReturn {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [loginState, setLoginState] = useState<LoginState>("IDLE");
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number | null>(null); // For debug feedback
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    // Load models on mount
    useEffect(() => {
        async function loadModels() {
            try {
                setLoginState("LOADING_MODELS");
                const MODEL_URL = "/models"; // Ensure this matches user's public folder structure
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setIsModelLoaded(true);
                setLoginState("IDLE");
            } catch (e) {
                console.error("Error loading models:", e);
                setError("Failed to load face detection models.");
                setLoginState("FAILURE");
            }
        }
        loadModels();
    }, []);

    const streamRef = useRef<MediaStream | null>(null);

    // Re-attach stream to video element whenever videoRef changes or component re-renders
    useEffect(() => {
        if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
            console.log("Re-attaching stream to video element");
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
    });

    const startCamera = useCallback(async () => {
        try {
            setLoginState("CAMERA_PERMISSION");
            setError(null);

            // If we already have a stream, reuse it
            if (streamRef.current) {
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    await videoRef.current.play();
                }
                setLoginState("CAMERA_READY");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setLoginState("CAMERA_READY");
            }
        } catch (e) {
            console.error("Camera access denied:", e);
            setError("Unable to access camera. Please allow permissions.");
            setLoginState("FAILURE");
        }
    }, []);

    const getFaceDescriptor = async (): Promise<Float32Array | undefined> => {
        if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Safety check: Ensure video has valid dimensions before processing
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.warn("Video dimensions are 0, skipping detection");
            return undefined;
        }

        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        try {
            faceapi.matchDimensions(canvas, displaySize);

            const detections = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                }
                return detections.descriptor;
            }
        } catch (err) {
            console.error("Face detection error:", err);
            return undefined;
        }

        return undefined;
    };

    const captureAndRegister = async () => {
        if (!isModelLoaded) return;
        setLoginState("SCANNING");

        // Artificial delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const descriptor = await getFaceDescriptor();
            if (descriptor) {
                localStorage.setItem("face_descriptor_demo", JSON.stringify(Array.from(descriptor)));
                // We successfully registered. Now what? 
                // Let's go to a temporary Success state or just back to IDLE with a toast?
                // For now, let's keep it simple and just go back to IDLE but maybe log it.
                console.log("Face registered successfully");
                setLoginState("IDLE");
                // Allow UI to update before alerting/notifying
                setTimeout(() => alert("Face registered successfully! You can now verify."), 100);
            } else {
                setError("No face detected. Try again.");
                setLoginState("CAMERA_READY");
            }
        } catch (e) {
            console.error(e);
            setError("Registration failed.");
            setLoginState("FAILURE");
        }
    };

    const captureAndLogin = async () => {
        if (!isModelLoaded) return;
        setLoginState("SCANNING");
        setError(null);

        // Artificial delay for UX (visual scanning effect)
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const descriptor = await getFaceDescriptor();
            const stored = localStorage.getItem("face_descriptor_demo");

            if (!stored) {
                setError("No registered face found. Please register first.");
                setLoginState("FAILURE");
                return;
            }

            if (!descriptor) {
                setError("No face detected in live view.");
                setLoginState("FAILURE");
                return;
            }

            const storedDescriptor = JSON.parse(stored) as number[];
            const distance = faceapi.euclideanDistance(storedDescriptor, descriptor);
            setDistance(distance);

            // Threshold for matching (~0.5 - 0.6 is good for tinyFaceDetector)
            if (distance < 0.55) {
                setLoginState("SUCCESS");
            } else {
                setError(`Face mismatch (Distance: ${distance.toFixed(3)})`);
                setLoginState("FAILURE");
            }

        } catch (e) {
            console.error(e);
            setError("Login verification failed.");
            setLoginState("FAILURE");
        }
    };

    const reset = () => {
        setLoginState("CAMERA_READY");
        setError(null);
        setDistance(null);
        // Clear canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return {
        videoRef,
        canvasRef,
        loginState,
        error,
        distance,
        startCamera,
        captureAndRegister,
        captureAndLogin,
        reset,
        isModelLoaded,
        logs
    };
}
