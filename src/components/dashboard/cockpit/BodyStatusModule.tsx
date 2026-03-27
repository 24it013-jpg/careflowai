import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

export function BodyStatusModule() {
    const [selectedSystem, setSelectedSystem] = useState("Nervous System");

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Background Scanner */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Left: Body Visual (SVG) */}
            <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
                {/* Rotating Rings Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-[200px] h-[200px] border border-cyan-500/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute w-[160px] h-[160px] border border-purple-500/20 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Simplified Body Silhouette */}
                <svg viewBox="0 0 100 200" className="h-[220px] w-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10">
                    <path
                        d="M50 10 C 60 10, 65 15, 65 25 C 65 35, 80 40, 85 55 L 90 100 L 80 100 L 75 70 L 70 110 L 70 180 L 55 180 L 55 130 L 45 130 L 45 180 L 30 180 L 30 110 L 25 70 L 20 100 L 10 100 L 15 55 C 20 40, 35 35, 35 25 C 35 15, 40 10, 50 10 Z"
                        fill="none"
                        stroke="currentColor"
                        className="text-cyan-400/50"
                        strokeWidth="0.5"
                    />
                    {/* Active Scan Lines */}
                    <motion.path
                        d="M50 10 C 60 10, 65 15, 65 25 C 65 35, 80 40, 85 55 L 90 100 L 80 100 L 75 70 L 70 110 L 70 180 L 55 180 L 55 130 L 45 130 L 45 180 L 30 180 L 30 110 L 25 70 L 20 100 L 10 100 L 15 55 C 20 40, 35 35, 35 25 C 35 15, 40 10, 50 10 Z"
                        className="text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="5 5"
                        animate={{ strokeDashoffset: [0, 100] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Highlight Point (Heart/Chest) */}
                    <motion.circle
                        cx="50" cy="50" r="3"
                        className="fill-red-500"
                        animate={{ r: [2, 4, 2], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>
            </div>

            {/* Right: Stats & Controls */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div>
                    <h3 className="text-white font-bold text-lg">System Status</h3>
                    <p className="text-xs text-slate-400">Real-time physiological mapping</p>
                </div>

                <div className="space-y-2">
                    {[
                        { name: "Nervous System", status: "Optimal", color: "text-emerald-400" },
                        { name: "Cardiovascular", status: "Attention", color: "text-amber-400" },
                        { name: "Respiratory", status: "Optimal", color: "text-emerald-400" },
                    ].map((sys) => (
                        <div
                            key={sys.name}
                            className={`p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex justify-between items-center ${selectedSystem === sys.name ? 'border-cyan-500/50 bg-cyan-500/20' : ''}`}
                            onClick={() => setSelectedSystem(sys.name)}
                        >
                            <span className="text-sm text-slate-300">{sys.name}</span>
                            {sys.status === "Optimal" ? (
                                <CheckCircle2 className="size-4 text-emerald-400" />
                            ) : (
                                <AlertCircle className="size-4 text-amber-400 animate-pulse" />
                            )}
                        </div>
                    ))}
                </div>

                <button className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-2 group/btn">
                    Launch Full Body Scan <ChevronRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
