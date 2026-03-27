import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Medication, Allergy } from "@/lib/ai/medication-checker";

export interface VitalReading {
    id: string;
    timestamp: number; // Unix ms
    heartRate?: number;
    spo2?: number;
    temperature?: number; // °F
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number; // lbs
    source: "camera" | "manual" | "wearable";
    notes?: string;
}

export interface HealthDataStore {
    vitals: {
        heartRate: number;
        spo2: number;
        temperature: number;
        bloodPressureSystolic: number;
        bloodPressureDiastolic: number;
        weight: number;
        lastMeasured: number | null; // Unix ms
    };
    vitalHistory: VitalReading[];
    medications: Medication[];
    allergies: Allergy[];

    // Actions
    setVitals: (vitals: Partial<HealthDataStore["vitals"]>) => void;
    addVitalReading: (reading: Omit<VitalReading, "id">) => void;
    clearHistory: () => void;
    setMedications: (medications: Medication[]) => void;
    addAllergy: (allergy: Allergy) => void;
    removeAllergy: (id: string) => void;
    addMedication: (medication: Medication) => void;
    removeMedication: (id: string) => void;
}

export const useHealthData = create<HealthDataStore>()(
    persist(
        (set) => ({
            vitals: {
                heartRate: 72,
                spo2: 98,
                temperature: 98.6,
                bloodPressureSystolic: 120,
                bloodPressureDiastolic: 80,
                weight: 154,
                lastMeasured: null,
            },
            vitalHistory: [],
            medications: [],
            allergies: [],

            setVitals: (newVitals) =>
                set((state) => ({
                    vitals: { ...state.vitals, ...newVitals },
                })),

            addVitalReading: (reading) =>
                set((state) => {
                    const newReading: VitalReading = {
                        ...reading,
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    };
                    // Update current vitals from reading
                    const updatedVitals = { ...state.vitals, lastMeasured: reading.timestamp };
                    if (reading.heartRate !== undefined) updatedVitals.heartRate = reading.heartRate;
                    if (reading.spo2 !== undefined) updatedVitals.spo2 = reading.spo2;
                    if (reading.temperature !== undefined) updatedVitals.temperature = reading.temperature;
                    if (reading.bloodPressureSystolic !== undefined) updatedVitals.bloodPressureSystolic = reading.bloodPressureSystolic;
                    if (reading.bloodPressureDiastolic !== undefined) updatedVitals.bloodPressureDiastolic = reading.bloodPressureDiastolic;
                    if (reading.weight !== undefined) updatedVitals.weight = reading.weight;

                    return {
                        vitalHistory: [newReading, ...state.vitalHistory].slice(0, 500), // keep last 500
                        vitals: updatedVitals,
                    };
                }),

            clearHistory: () => set({ vitalHistory: [] }),

            setMedications: (medications) => set({ medications }),
            addAllergy: (allergy) =>
                set((state) => ({ allergies: [...state.allergies, allergy] })),
            removeAllergy: (id) =>
                set((state) => ({ allergies: state.allergies.filter((a) => a.id !== id) })),
            addMedication: (medication) =>
                set((state) => ({ medications: [...state.medications, medication] })),
            removeMedication: (id) =>
                set((state) => ({ medications: state.medications.filter((m) => m.id !== id) })),
        }),
        {
            name: "careflow-health-data",
            partialize: (state) => ({
                vitals: state.vitals,
                vitalHistory: state.vitalHistory,
                medications: state.medications,
                allergies: state.allergies,
            }),
        }
    )
);
