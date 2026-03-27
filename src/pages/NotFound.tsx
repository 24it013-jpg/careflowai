import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MoveLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden p-4">
            {/* Deep Space Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-rose-900/10 rounded-full blur-[150px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 text-center space-y-8 max-w-2xl w-full premium-glass-panel p-12 md:p-16 rounded-[3rem] shadow-2xl border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] pointer-events-none" />
                
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center relative z-10"
                >
                    <div className="relative group p-6 bg-red-500/10 rounded-3xl border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.15)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(239,68,68,0.25)] hover:bg-red-500/20">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <ShieldAlert className="w-20 h-20 text-red-500 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="relative z-10"
                >
                    <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20 mb-6 drop-shadow-sm tracking-tighter">
                        404
                    </h1>
                    <h2 className="text-3xl font-light text-white/90 mb-4 tracking-tight">
                        Signal Lost
                    </h2>
                    <p className="text-white/50 text-lg leading-relaxed max-w-md mx-auto font-light">
                        The neural pathway you are trying to reach is not transmitting. The sector may have been moved, deleted, or never existed in this dimension.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="relative z-10 pt-4"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.1)]"
                    >
                        <MoveLeft className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                        <span className="font-medium tracking-wide">Return to Command Center</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
