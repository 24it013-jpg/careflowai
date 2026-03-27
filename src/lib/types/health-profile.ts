/**
 * Health Profile Types
 * User health context for personalized medication checking
 */

export interface UserHealthProfile {
    // Demographics
    age?: number;
    weight?: number; // in kg
    height?: number; // in cm
    gender?: 'male' | 'female' | 'other';

    // Allergies
    allergies: MedicationAllergy[];

    // Medical Conditions
    conditions: MedicalCondition[];

    // Pregnancy & Breastfeeding
    isPregnant?: boolean;
    isBreastfeeding?: boolean;
    pregnancyTrimester?: 1 | 2 | 3;

    // Organ Function
    kidneyFunction?: 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';
    liverFunction?: 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';

    // Lifestyle
    smokingStatus?: 'never' | 'former' | 'current';
    alcoholUse?: 'none' | 'occasional' | 'moderate' | 'heavy';

    // Previous Reactions
    adverseReactions: AdverseReaction[];
}

export interface MedicationAllergy {
    medication: string;
    allergyType: 'mild' | 'moderate' | 'severe' | 'anaphylaxis';
    symptoms: string[];
    dateReported?: Date;
}

export interface MedicalCondition {
    name: string;
    diagnosedDate?: Date;
    status: 'active' | 'controlled' | 'resolved';
    severity?: 'mild' | 'moderate' | 'severe';
}

export interface AdverseReaction {
    medication: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
    dateOccurred?: Date;
}

/**
 * Medication with enhanced details
 */
export interface EnhancedMedication {
    id: string;
    name: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    route?: string; // oral, injection, topical, etc.

    // Timing
    timeOfDay?: ('morning' | 'afternoon' | 'evening' | 'bedtime')[];
    withFood?: boolean;

    // Prescription Info
    prescriber?: string;
    pharmacy?: string;
    startDate?: Date;
    endDate?: Date;
    refillsRemaining?: number;

    // Tracking
    purpose?: string; // What is this medication for?
    notes?: string;

    // NDC for barcode scanning
    ndc?: string;
}

/**
 * Medication Schedule Entry
 */
export interface MedicationScheduleEntry {
    medicationId: string;
    scheduledTime: Date;
    taken: boolean;
    takenAt?: Date;
    skipped: boolean;
    skipReason?: string;
    sideEffectsReported?: string[];
}

/**
 * Adherence Metrics
 */
export interface AdherenceMetrics {
    medicationId: string;
    medicationName: string;

    // Adherence Score (0-100)
    adherenceScore: number;

    // Statistics
    totalDoses: number;
    dosesTaken: number;
    dosesSkipped: number;

    // Streak
    currentStreak: number; // days
    longestStreak: number; // days

    // Timing
    averageDelayMinutes: number;
    onTimePercentage: number;

    // Period
    periodStart: Date;
    periodEnd: Date;
}

/**
 * Cost Tracking
 */
export interface MedicationCost {
    medicationId: string;
    medicationName: string;

    // Pricing
    monthlyCost: number;
    yearlyProjectedCost: number;

    // Savings Opportunities
    genericSavings?: number;
    pharmacySavings?: number;
    couponSavings?: number;

    // History
    costHistory: CostHistoryEntry[];
}

export interface CostHistoryEntry {
    date: Date;
    pharmacy: string;
    amount: number;
    quantity: number;
    daysSupply: number;
}

/**
 * Clinical Decision Support Result
 */
export interface ClinicalDecisionResult {
    medication: string;

    // Dosage Validation
    dosageAppropriate: boolean;
    dosageWarnings: string[];
    recommendedDosageRange?: {
        min: number;
        max: number;
        unit: string;
    };

    // Contraindications
    contraindications: Contraindication[];

    // Adjustments Needed
    renalAdjustmentNeeded: boolean;
    hepaticAdjustmentNeeded: boolean;
    ageAdjustmentNeeded: boolean;

    // Recommendations
    clinicalRecommendations: string[];
}

export interface Contraindication {
    type: 'absolute' | 'relative';
    condition: string;
    reason: string;
    severity: 'minor' | 'moderate' | 'severe';
}
