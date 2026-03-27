import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
    {
        name: "Starter",
        icon: Zap,
        price: "Free",
        period: "",
        description: "Perfect for individual practitioners exploring AI-powered care.",
        color: "blue",
        gradient: "from-blue-500/10 to-transparent",
        glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
        iconBg: "bg-blue-500/10 border border-blue-500/20",
        iconColor: "text-blue-400",
        buttonStyle: "premium-button bg-white/5 hover:bg-white/10 text-white",
        features: [
            "Up to 50 patients",
            "Basic AI diagnostics",
            "Telemedicine (5 sessions/mo)",
            "Health vault (5GB)",
            "Email support",
            "Mobile app access",
        ],
        notIncluded: ["Advanced AI models", "Custom integrations", "Priority support"],
        badge: null,
    },
    {
        name: "Pro",
        icon: Shield,
        price: "$149",
        period: "/month",
        description: "For growing practices that need the full power of CAREflow AI.",
        color: "blue",
        gradient: "from-blue-600/15 to-purple-600/5",
        glow: "shadow-[0_0_40px_rgba(37,99,235,0.15)] hover:shadow-[0_0_60px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/30",
        iconBg: "bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        iconColor: "text-blue-400",
        buttonStyle: "premium-button bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]",
        features: [
            "Unlimited patients",
            "Full AI suite (all models)",
            "Unlimited telemedicine",
            "Health vault (unlimited)",
            "Priority 24/7 support",
            "Advanced analytics",
            "50+ EHR integrations",
            "Custom AI workflows",
        ],
        notIncluded: [],
        badge: "Most Popular",
    },
    {
        name: "Enterprise",
        icon: Building2,
        price: "Custom",
        period: "",
        description: "For hospital systems and large healthcare networks.",
        color: "purple",
        gradient: "from-purple-500/10 to-transparent",
        glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
        iconBg: "bg-purple-500/10 border border-purple-500/20",
        iconColor: "text-purple-400",
        buttonStyle: "premium-button bg-white/5 hover:bg-white/10 text-white",
        features: [
            "Everything in Pro",
            "Dedicated infrastructure",
            "Custom AI model training",
            "On-premise deployment",
            "SLA guarantees (99.99%)",
            "Dedicated success manager",
            "HIPAA BAA included",
            "Custom compliance reports",
        ],
        notIncluded: [],
        badge: null,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="relative py-32 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        Simple Pricing
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Choose your plan
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                        Start free, scale as you grow. No hidden fees, no surprises.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className={`relative p-8 rounded-3xl premium-glass-panel flex flex-col transition-all duration-500 hover:-translate-y-2 ${plan.glow} overflow-hidden`}
                        >
                            {/* Inner gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-white/20 z-20">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="relative z-10 flex-grow">
                                {/* Icon & Name */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`p-3 rounded-2xl ${plan.iconBg} backdrop-blur-sm`}>
                                        <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
                                    </div>
                                    <span className="text-white font-bold text-xl tracking-wide">{plan.name}</span>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="flex items-end gap-1.5 border-b border-white/10 pb-6">
                                        <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                                        {plan.period && <span className="text-white/40 text-base mb-1.5 font-medium">{plan.period}</span>}
                                    </div>
                                    <p className="text-white/50 text-sm mt-6 leading-relaxed min-h-[40px]">{plan.description}</p>
                                </div>

                                {/* Features */}
                                <div className="space-y-4 mb-10">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                                                <Check className="w-3 h-3 text-emerald-400" />
                                            </div>
                                            <span className="text-white/70 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 opacity-40">
                                            <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="w-1.5 h-[1.5px] bg-white/40 rounded-full" />
                                            </div>
                                            <span className="text-white text-sm strike-through line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-auto relative z-10 pt-4">
                                <Link to="/dashboard" className="block">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all ${plan.buttonStyle}`}
                                    >
                                        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-white/30 text-xs font-medium tracking-wide uppercase mt-16"
                >
                    All plans include a 14-day free trial · No credit card required · Cancel anytime
                </motion.p>
            </div>
        </section>
    );
}
