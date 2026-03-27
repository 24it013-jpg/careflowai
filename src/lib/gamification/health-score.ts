/**
 * Health Score Calculation Engine
 * Aggregates multiple health metrics into a comprehensive score (0-100)
 */

export interface HealthMetrics {
    vitals: {
        heartRate?: number;
        bloodPressure?: { systolic: number; diastolic: number };
        oxygenLevel?: number;
        temperature?: number;
        weight?: number;
    };
    medication: {
        adherenceRate: number; // 0-100
        missedDoses: number;
    };
    activity: {
        steps?: number;
        exerciseMinutes?: number;
        sleepHours?: number;
    };
    nutrition: {
        caloriesConsumed?: number;
        waterIntake?: number; // in ml
        mealsLogged: number;
    };
    mental: {
        moodScore?: number; // 1-10
        stressLevel?: number; // 1-10
    };
}

export interface HealthScore {
    overall: number;
    breakdown: {
        overall: number;
        vitals: number;
        medication: number;
        activity: number;
        nutrition: number;
        mental: number;
    };
    trend: 'improving' | 'stable' | 'declining';
    insights: string[];
}

/**
 * Calculate vitals score based on healthy ranges
 */
function calculateVitalsScore(vitals: HealthMetrics['vitals']): number {
    let score = 0;
    let count = 0;

    // Heart rate (60-100 bpm ideal)
    if (vitals.heartRate) {
        count++;
        if (vitals.heartRate >= 60 && vitals.heartRate <= 100) {
            score += 100;
        } else if (vitals.heartRate >= 50 && vitals.heartRate <= 110) {
            score += 75;
        } else if (vitals.heartRate >= 40 && vitals.heartRate <= 120) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Blood pressure (120/80 ideal)
    if (vitals.bloodPressure) {
        count++;
        const { systolic, diastolic } = vitals.bloodPressure;
        if (systolic <= 120 && diastolic <= 80) {
            score += 100;
        } else if (systolic <= 130 && diastolic <= 85) {
            score += 85;
        } else if (systolic <= 140 && diastolic <= 90) {
            score += 70;
        } else if (systolic <= 160 && diastolic <= 100) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Oxygen level (95-100% ideal)
    if (vitals.oxygenLevel) {
        count++;
        if (vitals.oxygenLevel >= 95) {
            score += 100;
        } else if (vitals.oxygenLevel >= 90) {
            score += 75;
        } else if (vitals.oxygenLevel >= 85) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Temperature (97-99°F ideal)
    if (vitals.temperature) {
        count++;
        if (vitals.temperature >= 97 && vitals.temperature <= 99) {
            score += 100;
        } else if (vitals.temperature >= 96 && vitals.temperature <= 100) {
            score += 75;
        } else {
            score += 50;
        }
    }

    return count > 0 ? score / count : 0;
}

/**
 * Calculate medication adherence score
 */
function calculateMedicationScore(medication: HealthMetrics['medication']): number {
    const { adherenceRate, missedDoses } = medication;

    // Base score from adherence rate
    let score = adherenceRate;

    // Penalty for missed doses
    const penalty = Math.min(missedDoses * 5, 30);
    score = Math.max(0, score - penalty);

    return score;
}

/**
 * Calculate activity score
 */
function calculateActivityScore(activity: HealthMetrics['activity']): number {
    let score = 0;
    let count = 0;

    // Steps (10,000 steps ideal)
    if (activity.steps !== undefined) {
        count++;
        if (activity.steps >= 10000) {
            score += 100;
        } else if (activity.steps >= 7500) {
            score += 85;
        } else if (activity.steps >= 5000) {
            score += 70;
        } else if (activity.steps >= 2500) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Exercise (30+ minutes ideal)
    if (activity.exerciseMinutes !== undefined) {
        count++;
        if (activity.exerciseMinutes >= 30) {
            score += 100;
        } else if (activity.exerciseMinutes >= 20) {
            score += 75;
        } else if (activity.exerciseMinutes >= 10) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Sleep (7-9 hours ideal)
    if (activity.sleepHours !== undefined) {
        count++;
        if (activity.sleepHours >= 7 && activity.sleepHours <= 9) {
            score += 100;
        } else if (activity.sleepHours >= 6 && activity.sleepHours <= 10) {
            score += 75;
        } else if (activity.sleepHours >= 5 && activity.sleepHours <= 11) {
            score += 50;
        } else {
            score += 25;
        }
    }

    return count > 0 ? score / count : 0;
}

/**
 * Calculate nutrition score
 */
function calculateNutritionScore(nutrition: HealthMetrics['nutrition']): number {
    let score = 0;
    let count = 0;

    // Water intake (2000ml ideal)
    if (nutrition.waterIntake !== undefined) {
        count++;
        if (nutrition.waterIntake >= 2000) {
            score += 100;
        } else if (nutrition.waterIntake >= 1500) {
            score += 75;
        } else if (nutrition.waterIntake >= 1000) {
            score += 50;
        } else {
            score += 25;
        }
    }

    // Meals logged (3+ ideal)
    count++;
    if (nutrition.mealsLogged >= 3) {
        score += 100;
    } else if (nutrition.mealsLogged >= 2) {
        score += 70;
    } else if (nutrition.mealsLogged >= 1) {
        score += 40;
    } else {
        score += 0;
    }

    return count > 0 ? score / count : 0;
}

/**
 * Calculate mental health score
 */
function calculateMentalScore(mental: HealthMetrics['mental']): number {
    let score = 0;
    let count = 0;

    // Mood score (8-10 ideal)
    if (mental.moodScore !== undefined) {
        count++;
        score += (mental.moodScore / 10) * 100;
    }

    // Stress level (1-3 ideal, inverted)
    if (mental.stressLevel !== undefined) {
        count++;
        const stressScore = ((10 - mental.stressLevel) / 10) * 100;
        score += stressScore;
    }

    return count > 0 ? score / count : 0;
}

/**
 * Generate insights based on health metrics
 */
function generateInsights(metrics: HealthMetrics, breakdown: HealthScore['breakdown']): string[] {
    const insights: string[] = [];

    // Vitals insights
    if (breakdown.vitals < 70) {
        if (metrics.vitals.bloodPressure) {
            const { systolic, diastolic } = metrics.vitals.bloodPressure;
            if (systolic > 130 || diastolic > 85) {
                insights.push('Your blood pressure is elevated. Consider reducing sodium intake and increasing exercise.');
            }
        }
        if (metrics.vitals.heartRate && metrics.vitals.heartRate > 100) {
            insights.push('Your resting heart rate is high. Try relaxation techniques and regular cardio exercise.');
        }
    }

    // Medication insights
    if (breakdown.medication < 80) {
        insights.push('Improve medication adherence by setting reminders and using our Smart Reminders feature.');
    }

    // Activity insights
    if (breakdown.activity < 70) {
        if (metrics.activity.steps && metrics.activity.steps < 5000) {
            insights.push('Increase daily steps. Try a 15-minute walk after meals.');
        }
        if (metrics.activity.sleepHours && metrics.activity.sleepHours < 7) {
            insights.push('Prioritize sleep. Aim for 7-9 hours per night for optimal health.');
        }
    }

    // Nutrition insights
    if (breakdown.nutrition < 70) {
        if (metrics.nutrition.waterIntake && metrics.nutrition.waterIntake < 1500) {
            insights.push('Stay hydrated! Aim for at least 2 liters of water daily.');
        }
        if (metrics.nutrition.mealsLogged < 2) {
            insights.push('Log your meals to track nutrition and maintain healthy eating habits.');
        }
    }

    // Mental health insights
    if (breakdown.mental < 70) {
        if (metrics.mental.stressLevel && metrics.mental.stressLevel > 7) {
            insights.push('High stress detected. Try our meditation exercises or speak with a mental health professional.');
        }
        if (metrics.mental.moodScore && metrics.mental.moodScore < 5) {
            insights.push('Your mood has been low. Consider journaling or reaching out to our mental health resources.');
        }
    }

    // Positive reinforcement
    if (breakdown.overall >= 80) {
        insights.push('🎉 Great job! Your health metrics are excellent. Keep up the good work!');
    }

    return insights;
}

/**
 * Calculate comprehensive health score
 */
export function calculateHealthScore(
    metrics: HealthMetrics,
    previousScore?: number
): HealthScore {
    const vitalsScore = calculateVitalsScore(metrics.vitals);
    const medicationScore = calculateMedicationScore(metrics.medication);
    const activityScore = calculateActivityScore(metrics.activity);
    const nutritionScore = calculateNutritionScore(metrics.nutrition);
    const mentalScore = calculateMentalScore(metrics.mental);

    // Weighted average (medication adherence is most important)
    const overall = Math.round(
        vitalsScore * 0.25 +
        medicationScore * 0.30 +
        activityScore * 0.20 +
        nutritionScore * 0.15 +
        mentalScore * 0.10
    );

    const breakdown = {
        overall,
        vitals: vitalsScore,
        medication: medicationScore,
        activity: activityScore,
        nutrition: nutritionScore,
        mental: mentalScore,
    };

    // Determine trend
    let trend: HealthScore['trend'] = 'stable';
    if (previousScore !== undefined) {
        const diff = overall - previousScore;
        if (diff >= 5) trend = 'improving';
        else if (diff <= -5) trend = 'declining';
    }

    const insights = generateInsights(metrics, breakdown);

    return {
        overall,
        breakdown,
        trend,
        insights,
    };
}

/**
 * Get health score color based on value
 */
export function getHealthScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
}

/**
 * Get health score label
 */
export function getHealthScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
}
