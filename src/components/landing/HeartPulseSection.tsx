import { motion } from "framer-motion";

export function HeartPulseSection() {

    // ECG Path definition
    // A simplified ECG wave: P-wave, QRS complex, T-wave
    const ecgPath = "M0,50 L20,50 L25,45 L30,55 L35,50 L45,50 L50,30 L55,80 L60,10 L65,70 L70,50 L85,50 L90,40 L95,60 L100,50 L120,50";

    return (
        <section id="pulse-section" className="relative min-h-[80vh] flex flex-col items-center justify-center bg-black overflow-hidden py-24">
            {/* Premium Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.08)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="container relative z-10 flex flex-col items-center justify-center gap-16">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center"
                >
                    {/* Glowing Heart Core */}
                    <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[60px] animate-pulse pointer-events-none" />
                    <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-[40px] animate-pulse pointer-events-none delay-150" />

                    {/* 3D Heart Representation (SVG) */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-48 h-48 md:w-64 md:h-64 text-red-600 drop-shadow-[0_0_35px_rgba(220,38,38,0.8)] relative z-10"
                        animate={{
                            scale: [1, 1.2, 1, 1.2, 1], // Double beat
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            times: [0, 0.1, 0.2, 0.3, 1],
                            ease: "easeInOut"
                        }}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </motion.svg>
                </motion.div>

                {/* ECG Line Animation */}
                <div className="w-full max-w-4xl overflow-hidden relative h-32 flex items-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-20 pointer-events-none" />

                    {/* Infinite scrolling ECG line */}
                    <motion.div
                        className="flex items-center gap-0 absolute left-0 h-full"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <svg key={i} viewBox="0 0 120 100" className="w-[300px] h-full stroke-red-500 fill-none stroke-[2px]" preserveAspectRatio="none">
                                <path d={ecgPath} className="drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                            </svg>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-6 max-w-2xl mx-auto premium-glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                        Real-Time Telemetry
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Alive with Data
                    </h2>
                    <p className="text-white/60 text-base md:text-lg leading-relaxed">
                        Monitor the heartbeat of your operations in real-time.
                        Every pulse, every signal, captured with <span className="text-white font-semibold">millisecond precision</span>.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
