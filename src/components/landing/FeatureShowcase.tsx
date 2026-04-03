import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Brain, Shield, Zap, Globe, Cpu } from "lucide-react";
import React, { useRef } from "react";

function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
    const ref = useRef<HTMLDivElement>(null);

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true, margin: "-100px" }}
            className="premium-glass-panel relative h-72 w-full rounded-3xl bg-white/[0.03] p-8 border border-white/10 backdrop-blur-xl shadow-2xl group cursor-pointer overflow-hidden"
        >
            <div
                style={{ transform: "translateZ(75px)" }}
                className="absolute inset-4 flex flex-col items-start gap-4 p-4"
            >
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                    <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold text-white/90 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 tracking-tight">
                    {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300 font-light">
                    {description}
                </p>
            </div>

            {/* Sub-layer glowing effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-colors duration-500 -z-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

const features = [
    {
        icon: Activity,
        title: "Real-time Diagnostics",
        description: "Monitor patient vitals with millisecond latency using our advanced telemetry engine running on edge nodes.",
        delay: 0.1
    },
    {
        icon: Brain,
        title: "AI-Powered Triage",
        description: "Deep learning algorithms predict patient deterioration and provide automated symptom assessments.",
        delay: 0.2
    },
    {
        icon: Shield,
        title: "Neural Health Vault",
        description: "Secure, AI-indexed storage for all your medical records, prescriptions, and lab reports with end-to-end encryption.",
        delay: 0.3
    },
    {
        icon: Zap,
        title: "Longevity Insights",
        description: "Personalized biohacking and anti-aging recommendations based on your unique physiological biomarkers.",
        delay: 0.4
    },
    {
        icon: Globe,
        title: "Nearby Care Radar",
        description: "Instantly locate the best hospitals, clinics, and pharmacies near you with real-time availability and ratings.",
        delay: 0.5
    },
    {
        icon: Cpu,
        title: "Vision Decoder",
        description: "Advanced AI analysis of X-rays, MRIs, and medication packaging for instant medical insights.",
        delay: 0.6
    }
];

export function FeatureShowcase() {
    return (
        <section className="relative min-h-screen py-32 bg-black text-white overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-8">
                {/* Section Header */}
                <div className="mb-24 text-center max-w-4xl mx-auto flex flex-col items-center">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium mb-6"
                    >
                        Platform Capabilities
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 mb-8 tracking-tighter"
                    >
                        Redefining the boundaries
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-white/50 leading-relaxed font-light"
                    >
                        We bridge the gap between biological signals and digital intelligence, empowering medical professionals to see the unseen.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
            
            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
