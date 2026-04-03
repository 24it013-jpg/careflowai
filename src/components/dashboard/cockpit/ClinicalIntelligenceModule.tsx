import { motion } from "framer-motion";
import { Brain, AlertTriangle, CheckCircle2, ChevronRight, Zap, Info } from "lucide-react";

export function ClinicalIntelligenceModule() {
    const alerts = [
        { type: "critical", msg: "Blood Pressure trending 15% higher than 7-day avg", icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10" },
        { type: "info", msg: "Metformin refill due in 3 days", icon: Info, color: "text-amber-400 bg-amber-500/10" },
        { type: "success", msg: "Sleep consistency improved by 22%", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    ];

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col group will-change-transform"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                    <Brain className="size-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Clinical Intelligence</h3>
                    <p className="text-xs text-slate-400">AI-driven diagnostics & trends</p>
                </div>
            </div>

            {/* AI Insights */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 no-scrollbar">
                {alerts.map((alert, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/alert"
                    >
                        <div className={`p-2 rounded-xl shrink-0 ${alert.color}`}>
                            <alert.icon className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/80 font-medium leading-relaxed">{alert.msg}</p>
                            <button className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1 group-hover/alert:text-purple-300 transition-colors">
                                View Detail <ChevronRight className="size-2.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Insight Card */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="size-3 text-purple-400" />
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Neural Prediction</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                    "Based on current heart rate variability, suggest focused meditation session to optimize recovery."
                </p>
            </div>
        </motion.div>
    );
}
