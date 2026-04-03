import { motion } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";

export function NeuralLoadingScreen() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center">
                {/* Neural Pulse Core */}
                <div className="relative size-32 mb-8">
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2 border border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="text-blue-400"
                        >
                            <Sparkles className="size-8" />
                        </motion.div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-2 relative z-10">
                    <motion.h2 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white font-black text-xl tracking-[0.3em] uppercase"
                    >
                        Synchronizing
                    </motion.h2>
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <Activity className="size-3 animate-pulse text-blue-500" />
                        <span>Neural Intelligence Stream</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    />
                </div>
            </div>

            {/* Matrix-like decorative bits */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-1">
                <span className="text-[8px] font-mono text-blue-500/40">CORE_SYNC_ACTIVE</span>
                <span className="text-[8px] font-mono text-purple-500/40">NEURAL_MAPPING_0.84</span>
            </div>
            <div className="absolute top-12 right-12 flex flex-col gap-1 items-end">
                <span className="text-[8px] font-mono text-blue-500/40">VITE_HMR_READY</span>
                <span className="text-[8px] font-mono text-purple-500/40">HEALTH_OS_SECURE</span>
            </div>
        </motion.div>
    );
}
