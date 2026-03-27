import { motion } from "framer-motion";
import { Brain, Smile } from "lucide-react";
import { Link } from "react-router-dom";

export function MentalHealthWidget() {
    return (
        <Link to="/dashboard/mental-health">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group cursor-pointer shadow-sm hover:border-white/20 transition-all"
            >
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Brain className="size-5" />
                    </div>
                    <h3 className="font-semibold text-white">Mind Monitor</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative mb-2">
                        <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl" />
                        <Smile className="size-12 text-purple-400 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    </div>
                    <span className="text-lg font-medium text-white">Feeling Great</span>
                    <span className="text-xs text-slate-400">Last check-in: 2h ago</span>
                </div>

                <div className="mt-4 flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className={`h-8 w-1.5 rounded-full ${i === 4 ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`} />
                    ))}
                </div>
            </motion.div>
        </Link>
    );
}
