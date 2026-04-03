import { motion } from "framer-motion";
import { ArrowRight, Play, ChevronDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export function AnalogueHero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 pt-20">
            {/* Shader Animation Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <ShaderAnimation />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Ambient Base Glows */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[150px] pointer-events-none z-0" />

            <div className="container px-4 md:px-6 text-center select-none relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Now in Beta — Join 1.2M+ Healthcare Professionals
                    <Sparkles className="w-3.5 h-3.5 ml-1 text-blue-400" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent blur-3xl -z-10 rounded-full" />
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[1.1]">
                        <span className="block overflow-hidden relative">
                            <motion.span
                                initial={{ y: 120 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "circOut", delay: 0.8 }}
                                className="block text-white/90 drop-shadow-lg"
                            >
                                Precision is the heart
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-purple-400 pb-2">
                            <motion.span
                                initial={{ y: 120 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: "circOut", delay: 1 }}
                                className="block"
                            >
                                of every decision
                            </motion.span>
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="mt-8 text-lg md:text-2xl text-white/50 max-w-3xl mx-auto tracking-wide font-light leading-relaxed"
                >
                    The next generation of healthcare intelligence. AI-powered diagnostics,
                    real-time vitals, and seamless care coordination — all in one platform.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link to="/dashboard" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="premium-button w-full sm:w-auto px-10 py-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-3 group transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] text-lg"
                        >
                            Enter Dashboard 
                            <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                        className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold flex items-center justify-center gap-3 transition-all backdrop-blur-md text-lg"
                    >
                        <Play className="w-5 h-5 fill-white/50 group-hover:fill-white" />
                        See How It Works
                    </motion.button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-white/30 font-medium uppercase tracking-widest"
                >
                    {["HIPAA Compliant", "SOC 2 Certified", "FDA Registered", "256-bit Encryption"].map((badge) => (
                        <span key={badge} className="flex items-center gap-2 group">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="group-hover:text-white/60 transition-colors">{badge}</span>
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 cursor-pointer hover:text-white/60 transition-colors"
                onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Explore More</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white/5 p-2 rounded-full backdrop-blur-sm border border-white/10"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </motion.div>
        </section>
    );
}
