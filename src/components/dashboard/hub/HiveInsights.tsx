import { motion } from "framer-motion";
import { BarChart3, Users, TrendingDown, TrendingUp, Info } from "lucide-react";

const COMPARATIVE_DATA = [
    { label: "Sleep Quality", user: 82, hive: 74, unit: "%" },
    { label: "Stress Resilience", user: 65, hive: 58, unit: "%" },
    { label: "VO2 Max", user: 42, hive: 38, unit: "ml/kg" },
    { label: "Daily Steps", user: 8400, hive: 7200, unit: "" },
    { label: "Deep Sleep", user: 1.8, hive: 1.4, unit: "h" },
];

export function HiveInsights() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden group h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="size-5 text-blue-400" />
                        Hive Comparative Analysis
                    </h3>
                    <p className="text-xs text-white/40">You vs. Alpha Circle Average</p>
                </div>
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Users className="size-5 text-blue-400" />
                </div>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {COMPARATIVE_DATA.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-white/40">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-white/60">Hive: {item.hive}{item.unit}</span>
                                <span className="text-blue-400">You: {item.user}{item.unit}</span>
                            </div>
                        </div>

                        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            {/* Hive Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.hive / Math.max(item.user, item.hive)) * 100}%` }}
                                className="absolute top-0 left-0 h-full bg-white/10 rounded-full"
                            />
                            {/* User Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.user / Math.max(item.user, item.hive)) * 100}%` }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {item.user > item.hive ? (
                                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                                    <TrendingUp className="size-3" />
                                    +{Math.round(((item.user - item.hive) / item.hive) * 100)}% Above Average
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold uppercase">
                                    <TrendingDown className="size-3" />
                                    {Math.round(((item.user - item.hive) / item.hive) * 100)}% Below Average
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed italic">
                    "Your stress resilience is significantly higher than the hive average. This suggests your recent breathing protocols in the Resilience Center are highly effective."
                </p>
            </div>
        </motion.div>
    );
}
