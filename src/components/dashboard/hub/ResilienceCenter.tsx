import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Brain, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";

export function ResilienceCenter() {
    const { vitals } = useHealthData();
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [timer, setTimer] = useState(0);

    // Dynamic breathing cycle based on stress levels (mocked logic)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (phase === "inhale" && prev >= 4) {
                    setPhase("hold");
                    return 0;
                }
                if (phase === "hold" && prev >= 4) {
                    setPhase("exhale");
                    return 0;
                }
                if (phase === "exhale" && prev >= 4) {
                    setPhase("inhale");
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);

    // Calculate pulse speed based on heart rate
    // const pulseDuration = vitals.heartRate > 100 ? 0.6 : vitals.heartRate > 80 ? 0.8 : 1.2;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -bottom-24 -left-24 size-48 bg-purple-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Brain className="size-5 text-purple-400" />
                        Resilience Center
                    </h2>
                    <p className="text-sm text-white/40">Neural Stress Mitigation & Coherence</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
                    <Heart className="size-3 text-purple-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        {vitals.heartRate} BPM Sync
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-12">
                {/* Breathing Orb */}
                <div className="relative size-64 flex items-center justify-center">
                    {/* Pulsing Aura */}
                    <motion.div
                        animate={{
                            scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl"
                    />

                    {/* The Core Orb */}
                    <motion.div
                        animate={{
                            scale: phase === "inhale" ? 1.2 : phase === "hold" ? 1.2 : 0.8,
                            boxShadow: phase === "inhale"
                                ? "0 0 50px rgba(168, 85, 247, 0.4)"
                                : "0 0 20px rgba(168, 85, 247, 0.2)"
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="size-32 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg relative z-20"
                    >
                        <Wind className="size-10 text-white/80" />
                    </motion.div>

                    {/* Progress Ring */}
                    <svg className="absolute inset-0 size-64 -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="110"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="110"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="690"
                            initial={{ strokeDashoffset: 690 }}
                            animate={{ strokeDashoffset: 690 - (timer / 4) * 690 }}
                            transition={{ duration: 1, ease: "linear" }}
                            className="text-purple-500"
                        />
                    </svg>
                </div>

                <div className="mt-12 text-center">
                    <motion.h3
                        key={phase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-2"
                    >
                        {phase}
                    </motion.h3>
                    <p className="text-white/40 text-sm font-mono italic">
                        Aligning neural oscillations...
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="size-4 text-purple-400" />
                        <span className="text-xs font-bold text-white/60 uppercase">Coherence Score</span>
                    </div>
                    <div className="text-xl font-bold text-white">92%</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="size-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white/60 uppercase">Cortisol Delta</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-400">-12.4%</div>
                </div>
            </div>
        </motion.div>
    );
}
