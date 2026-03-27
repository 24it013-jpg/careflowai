import { ConnectedProvider, DailyHealthSummary, HealthProvider } from "./types";

// Mock available providers
const AVAILABLE_PROVIDERS: ConnectedProvider[] = [
    { id: 'apple_health', name: 'Apple Health', icon: '🍎', isConnected: false },
    { id: 'google_fit', name: 'Google Fit', icon: '💪', isConnected: false },
    { id: 'fitbit', name: 'Fitbit', icon: '⌚', isConnected: false },
    { id: 'oura', name: 'Oura Ring', icon: '💍', isConnected: false },
    { id: 'garmin', name: 'Garmin', icon: '🏃', isConnected: false },
];

class HealthDataService {
    private providers: ConnectedProvider[] = [...AVAILABLE_PROVIDERS];

    // Simulate local storage persistence
    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('connected_health_providers');
            if (saved) {
                this.providers = JSON.parse(saved);
            }
        }
    }

    getProviders(): ConnectedProvider[] {
        return this.providers;
    }

    async connectProvider(providerId: HealthProvider): Promise<boolean> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, isConnected: true, lastSync: new Date().toISOString() } : p
        );

        this.persist();
        return true;
    }

    async disconnectProvider(providerId: HealthProvider): Promise<boolean> {
        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, isConnected: false, lastSync: undefined } : p
        );
        this.persist();
        return true;
    }

    async syncData(providerId: HealthProvider): Promise<boolean> {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider || !provider.isConnected) return false;

        // Simulate syncing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update last sync time
        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, lastSync: new Date().toISOString() } : p
        );
        this.persist();

        return true;
    }

    // Generate realistic mock data for today
    getTodaySummary(): DailyHealthSummary {
        const now = new Date();

        return {
            date: now.toISOString().split('T')[0],
            activity: {
                steps: 8432,
                caloriesBurned: 1840,
                distanceKm: 5.2,
                activeMinutes: 45,
                floorsClimbed: 12
            },
            vitals: {
                heartRate: {
                    current: 72,
                    resting: 64,
                    min: 58,
                    max: 145,
                    history: Array.from({ length: 24 }, (_, i) => ({
                        time: `${i}:00`,
                        value: 60 + Math.floor(Math.random() * 40)
                    }))
                },
                bloodPressure: {
                    systolic: 120,
                    diastolic: 80,
                    lastReading: new Date(now.setHours(8, 0)).toISOString()
                },
                spo2: 98,
                hrv: 45,
                weight: 75.5
            },
            sleep: {
                totalDurationHours: 7.5,
                deepSleepHours: 1.5,
                remSleepHours: 2.1,
                awakeDurationHours: 0.4,
                sleepScore: 85,
                bedtime: "23:15",
                wakeupTime: "06:45"
            },
            nutrition: {
                caloriesConsumed: 1250, // So far today
                proteinGrams: 90,
                carbsGrams: 140,
                fatGrams: 45,
                waterMl: 1250
            }
        };
    }

    private persist() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('connected_health_providers', JSON.stringify(this.providers));
        }
    }
}

export const healthDataService = new HealthDataService();
