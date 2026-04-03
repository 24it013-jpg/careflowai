import { motion } from "framer-motion";
import { Moon, Sun, Star, Clock, TrendingUp, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { cn } from "@/lib/utils";

const SLEEP_STAGES = [
    { time: "10:30 PM", stage: 1, label: "Awake" },
    { time: "10:45 PM", stage: 2, label: "Light" },
    { time: "11:00 PM", stage: 3, label: "Light" },
    { time: "11:15 PM", stage: 4, label: "Deep" },
    { time: "11:30 PM", stage: 4, label: "Deep" },
    { time: "11:45 PM", stage: 4, label: "Deep" },
    { time: "12:00 AM", stage: 3, label: "Light" },
    { time: "12:15 AM", stage: 5, label: "REM" },
    { time: "12:30 AM", stage: 5, label: "REM" },
    { time: "12:45 AM", stage: 3, label: "Light" },
    { time: "1:00 AM", stage: 4, label: "Deep" },
    { time: "1:15 AM", stage: 4, label: "Deep" },
    { time: "1:30 AM", stage: 3, label: "Light" },
    { time: "1:45 AM", stage: 5, label: "REM" },
    { time: "2:00 AM", stage: 5, label: "REM" },
    { time: "2:15 AM", stage: 3, label: "Light" },
    { time: "2:30 AM", stage: 4, label: "Deep" },
    { time: "2:45 AM", stage: 3, label: "Light" },
    { time: "3:00 AM", stage: 5, label: "REM" },
    { time: "3:15 AM", stage: 5, label: "REM" },
    { time: "3:30 AM", stage: 3, label: "Light" },
    { time: "3:45 AM", stage: 2, label: "Light" },
    { time: "4:00 AM", stage: 5, label: "REM" },
    { time: "4:15 AM", stage: 5, label: "REM" },
    { time: "4:30 AM", stage: 3, label: "Light" },
    { time: "4:45 AM", stage: 2, label: "Light" },
    { time: "5:00 AM", stage: 1, label: "Awake" },
    { time: "5:15 AM", stage: 2, label: "Light" },
    { time: "5:30 AM", stage: 5, label: "REM" },
    { time: "5:45 AM", stage: 3, label: "Light" },
    { time: "6:00 AM", stage: 2, label: "Light" },
    { time: "6:15 AM", stage: 1, label: "Awake" },
];

const STAGE_CONFIG: Record<string, { color: string; bg: string; height: number }> = {
    Awake: { color: "#f59e0b", bg: "bg-amber-500", height: 10 },
    REM: { color: "#8b5cf6", bg: "bg-violet-500", height: 40 },
    Light: { color: "#3b82f6", bg: "bg-blue-500", height: 65 },
    Deep: { color: "#1d4ed8", bg: "bg-blue-700", height: 90 },
};

const WEEKLY_DATA = [
    { day: "Mon", score: 78, deep: 1.2, rem: 1.8 },
    { day: "Tue", score: 65, deep: 0.8, rem: 1.2 },
    { day: "Wed", score: 82, deep: 1.5, rem: 2.1 },
    { day: "Thu", score: 71, deep: 1.0, rem: 1.6 },
    { day: "Fri", score: 88, deep: 1.8, rem: 2.4 },
    { day: "Sat", score: 91, deep: 2.0, rem: 2.6 },
    { day: "Sun", score: 85, deep: 1.7, rem: 2.2 },
];

const CIRCADIAN_DATA = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`,
    alertness: Math.round(
        i < 6 ? 10 + i * 3 :
            i < 10 ? 40 + (i - 6) * 12 :
                i < 14 ? 88 - (i - 10) * 4 :
                    i < 16 ? 72 + (i - 14) * 6 :
                        i < 20 ? 84 - (i - 16) * 8 :
                            i < 22 ? 52 - (i - 20) * 15 :
                                22 - (i - 22) * 6
    ),
}));

export default function SleepVisualizer() {
    const totalDeep = 1.7;
    const totalREM = 2.2;
    const totalLight = 3.1;
    const totalAwake = 0.5;
    const totalSleep = totalDeep + totalREM + totalLight + totalAwake;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Moon className="size-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white">Sleep Visualizer</h1>
                    <p className="text-sm text-white/40">Last night · Feb 18 · 7h 32m total</p>
                    <p className="text-white/50 text-sm font-light max-w-2xl leading-relaxed mt-2">
                        Gain deep insights into your sleep quality. Our AI visualizes your sleep stages, tracks cycles, and provides actionable advice for a more restful night.
                    </p>
                </div>
                <div className="ml-auto px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-2xl font-black text-indigo-400">85</span>
                    <span className="text-xs text-white/30 ml-1">/ 100</span>
                </div>
            </motion.div>

            {/* Sleep Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Deep Sleep", value: `${totalDeep}h`, color: "text-blue-400", bg: "from-blue-500/10 to-blue-700/5", icon: Star },
                    { label: "REM Sleep", value: `${totalREM}h`, color: "text-violet-400", bg: "from-violet-500/10 to-indigo-500/5", icon: Moon },
                    { label: "Light Sleep", value: `${totalLight}h`, color: "text-indigo-400", bg: "from-indigo-500/10 to-blue-500/5", icon: Clock },
                    { label: "Awake", value: `${totalAwake}h`, color: "text-amber-400", bg: "from-amber-500/10 to-yellow-500/5", icon: Sun },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className={cn("p-5 rounded-3xl premium-glass-panel border-white/5 bg-gradient-to-br", stat.bg)}>
                        <div className="flex items-center gap-3 mb-3">
                            <stat.icon className={cn("size-5", stat.color)} />
                            <p className="text-xs text-white/40 font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                        <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[10px] text-white/20 font-bold">{Math.round((parseFloat(stat.value) / totalSleep) * 100)}% of night</p>
                            <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full", stat.bg.split(" ")[0].replace("from-", "bg-"))} style={{ width: `${(parseFloat(stat.value) / totalSleep) * 100}%` }} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Hypnogram */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mb-8 p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Sleep Architecture (Hypnogram)</h3>
                <div className="flex items-end gap-0.5 h-24 mb-3">
                    {SLEEP_STAGES.map((s, i) => {
                        const cfg = STAGE_CONFIG[s.label];
                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${cfg.height}%` }}
                                transition={{ delay: i * 0.02, duration: 0.4 }}
                                className={cn("flex-1 rounded-sm opacity-80", cfg.bg)}
                                title={`${s.time}: ${s.label}`}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between text-[10px] text-white/20 font-bold">
                    <span>10:30 PM</span><span>12:00 AM</span><span>2:00 AM</span><span>4:00 AM</span><span>6:15 AM</span>
                </div>
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                    {Object.entries(STAGE_CONFIG).map(([label, cfg]) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <div className={cn("size-2.5 rounded-sm", cfg.bg)} />
                            <span className="text-[10px] text-white/40 font-bold">{label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Sleep Scores */}
                <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp className="size-4 text-indigo-400" /> Weekly Efficiency
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={WEEKLY_DATA} barSize={32}>
                            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                contentStyle={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#fff" }} 
                            />
                            <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                                {WEEKLY_DATA.map((_entry, i) => (
                                    <Cell key={i} fill={i === 6 ? "#6366f1" : "rgba(99,102,241,0.2)"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Circadian Rhythm */}
                <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap className="size-4 text-amber-400" /> Circadian Alertness Curve
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={CIRCADIAN_DATA}>
                            <defs>
                                <linearGradient id="circGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: "bold" }} axisLine={false} tickLine={false} interval={3} />
                            <Tooltip 
                                contentStyle={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#fff" }} 
                            />
                            <Area type="monotone" dataKey="alertness" stroke="#8b5cf6" strokeWidth={3} fill="url(#circGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            </div>
        </div>
    );
}
