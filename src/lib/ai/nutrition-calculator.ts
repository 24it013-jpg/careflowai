export type DietPreference = 'veg' | 'non-veg';
export type Goal = 'muscle-gain' | 'fat-loss' | 'maintenance';
export type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active';

export interface UserNutritionStats {
    age: number;
    gender: 'male' | 'female';
    weightKg: number;
    heightCm: number;
    activityLevel: ActivityLevel;
    goal: Goal;
    dietPreference: DietPreference;
}

export interface NutritionResult {
    bmr: number;
    tdee: number;
    targetCalories: number;
    macros: {
        protein: number;
        fats: number;
        carbs: number;
    };
}

const activityMultipliers: Record<ActivityLevel, number> = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'extra-active': 1.9
};

export function calculateNutrition(stats: UserNutritionStats): NutritionResult {
    const { age, gender, weightKg, heightCm, activityLevel, goal } = stats;

    // 1. Calculate BMR (Mifflin-St Jeor Equation)
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // 2. Determine TDEE
    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

    // 3. Target Calories based on Goal
    let targetCalories = tdee;
    if (goal === 'fat-loss') {
        targetCalories -= 500;
    } else if (goal === 'muscle-gain') {
        targetCalories += 300;
    }

    // 4. Macro-Nutrient Split
    let proteinGrams = 0;
    let fatGrams = 0;
    let carbGrams = 0;

    if (goal === 'muscle-gain') {
        // High Protein (2.0g per kg)
        proteinGrams = Math.round(weightKg * 2.0);
        // Moderate Fat (25% of calories)
        fatGrams = Math.round((targetCalories * 0.25) / 9);
    } else if (goal === 'fat-loss') {
        // High Protein (2.2g per kg to preserve muscle)
        proteinGrams = Math.round(weightKg * 2.2);
        // Moderate Fat (20% of calories)
        fatGrams = Math.round((targetCalories * 0.20) / 9);
    } else {
        // Maintenance
        proteinGrams = Math.round(weightKg * 1.8);
        fatGrams = Math.round((targetCalories * 0.25) / 9);
    }

    // Remaining calories go to carbs
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    carbGrams = Math.round((targetCalories - proteinCals - fatCals) / 4);

    return {
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        macros: {
            protein: proteinGrams,
            fats: fatGrams,
            carbs: carbGrams
        }
    };
}
