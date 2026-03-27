import { motion } from "framer-motion";
import { Plug, BarChart3, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
    {
        number: "01",
        icon: Plug,
        title: "Connect Your Ecosystem",
        description: "Seamlessly integrate your EHR, wearables, lab systems, and medical devices in minutes. No complex setup — just plug in and go.",
        highlights: ["50+ EHR integrations", "Apple Watch & Fitbit", "Lab & imaging systems"],
        color: "blue",
        gradient: "from-blue-500/10 to-transparent",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10 border border-blue-500/20",
    },
    {
        number: "02",
        icon: BarChart3,
        title: "AI Analyzes Everything",
        description: "Our deep learning engine processes millions of data points in real-time, identifying patterns and anomalies invisible to the human eye.",
        highlights: ["Real-time vitals monitoring", "Predictive deterioration alerts", "Personalized health scoring"],
        color: "purple",
        gradient: "from-purple-500/10 to-transparent",
        glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10 border border-purple-500/20",
    },
    {
        number: "03",
        icon: Zap,
        title: "Act with Confidence",
        description: "Receive actionable insights, automated alerts, and AI-generated care plans that empower your team to make faster, better decisions.",
        highlights: ["Instant push notifications", "AI care plan generation", "One-click telemedicine"],
        color: "emerald",
        gradient: "from-emerald-500/10 to-transparent",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10 border border-emerald-500/20",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-32 bg-black overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        Simple by Design
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        How CAREflow Works
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        From setup to actionable insights in under 10 minutes. Our platform is built for speed without sacrificing depth.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-16 left-[calc(33.33%+2rem)] right-[calc(33.33%+2rem)] h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 overflow-hidden">
                        <motion.div 
                            className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                            animate={{ x: ["-100%", "300%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className={`relative p-8 rounded-3xl premium-glass-panel group transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:${step.glow}`}
                        >
                            {/* Inner gradient glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            <div className="relative z-10">
                                {/* Step Number */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-6xl font-black text-white/[0.03] select-none group-hover:text-white/[0.05] transition-colors">{step.number}</span>
                                    <div className={`p-4 rounded-2xl ${step.iconBg} backdrop-blur-sm`}>
                                        <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-white/60 text-base leading-relaxed mb-8">{step.description}</p>

                                {/* Highlights */}
                                <ul className="space-y-3">
                                    {step.highlights.map((h) => (
                                        <li key={h} className="flex items-center gap-3 text-sm text-white/50 group-hover:text-white/70 transition-colors">
                                            <span className={`w-1.5 h-1.5 rounded-full ${step.iconColor.replace("text-", "bg-")}`} />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center mt-24"
                >
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="premium-button inline-flex items-center gap-2"
                        >
                            Start Your Free Trial
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                    <p className="text-white/20 text-xs mt-6 font-medium tracking-wide">NO CREDIT CARD REQUIRED · 14-DAY FREE TRIAL · CANCEL ANYTIME</p>
                </motion.div>
            </div>
        </section>
    );
}
