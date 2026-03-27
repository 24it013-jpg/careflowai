import { useRef, useState, useCallback, useEffect } from "react";

export type PPGState = "idle" | "requesting" | "calibrating" | "measuring" | "done" | "error";

interface UseCameraHeartRateReturn {
    bpm: number | null;
    state: PPGState;
    progress: number; // 0-100
    signalStrength: number; // 0-100, how good the finger coverage is
    waveformData: number[]; // last N raw signal values for display
    error: string | null;
    startMeasurement: () => Promise<void>;
    stopMeasurement: () => void;
}

const SAMPLE_RATE = 30; // ~30fps
const MEASURE_SECONDS = 30;
const CALIBRATE_SECONDS = 3;
const WAVEFORM_LENGTH = 120;

// Simple bandpass filter coefficients for 0.75–3 Hz (45–180 BPM at 30fps)
function bandpassFilter(signal: number[]): number[] {
    if (signal.length < 5) return signal;
    const filtered: number[] = [];
    for (let i = 2; i < signal.length - 2; i++) {
        // Simple moving average subtraction (high-pass) + smoothing (low-pass)
        const avg = (signal[i - 2] + signal[i - 1] + signal[i] + signal[i + 1] + signal[i + 2]) / 5;
        filtered.push(signal[i] - avg * 0.7);
    }
    return filtered;
}

function countPeaks(signal: number[], sampleRate: number): number {
    if (signal.length < 10) return 0;
    const peaks: number[] = [];
    const threshold = Math.max(...signal) * 0.4;
    for (let i = 1; i < signal.length - 1; i++) {
        if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1] && signal[i] > threshold) {
            // Avoid double-counting (min 0.3s between peaks = 18 frames at 30fps)
            if (peaks.length === 0 || i - peaks[peaks.length - 1] > sampleRate * 0.3) {
                peaks.push(i);
            }
        }
    }
    if (peaks.length < 2) return 0;
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
        intervals.push(peaks[i] - peaks[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = (sampleRate / avgInterval) * 60;
    return Math.round(Math.min(200, Math.max(40, bpm)));
}

export function useCameraHeartRate(): UseCameraHeartRateReturn {
    const [bpm, setBpm] = useState<number | null>(null);
    const [state, setState] = useState<PPGState>("idle");
    const [progress, setProgress] = useState(0);
    const [signalStrength, setSignalStrength] = useState(0);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rawSignalRef = useRef<number[]>([]);
    const frameCountRef = useRef(0);
    const animFrameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef(false);

    const stopMeasurement = useCallback(() => {
        isRunningRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setState((s) => (s === "done" || s === "error" ? s : "idle"));
        setProgress(0);
    }, []);

    const startMeasurement = useCallback(async () => {
        setError(null);
        setBpm(null);
        setProgress(0);
        setWaveformData([]);
        rawSignalRef.current = [];
        frameCountRef.current = 0;
        setState("requesting");

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API is unavailable. This usually happens when the application is not running on a secure context (HTTPS) or localhost.");
            }

            // Request back camera on mobile (environment), fallback to any
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment", width: 320, height: 240 },
                });
            } catch {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240 },
                });
            }

            streamRef.current = stream;

            // Create hidden video element
            const video = document.createElement("video");
            video.srcObject = stream;
            video.playsInline = true;
            video.muted = true;
            videoRef.current = video;
            await video.play();

            // Create hidden canvas for pixel sampling
            const canvas = document.createElement("canvas");
            canvas.width = 32;
            canvas.height = 32;
            canvasRef.current = canvas;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) throw new Error("Canvas context unavailable");

            isRunningRef.current = true;
            startTimeRef.current = Date.now();
            setState("calibrating");

            const totalFrames = (CALIBRATE_SECONDS + MEASURE_SECONDS) * SAMPLE_RATE;

            const processFrame = () => {
                if (!isRunningRef.current) return;

                ctx.drawImage(video, 0, 0, 32, 32);
                const imageData = ctx.getImageData(8, 8, 16, 16); // center 16x16 pixels
                const data = imageData.data;

                let redSum = 0;
                let greenSum = 0;
                let pixelCount = 0;

                for (let i = 0; i < data.length; i += 4) {
                    redSum += data[i];
                    greenSum += data[i + 1];
                    pixelCount++;
                }

                const avgRed = redSum / pixelCount;
                const avgGreen = greenSum / pixelCount;

                // Signal strength: finger coverage makes red channel very high (>150) and green low
                const fingerCoverage = Math.min(100, Math.max(0, ((avgRed - avgGreen) / 255) * 200));
                setSignalStrength(Math.round(fingerCoverage));

                // Use red channel for PPG signal
                rawSignalRef.current.push(avgRed);
                frameCountRef.current++;

                const elapsed = (Date.now() - startTimeRef.current) / 1000;
                const totalTime = CALIBRATE_SECONDS + MEASURE_SECONDS;
                const prog = Math.min(100, (elapsed / totalTime) * 100);
                setProgress(Math.round(prog));

                if (elapsed < CALIBRATE_SECONDS) {
                    setState("calibrating");
                } else {
                    setState("measuring");
                    // Update waveform display
                    const recent = rawSignalRef.current.slice(-WAVEFORM_LENGTH);
                    const filtered = bandpassFilter(recent);
                    setWaveformData([...filtered]);
                }

                if (frameCountRef.current >= totalFrames) {
                    // Done — calculate BPM
                    const measureSignal = rawSignalRef.current.slice(CALIBRATE_SECONDS * SAMPLE_RATE);
                    const filtered = bandpassFilter(measureSignal);
                    const calculatedBpm = countPeaks(filtered, SAMPLE_RATE);

                    if (calculatedBpm > 0) {
                        setBpm(calculatedBpm);
                        setState("done");
                    } else {
                        setError("Could not detect a clear pulse. Make sure your fingertip fully covers the camera lens.");
                        setState("error");
                    }

                    isRunningRef.current = false;
                    streamRef.current?.getTracks().forEach((t) => t.stop());
                    return;
                }

                // Throttle to ~30fps
                setTimeout(() => {
                    animFrameRef.current = requestAnimationFrame(processFrame);
                }, 1000 / SAMPLE_RATE);
            };

            animFrameRef.current = requestAnimationFrame(processFrame);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Camera access denied";
            if (msg.includes("denied") || msg.includes("NotAllowed")) {
                setError("Camera permission denied. Please allow camera access in your browser settings.");
            } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
                setError("No camera found on this device.");
            } else {
                setError(`Camera error: ${msg}`);
            }
            setState("error");
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isRunningRef.current = false;
            cancelAnimationFrame(animFrameRef.current);
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return { bpm, state, progress, signalStrength, waveformData, error, startMeasurement, stopMeasurement };
}
