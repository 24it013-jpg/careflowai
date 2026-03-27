import { create } from "zustand";

export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
}

interface EmergencyStore {
    isSOSActive: boolean;
    isCountdownActive: boolean;
    countdownValue: number;
    emergencyContacts: EmergencyContact[];
    emergencyNotes: string;

    // Actions
    setSOSActive: (active: boolean) => void;
    setCountdownActive: (active: boolean) => void;
    setCountdownValue: (value: number) => void;
    addEmergencyContact: (contact: EmergencyContact) => void;
    removeEmergencyContact: (id: string) => void;
    setEmergencyNotes: (notes: string) => void;
}

export const useEmergencyStore = create<EmergencyStore>((set) => ({
    isSOSActive: false,
    isCountdownActive: false,
    countdownValue: 5,
    emergencyContacts: [
        {
            id: '1',
            name: 'Sarah Smith',
            relationship: 'Spouse',
            phone: '+1 (555) 0123',
            email: 'sarah.s@example.com'
        },
        {
            id: '2',
            name: 'Dr. Michael Chen',
            relationship: 'Primary Care Physician',
            phone: '+1 (555) 9876',
            email: 'dr.chen@health.care'
        }
    ],
    emergencyNotes: "Blood Type: B+, Allergic to Penicillin, Diabetic Type 2.",

    setSOSActive: (active) => set({ isSOSActive: active }),
    setCountdownActive: (active) => set({ isCountdownActive: active }),
    setCountdownValue: (value) => set({ countdownValue: value }),
    addEmergencyContact: (contact) => set((state) => ({
        emergencyContacts: [...state.emergencyContacts, contact]
    })),
    removeEmergencyContact: (id) => set((state) => ({
        emergencyContacts: state.emergencyContacts.filter(c => c.id !== id)
    })),
    setEmergencyNotes: (notes) => set({ emergencyNotes: notes }),
}));
