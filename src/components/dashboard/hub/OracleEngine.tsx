import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, Sparkles, Zap, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FORECAST_DATA = [
    { day: "Today", score: 76, lower: 70, upper: 82 },
    { day: "Wed", score: 79, lower: 73, upper: 85 },
    { day: "Thu", score: 74, lower: 67, upper: 81 },
    { day: "Fri", score: 82, lower: 76, upper: 88 },
    { day: "Sat", score: 88, lower: 83, upper: 93 },
    { day: "Sun", score: 85, lower: 79, upper: 91 },
    { day: "Mon", score: 91, lower: 86, upper: 96 },
];

const RISK_FACTORS = [
    { label: "Sleep Debt", level: "medium", impact: -8, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Stress Accumulation", level: "low", impact: -3, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Hydration Deficit", level: "high", impact: -12, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
];

const SCENARIOS = [
    { label: "Sleep 8h tonight", delta: "+12", icon: "🌙" },
    { label: "30min cardio", delta: "+8", icon: "🏃" },
    { label: "Meditate 10min", delta: "+5", icon: "🧘" },
    { label: "Drink 3L water", delta: "+6", icon: "💧" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="text-white text-xs font-bold mb-1">{label}</p>
                <p className="text-blue-400 text-xs">Score: <span className="font-bold">{payload[0]?.value}</span></p>
            </div>
        );
    }
    return null;
};

export function OracleEngine() {
    const [activeScenario, setActiveScenario] = useState<number | null>(null);
    const baseScore = 76;
    const projectedScore = activeScenario !== null
        ? baseScore + parseInt(SCENARIOS[activeScenario].delta)
        : baseScore;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -top-32 -left-32 size-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 size-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Brain className="size-5 text-blue-400" />
                        The Oracle — Health Forecast
                    </h2>
                    <p className="text-sm text-white/40">7-Day Predictive Intelligence Engine</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <Sparkles className="size-3 text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Powered</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 relative z-10">
                {/* Left: Forecast Chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Score Display */}
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">Current Score</p>
                            <div className="text-6xl font-black text-white">{baseScore}</div>
                        </div>
                        {activeScenario !== null && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 pb-2"
                            >
                                <ChevronRight className="size-5 text-white/20" />
                                <div className="text-4xl font-black text-emerald-400">{projectedScore}</div>
                                <span className="text-emerald-400 text-sm font-bold">{SCENARIOS[activeScenario].delta} pts</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Chart */}
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={FORECAST_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                                <defs>
                                    <linearGradient id="oracleGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[60, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} fill="url(#oracleGrad)" dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* What-If Scenarios */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">What-If Simulator</p>
                        <div className="grid grid-cols-2 gap-3">
                            {SCENARIOS.map((s, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveScenario(activeScenario === i ? null : i)}
                                    className={cn(
                                        "p-3 rounded-xl border text-left transition-all",
                                        activeScenario === i
                                            ? "bg-blue-500/20 border-blue-500/40 text-white"
                                            : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg">{s.icon}</span>
                                        <span className={cn("text-xs font-bold", activeScenario === i ? "text-emerald-400" : "text-white/30")}>{s.delta}</span>
                                    </div>
                                    <p className="text-xs mt-1 font-medium">{s.label}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Risk Factors */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Risk Factors</p>
                    {RISK_FACTORS.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn("p-4 rounded-2xl border", r.bg)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={cn("text-xs font-bold uppercase tracking-wider", r.color)}>{r.label}</span>
                                <span className={cn("text-xs font-mono font-bold", r.color)}>{r.impact} pts</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.abs(r.impact) * 6}%` }}
                                    className={cn("h-full rounded-full", r.color.replace('text-', 'bg-'))}
                                />
                            </div>
                        </motion.div>
                    ))}

                    <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-start gap-3">
                            <TrendingUp className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-white/40 leading-relaxed italic">
                                "Your trajectory is positive. Addressing hydration deficit could push your weekend score above 90."
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="size-4 text-blue-400" />
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Oracle Prediction</span>
                        </div>
                        <p className="text-2xl font-black text-white">91 <span className="text-sm font-normal text-white/40">by Monday</span></p>
                        <p className="text-[10px] text-white/30 mt-1">87% confidence interval</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
