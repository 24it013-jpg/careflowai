import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar,
    Pill,
    Brain,
    Heart,
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


const FEATURES = [
    { id: "appointments", icon: Calendar, label: "Appointments", color: "from-blue-600 to-blue-700", bg: "bg-blue-500/10", iconColor: "text-blue-400", href: "/dashboard/booking" },
    { id: "medications", icon: Pill, label: "Medications", color: "from-rose-600 to-rose-700", bg: "bg-rose-500/10", iconColor: "text-rose-400", href: "/dashboard/med-check" },
    { id: "mental-health", icon: Brain, label: "Mental Health", color: "from-purple-600 to-purple-700", bg: "bg-purple-500/10", iconColor: "text-purple-400", href: "/dashboard/mental-health" },
    { id: "vitals", icon: Heart, label: "Vital Signs", color: "from-red-600 to-red-700", bg: "bg-red-500/10", iconColor: "text-red-400", href: "/dashboard" },
    { id: "family", icon: Users, label: "Family Hub", color: "from-emerald-600 to-emerald-700", bg: "bg-emerald-500/10", iconColor: "text-emerald-400", href: "/dashboard/family" },
    { id: "records", icon: FileText, label: "Health Records", color: "from-slate-600 to-slate-700", bg: "bg-slate-500/10", iconColor: "text-slate-400", href: "/dashboard/vault" },
    { id: "reminders", icon: Bell, label: "Smart Reminders", color: "from-amber-600 to-amber-700", bg: "bg-amber-500/10", iconColor: "text-amber-400", href: "/dashboard/reminders" },
    { id: "analytics", icon: TrendingUp, label: "Analytics", color: "from-violet-600 to-violet-700", bg: "bg-violet-500/10", iconColor: "text-violet-400", href: "/dashboard/vision" },
    { id: "insurance", icon: Shield, label: "Insurance", color: "from-sky-600 to-sky-700", bg: "bg-sky-500/10", iconColor: "text-sky-400", href: "/dashboard" },
    { id: "nutrition", icon: Utensils, label: "Nutrition", color: "from-lime-600 to-lime-700", bg: "bg-lime-500/10", iconColor: "text-lime-400", href: "/dashboard/diet" },

    { id: "sleep", icon: Moon, label: "Sleep Tracker", color: "from-indigo-600 to-indigo-700", bg: "bg-indigo-500/10", iconColor: "text-indigo-400", href: "/dashboard/sleep" },
    { id: "telemedicine", icon: Stethoscope, label: "Telemedicine", color: "from-teal-600 to-teal-700", bg: "bg-teal-500/10", iconColor: "text-teal-400", href: "/dashboard/telemedicine" },
    { id: "chat", icon: MessageCircle, label: "Health Chat", color: "from-fuchsia-600 to-fuchsia-700", bg: "bg-fuchsia-500/10", iconColor: "text-fuchsia-400", href: "/dashboard/symptom-checker" },
    { id: "video", icon: Video, label: "Video Consult", color: "from-pink-600 to-pink-700", bg: "bg-pink-500/10", iconColor: "text-pink-400", href: "/dashboard/telemedicine" },
    { id: "achievements", icon: Trophy, label: "Achievements", color: "from-amber-600 to-orange-700", bg: "bg-amber-500/10", iconColor: "text-amber-400", href: "/dashboard/achievements" },
    { id: "leaderboard", icon: Crown, label: "Leaderboard", color: "from-yellow-600 to-amber-700", bg: "bg-yellow-500/10", iconColor: "text-yellow-400", href: "/dashboard/leaderboard" },
    { id: "quests", icon: Target, label: "Daily Quests", color: "from-violet-600 to-purple-700", bg: "bg-violet-500/10", iconColor: "text-violet-400", href: "/dashboard/quests" },
    { id: "avatar", icon: Star, label: "Health Avatar", color: "from-emerald-600 to-teal-700", bg: "bg-emerald-500/10", iconColor: "text-emerald-400", href: "/dashboard/avatar" },
    { id: "wearable", icon: Activity, label: "Wearable", color: "from-rose-600 to-pink-700", bg: "bg-rose-500/10", iconColor: "text-rose-400", href: "/dashboard/wearable" },
    { id: "mood", icon: Brain, label: "Mood Journal", color: "from-purple-600 to-pink-700", bg: "bg-purple-500/10", iconColor: "text-purple-400", href: "/dashboard/mood" },
    { id: "labs", icon: FlaskConical, label: "Lab Results", color: "from-cyan-600 to-teal-700", bg: "bg-cyan-500/10", iconColor: "text-cyan-400", href: "/dashboard/labs" },
    { id: "bmi", icon: Activity, label: "BMI Machine", color: "from-blue-600 to-emerald-700", bg: "bg-blue-500/10", iconColor: "text-blue-400", href: "/dashboard/bmi" },
    { id: "nearby", icon: Navigation, label: "Nearby Care", color: "from-teal-600 to-cyan-700", bg: "bg-teal-500/10", iconColor: "text-teal-400", href: "/dashboard/nearby" },
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {FEATURES.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.025, duration: 0.35 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link
                                to={feature.href}
                                className="group relative block premium-glass-panel rounded-2xl p-4 overflow-hidden h-full"
                            >
                                {/* Shimmer overlay on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                                </div>

                                {/* Icon */}
                                <div className={`size-11 ${feature.bg} border ${feature.bg.replace('bg-', 'border-').replace('/10', '/20')} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <Icon className={`size-5 ${feature.iconColor}`} />
                                </div>

                                {/* Label */}
                                <h3 className="font-bold text-white/80 group-hover:text-white text-xs leading-tight transition-colors">
                                    {feature.label}
                                </h3>

                                {/* Bottom gradient line */}
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

