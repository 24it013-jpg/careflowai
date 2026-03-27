import { motion } from "framer-motion";
import { Trophy, Star, Zap, Shield, Moon, Heart, Dumbbell, Droplets, Brain, Target, Flame, Award, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
    unlocked: boolean;
    rarity: "common" | "rare" | "epic" | "legendary";
    xp: number;
    unlockedAt?: string;
    progress?: number;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: "first-steps", title: "First Steps", description: "Log your first 1,000 steps", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", unlocked: true, rarity: "common", xp: 50, unlockedAt: "2 days ago" },
    { id: "sleep-champion", title: "Sleep Champion", description: "Achieve 90+ sleep score 3 nights in a row", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", unlocked: true, rarity: "rare", xp: 200, unlockedAt: "Yesterday" },
    { id: "heart-guardian", title: "Heart Guardian", description: "Maintain optimal heart rate for 7 days", icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", unlocked: true, rarity: "epic", xp: 500, unlockedAt: "Today" },
    { id: "hydration-hero", title: "Hydration Hero", description: "Hit your water goal 5 days in a row", icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", unlocked: true, rarity: "common", xp: 75, unlockedAt: "3 days ago" },
    { id: "zen-master", title: "Zen Master", description: "Complete 10 breathing sessions", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", unlocked: true, rarity: "rare", xp: 300, unlockedAt: "1 week ago" },
    { id: "iron-will", title: "Iron Will", description: "Maintain a 30-day health streak", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", unlocked: false, rarity: "legendary", xp: 1000, progress: 65 },
    { id: "peak-performer", title: "Peak Performer", description: "Reach a health score of 95+", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", unlocked: false, rarity: "legendary", xp: 1500, progress: 92 },
    { id: "fitness-beast", title: "Fitness Beast", description: "Complete 50 workout sessions", icon: Dumbbell, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", unlocked: false, rarity: "epic", xp: 750, progress: 40 },
    { id: "streak-lord", title: "Streak Lord", description: "Maintain a 14-day medication streak", icon: Flame, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", unlocked: false, rarity: "rare", xp: 400, progress: 80 },
    { id: "community-hero", title: "Community Hero", description: "Join 5 Hive challenges", icon: Target, color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", unlocked: false, rarity: "common", xp: 150, progress: 20 },
    { id: "oracle-seeker", title: "Oracle Seeker", description: "View your health forecast 10 times", icon: Star, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", unlocked: false, rarity: "common", xp: 100, progress: 50 },
    { id: "legend", title: "The Legend", description: "Unlock all other achievements", icon: Award, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", unlocked: false, rarity: "legendary", xp: 5000, progress: 25 },
];

const RARITY_CONFIG = {
    common: { label: "Common", color: "text-slate-400", border: "border-slate-500/30", aura: "" },
    rare: { label: "Rare", color: "text-blue-400", border: "border-blue-500/30", aura: "shadow-blue-500/5 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" },
    epic: { label: "Epic", color: "text-purple-400", border: "border-purple-500/30", aura: "shadow-purple-500/10 shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]" },
    legendary: { label: "Legendary", color: "text-amber-400", border: "border-amber-500/30", aura: "shadow-amber-500/20 shadow-[inset_0_0_40px_rgba(245,158,11,0.15)] bg-gradient-to-br from-amber-500/5 to-transparent" },
};

export default function AchievementsPage() {
    const unlocked = ACHIEVEMENTS.filter(a => a.unlocked);
    const totalXP = unlocked.reduce((sum, a) => sum + a.xp, 0);
    const currentLevel = Math.floor(totalXP / 1000) + 1;
    const nextLevelXP = currentLevel * 1000;
    const progressToNext = (totalXP % 1000) / 10;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-amber-500/30">
            {/* Background Architecture */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-5 mb-4">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 border border-white/20 group">
                                <Trophy className="size-7 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter">Achievement Arena</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Personal Milestones & Global Rank</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-end gap-3"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Ranking</p>
                                <p className="text-xl font-black text-white">#1,248 Top 5%</p>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="size-12 rounded-full border-2 border-amber-500/50 flex items-center justify-center font-black text-lg text-amber-400 bg-amber-500/5">
                                {currentLevel}
                            </div>
                        </div>
                        <div className="w-56 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                            />
                        </div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{totalXP} / {nextLevelXP} XP to Level {currentLevel + 1}</p>
                    </motion.div>
                </header>

                {/* Sub-header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: "Badges", value: `${unlocked.length}/${ACHIEVEMENTS.length}`, icon: Award, color: "text-emerald-400" },
                        { label: "Total XP", value: totalXP.toLocaleString(), icon: Zap, color: "text-amber-400" },
                        { label: "Health Streak", value: "12 Days", icon: Flame, color: "text-rose-400" },
                        { label: "Challenges", value: "8 Done", icon: Target, color: "text-indigo-400" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-glass-panel p-6 rounded-[2rem] flex items-center gap-4 group hover:bg-white/[0.04] transition-all cursor-default"
                        >
                            <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center", stat.color)}>
                                <stat.icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Achievement Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ACHIEVEMENTS.map((ach, i) => {
                        const rarCfg = RARITY_CONFIG[ach.rarity];
                        return (
                            <motion.div
                                key={ach.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className={cn(
                                    "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group flex flex-col",
                                    ach.unlocked
                                        ? cn("bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-2", rarCfg.border, rarCfg.aura)
                                        : "bg-white/[0.01] border-white/5 opacity-40 grayscale-[0.8]"
                                )}
                            >
                                {/* Holographic Sheen Effect */}
                                {ach.unlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                                )}

                                <div className="flex justify-between items-start mb-8">
                                    <div className={cn(
                                        "size-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-110",
                                        ach.unlocked ? cn(ach.bg, "border border-white/10") : "bg-white/5 border border-white/5"
                                    )}>
                                        {ach.unlocked ? (
                                            <ach.icon className={cn("size-8", ach.color)} />
                                        ) : (
                                            <Lock className="size-6 text-white/10" />
                                        )}
                                    </div>
                                    <div className={cn("px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", rarCfg.color, rarCfg.border)}>
                                        {rarCfg.label}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className={cn("text-xl font-black mb-2 tracking-tight transition-colors", ach.unlocked ? "text-white" : "text-white/20")}>
                                        {ach.title}
                                    </h3>
                                    <p className={cn("text-xs leading-relaxed transition-colors font-medium", ach.unlocked ? "text-white/40 group-hover:text-white/60" : "text-white/10")}>
                                        {ach.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Rewards</p>
                                        <span className={cn("text-sm font-black", ach.unlocked ? "text-amber-400" : "text-white/10")}>+{ach.xp} XP</span>
                                    </div>
                                    <div className="text-right">
                                        {ach.unlocked ? (
                                            <>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Earned</p>
                                                <span className="text-[10px] font-bold text-emerald-500/60 uppercase">{ach.unlockedAt}</span>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Progress</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-white/20" style={{ width: `${ach.progress}%` }} />
                                                    </div>
                                                    <span className="text-[9px] font-black text-white/20">{ach.progress || 0}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Unlocked Glow */}
                                {ach.unlocked && (
                                    <div className={cn("absolute -bottom-10 -right-10 size-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40", ach.color.replace('text-', 'bg-'))} />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="mt-20 flex justify-center pb-12"
                >
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-amber-400 hover:bg-transparent gap-3 group">
                        Enter Competition Hive <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
