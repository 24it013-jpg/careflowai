import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Sparkles, Flame } from 'lucide-react';
import {
    type Achievement,
    getRarityColor,
    getRarityBorderColor,
    getAchievementProgress,
    getStreakEmoji,
    type Streak,
    calculateTotalPoints
} from '@/lib/gamification/achievements';

interface AchievementsPanelProps {
    achievements: Achievement[];
    streaks: Streak[];
}

export function AchievementsPanel({ achievements, streaks }: AchievementsPanelProps) {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);
    const totalPoints = calculateTotalPoints(achievements);

    // Get highest streak
    const highestStreak = streaks.reduce((max, streak) =>
        streak.current > max.current ? streak : max
        , streaks[0]);

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl">
                        <Trophy className="size-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Achievements</h3>
                        <p className="text-sm text-slate-400">{unlockedAchievements.length} of {achievements.length} unlocked</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">{totalPoints}</div>
                    <div className="text-xs text-slate-400">Total Points</div>
                </div>
            </div>

            {/* Current Streak */}
            {highestStreak.current > 0 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 mb-6 border border-orange-500/30"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">{getStreakEmoji(highestStreak.current)}</div>
                            <div>
                                <div className="font-semibold text-slate-900 capitalize">{highestStreak.type} Streak</div>
                                <div className="text-sm text-slate-700">Keep it going!</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-orange-500">{highestStreak.current}</div>
                            <div className="text-xs text-slate-400">days</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* All Streaks */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {streaks.map((streak, index) => (
                    <motion.div
                        key={streak.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Flame className={`size-4 ${streak.current > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
                            <span className="text-sm font-medium text-white capitalize">{streak.type}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{streak.current}</span>
                            <span className="text-xs text-slate-400">/ {streak.longest} best</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="size-4 text-orange-600" />
                        Unlocked ({unlockedAchievements.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        <AnimatePresence>
                            {unlockedAchievements.map((achievement, index) => {
                                const Icon = achievement.icon;
                                return (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-3 rounded-lg border-2 ${getRarityBorderColor(achievement.rarity)} ${getRarityColor(achievement.rarity)} relative overflow-hidden`}
                                    >
                                        {/* Shine effect for legendary */}
                                        {achievement.rarity === 'legendary' && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            />
                                        )}

                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className="p-2 bg-white/10 rounded-lg">
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h5 className="font-semibold text-sm truncate">{achievement.title}</h5>
                                                    <span className="text-xs font-bold whitespace-nowrap">+{achievement.points}</span>
                                                </div>
                                                <p className="text-xs opacity-80 mb-1">{achievement.description}</p>
                                                {achievement.unlockedAt && (
                                                    <p className="text-xs opacity-60">
                                                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Locked Achievements (In Progress) */}
            {lockedAchievements.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Lock className="size-4 text-slate-400" />
                        In Progress ({lockedAchievements.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {lockedAchievements.slice(0, 5).map((achievement, index) => {
                            const Icon = achievement.icon;
                            const progress = getAchievementProgress(achievement);

                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-lg border border-white/10 bg-white/5"
                                >
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="p-2 bg-white/10 rounded-lg opacity-50">
                                            <Icon className="size-5 text-slate-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h5 className="font-semibold text-sm text-slate-300 truncate">{achievement.title}</h5>
                                                <span className="text-xs font-bold text-slate-400">+{achievement.points}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-1">{achievement.description}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-blue-500"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                                    {achievement.currentProgress}/{achievement.requirement}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
