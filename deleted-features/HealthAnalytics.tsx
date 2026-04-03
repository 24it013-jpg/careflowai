import { motion } from "framer-motion";
import { Heart, Moon, Zap, ShieldCheck, Target, Sparkles, ArrowRight, Trophy, Star, Brain, FileText } from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";
import { useHealthForecaster } from "@/hooks/use-health-forecaster";
import { NeuralLab } from "./NeuralLab";
import { ClinicalReport } from "./ClinicalReport";
import { MedicalIntelligence } from "./MedicalIntelligence";
import { BioSync } from "./BioSync";
import { ResilienceCenter } from "./ResilienceCenter";
import { NeuralXP } from "./NeuralXP";
import { GlobalPulse } from "./GlobalPulse";
import { CommunityHub } from "./CommunityHub";
import { HiveInsights } from "./HiveInsights";
import { OracleEngine } from "./OracleEngine";
import { NeuralRhythmChart } from "./analytics/NeuralRhythmChart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

const HEART_RATE_DATA = [
    { time: '00:00', bpm: 62 },
    { time: '04:00', bpm: 58 },
    { time: '08:00', bpm: 72 },
    { time: '12:00', bpm: 85 },
    { time: '16:00', bpm: 78 },
    { time: '20:00', bpm: 70 },
    { time: '23:59', bpm: 64 },
];

export function HealthAnalytics() {
    const { vitals } = useHealthData();
    const { prediction, riskLevel, insight } = useHealthForecaster();
    const [viewMode, setViewMode] = useState<"standard" | "simulator" | "bio" | "resilience" | "hive" | "oracle">("standard");
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [score, setScore] = useState(75);
    const [status, setStatus] = useState("Optimal");

    useEffect(() => {
        let base = 75;
        if (vitals.heartRate > 60 && vitals.heartRate < 80) base += 10;
        if (vitals.spo2 > 96) base += 5;

        const finalScore = Math.min(100, Math.max(0, base));
        setScore(finalScore);

        if (finalScore > 85) setStatus("Peak Efficiency");
        else if (finalScore > 70) setStatus("Stable");
        else setStatus("System Strain");
    }, [vitals]);

    const getScoreColor = () => {
        if (score > 85) return "text-blue-400";
        if (score > 70) return "text-emerald-400";
        return "text-rose-400";
    };

    const lastPoint = {
        time: 'Present',
        bpm: vitals.heartRate,
        spo2: vitals.spo2
    };

    const forecastData = [...HEART_RATE_DATA, lastPoint, ...prediction];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {viewMode === "simulator" ? "Neural Simulation Lab" : viewMode === "bio" ? "Bio-Sync Hub" : viewMode === "resilience" ? "Resilience Center" : "System Analytics"}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                        {viewMode === "simulator"
                            ? "Test lifestyle impacts on your digital twin"
                            : viewMode === "bio"
                                ? "Multi-device Neural Synchronization"
                                : viewMode === "resilience"
                                    ? "Neural Stress Mitigation & Coherence"
                                    : "Predictive synthesis of your physiological core"
                        }
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Controls */}
                    <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <button
                            onClick={() => setViewMode("standard")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "standard" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Core
                        </button>
                        <button
                            onClick={() => setViewMode("simulator")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "simulator" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Lab
                        </button>
                        <button
                            onClick={() => setViewMode("bio")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "bio" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Bio
                        </button>
                        <button
                            onClick={() => setViewMode("resilience")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "resilience" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Zen
                        </button>
                        <button
                            onClick={() => setViewMode("hive")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "hive" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Hive
                        </button>
                        <button
                            onClick={() => setViewMode("oracle")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                viewMode === "oracle" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white"
                            )}
                        >
                            Oracle
                        </button>
                    </div>

                    {/* Clinical Report Button */}
                    <button
                        onClick={() => setIsReportOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <FileText className="size-3.5" />
                        Report
                    </button>

                    {/* Neural Health Index Gauge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-6 px-6 py-3 premium-glass-panel rounded-2xl relative overflow-hidden group min-w-[300px]"
                    >
                        {/* Background Aura */}
                        <div className={cn(
                            "absolute inset-0 opacity-10 blur-xl transition-all duration-1000",
                            score > 85 ? "bg-blue-500" : score > 70 ? "bg-emerald-500" : "bg-rose-500"
                        )} />

                        <div className="relative flex items-center gap-4">
                            <div className="relative size-14">
                                <svg className="size-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-white/5 stroke-current"
                                        strokeWidth="8"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    <motion.circle
                                        className={cn("stroke-current", getScoreColor())}
                                        strokeWidth="8"
                                        strokeDasharray={251.2}
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">
                                    {score}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Health Index</div>
                                <div className={cn("text-sm font-bold uppercase tracking-wider", getScoreColor())}>
                                    {status}
                                </div>
                            </div>
                        </div>

                        <div className="ml-auto flex flex-col items-end">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="size-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] mb-1"
                            />
                            <div className="text-[10px] text-white/20 font-medium">LIVE SYNC</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {viewMode === "simulator" ? (
                <NeuralLab />
            ) : viewMode === "bio" ? (
                <BioSync />
            ) : viewMode === "resilience" ? (
                <ResilienceCenter />
            ) : viewMode === "oracle" ? (
                <OracleEngine />
            ) : viewMode === "hive" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2">
                        <GlobalPulse />
                    </div>
                    <div className="space-y-8 flex flex-col">
                        <CommunityHub />
                        <HiveInsights />
                    </div>
                </div>
            ) : (
                <>
                    <NeuralXP />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Heart Rate & Activity Flow with Projection */}
                        <NeuralRhythmChart forecastData={forecastData} prediction={prediction} lastPoint={lastPoint} />

                        {/* Next System Intervention (NEW) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-glass-panel rounded-3xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="size-5 text-blue-400/30 group-hover:text-blue-400 transition-colors" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Target className="size-5 text-blue-400" />
                                Next System Intervention
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Predictive Action</span>
                                        <span className="text-[10px] text-slate-500">Confidence: 94%</span>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium">
                                        {riskLevel === 'high'
                                            ? "Initiate immediate hydration protocol and reduce optical strain."
                                            : "Optimize neural load—excellent window for high-performance cognitive tasks."
                                        }
                                    </p>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-all group/btn">
                                    Acknowledge Foresight
                                    <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Health Milestone & Achievement Tracker (NEW) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-glass-panel rounded-3xl p-6 lg:col-span-2 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 blur-2xl bg-blue-500 size-32 rounded-full" />

                            <div className="flex items-center justify-between mb-6 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Trophy className="size-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Neural Achievements</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Milestones & Streaks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                    <Star className="size-3 text-blue-400 fill-blue-400" />
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">Master Rank</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                                {[
                                    { label: "Stability Streak", value: "12 Days", icon: Zap, color: "text-blue-400", bg: "bg-blue-400/10" },
                                    { label: "Optimal Sleep", value: "98% Score", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                                    { label: "Recovery Rate", value: "Fast", icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
                                    { label: "Deep Focus", value: "4.5h Avg", icon: Brain, color: "text-emerald-400", bg: "bg-emerald-400/10" }
                                ].map((m, i) => (
                                    <div key={i} className="p-4 rounded-2xl premium-glass-panel group">
                                        <m.icon className={cn("size-5 mb-3 transition-transform group-hover:scale-110", m.color)} />
                                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{m.label}</div>
                                        <div className="text-sm font-bold text-white">{m.value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Insights Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-4 group hover:bg-blue-500/10 transition-all border-l-4 border-l-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.1)]"
                    >
                        <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Zap className="size-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-blue-400 text-sm">Predictive Health Synthesis</h4>
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded-full border border-blue-500/30 font-bold uppercase tracking-widest">The Sentinel AI</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <ShieldCheck className="size-3 text-emerald-400" />
                                    98% Accuracy
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                {insight}
                            </p>
                        </div>
                    </motion.div>

                    {/* Medical Intelligence & Knowledge Base */}
                    <div className="grid grid-cols-1 gap-6 pt-4">
                        <MedicalIntelligence />
                    </div>
                </>
            )}

            {/* Clinical Report Modal */}
            <AnimatePresence>
                {isReportOpen && (
                    <ClinicalReport onClose={() => setIsReportOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
