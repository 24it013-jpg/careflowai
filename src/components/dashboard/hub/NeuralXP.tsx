import { motion } from "framer-motion";
import { Trophy, Star, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthData } from "@/hooks/use-health-data";
import { useMemo } from "react";
import { differenceInDays, isSameDay } from "date-fns";

interface XPStat {
    label: string;
    value: string;
    icon: any;
    color: string;
}

export function NeuralXP() {
    const { vitalHistory, medications } = useHealthData();

    // Calculate Game Stats
    const stats = useMemo(() => {
        // 1. XP Calculation
        // - 50 XP per vital reading
        // - 100 XP per active medication managed
        const xpFromVitals = vitalHistory.length * 50;
        const xpFromMeds = medications.length * 100;
        const currentXP = xpFromVitals + xpFromMeds;

        // 2. Level Calculation
        // - Level 1: 0-1000 XP
        // - Level 2: 1001-2000 XP, etc.
        const level = Math.floor(currentXP / 1000) + 1;
        const nextLevelXP = level * 1000;
        const progress = Math.min(100, Math.max(0, ((currentXP % 1000) / 1000) * 100));

        // 3. Streak Calculation
        // Sort history by date descending
        const sortedHistory = [...vitalHistory].sort((a, b) => b.timestamp - a.timestamp);
        let streak = 0;
        let today = new Date();

        // Check if there's a reading today or yesterday to keep streak alive
        const hasReadingToday = sortedHistory.length > 0 && isSameDay(new Date(sortedHistory[0].timestamp), today);
        const hasReadingYesterday = sortedHistory.length > 0 && isSameDay(new Date(sortedHistory[0].timestamp), new Date(Date.now() - 86400000));

        if (hasReadingToday || hasReadingYesterday) {
            streak = 1;
            // Naive streak check for previous days (simplified for this demo)
            // In a real app, we'd check consecutive days more robustly
            for (let i = 0; i < sortedHistory.length - 1; i++) {
                const current = new Date(sortedHistory[i].timestamp);
                const next = new Date(sortedHistory[i + 1].timestamp);
                const diff = differenceInDays(current, next);
                if (diff === 1) {
                    streak++;
                } else if (diff > 1) {
                    break;
                }
            }
        }

        return {
            level,
            currentXP,
            nextLevelXP,
            progress,
            streak,
            syncPoints: Math.floor(currentXP * 0.1) // 10% of XP as "Currency"
        };
    }, [vitalHistory, medications]);

    const displayStats: XPStat[] = [
        { label: "Daily Streak", value: `${stats.streak} Days`, icon: Zap, color: "text-amber-400" },
        { label: "Sync Points", value: stats.syncPoints.toLocaleString(), icon: Star, color: "text-blue-400" },
        { label: "Resilience Level", value: stats.level >= 5 ? "Platinum" : stats.level >= 3 ? "Gold" : "Silver", icon: Trophy, color: "text-purple-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden group"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 size-32 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-colors" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Level Hexagon */}
                <div className="relative size-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl rotate-45 opacity-20 animate-pulse" />
                    <div className="relative z-10 text-center">
                        <span className="block text-[10px] uppercase font-bold text-amber-500/60 tracking-widest">Level</span>
                        <span className="text-4xl font-black text-white">{stats.level}</span>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">Neural Evolution Progress</h3>
                            <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase">
                                Season 1: Genesis
                            </div>
                        </div>
                        <span className="text-xs font-mono text-white/40">{stats.currentXP.toLocaleString()} / {stats.nextLevelXP.toLocaleString()} XP</span>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-[length:200%_100%] animate-shimmer rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-sm overflow-hidden" />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {displayStats.map((stat) => (
                            <div key={stat.label} className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                    <stat.icon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-sm font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2 group/btn">
                    Details
                    <Target className="size-4 text-white/40 group-hover/btn:text-amber-400 transition-colors" />
                </button>
            </div>
        </motion.div>
    );
}
