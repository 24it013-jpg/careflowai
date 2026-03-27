import { ConnectedProvider, NutritionMetrics } from "./types";

const AVAILABLE_NUTRITION_PROVIDERS: ConnectedProvider[] = [
    { id: 'myfitnesspal', name: 'MyFitnessPal', icon: '🥗', isConnected: false },
    { id: 'cronometer', name: 'Cronometer', icon: '🍎', isConnected: false },
    { id: 'loseit', name: 'Lose It!', icon: '⚖️', isConnected: false },
];

class NutritionDataService {
    private providers: ConnectedProvider[] = [...AVAILABLE_NUTRITION_PROVIDERS];

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('connected_nutrition_providers');
            if (saved) {
                this.providers = JSON.parse(saved);
            }
        }
    }

    getProviders(): ConnectedProvider[] {
        return this.providers;
    }

    async connectProvider(providerId: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, isConnected: true, lastSync: new Date().toISOString() } : p
        );

        this.persist();
        return true;
    }

    async disconnectProvider(providerId: string): Promise<boolean> {
        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, isConnected: false, lastSync: undefined } : p
        );
        this.persist();
        return true;
    }

    async syncData(providerId: string): Promise<boolean> {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider || !provider.isConnected) return false;

        await new Promise(resolve => setTimeout(resolve, 2000));

        this.providers = this.providers.map(p =>
            p.id === providerId ? { ...p, lastSync: new Date().toISOString() } : p
        );
        this.persist();
        return true;
    }

    getTodayNutrition(): NutritionMetrics {
        return {
            caloriesConsumed: 1450,
            proteinGrams: 110,
            carbsGrams: 160,
            fatGrams: 55,
            waterMl: 1800
        };
    }

    private persist() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('connected_nutrition_providers', JSON.stringify(this.providers));
        }
    }
}

export const nutritionDataService = new NutritionDataService();
