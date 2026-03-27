import { create } from 'zustand';
import { useHealthData } from './use-health-data';

interface SimulationState {
    sleepHours: number;
    activityMinutes: number;
    hydrationLiters: number;
    setSimulationValue: (key: keyof Omit<SimulationState, 'setSimulationValue' | 'resetSimulation'>, value: number) => void;
    resetSimulation: () => void;
}

export const useHealthSimulatorStore = create<SimulationState>((set) => ({
    sleepHours: 8,
    activityMinutes: 30,
    hydrationLiters: 2,
    setSimulationValue: (key, value) => set({ [key]: value }),
    resetSimulation: () => set({ sleepHours: 8, activityMinutes: 30, hydrationLiters: 2 }),
}));

export function useHealthSimulator() {
    const { sleepHours, activityMinutes, hydrationLiters } = useHealthSimulatorStore();
    const { vitals } = useHealthData();

    // Base NHI calculation logic (replicated/simplified from main store for simulation)
    const calculateSimulatedNHI = () => {
        let base = 75; // Starting point for simulation

        // Vitals influence (current)
        if (vitals.heartRate > 60 && vitals.heartRate < 80) base += 5;
        if (vitals.spo2 > 96) base += 5;

        // Simulation modifiers
        const sleepBonus = (sleepHours - 7) * 4; // +4 per hour over 7, negative if under
        const activityBonus = (activityMinutes / 30) * 3; // +3 per 30 mins
        const hydrationBonus = (hydrationLiters - 2) * 2; // +2 per liter over 2

        const simulatedScore = Math.min(100, Math.max(0, base + sleepBonus + activityBonus + hydrationBonus));

        // Calculate verdict
        let verdict = "Optimal balance maintained.";
        if (simulatedScore > 90) verdict = "Peak Neural Synchronization projected.";
        if (simulatedScore < 70) verdict = "Potential System Fatigue detected in simulation.";
        if (sleepHours < 5) verdict = "Critical: Neural recovery insufficient.";

        return {
            simulatedScore: Math.round(simulatedScore),
            verdict,
            isImproving: simulatedScore > 75 // Compared to base
        };
    };

    return {
        ...useHealthSimulatorStore(),
        ...calculateSimulatedNHI()
    };
}
