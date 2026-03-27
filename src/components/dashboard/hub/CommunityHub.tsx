import { motion } from "framer-motion";
import { Users, Target, Zap, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Challenge {
    id: string;
    title: string;
    description: string;
    participants: number;
    progress: number;
    timeLeft: string;
    icon: any;
    color: string;
}

const CHALLENGES: Challenge[] = [
    {
        id: "step-exodus",
        title: "The 10k Step Exodus",
        description: "Collective goal to reach 100M steps this weekend.",
        participants: 24500,
        progress: 68,
        timeLeft: "2d 4h",
        icon: Zap,
        color: "text-amber-400"
    },
    {
        id: "zen-wave",
        title: "The Mindfulness Wave",
        description: "Join 50k others for a synchronized breathing session.",
        participants: 41200,
        progress: 42,
        timeLeft: "12h 15m",
        icon: Sparkles,
        color: "text-purple-400"
    },
    {
        id: "sleep-shield",
        title: "Deep Sleep Shield",
        description: "Maximize collective recovery score tonight.",
        participants: 18200,
        progress: 15,
        timeLeft: "8h 0m",
        icon: ShieldCheck,
        color: "text-blue-400"
    }
];

export function CommunityHub() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="size-5 text-emerald-400" />
                        The Hive: Community Hub
                    </h2>
                    <p className="text-sm text-white/40">Collaborative Missions & Synchronization</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Heart className="size-3 text-emerald-400 fill-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        84% Collective Coherence
                    </span>
                </div>
            </div>

            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {CHALLENGES.map((challenge) => (
                    <motion.div
                        key={challenge.id}
                        whileHover={{ x: 4 }}
                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 group cursor-pointer transition-colors hover:bg-white/[0.05]"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl bg-white/5", challenge.color)}>
                                    <challenge.icon className="size-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{challenge.title}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed">{challenge.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Time Left</div>
                                <div className="text-xs font-mono text-white/60">{challenge.timeLeft}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-white/40">{challenge.participants.toLocaleString()} Participants</span>
                                <span className={cn(challenge.color)}>{challenge.progress}% Complete</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${challenge.progress}%` }}
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        challenge.color.replace('text-', 'bg-')
                                    )}
                                />
                            </div>
                        </div>

                        <button className="mt-4 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black hover:border-emerald-500">
                            Join Mission
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
                        <Target className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Create Private Challenge</p>
                        <p className="text-xs text-white/40">Sync with your custom Alpha Circle</p>
                    </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-white/20 group-hover:text-white transition-colors">
                    <Sparkles className="size-4" />
                </div>
            </div>
        </motion.div>
    );
}
