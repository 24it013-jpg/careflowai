import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Thermometer, Wind, ChevronRight } from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function ECGCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const xRef = useRef(0);
    const historyRef = useRef<number[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 400;
            canvas.height = 110;
            historyRef.current = new Array(canvas.width).fill(canvas.height / 2);
        };
        resize();

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            const mid = H / 2;

            ctx.clearRect(0, 0, W, H);

            ctx.strokeStyle = "rgba(96,165,250,0.04)";
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 30) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += 22) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            const x = xRef.current;
            const phase = (x / W * 4) % 1;
            let y = mid;
            if (phase < 0.05) y = mid - Math.sin(phase * Math.PI / 0.05) * 6;
            else if (phase < 0.08) y = mid + 4;
            else if (phase < 0.11) y = mid - 55;
            else if (phase < 0.13) y = mid + 25;
            else if (phase < 0.18) y = mid - 15;
            else if (phase < 0.28) y = mid - Math.sin((phase - 0.18) * Math.PI / 0.1) * 12;
            else y = mid + (Math.random() - 0.5) * 2;

            historyRef.current[x] = y;

            const grad = ctx.createLinearGradient(0, 0, W, 0);
            grad.addColorStop(0, "rgba(96,165,250,0)");
            grad.addColorStop(0.3, "rgba(96,165,250,0.3)");
            grad.addColorStop(0.8, "rgba(96,165,250,0.9)");
            grad.addColorStop(1, "rgba(96,165,250,0)");

            ctx.shadowColor = "rgba(96,165,250,0.8)";
            ctx.shadowBlur = 8;
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.beginPath();

            for (let i = 0; i < W; i++) {
                const px = (x - i + W) % W;
                const py = historyRef.current[px] ?? mid;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#60a5fa";
            ctx.shadowColor = "#60a5fa";
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;

            xRef.current = (x + 2) % W;
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}

const MemoizedECG = memo(ECGCanvas);

export function OptimizedVitalsMonitor() {
    const { vitals } = useHealthData();
    const navigate = useNavigate();

    const lastMeasuredText = vitals.lastMeasured
        ? (() => {
            const diff = Date.now() - vitals.lastMeasured;
            if (diff < 60000) return "just now";
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
            return new Date(vitals.lastMeasured).toLocaleDateString();
        })()
        : null;

    const VITAL_CARDS = [
        { key: "heartRate" as const, icon: Heart, label: "Heart Rate", unit: "BPM", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
        { key: "spo2" as const, icon: Wind, label: "Blood Oxygen", unit: "SpO₂ %", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { key: "temperature" as const, icon: Thermometer, label: "Temperature", unit: "°F", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    const vitalValues: Record<string, number> = {
        heartRate: vitals.heartRate,
        spo2: vitals.spo2,
        temperature: vitals.temperature,
    };

    return (
        <motion.div
            className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-white/[0.07] bg-gradient-to-r from-blue-500/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(96,165,250,0.2)]">
                        <Activity className="size-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Live Vitals Monitor</h3>
                        <p className="text-[10px] text-white/30 font-medium">
                            {lastMeasuredText ? `Last measured: ${lastMeasuredText}` : "No measurements yet — tap to measure"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/dashboard/wearable")}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold"
                >
                    Measure <ChevronRight className="size-3" />
                </button>
            </div>

            {/* ECG Canvas */}
            <div className="relative h-[110px] w-full bg-black/30 border-b border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                <MemoizedECG />
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-3 gap-0 divide-x divide-white/[0.06]">
                {VITAL_CARDS.map((card) => (
                    <motion.div
                        key={card.key}
                        className="p-5 flex flex-col items-center justify-center gap-1.5 group cursor-default hover:bg-white/[0.03] transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={cn("size-8 rounded-xl flex items-center justify-center mb-1", card.bg)}>
                            <card.icon className={cn("size-4", card.color)} />
                        </div>
                        <motion.span
                            key={vitalValues[card.key]}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={cn("text-3xl font-black tabular-nums", card.color)}
                        >
                            {vitalValues[card.key]}
                        </motion.span>
                        <span className="text-[9px] text-white/25 uppercase tracking-widest font-bold">{card.unit}</span>
                        <span className="text-[9px] text-white/20">{card.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Measure Now CTA */}
            {!vitals.lastMeasured && (
                <div className="px-6 py-3 border-t border-white/[0.05]">
                    <button
                        onClick={() => navigate("/dashboard/wearable")}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold hover:from-rose-500/30 hover:to-pink-500/30 transition-all"
                    >
                        📷 Measure Heart Rate with Camera
                    </button>
                </div>
            )}
        </motion.div>
    );
}
