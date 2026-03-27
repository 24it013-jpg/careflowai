import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatItem {
    value: number;
    suffix: string;
    label: string;
    description: string;
    color: string;
}

const stats: StatItem[] = [
    { value: 1.2, suffix: "M+", label: "Active Patients", description: "Monitored in real-time globally", color: "from-blue-400 to-cyan-400" },
    { value: 98.7, suffix: "%", label: "Platform Uptime", description: "99.9% SLA guaranteed", color: "from-emerald-400 to-teal-400" },
    { value: 50, suffix: "+", label: "Integrations", description: "EHR, wearables & lab systems", color: "from-purple-400 to-pink-400" },
    { value: 340, suffix: "ms", label: "Avg Response Time", description: "AI diagnostics at lightning speed", color: "from-amber-400 to-orange-400" },
    { value: 99.9, suffix: "%", label: "Data Accuracy", description: "Validated clinical-grade precision", color: "from-rose-400 to-red-400" },
    { value: 24, suffix: "/7", label: "Support Coverage", description: "Dedicated medical IT support", color: "from-sky-400 to-blue-400" },
];

function AnimatedNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = value;
        const duration = 1500;
        const step = (end / duration) * 16;
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setDisplay(end);
                clearInterval(timer);
            } else {
                setDisplay(parseFloat(start.toFixed(1)));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <span ref={ref} className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
            {display}{suffix}
        </span>
    );
}

export function StatsSection() {
    return (
        <section id="stats" className="relative py-24 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        Trusted Worldwide
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Numbers that speak for themselves
                    </h2>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group p-6 rounded-2xl premium-glass-panel hover:bg-white/[0.04] transition-all text-center relative overflow-hidden"
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />
                                <p className="text-white font-semibold text-sm mt-3">{stat.label}</p>
                                <p className="text-white/40 text-xs mt-1.5 leading-relaxed">{stat.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Logos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-20 pt-12 border-t border-white/5 relative"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    <p className="text-center text-white/30 text-xs uppercase tracking-[0.2em] mb-10 font-medium">Trusted by leading healthcare institutions</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {["Mayo Clinic", "Johns Hopkins", "Cleveland Clinic", "Mass General", "Stanford Health"].map((org) => (
                            <span key={org} className="text-white/30 font-semibold text-sm md:text-base tracking-wide hover:text-white/70 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all cursor-default">
                                {org}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
