import { motion } from "framer-motion";
import { Utensils, Flame, Apple } from "lucide-react";
import { Link } from "react-router-dom";

export function DietWidget() {
    return (
        <Link to="/dashboard/diet">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group cursor-pointer shadow-sm hover:border-white/20 transition-all"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        <Utensils className="size-5" />
                    </div>
                    <h3 className="font-semibold text-white">Diet AI</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-white">1,350</span>
                            <span className="text-xs text-slate-400">kcal consumed</span>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-orange-400 font-medium">67%</span>
                            <span className="text-xs text-slate-400 block">of daily goal</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 w-[67%] shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
                            <Apple className="size-3 text-emerald-400" />
                            <span className="text-xs text-slate-300">Carbs: 120g</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
                            <Flame className="size-3 text-rose-500" />
                            <span className="text-xs text-slate-300">Fat: 45g</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
