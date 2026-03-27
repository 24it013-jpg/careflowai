import { motion } from "framer-motion";
import { FlaskConical, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Calendar, Brain } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LabResult {
    id: string;
    name: string;
    category: string;
    unit: string;
    current: number;
    min: number;
    max: number;
    normalMin: number;
    normalMax: number;
    trend: "up" | "down" | "stable";
    history: { date: string; value: number }[];
}

const LAB_RESULTS: LabResult[] = [
    {
        id: "glucose", name: "Fasting Glucose", category: "Metabolic", unit: "mg/dL",
        current: 94, min: 70, max: 130, normalMin: 70, normalMax: 100, trend: "stable",
        history: [
            { date: "Aug", value: 102 }, { date: "Sep", value: 98 }, { date: "Oct", value: 96 },
            { date: "Nov", value: 99 }, { date: "Dec", value: 95 }, { date: "Jan", value: 94 },
        ]
    },
    {
        id: "cholesterol", name: "Total Cholesterol", category: "Lipid Panel", unit: "mg/dL",
        current: 182, min: 100, max: 250, normalMin: 0, normalMax: 200, trend: "down",
        history: [
            { date: "Aug", value: 210 }, { date: "Sep", value: 205 }, { date: "Oct", value: 198 },
            { date: "Nov", value: 192 }, { date: "Dec", value: 187 }, { date: "Jan", value: 182 },
        ]
    },
    {
        id: "hdl", name: "HDL Cholesterol", category: "Lipid Panel", unit: "mg/dL",
        current: 58, min: 20, max: 100, normalMin: 40, normalMax: 100, trend: "up",
        history: [
            { date: "Aug", value: 48 }, { date: "Sep", value: 50 }, { date: "Oct", value: 52 },
            { date: "Nov", value: 54 }, { date: "Dec", value: 56 }, { date: "Jan", value: 58 },
        ]
    },
    {
        id: "hba1c", name: "HbA1c", category: "Metabolic", unit: "%",
        current: 5.4, min: 4, max: 8, normalMin: 4, normalMax: 5.7, trend: "stable",
        history: [
            { date: "Aug", value: 5.7 }, { date: "Sep", value: 5.6 }, { date: "Oct", value: 5.5 },
            { date: "Nov", value: 5.5 }, { date: "Dec", value: 5.4 }, { date: "Jan", value: 5.4 },
        ]
    },
    {
        id: "vitd", name: "Vitamin D", category: "Vitamins", unit: "ng/mL",
        current: 28, min: 0, max: 80, normalMin: 30, normalMax: 80, trend: "up",
        history: [
            { date: "Aug", value: 18 }, { date: "Sep", value: 20 }, { date: "Oct", value: 22 },
            { date: "Nov", value: 24 }, { date: "Dec", value: 26 }, { date: "Jan", value: 28 },
        ]
    },
    {
        id: "crp", name: "C-Reactive Protein", category: "Inflammation", unit: "mg/L",
        current: 0.8, min: 0, max: 10, normalMin: 0, normalMax: 3, trend: "down",
        history: [
            { date: "Aug", value: 2.1 }, { date: "Sep", value: 1.8 }, { date: "Oct", value: 1.5 },
            { date: "Nov", value: 1.2 }, { date: "Dec", value: 1.0 }, { date: "Jan", value: 0.8 },
        ]
    },
];

const CATEGORIES = ["All", "Metabolic", "Lipid Panel", "Vitamins", "Inflammation"];

export default function LabResults() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedResult, setSelectedResult] = useState<LabResult>(LAB_RESULTS[0]);

    const filtered = selectedCategory === "All" ? LAB_RESULTS : LAB_RESULTS.filter(r => r.category === selectedCategory);

    const getStatus = (r: LabResult) => {
        if (r.current < r.normalMin || r.current > r.normalMax) return "abnormal";
        if (r.current < r.normalMin * 1.05 || r.current > r.normalMax * 0.95) return "borderline";
        return "normal";
    };

    const STATUS_CONFIG = {
        normal: { label: "Normal", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
        borderline: { label: "Borderline", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
        abnormal: { label: "Abnormal", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
    };

    const TREND_ICONS = { up: TrendingUp, down: TrendingDown, stable: Minus };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-teal-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                            <FlaskConical className="size-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">Biometric Lab Analytics</h1>
                            <p className="text-sm text-white/40">Molecular diagnostics · Long-term trend synchronization</p>
                        </div>
                        <div className="ml-auto hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/30 uppercase tracking-widest">
                            <Calendar className="size-3" /> Data Latency: 2h
                        </div>
                    </motion.div>
                </header>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                selectedCategory === cat
                                    ? "bg-teal-500/20 border-teal-500/30 text-teal-300 shadow-lg shadow-teal-500/10"
                                    : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    {/* Results List */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-4">Diagnostic Feed</h3>
                        <div className="space-y-3">
                            {filtered.map((result, i) => {
                                const status = getStatus(result);
                                const cfg = STATUS_CONFIG[status];
                                const TrendIcon = TREND_ICONS[result.trend];
                                const pct = ((result.current - result.min) / (result.max - result.min)) * 100;
                                const normalMinPct = ((result.normalMin - result.min) / (result.max - result.min)) * 100;
                                const normalMaxPct = ((result.normalMax - result.min) / (result.max - result.min)) * 100;

                                return (
                                    <motion.button
                                        key={result.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        onClick={() => setSelectedResult(result)}
                                        className={cn(
                                            "w-full text-left p-6 rounded-[2rem] border transition-all relative overflow-hidden group",
                                            selectedResult.id === result.id
                                                ? "premium-glass-panel border-teal-500/30 bg-teal-500/5"
                                                : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">{result.name}</p>
                                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-0.5">{result.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendIcon className={cn("size-3.5", result.trend === "up" ? "text-emerald-400" : result.trend === "down" ? "text-red-400" : "text-white/20")} />
                                                <span className={cn("text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border", cfg.bg, cfg.color)}>{cfg.label}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-4">
                                            <span className="text-2xl font-black text-white">{result.current}</span>
                                            <span className="text-[10px] font-bold text-white/20 uppercase">{result.unit}</span>
                                        </div>
                                        {/* Range bar */}
                                        <div className="relative h-1 bg-white/5 rounded-full">
                                            <div
                                                className="absolute h-full bg-emerald-500/10 rounded-full"
                                                style={{ left: `${normalMinPct}%`, width: `${normalMaxPct - normalMinPct}%` }}
                                            />
                                            <div
                                                className={cn("absolute h-full rounded-full transition-all duration-500", status === "normal" ? "bg-emerald-400" : status === "borderline" ? "bg-amber-400" : "bg-red-400")}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            key={selectedResult.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[3rem] premium-glass-panel border-white/5 relative overflow-hidden group min-h-[600px] flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-teal-500/10 transition-colors" />

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                                <div>
                                    <h3 className="text-4xl font-black text-white tracking-tight mb-3">{selectedResult.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[10px] font-black text-teal-300 uppercase tracking-widest">
                                            {selectedResult.category}
                                        </span>
                                        <span className="text-[11px] font-bold text-white/30 uppercase tracking-tight">Normal: {selectedResult.normalMin}–{selectedResult.normalMax} {selectedResult.unit}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn(
                                            "text-7xl font-black tracking-tighter leading-none",
                                            getStatus(selectedResult) === "normal" ? "text-teal-400" :
                                                getStatus(selectedResult) === "borderline" ? "text-amber-400" : "text-red-400"
                                        )}>
                                            {selectedResult.current}
                                        </span>
                                        <span className="text-xl font-bold text-white/20 uppercase">{selectedResult.unit}</span>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-4 shadow-lg",
                                        getStatus(selectedResult) === "normal" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-teal-500/5" :
                                            getStatus(selectedResult) === "borderline" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-500/5" :
                                                "bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/5"
                                    )}>
                                        {getStatus(selectedResult) === "normal" ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
                                        {STATUS_CONFIG[getStatus(selectedResult)].label}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[300px] w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={selectedResult.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={getStatus(selectedResult) === "normal" ? "#2dd4bf" : "#f87171"} stopOpacity={0.2} />
                                                <stop offset="95%" stopColor={getStatus(selectedResult) === "normal" ? "#2dd4bf" : "#f87171"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="premium-glass-panel border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl">
                                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">{label} SYNC</p>
                                                            <p className="text-2xl font-black text-white">
                                                                {payload[0].value} <span className="text-xs font-bold text-white/20 uppercase">{selectedResult.unit}</span>
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={getStatus(selectedResult) === "normal" ? "#2dd4bf" : getStatus(selectedResult) === "borderline" ? "#fbbf24" : "#f87171"}
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5">
                                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Brain className="size-3 mr-1" /> Neural Analysis
                                    </h4>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        Status: <span className={getStatus(selectedResult) === "normal" ? "text-teal-400" : "text-amber-400"}>{getStatus(selectedResult).toUpperCase()}</span>.
                                        The biometric trend is {selectedResult.trend === "up" ? "ascending" : selectedResult.trend === "down" ? "descending" : "plateaued"} over the last interval.
                                        {getStatus(selectedResult) === "normal" ? " Homeostasis detected. Continue current metabolic regimen." : " Intervention or monitoring recommended."}
                                    </p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 flex items-center gap-6 group/action cursor-pointer">
                                    <div className="size-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover/action:scale-110 transition-transform">
                                        <CheckCircle2 className="size-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white mb-1">Physician Sync</h4>
                                        <p className="text-[10px] font-bold text-white/30 uppercase">Next Review: April 2026</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
