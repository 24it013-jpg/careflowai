import { motion } from "framer-motion";
import { Globe, Users, TrendingUp, Activity, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionTrend {
    id: string;
    name: string;
    trend: string;
    metric: string;
    value: string;
    status: "optimal" | "alert" | "neutral";
    coords: { x: number; y: number };
}

const REGIONAL_TRENDS: RegionTrend[] = [
    { id: "na", name: "North America", trend: "High Stress", metric: "Cortisol", value: "84%", status: "alert", coords: { x: 25, y: 35 } },
    { id: "eu", name: "Europe", trend: "Deep Sleep Spike", metric: "REM", value: "92%", status: "optimal", coords: { x: 50, y: 30 } },
    { id: "asia", name: "Asia-Pacific", trend: "Activity Surge", metric: "Steps", value: "12.4k", status: "optimal", coords: { x: 75, y: 45 } },
    { id: "sa", name: "South America", trend: "Balanced Vitals", metric: "NHI", value: "78", status: "neutral", coords: { x: 35, y: 65 } },
];

export function GlobalPulse() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-blue-500/5 blur-[120px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe className="size-5 text-blue-400" />
                        Global Health Pulse
                    </h2>
                    <p className="text-sm text-white/40">Real-time Anonymized Collective Intelligence</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Users className="size-3 text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                            1.2M Concurrent Nodes
                        </span>
                    </div>
                </div>
            </div>

            {/* Map Container (SVG World Map) */}
            <div className="flex-1 relative mb-8 rounded-2xl bg-black/40 border border-white/5 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10 pointer-events-none" />

                {/* World Map SVG */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <svg
                        viewBox="0 0 1000 500"
                        className="w-full h-full transition-colors duration-700"
                        fill="none"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Professional Simplified World Map Path */}
                        <path
                            d="M198,135 L190,140 L180,145 L170,140 L165,130 L170,120 L180,115 L195,120 L205,130 Z M220,150 L230,165 L225,185 L215,205 L195,225 L175,245 L155,265 L135,260 L125,240 L130,220 L145,200 L165,180 L185,165 Z M420,110 L450,105 L480,115 L500,140 L510,170 L505,210 L520,250 L550,280 L585,305 L615,335 L615,375 L590,415 L555,435 L515,445 L475,435 L445,405 L425,365 L415,325 L395,285 L365,255 L325,235 L285,225 L255,205 L235,175 L235,145 L255,115 L285,95 L325,85 L375,90 Z M645,155 L685,145 L735,135 L785,145 L835,165 L875,195 L905,235 L915,295 L915,355 L895,415 L855,455 L795,475 L735,465 L685,435 L655,395 L635,345 L625,285 L625,225 L635,185 Z M750,200 L770,200 L780,210 L770,220 L750,220 L740,210 Z"
                            className="fill-blue-500/10 transition-colors duration-700 group-hover:fill-blue-500/15"
                        />

                        {/* Organic Dot Map Generation */}
                        {Array.from({ length: 1500 }).map((_, i) => {
                            // Seeded random-ish values
                            const x = (Math.sin(i * 123.456) * 500) + 500;
                            const y = (Math.cos(i * 987.654) * 250) + 250;

                            // Accurate-ish collision logic for the paths above
                            const isNA = x > 110 && x < 240 && y > 100 && y < 270;
                            const isSA = x > 150 && x < 280 && y > 270 && y < 460;
                            const isEU = x > 420 && x < 580 && y > 70 && y < 200;
                            const isAF = x > 410 && x < 620 && y > 200 && y < 450;
                            const isAS = x > 630 && x < 930 && y > 80 && y < 380;
                            const isAU = x > 780 && x < 930 && y > 380 && y < 480;

                            if (!isNA && !isSA && !isEU && !isAF && !isAS && !isAU) return null;

                            return (
                                <motion.circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r={0.6 + Math.random() * 0.8}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0.1, 0.35, 0.1],
                                        scale: [1, 1.15, 1]
                                    }}
                                    transition={{
                                        duration: 4 + Math.random() * 5,
                                        repeat: Infinity,
                                        delay: Math.random() * 10
                                    }}
                                    className="fill-blue-400/60"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Simulated Map Grid (Underlay) */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_2px,transparent_2px),linear-gradient(to_bottom,#ffffff10_2px,transparent_2px)] bg-[size:40px_40px]" />

                {/* Pulsing Hotspots */}
                {REGIONAL_TRENDS.map((region) => (
                    <motion.div
                        key={region.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ left: `${region.coords.x}%`, top: `${region.coords.y}%` }}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
                    >
                        <div className="relative">
                            {/* Sonar Ring 1 */}
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    region.status === "optimal" ? "bg-emerald-500" : region.status === "alert" ? "bg-rose-500" : "bg-blue-500"
                                )}
                            />
                            {/* Sonar Ring 2 */}
                            <motion.div
                                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    region.status === "optimal" ? "bg-emerald-500" : region.status === "alert" ? "bg-rose-500" : "bg-blue-500"
                                )}
                            />

                            <div className={cn(
                                "size-3.5 rounded-full border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] relative z-10 transition-transform duration-300 group-hover/pin:scale-150",
                                region.status === "optimal" ? "bg-emerald-500" : region.status === "alert" ? "bg-rose-500" : "bg-blue-500"
                            )} />
                        </div>

                        {/* Tooltip on Hover */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 translate-y-2 group-hover/pin:translate-y-0 pointer-events-none z-30">
                            <div className="p-4 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{region.name}</p>
                                <p className="text-sm font-bold text-white mb-2.5 leading-tight">{region.trend}</p>
                                <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                                    <span className="text-[10px] text-white/30 font-medium uppercase">{region.metric}</span>
                                    <span className={cn(
                                        "text-[10px] font-black tracking-wider",
                                        region.status === "optimal" ? "text-emerald-400" : region.status === "alert" ? "text-rose-400" : "text-blue-400"
                                    )}>{region.value}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Insights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                    <TrendingUp className="size-4 text-emerald-400 mb-2" />
                    <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Peak Flow</p>
                    <p className="text-sm font-bold text-white">Northern Europe</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                    <Activity className="size-4 text-rose-400 mb-2" />
                    <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Fatigue Alert</p>
                    <p className="text-sm font-bold text-white">East Coast US</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                    <Users className="size-4 text-blue-400 mb-2" />
                    <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Group Sync</p>
                    <p className="text-sm font-bold text-white">84% Coherence</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                    <MapPin className="size-4 text-cyan-400 mb-2" />
                    <p className="text-[10px] text-white/20 font-bold uppercase mb-1">Your Context</p>
                    <p className="text-sm font-bold text-white">+2% Region Avg</p>
                </div>
            </div>
        </motion.div>
    );
}
