/**
 * Achievement and Badge System
 * Tracks user accomplishments and milestones
 */

import { Award, Heart, Pill, Footprints, Utensils, Brain, Calendar, Trophy, Zap, Target } from 'lucide-react';

export type AchievementCategory = 'medication' | 'vitals' | 'activity' | 'nutrition' | 'mental' | 'general';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    category: AchievementCategory;
    icon: any; // Lucide icon component
    requirement: number;
    currentProgress: number;
    unlocked: boolean;
    unlockedAt?: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
}

export interface Streak {
    type: 'medication' | 'exercise' | 'logging' | 'vitals';
    current: number;
    longest: number;
    lastUpdated: Date;
}

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS: Omit<Achievement, 'currentProgress' | 'unlocked' | 'unlockedAt'>[] = [
    // Medication Achievements
    {
        id: 'med_week',
        title: 'Week Warrior',
        description: 'Take all medications on time for 7 days',
        category: 'medication',
        icon: Pill,
        requirement: 7,
        rarity: 'common',
        points: 50,
    },
    {
        id: 'med_month',
        title: 'Monthly Master',
        description: 'Perfect medication adherence for 30 days',
        category: 'medication',
        icon: Pill,
        requirement: 30,
        rarity: 'rare',
        points: 200,
    },
    {
        id: 'med_perfect',
        title: 'Perfect Patient',
        description: '100 days of perfect medication adherence',
        category: 'medication',
        icon: Trophy,
        requirement: 100,
        rarity: 'legendary',
        points: 1000,
    },

    // Activity Achievements
    {
        id: 'steps_10k',
        title: '10K Steps',
        description: 'Walk 10,000 steps in a single day',
        category: 'activity',
        icon: Footprints,
        requirement: 10000,
        rarity: 'common',
        points: 30,
    },
    {
        id: 'steps_week',
        title: 'Step Champion',
        description: 'Hit 10,000 steps for 7 consecutive days',
        category: 'activity',
        icon: Footprints,
        requirement: 7,
        rarity: 'rare',
        points: 150,
    },
    {
        id: 'exercise_streak',
        title: 'Fitness Fanatic',
        description: 'Exercise for 30 consecutive days',
        category: 'activity',
        icon: Zap,
        requirement: 30,
        rarity: 'epic',
        points: 300,
    },

    // Vitals Achievements
    {
        id: 'vitals_week',
        title: 'Vital Signs Vigilant',
        description: 'Log vitals daily for 7 days',
        category: 'vitals',
        icon: Heart,
        requirement: 7,
        rarity: 'common',
        points: 40,
    },
    {
        id: 'vitals_healthy',
        title: 'Healthy Range Hero',
        description: 'Maintain healthy vitals for 30 days',
        category: 'vitals',
        icon: Heart,
        requirement: 30,
        rarity: 'rare',
        points: 180,
    },

    // Nutrition Achievements
    {
        id: 'nutrition_week',
        title: 'Meal Logger',
        description: 'Log all meals for 7 days',
        category: 'nutrition',
        icon: Utensils,
        requirement: 7,
        rarity: 'common',
        points: 35,
    },
    {
        id: 'hydration_week',
        title: 'Hydration Hero',
        description: 'Drink 2L water daily for 7 days',
        category: 'nutrition',
        icon: Utensils,
        requirement: 7,
        rarity: 'common',
        points: 40,
    },

    // Mental Health Achievements
    {
        id: 'mood_week',
        title: 'Mood Tracker',
        description: 'Log mood daily for 7 days',
        category: 'mental',
        icon: Brain,
        requirement: 7,
        rarity: 'common',
        points: 30,
    },
    {
        id: 'meditation_streak',
        title: 'Zen Master',
        description: 'Meditate for 30 consecutive days',
        category: 'mental',
        icon: Brain,
        requirement: 30,
        rarity: 'epic',
        points: 250,
    },

    // General Achievements
    {
        id: 'first_login',
        title: 'Welcome Aboard',
        description: 'Complete your first login',
        category: 'general',
        icon: Award,
        requirement: 1,
        rarity: 'common',
        points: 10,
    },
    {
        id: 'appointment_keeper',
        title: 'Appointment Keeper',
        description: 'Attend 5 scheduled appointments',
        category: 'general',
        icon: Calendar,
        requirement: 5,
        rarity: 'common',
        points: 50,
    },
    {
        id: 'health_score_80',
        title: 'Health Champion',
        description: 'Achieve health score of 80+',
        category: 'general',
        icon: Target,
        requirement: 80,
        rarity: 'rare',
        points: 100,
    },
    {
        id: 'health_score_90',
        title: 'Health Legend',
        description: 'Achieve health score of 90+',
        category: 'general',
        icon: Trophy,
        requirement: 90,
        rarity: 'legendary',
        points: 500,
    },
];

/**
 * Get rarity color
 */
export function getRarityColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
        case 'common':
            return 'text-slate-600 bg-slate-100';
        case 'rare':
            return 'text-blue-600 bg-blue-100';
        case 'epic':
            return 'text-purple-600 bg-purple-100';
        case 'legendary':
            return 'text-orange-600 bg-orange-100';
    }
}

/**
 * Get rarity border color
 */
export function getRarityBorderColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
        case 'common':
            return 'border-slate-300';
        case 'rare':
            return 'border-blue-400';
        case 'epic':
            return 'border-purple-400';
        case 'legendary':
            return 'border-orange-400';
    }
}

/**
 * Check if achievement is unlocked
 */
export function checkAchievementUnlock(
    achievementId: string,
    currentProgress: number
): boolean {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return false;
    return currentProgress >= achievement.requirement;
}

/**
 * Calculate total achievement points
 */
export function calculateTotalPoints(achievements: Achievement[]): number {
    return achievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + a.points, 0);
}

/**
 * Get achievement progress percentage
 */
export function getAchievementProgress(achievement: Achievement): number {
    return Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);
}

/**
 * Initialize user achievements
 */
export function initializeAchievements(): Achievement[] {
    return ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        unlocked: false,
    }));
}

/**
 * Update achievement progress
 */
export function updateAchievementProgress(
    achievements: Achievement[],
    achievementId: string,
    progress: number
): Achievement[] {
    return achievements.map(achievement => {
        if (achievement.id === achievementId) {
            const unlocked = progress >= achievement.requirement;
            return {
                ...achievement,
                currentProgress: progress,
                unlocked,
                unlockedAt: unlocked && !achievement.unlocked ? new Date() : achievement.unlockedAt,
            };
        }
        return achievement;
    });
}

/**
 * Get newly unlocked achievements
 */
export function getNewlyUnlocked(
    oldAchievements: Achievement[],
    newAchievements: Achievement[]
): Achievement[] {
    return newAchievements.filter((newAch, index) => {
        const oldAch = oldAchievements[index];
        return newAch.unlocked && !oldAch.unlocked;
    });
}

/**
 * Initialize streaks
 */
export function initializeStreaks(): Streak[] {
    return [
        { type: 'medication', current: 0, longest: 0, lastUpdated: new Date() },
        { type: 'exercise', current: 0, longest: 0, lastUpdated: new Date() },
        { type: 'logging', current: 0, longest: 0, lastUpdated: new Date() },
        { type: 'vitals', current: 0, longest: 0, lastUpdated: new Date() },
    ];
}

/**
 * Update streak
 */
export function updateStreak(
    streaks: Streak[],
    type: Streak['type'],
    completed: boolean
): Streak[] {
    return streaks.map(streak => {
        if (streak.type === type) {
            const now = new Date();
            const lastUpdate = new Date(streak.lastUpdated);
            const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

            // If more than 48 hours, reset streak
            if (hoursSinceUpdate > 48) {
                return {
                    ...streak,
                    current: completed ? 1 : 0,
                    longest: Math.max(streak.longest, streak.current),
                    lastUpdated: now,
                };
            }

            // If within 24-48 hours and completed, increment
            if (completed && hoursSinceUpdate >= 24) {
                const newCurrent = streak.current + 1;
                return {
                    ...streak,
                    current: newCurrent,
                    longest: Math.max(streak.longest, newCurrent),
                    lastUpdated: now,
                };
            }

            // If within 24 hours, just update timestamp
            return {
                ...streak,
                lastUpdated: now,
            };
        }
        return streak;
    });
}

/**
 * Get streak emoji
 */
export function getStreakEmoji(days: number): string {
    if (days >= 100) return '🔥🔥🔥';
    if (days >= 50) return '🔥🔥';
    if (days >= 7) return '🔥';
    if (days >= 3) return '⚡';
    return '✨';
}
