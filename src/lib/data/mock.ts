// Standalone types for client-side mocking
export interface Vital {
    id: string;
    userId: string;
    type: "heart_rate" | "blood_pressure_sys" | "blood_pressure_dia" | "glucose" | "temperature" | "oxygen";
    value: string;
    unit: string;
    recordedAt: Date;
    source: string;
}

export interface Symptom {
    id: string;
    userId: string;
    bodyPart: string;
    severity: number;
    description: string;
    reportedAt: Date;
    status: "active" | "resolved";
    locationCoordinates: any; // Using any or specific type if known
}

export interface Medication {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    frequency: string;
    timeOfDay: string[];
    instructions: string;
    remainingQuantity: number;
    refillThreshold: number;
    isActive: boolean;
}

export interface Appointment {
    id: string;
    userId: string;
    doctorName: string;
    specialty: string;
    date: Date;
    status: "scheduled" | "completed" | "cancelled";
    notes: string;
    meetingLink?: string;
}

export interface Expense {
    id: string;
    userId: string;
    category: string;
    amount: string;
    date: Date;
    description: string;
}

export interface MedicalProfile {
    id: string;
    userId: string;
    // Add other fields as needed based on usage, or keep it generic for now
    [key: string]: any;
}

// --- MOCK DATA ---

export const MOCK_USER_ID = "user_2n...mock";

export const mockVitals: Vital[] = [
    { id: "v1", userId: MOCK_USER_ID, type: "heart_rate", value: "72", unit: "bpm", recordedAt: new Date(), source: "Apple Watch" },
    { id: "v2", userId: MOCK_USER_ID, type: "blood_pressure_sys", value: "120", unit: "mmHg", recordedAt: new Date(), source: "Omron" },
    { id: "v3", userId: MOCK_USER_ID, type: "blood_pressure_dia", value: "80", unit: "mmHg", recordedAt: new Date(), source: "Omron" },
    { id: "v4", userId: MOCK_USER_ID, type: "glucose", value: "95", unit: "mg/dL", recordedAt: new Date(), source: "Dexcom" },
    { id: "v5", userId: MOCK_USER_ID, type: "temperature", value: "98.6", unit: "F", recordedAt: new Date(), source: "Manual" },
    { id: "v6", userId: MOCK_USER_ID, type: "oxygen", value: "98", unit: "%", recordedAt: new Date(), source: "Oura" },
];

export const mockSymptoms: Symptom[] = [
    { id: "s1", userId: MOCK_USER_ID, bodyPart: "head", severity: 4, description: "Mild migraine mostly left side", reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "active", locationCoordinates: null },
    { id: "s2", userId: MOCK_USER_ID, bodyPart: "left-leg", severity: 2, description: "Slight stiffness", reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), status: "resolved", locationCoordinates: null },
];

export const mockMedications: Medication[] = [
    { id: "m1", userId: MOCK_USER_ID, name: "Metformin", dosage: "500g", frequency: "daily", timeOfDay: ["08:00"], instructions: "Take with food", remainingQuantity: 14, refillThreshold: 5, isActive: true },
    { id: "m2", userId: MOCK_USER_ID, name: "Lisinopril", dosage: "10mg", frequency: "daily", timeOfDay: ["20:00"], instructions: "Before bed", remainingQuantity: 28, refillThreshold: 7, isActive: true },
    { id: "m3", userId: MOCK_USER_ID, name: "Vitamin D", dosage: "1000IU", frequency: "daily", timeOfDay: ["13:00"], instructions: "With lunch", remainingQuantity: 90, refillThreshold: 10, isActive: true },
];

export const mockAppointments: Appointment[] = [
    { id: "a1", userId: MOCK_USER_ID, doctorName: "Dr. Sarah Chen", specialty: "Pulmonologist", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), status: "scheduled", notes: "Follow up on asthma", meetingLink: "https://meet.google.com/abc-defg-hij" },
];

export const mockExpenses: Expense[] = [
    { id: "e1", userId: MOCK_USER_ID, category: "medication", amount: "45.00", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), description: "Metformin Refill" },
    { id: "e2", userId: MOCK_USER_ID, category: "consultation", amount: "150.00", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), description: "Dr. Chen Visit" },
    { id: "e3", userId: MOCK_USER_ID, category: "lab_test", amount: "225.50", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), description: "Comprehensive Metabolic Panel" },
];

// --- SIMULATED API CALLS ---

export const api = {
    getVitals: async () => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        return mockVitals;
    },
    getSymptoms: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockSymptoms;
    },
    addSymptom: async (symptom: Omit<Symptom, "id" | "userId" | "reportedAt">) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newSymptom: Symptom = {
            ...symptom,
            id: Math.random().toString(36).substr(2, 9),
            userId: MOCK_USER_ID,
            reportedAt: new Date(),
        };
        mockSymptoms.push(newSymptom);
        return newSymptom;
    },
    getMedications: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockMedications;
    },
    getAppointments: async () => {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockAppointments;
    },
    getExpenses: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockExpenses;
    }
};
