import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Award, Target, Zap } from 'lucide-react';
import { calculateHealthScore, getHealthScoreColor, getHealthScoreLabel, type HealthMetrics } from '@/lib/gamification/health-score';
import { useEffect, useState } from 'react';

interface HealthScoreWidgetProps {
    metrics: HealthMetrics;
    previousScore?: number;
}

export function HealthScoreWidget({ metrics, previousScore }: HealthScoreWidgetProps) {
    const [score, setScore] = useState(calculateHealthScore(metrics, previousScore));

    useEffect(() => {
        const newScore = calculateHealthScore(metrics, previousScore);
        setScore(newScore);
    }, [metrics, previousScore]);

    const { overall, breakdown, trend, insights } = score;
    const scoreColor = getHealthScoreColor(overall);
    const scoreLabel = getHealthScoreLabel(overall);

    const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
    const trendColor = trend === 'improving' ? 'text-emerald-600' : trend === 'declining' ? 'text-red-600' : 'text-slate-600';

    return (
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <Target className="size-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Health Score</h3>
                        <p className="text-sm text-slate-400">Your overall health rating</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="size-4" />
                    <span className="text-sm font-medium capitalize">{trend}</span>
                </div>
            </div>

            {/* Main Score Circle */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    {/* Background Circle */}
                    <svg className="size-48 -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            fill="none"
                            stroke={overall >= 80 ? '#059669' : overall >= 60 ? '#2563eb' : overall >= 40 ? '#ea580c' : '#dc2626'}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 88}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - overall / 100) }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </svg>

                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                            className={`text-5xl font-bold ${scoreColor}`}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {overall}
                        </motion.div>
                        <div className="text-sm text-slate-400 font-medium mt-1">{scoreLabel}</div>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 mb-6">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Award className="size-4 text-blue-600" />
                    Score Breakdown
                </h4>

                {Object.entries(breakdown).map(([category, value]) => (
                    <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 capitalize">{category}</span>
                            <span className={`font-semibold ${getHealthScoreColor(value)}`}>{Math.round(value)}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-blue-500' : value >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Zap className="size-4 text-orange-600" />
                        Personalized Insights
                    </h4>
                    <div className="space-y-2">
                        {insights.map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="text-sm text-slate-300 bg-white/5 rounded-lg p-3 border border-white/10"
                            >
                                {insight}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
