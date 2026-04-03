import { motion, AnimatePresence } from "framer-motion";
import { Target, CheckCircle2, Clock, Zap, RefreshCw, ChevronRight, Sparkles, Brain, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Quest {
    id: string;
    title: string;
    description: string;
    xp: number;
    progress: number;
    goal: number;
    unit: string;
    difficulty: "easy" | "medium" | "hard";
    completed: boolean;
    timeLeft: string;
    emoji: string;
    category: "Vitals" | "Fitness" | "Mindfulness" | "Nutrition";
}

const DAILY_QUESTS: Quest[] = [
    { id: "q1", title: "Morning Warrior", description: "Log your vitals before 9 AM", xp: 50, progress: 1, goal: 1, unit: "check-in", difficulty: "easy", completed: true, timeLeft: "Done!", emoji: "🌅", category: "Vitals" },
    { id: "q2", title: "Step Surge", description: "Walk 8,000 steps today", xp: 150, progress: 6240, goal: 8000, unit: "steps", difficulty: "medium", completed: false, timeLeft: "8h left", emoji: "👟", category: "Fitness" },
    { id: "q3", title: "Hydration Protocol", description: "Drink 8 glasses of water", xp: 75, progress: 5, goal: 8, unit: "glasses", difficulty: "easy", completed: false, timeLeft: "8h left", emoji: "💧", category: "Nutrition" },
    { id: "q4", title: "Zen Moment", description: "Complete a 5-minute breathing session", xp: 100, progress: 0, goal: 1, unit: "session", difficulty: "easy", completed: false, timeLeft: "8h left", emoji: "🧘", category: "Mindfulness" },
    { id: "q5", title: "Oracle Consult", description: "Review your 7-day health forecast", xp: 50, progress: 1, goal: 1, unit: "view", difficulty: "easy", completed: true, timeLeft: "Done!", emoji: "🔮", category: "Vitals" },
    { id: "q6", title: "Sleep Architect", description: "Get to bed before 11 PM tonight", xp: 200, progress: 0, goal: 1, unit: "night", difficulty: "hard", completed: false, timeLeft: "Tonight", emoji: "🌙", category: "Mindfulness" },
];

const DIFFICULTY_CONFIG = {
    easy: { label: "Standard", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    medium: { label: "Ventured", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
    hard: { label: "Legendary", color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" },
};

export default function DailyQuests() {
    const quests = DAILY_QUESTS;
    const completedCount = quests.filter(q => q.completed).length;
    const totalXP = quests.filter(q => q.completed).reduce((s, q) => s + q.xp, 0);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-violet-500/30">
            {/* Background Architecture */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-5 mb-3">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/20 border border-white/10 group">
                                <Target className="size-8 text-white group-hover:rotate-12 transition-transform" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Quest Terminal</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Generated Health Objectives</p>
                            </div>
                        </div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Complete daily health quests to maintain your wellness routine. Earn XP and track your progress toward long-term health goals through gamified activities.
                        </p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10">
                            <RefreshCw className="size-4" /> Resync Objectives
                        </button>
                    </motion.div>
                </header>

                {/* Progress Hub */}
                <div className="grid md:grid-cols-12 gap-6 mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-8 p-10 rounded-[3rem] premium-glass-panel border border-white/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-violet-500/20 transition-all" />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] mb-4">Current Progress</p>
                                <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Daily Synchronization: {Math.round((completedCount/quests.length)*100)}%</h2>
                                <div className="space-y-4">
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(completedCount/quests.length)*100}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                        <span>{completedCount} of {quests.length} Quests Terminated</span>
                                        <span className="text-violet-400">Target: 100% Alignment</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center md:text-right shrink-0">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">XP Accumulated</p>
                                <p className="text-6xl font-black text-white tracking-tighter">+{totalXP}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="md:col-span-4 p-8 rounded-[3rem] bg-indigo-600 flex flex-col justify-between group relative overflow-hidden border border-white/10 shadow-2xl shadow-indigo-600/20"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="relative z-10 text-white/70">
                            <Flame className="size-10 mb-4 animate-bounce" />
                            <h3 className="text-2xl font-black text-white leading-tight">14 DAY<br />STREAK</h3>
                        </div>
                        <Button className="w-full bg-white/10 hover:bg-white text-white hover:text-indigo-600 border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest h-14 transition-all relative z-10">
                            View Multiplier
                        </Button>
                    </motion.div>
                </div>

                {/* Quests Container */}
                <div className="grid lg:grid-cols-2 gap-6 pb-20">
                    <AnimatePresence>
                        {quests.map((quest, i) => {
                            const diffCfg = DIFFICULTY_CONFIG[quest.difficulty];
                            const pct = Math.min(100, (quest.progress / quest.goal) * 100);
                            return (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                        "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group flex flex-col",
                                        quest.completed 
                                            ? "bg-emerald-500/5 border-emerald-500/20" 
                                            : "premium-glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-1"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "size-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl transition-all",
                                                quest.completed ? "bg-emerald-500/10 border border-emerald-500/20 grayscale-0" : "bg-white/5 border border-white/5 group-hover:scale-110"
                                            )}>
                                                {quest.emoji}
                                            </div>
                                            <div>
                                                <h3 className={cn("text-xl font-black transition-colors tracking-tight", quest.completed ? "text-emerald-400" : "text-white")}>
                                                    {quest.title}
                                                </h3>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{quest.category}</p>
                                            </div>
                                        </div>
                                        <div className={cn("px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest", diffCfg.color, diffCfg.border, diffCfg.bg)}>
                                            {diffCfg.label}
                                        </div>
                                    </div>

                                    <p className={cn("text-sm transition-colors mb-8 font-medium leading-relaxed flex-1", quest.completed ? "text-emerald-400/60" : "text-white/40 group-hover:text-white/60")}>
                                        {quest.description}
                                    </p>

                                    <div className="space-y-6">
                                        {!quest.completed && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-white/20">Resolution: {quest.progress.toLocaleString()}/{quest.goal.toLocaleString()}</span>
                                                    <span className="text-white/40">{Math.round(pct)}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Zap className={cn("size-4", quest.completed ? "text-emerald-400" : "text-violet-400")} />
                                                <span className={cn("text-sm font-black tracking-tighter", quest.completed ? "text-emerald-400" : "text-white")}>
                                                    +{quest.xp} <span className="text-[10px] text-white/20 uppercase ml-1">XP Points</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-white/20">
                                                    <Clock className="size-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{quest.timeLeft}</span>
                                                </div>
                                                {quest.completed ? (
                                                    <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                                                        <CheckCircle2 className="size-5" />
                                                    </div>
                                                ) : (
                                                    <ChevronRight className="size-5 text-white/10 group-hover:translate-x-1 group-hover:text-white transition-all" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Success Glow */}
                                    {quest.completed && (
                                        <div className="absolute -bottom-20 -right-20 size-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* AI Suggestions Footer */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="p-10 rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
                >
                    <div className="size-16 rounded-3xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
                        <Brain className="size-8" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-black text-white tracking-tight mb-2">Neural Pattern Detected</h4>
                        <p className="text-xs text-white/30 font-medium">Oracle suggests focusing on "Zen Moment" before the 2 PM cognitive load peak.</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl h-14 px-8 border-white/10 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2">
                        Adjust Weights <Sparkles className="size-4" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
