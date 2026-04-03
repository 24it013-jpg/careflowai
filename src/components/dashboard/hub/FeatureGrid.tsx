import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar,
    Pill,
    Brain,
    Heart,
    HeartPulse,
    Users,
    FileText,
    Bell,
    TrendingUp,
    Shield,
    Utensils,

    Moon,
    Stethoscope,
    MessageCircle,
    Video,
    Trophy,
    Crown,
    Target,
    Star,
    Activity,
    FlaskConical,
    Navigation
} from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

type GlowColor = 'blue' | 'purple' | 'green' | 'red' | 'orange';

const FEATURES = [
    { id: "medications", icon: Pill, label: "Med photo AI", description: "Scan medicine packaging for instant info", color: "from-rose-600 to-rose-700", bg: "bg-rose-500/10", iconColor: "text-rose-400", href: "/dashboard/med-check", glow: "red" as GlowColor },
    { id: "open-health", icon: HeartPulse, label: "Open Health", description: "Access universal medical knowledge", color: "from-sky-600 to-blue-700", bg: "bg-sky-500/10", iconColor: "text-sky-400", href: "/dashboard/open-health", glow: "blue" as GlowColor },
    { id: "nutrition", icon: Utensils, label: "Nutrition", description: "Personalized diet & macro tracking", color: "from-lime-600 to-lime-700", bg: "bg-lime-500/10", iconColor: "text-lime-400", href: "/dashboard/diet", glow: "green" as GlowColor },
    { id: "sleep", icon: Moon, label: "Sleep Tracker", description: "Analyze sleep cycles & quality", color: "from-indigo-600 to-indigo-700", bg: "bg-indigo-500/10", iconColor: "text-indigo-400", href: "/dashboard/sleep", glow: "purple" as GlowColor },
    { id: "chat", icon: MessageCircle, label: "Health Chat", description: "AI-powered symptom assessment", color: "from-fuchsia-600 to-fuchsia-700", bg: "bg-fuchsia-500/10", iconColor: "text-fuchsia-400", href: "/dashboard/symptom-checker", glow: "purple" as GlowColor },
    { id: "video", icon: Video, label: "Video Consult", description: "Secure virtual doctor visits", color: "from-pink-600 to-pink-700", bg: "bg-pink-500/10", iconColor: "text-pink-400", href: "/dashboard/telemedicine", glow: "red" as GlowColor },
    { id: "achievements", icon: Trophy, label: "Achievements", description: "Gamified health milestones", color: "from-amber-600 to-orange-700", bg: "bg-amber-500/10", iconColor: "text-amber-400", href: "/dashboard/achievements", glow: "orange" as GlowColor },
    { id: "quests", icon: Target, label: "Daily Quests", description: "AI-generated daily health goals", color: "from-violet-600 to-purple-700", bg: "bg-violet-500/10", iconColor: "text-violet-400", href: "/dashboard/quests", glow: "purple" as GlowColor },
    { id: "mood", icon: Brain, label: "Mood Journal", description: "Track emotions & pattern analysis", color: "from-purple-600 to-pink-700", bg: "bg-purple-500/10", iconColor: "text-purple-400", href: "/dashboard/mood", glow: "purple" as GlowColor },
    { id: "nearby", icon: Navigation, label: "Nearby Care", description: "Locate medical facilities instantly", color: "from-teal-600 to-cyan-700", bg: "bg-teal-500/10", iconColor: "text-teal-400", href: "/dashboard/nearby", glow: "green" as GlowColor },
    { id: "telemedicine", icon: Stethoscope, label: "Telemedicine", description: "Digital sub-specialty care", color: "from-teal-600 to-teal-700", bg: "bg-teal-500/10", iconColor: "text-teal-400", href: "/dashboard/telemedicine", glow: "green" as GlowColor },
    { id: "vision", icon: FlaskConical, label: "Vision Decoder", description: "AI analysis of medical imaging", color: "from-purple-600 to-indigo-700", bg: "bg-purple-500/10", iconColor: "text-purple-400", href: "/dashboard/vision-decoder", glow: "purple" as GlowColor },
];


export function FeatureGrid() {
    return (
        <div>
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-black text-white text-xl mb-1">All Features</h2>
                    <p className="text-white/30 text-xs font-medium">Comprehensive health management tools</p>
                </div>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{FEATURES.length} tools</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {FEATURES.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.025, duration: 0.35 }}
                        >
                            <Link to={feature.href} className="block h-full group">
                                <GlowCard 
                                    glowColor={feature.glow} 
                                    customSize 
                                    className="h-full border-white/5 hover:border-white/20 transition-colors"
                                >
                                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
                                        {/* Icon */}
                                        <div className={`size-14 ${feature.bg} border ${feature.bg.replace('bg-', 'border-').replace('/10', '/20')} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
                                            <Icon className={`size-6 ${feature.iconColor}`} />
                                        </div>

                                        {/* Label */}
                                        <h3 className="font-bold text-white/90 group-hover:text-white text-sm leading-tight transition-colors mb-1">
                                            {feature.label}
                                        </h3>
                                        
                                        <p className="text-[10px] text-white/30 font-medium group-hover:text-white/50 transition-colors line-clamp-2 px-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </GlowCard>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
