import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Thermometer, Wind } from "lucide-react";

export function VitalsMonitorModule() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [heartRate, setHeartRate] = useState(72);

    // Simulated Heartbeat Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartRate(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.min(Math.max(60, prev + change), 100);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // ECG Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let x = 0;

        const width = canvas.width = canvas.parentElement?.clientWidth || 300;
        const height = canvas.height = 120;
        const baseline = height / 2;

        const draw = () => {
            // Fade out effect for "old" lines to simulate phosphor persistence
            ctx.fillStyle = "rgba(0, 20, 40, 0.1)";
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#0ea5e9"; // Sky-500 (Cyan-ish)
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#0ea5e9";

            ctx.beginPath();

            // Generate ECG waveform
            if (x >= width) {
                x = 0;
            }

            // Simple P-QRS-T wave simulation
            // Most frames are flat-ish noise
            let y = baseline + (Math.random() * 4 - 2);

            // Trigger a beat every ~100 frames (roughly depending on HR)
            if (Math.random() > 0.96) {
                // QRS Complex simulation (very rough drawing frame-by-frame is hard, 
                // typically you'd trace a path, but for a simple "live" effect we can jitter y)
                y = baseline - 40; // spike up
            } else if (Math.random() > 0.95) {
                y = baseline + 15; // dip down
            }

            ctx.lineTo(x, y);
            ctx.stroke();

            // Draw line from prev point
            // For smoother look, we'd need to track history properly.
            // Simplified: Just draw small segments.

            // let's do a proper moving dot
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();

            x += 2; // speed

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/20 rounded-lg animate-pulse">
                        <Activity className="size-4 text-red-500" />
                    </div>
                    <span className="font-semibold text-white tracking-wide text-sm">BIO-TELEMETRY</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs text-emerald-500 font-mono">LIVE</span>
                </div>
            </div>

            {/* ECG Canvas */}
            <div className="relative h-[120px] w-full bg-black/20">
                {/* Grid overlay */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        opacity: 0.3
                    }}
                />
                <canvas ref={canvasRef} className="w-full h-full relative z-10" />
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-3 gap-0 divide-x divide-white/5 border-t border-white/10 h-full">
                {/* Heart Rate */}
                <div className="p-4 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors">
                    <Heart className="size-5 text-rose-500 mb-2" />
                    <span className="text-3xl font-bold text-white tabular-nums">{heartRate}</span>
                    <span className="text-xs text-slate-400 uppercase">BPM</span>
                </div>

                {/* Oxygen */}
                <div className="p-4 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors">
                    <Wind className="size-5 text-sky-500 mb-2" />
                    <span className="text-3xl font-bold text-white tabular-nums">98</span>
                    <span className="text-xs text-slate-400 uppercase">SpO2 %</span>
                </div>

                {/* Temp */}
                <div className="p-4 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors">
                    <Thermometer className="size-5 text-amber-500 mb-2" />
                    <span className="text-3xl font-bold text-white tabular-nums">98.6</span>
                    <span className="text-xs text-slate-400 uppercase">°F</span>
                </div>
            </div>
        </motion.div>
    );
}
