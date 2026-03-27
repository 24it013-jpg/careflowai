import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Dr. Sarah Chen",
        role: "Chief of Cardiology",
        org: "Mayo Clinic",
        avatar: "SC",
        avatarColor: "from-blue-500 to-cyan-500",
        quote: "CAREflow has fundamentally changed how we monitor post-op patients. The AI caught a deterioration pattern 4 hours before our team would have noticed. It saved a life.",
        stars: 5,
        metric: "4hrs earlier detection",
    },
    {
        name: "Dr. Marcus Williams",
        role: "Emergency Medicine Director",
        org: "Johns Hopkins",
        avatar: "MW",
        avatarColor: "from-purple-500 to-pink-500",
        quote: "In the ER, every second counts. CAREflow's real-time triage AI has reduced our average assessment time by 40%. The ambient scribe alone is worth the subscription.",
        stars: 5,
        metric: "40% faster triage",
    },
    {
        name: "Dr. Priya Patel",
        role: "Family Medicine Physician",
        org: "Cleveland Clinic",
        avatar: "PP",
        avatarColor: "from-emerald-500 to-teal-500",
        quote: "My patients love the health avatar and daily quests. Engagement with their own health data has never been higher. I've seen measurable improvements in chronic disease management.",
        stars: 5,
        metric: "3x patient engagement",
    },
    {
        name: "James Rodriguez",
        role: "CTO, HealthTech Systems",
        org: "Stanford Health",
        avatar: "JR",
        avatarColor: "from-amber-500 to-orange-500",
        quote: "The integration capabilities are unmatched. We connected our entire EHR stack in under a day. The API documentation is excellent and the support team is world-class.",
        stars: 5,
        metric: "1-day integration",
    },
    {
        name: "Dr. Aisha Okonkwo",
        role: "Telemedicine Lead",
        org: "Mass General Hospital",
        avatar: "AO",
        avatarColor: "from-rose-500 to-red-500",
        quote: "The telemedicine suite is phenomenal. Built-in AI transcription, digital whiteboard, and in-call prescriptions — everything we need in one seamless experience.",
        stars: 5,
        metric: "60% less admin time",
    },
    {
        name: "Dr. Kevin Park",
        role: "Radiologist",
        org: "UCSF Medical Center",
        avatar: "KP",
        avatarColor: "from-sky-500 to-blue-500",
        quote: "The AI Vision Decoder is remarkable. It flags subtle anomalies in imaging that I then confirm — it's like having an incredibly attentive second pair of eyes on every scan.",
        stars: 5,
        metric: "23% more anomalies caught",
    },
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="relative py-32 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(147,51,234,0.05)_0%,_transparent_70%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        Real Stories
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Trusted by the best
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                        Hear from the healthcare professionals who use CAREflow every day to revolutionize patient care.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative p-8 rounded-3xl premium-glass-panel transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Hover highlight */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                                {/* Quote Icon */}
                                <Quote className="w-8 h-8 text-white/[0.08] mb-6 group-hover:text-purple-400/20 transition-colors" />

                                {/* Stars */}
                                <div className="flex gap-1.5 mb-6">
                                    {Array.from({ length: t.stars }).map((_, s) => (
                                        <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <p className="text-white/70 text-base leading-relaxed mb-8 italic font-light">
                                    "{t.quote}"
                                </p>

                                {/* Metric Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
                                    <span className="text-emerald-400 text-xs font-bold tracking-wide">{t.metric}</span>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-base">{t.name}</p>
                                        <p className="text-white/40 text-sm">{t.role} · <span className="text-white/60">{t.org}</span></p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
