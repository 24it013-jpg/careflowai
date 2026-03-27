export type HealthProvider = 'apple_health' | 'google_fit' | 'fitbit' | 'oura' | 'garmin' | 'myfitnesspal' | 'cronometer' | 'loseit';

export interface ConnectedProvider {
    id: HealthProvider;
    name: string;
    icon: string;
    isConnected: boolean;
    lastSync?: string;
}

export interface ActivityMetrics {
    steps: number;
    caloriesBurned: number;
    distanceKm: number;
    activeMinutes: number;
    floorsClimbed: number;
}

export interface VitalSigns {
    heartRate: {
        current: number;
        resting: number;
        min: number;
        max: number;
        history: { time: string; value: number }[];
    };
    bloodPressure?: {
        systolic: number;
        diastolic: number;
        lastReading: string;
    };
    spo2?: number;
    hrv?: number;
    weight?: number;
}

export interface SleepMetrics {
    totalDurationHours: number;
    deepSleepHours: number;
    remSleepHours: number;
    awakeDurationHours: number;
    sleepScore: number; // 0-100
    bedtime: string;
    wakeupTime: string;
}

export interface NutritionMetrics {
    caloriesConsumed: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    waterMl: number;
}

export interface DailyHealthSummary {
    date: string;
    activity: ActivityMetrics;
    vitals: VitalSigns;
    sleep: SleepMetrics;
    nutrition: NutritionMetrics;
}
