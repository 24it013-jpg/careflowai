import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                        The Future of Healthcare Intelligence
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Precision diagnostics, real-time vitals, and AI-driven insights.
                        Your medical cockpit for the next generation of care.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link to="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center gap-2 group transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)]"
                            >
                                Enter Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                document.getElementById('pulse-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-4 rounded-full border border-gray-700 hover:border-gray-500 hover:bg-slate-50 text-gray-300 font-semibold text-lg transition-all backdrop-blur-sm"
                        >
                            View Features
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
            >
                <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-0.5 h-12 bg-gradient-to-b from-transparent via-blue-500 to-transparent"
                />
            </motion.div>
        </section>
    );
}
