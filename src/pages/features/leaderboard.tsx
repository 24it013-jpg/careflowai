import { motion } from "framer-motion";
import { Crown, Star, Flame, Users, ChevronUp, ChevronDown, Minus, Medal, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    score: number;
    streak: number;
    change: "up" | "down" | "same";
    isUser?: boolean;
    badge?: string;
    level: number;
}

const LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah K.", avatar: "SK", score: 9840, streak: 42, change: "same", badge: "👑", level: 45 },
    { rank: 2, name: "Marcus T.", avatar: "MT", score: 9620, streak: 38, change: "up", level: 42 },
    { rank: 3, name: "Priya M.", avatar: "PM", score: 9410, streak: 31, change: "up", level: 38 },
    { rank: 4, name: "Alex J.", avatar: "AJ", score: 8850, streak: 14, change: "up", isUser: true, level: 32 },
    { rank: 5, name: "David L.", avatar: "DL", score: 8520, streak: 22, change: "down", level: 30 },
    { rank: 6, name: "Emma W.", avatar: "EW", score: 8310, streak: 19, change: "same", level: 28 },
    { rank: 7, name: "James R.", avatar: "JR", score: 8140, streak: 11, change: "down", level: 25 },
    { rank: 8, name: "Aisha B.", avatar: "AB", score: 7920, streak: 8, change: "up", level: 24 },
    { rank: 9, name: "Carlos V.", avatar: "CV", score: 7750, streak: 5, change: "down", level: 22 },
    { rank: 10, name: "Nina P.", avatar: "NP", score: 7420, streak: 3, change: "same", level: 21 },
];

export default function Leaderboard() {
    const userEntry = LEADERBOARD.find(e => e.isUser)!;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            {/* Background architecture */}
            <div className="fixed inset-0 pointer-events-none opacity-50">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="size-16 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-indigo-500/30 border border-white/20 rotate-3">
                                <Crown className="size-8 text-white -rotate-3" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter">Elite Apex</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Global Health synchronization rankings</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6 bg-white/[0.03] border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="size-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Active Hive</p>
                            <p className="text-sm font-black text-indigo-400">2,847 Participants</p>
                        </div>
                    </motion.div>
                </header>

                {/* Podium Stage */}
                <div className="grid grid-cols-3 gap-8 mb-20 items-end">
                    {/* Rank 2 */}
                    <div className="flex flex-col items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="flex flex-col items-center gap-4 mb-4"
                        >
                            <div className="size-20 rounded-[2rem] bg-slate-700/50 border-4 border-slate-400/30 flex items-center justify-center text-2xl font-black text-slate-300 shadow-2xl">
                                {LEADERBOARD[1].avatar}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-white">{LEADERBOARD[1].name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LVL {LEADERBOARD[1].level}</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ height: 0 }} animate={{ height: 160 }} transition={{ duration: 1, ease: "circOut", delay: 0.4 }}
                            className="w-full bg-gradient-to-t from-slate-400/20 to-slate-400/5 rounded-t-[3rem] border-x border-t border-slate-400/20 flex flex-col items-center justify-start pt-8 shadow-[0_-20px_40px_rgba(148,163,184,0.1)]"
                        >
                            <span className="text-6xl font-black text-slate-400/20">2</span>
                            <Medal className="size-8 text-slate-400 mt-2" />
                        </motion.div>
                    </div>

                    {/* Rank 1 */}
                    <div className="flex flex-col items-center scale-110">
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="flex flex-col items-center gap-4 mb-6 relative"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                    <Crown className="size-12 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                                </motion.div>
                            </div>
                            <div className="size-28 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-orange-600 border-4 border-amber-300/30 flex items-center justify-center text-4xl font-black text-white shadow-[0_0_50px_rgba(251,191,36,0.2)]">
                                {LEADERBOARD[0].avatar}
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-black text-white">{LEADERBOARD[0].name}</p>
                                <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">LVL {LEADERBOARD[0].level}</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ height: 0 }} animate={{ height: 240 }} transition={{ duration: 1, ease: "circOut", delay: 0.3 }}
                            className="w-full bg-gradient-to-t from-amber-500/20 to-amber-500/5 rounded-t-[3.5rem] border-x border-t border-amber-500/30 flex flex-col items-center justify-start pt-10 shadow-[0_-30px_60px_rgba(251,191,36,0.15)]"
                        >
                            <span className="text-8xl font-black text-amber-500/20 leading-none">1</span>
                            <Trophy className="size-10 text-amber-500 mt-4" />
                        </motion.div>
                    </div>

                    {/* Rank 3 */}
                    <div className="flex flex-col items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="flex flex-col items-center gap-4 mb-4"
                        >
                            <div className="size-20 rounded-[2rem] bg-orange-900/40 border-4 border-orange-500/30 flex items-center justify-center text-2xl font-black text-orange-400 shadow-2xl">
                                {LEADERBOARD[2].avatar}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-white">{LEADERBOARD[2].name}</p>
                                <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest">LVL {LEADERBOARD[2].level}</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ height: 0 }} animate={{ height: 120 }} transition={{ duration: 1, ease: "circOut", delay: 0.5 }}
                            className="w-full bg-gradient-to-t from-orange-500/20 to-orange-500/5 rounded-t-[2.5rem] border-x border-t border-orange-500/20 flex flex-col items-center justify-start pt-6 shadow-[0_-20px_40px_rgba(249,115,22,0.1)]"
                        >
                            <span className="text-5xl font-black text-orange-500/20">3</span>
                            <Medal className="size-8 text-orange-500 mt-1" />
                        </motion.div>
                    </div>
                </div>

                {/* User Row (Pinned-style banner) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                    className="mb-12 p-8 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-600/20 flex flex-col md:flex-row items-center gap-10 border border-white/20 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="size-16 rounded-3xl bg-white flex items-center justify-center text-3xl font-black text-indigo-600 shadow-xl">
                            {userEntry.rank}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Your Current Status</p>
                            <h3 className="text-2xl font-black text-white tracking-tight">Climbing the Ranks, {userEntry.name.split(' ')[0]}</h3>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex gap-10 relative z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Hive Points</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white">{userEntry.score}</span>
                                <TrendingUp className="size-4 text-emerald-300" />
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/20 hidden md:block" />
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Active Streak</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white">{userEntry.streak}</span>
                                <Flame className="size-4 text-orange-300 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/20 hidden md:block" />
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">To Next Rank</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white">560</span>
                                <span className="text-[10px] font-black text-white/40 uppercase">XP</span>
                            </div>
                        </div>
                    </div>

                    <Button className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] relative z-10 shrink-0">
                        Accelerate Progress
                    </Button>
                </motion.div>

                {/* Main Leaderboard Table */}
                <div className="space-y-4">
                    <div className="px-10 flex items-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                        <span className="w-12">Pos</span>
                        <span className="flex-1">Contributor</span>
                        <span className="w-24 text-center">Change</span>
                        <span className="w-32 text-right">Hive Points</span>
                    </div>
                    {LEADERBOARD.map((entry, i) => (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className={cn(
                                "flex items-center gap-6 p-6 md:p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group",
                                entry.isUser
                                    ? "bg-indigo-500/10 border-indigo-500/30 shadow-xl"
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                            )}
                        >
                            <div className="w-12 text-2xl font-black text-white/10 group-hover:text-white/40 transition-colors">
                                {entry.rank.toString().padStart(2, '0')}
                            </div>

                            <div className="flex items-center gap-6 flex-1">
                                <div className={cn(
                                    "size-14 rounded-2xl flex items-center justify-center text-lg font-black relative overflow-hidden",
                                    entry.rank === 1 ? "bg-amber-400 text-amber-900" :
                                    entry.rank === 2 ? "bg-slate-400 text-slate-900" :
                                    entry.rank === 3 ? "bg-orange-400 text-orange-900" :
                                    "bg-white/10 text-white/60"
                                )}>
                                    {entry.avatar}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                        {entry.name}
                                        {entry.isUser && <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-[8px] uppercase tracking-widest text-white">Identity Verified</span>}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-white/20 transition-all" style={{ width: `${(entry.level / 50) * 100}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">LVL {entry.level}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-24 flex justify-center">
                                {entry.change === "up" ? (
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                                        <ChevronUp className="size-3 text-emerald-400" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase">Rise</span>
                                    </div>
                                ) : entry.change === "down" ? (
                                    <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-1">
                                        <ChevronDown className="size-3 text-rose-400" />
                                        <span className="text-[9px] font-black text-rose-400 uppercase">Fall</span>
                                    </div>
                                ) : (
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-1">
                                        <Minus className="size-3 text-white/20" />
                                        <span className="text-[9px] font-black text-white/20 uppercase">Hold</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-32 text-right">
                                <p className="text-2xl font-black text-white tracking-tighter">{entry.score.toLocaleString()}</p>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Points</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 pb-12 flex justify-center">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Season 04 End · 02d 14h 22m Remaining</p>
                </div>
            </div>
        </div>
    );
}
