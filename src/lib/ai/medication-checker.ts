/**
 * AI Medication Checker Service
 * Checks drug interactions, side effects, and provides pharmacy pricing
 */

export interface Medication {
    id?: string;
    name: string;
    dosage?: string;
    frequency?: string;
    genericName?: string;
}

export interface Allergy {
    id: string;
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
}

export interface DrugInteraction {
    drug1: string;
    drug2: string;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
    recommendation: string;
}

export interface SideEffect {
    effect: string;
    frequency: 'common' | 'uncommon' | 'rare';
    severity: 'mild' | 'moderate' | 'severe';
}

export interface DrugInfo {
    brandName: string;
    genericName: string;
    description: string;
    sideEffects: SideEffect[];
    warnings: string[];
    contraindications: string[];
    pregnancyCategory?: string;
    breastfeedingWarning?: string;
}

export interface PharmacyPrice {
    pharmacy: string;
    price: number;
    discount?: number;
    finalPrice: number;
    inStock: boolean;
    lastUpdated: Date;
    distance: number;
    url?: string;
}

export interface MedicationCheckResult {
    interactions: DrugInteraction[];
    allergyInteractions: DrugInteraction[];
    drugInfo: Map<string, DrugInfo>;
    pricing: Map<string, PharmacyPrice[]>;
    genericAlternatives: Map<string, string>;
}

/**
 * Check for drug interactions using FDA OpenFDA API
 */
export async function checkMedications(medications: Medication[], allergies: Allergy[] = []): Promise<MedicationCheckResult> {
    const interactions = await checkDrugInteractions(medications);
    const allergyInteractions = await checkAllergies(medications, allergies);

    const drugInfo = new Map<string, DrugInfo>();
    const pricing = new Map<string, PharmacyPrice[]>();
    const genericAlternatives = new Map<string, string>();

    await Promise.all(medications.map(async (med) => {
        const info = await getDrugInfo(med.name);
        if (info) {
            drugInfo.set(med.name, info);
        }

        const prices = await getPharmacyPricing(med.name, med.dosage);
        pricing.set(med.name, prices);

        const generic = await getGenericAlternatives(med.name);
        if (generic) {
            genericAlternatives.set(med.name, generic);
        }
    }));

    return {
        interactions,
        allergyInteractions,
        drugInfo,
        pricing,
        genericAlternatives
    };
}

/**
 * Check for drug interactions using FDA OpenFDA API
 */
export async function checkDrugInteractions(
    medications: Medication[]
): Promise<DrugInteraction[]> {
    if (medications.length < 2) {
        return [];
    }

    const interactions: DrugInteraction[] = [];

    // Check each pair of medications
    for (let i = 0; i < medications.length; i++) {
        for (let j = i + 1; j < medications.length; j++) {
            const drug1 = medications[i].name.toLowerCase();
            const drug2 = medications[j].name.toLowerCase();

            // Query FDA API for interactions
            try {
                const interaction = await queryFDAInteraction(drug1, drug2);
                if (interaction) {
                    interactions.push(interaction);
                }
            } catch (error) {
                console.error(`Error checking interaction between ${drug1} and ${drug2}:`, error);
            }
        }
    }

    return interactions;
}

/**
 * Check for allergy interactions
 */
export async function checkAllergies(
    medications: Medication[],
    allergies: Allergy[]
): Promise<DrugInteraction[]> {
    const interactions: DrugInteraction[] = [];

    // Simple string matching for now
    // In a real app, this would use a more sophisticated allergen database
    for (const med of medications) {
        for (const allergy of allergies) {
            const medName = med.name.toLowerCase();
            const genericName = med.genericName?.toLowerCase() || '';
            const allergen = allergy.allergen.toLowerCase();

            // Direct match
            if (medName.includes(allergen) || genericName.includes(allergen)) {
                interactions.push({
                    drug1: med.name,
                    drug2: `Allergy: ${allergy.allergen}`,
                    severity: allergy.severity === 'life-threatening' ? 'severe' :
                        allergy.severity === 'severe' ? 'severe' : 'moderate',
                    description: `Patient has a reported allergy to ${allergy.allergen} which may be present in ${med.name}.`,
                    recommendation: 'Do not administer. Consult healthcare provider for alternatives.'
                });
            }
        }
    }

    return interactions;
}

/**
 * Query FDA OpenFDA API for drug interaction data
 */
async function queryFDAInteraction(
    drug1: string,
    drug2: string
): Promise<DrugInteraction | null> {
    try {
        // FDA OpenFDA API endpoint for drug labels
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drug1}"+AND+drug_interactions:"${drug2}"&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
            // No interaction found or API error
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const interactionText = result.drug_interactions?.[0] || '';

            // Determine severity based on keywords
            let severity: 'minor' | 'moderate' | 'severe' = 'moderate';
            if (interactionText.toLowerCase().includes('contraindicated') ||
                interactionText.toLowerCase().includes('severe') ||
                interactionText.toLowerCase().includes('life-threatening')) {
                severity = 'severe';
            } else if (interactionText.toLowerCase().includes('minor') ||
                interactionText.toLowerCase().includes('unlikely')) {
                severity = 'minor';
            }

            return {
                drug1,
                drug2,
                severity,
                description: interactionText.substring(0, 300),
                recommendation: severity === 'severe'
                    ? 'Consult your healthcare provider immediately'
                    : 'Discuss with your healthcare provider',
            };
        }

        return null;
    } catch (error) {
        console.error('FDA API error:', error);
        return null;
    }
}

/**
 * Get detailed drug information from FDA
 */
export async function getDrugInfo(medicationName: string): Promise<DrugInfo | null> {
    try {
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicationName}"&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];

            // Extract side effects
            const sideEffects: SideEffect[] = [];
            const adverseReactions = result.adverse_reactions?.[0] || '';

            // Parse common side effects (simplified)
            const commonEffects = ['nausea', 'headache', 'dizziness', 'fatigue', 'diarrhea'];
            commonEffects.forEach(effect => {
                if (adverseReactions.toLowerCase().includes(effect)) {
                    sideEffects.push({
                        effect: effect.charAt(0).toUpperCase() + effect.slice(1),
                        frequency: 'common',
                        severity: 'mild',
                    });
                }
            });

            return {
                brandName: result.openfda?.brand_name?.[0] || medicationName,
                genericName: result.openfda?.generic_name?.[0] || '',
                description: result.description?.[0]?.substring(0, 200) || '',
                sideEffects,
                warnings: result.warnings?.slice(0, 3) || [],
                contraindications: result.contraindications?.slice(0, 3) || [],
                pregnancyCategory: result.pregnancy?.[0]?.substring(0, 100),
                breastfeedingWarning: result.nursing_mothers?.[0]?.substring(0, 100),
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching drug info:', error);
        return null;
    }
}

/**
 * Get pharmacy pricing (mock data for now)
 * Real implementation would use GoodRx API or similar
 */
export async function getPharmacyPricing(
    _medicationName: string,
    _dosage?: string
): Promise<PharmacyPrice[]> {
    // Mock pricing data
    const basePrice = Math.random() * 100 + 20;

    const pharmacies = [
        { name: 'CVS Pharmacy', multiplier: 1.2, distance: 1.2 },
        { name: 'Walgreens', multiplier: 1.15, distance: 2.5 },
        { name: 'Walmart', multiplier: 0.8, distance: 3.8 },
        { name: 'Costco', multiplier: 0.7, distance: 5.2 },
        { name: 'Target', multiplier: 1.0, distance: 1.8 },
    ];

    return pharmacies.map(pharmacy => {
        const price = basePrice * pharmacy.multiplier;
        const discount = Math.random() > 0.5 ? Math.random() * 20 : 0;
        const finalPrice = Math.round((price - discount) * 100) / 100;

        return {
            pharmacy: pharmacy.name,
            price: Math.round(price * 100) / 100,
            discount: discount > 0 ? Math.round(discount * 100) / 100 : undefined,
            finalPrice: finalPrice,
            inStock: Math.random() > 0.1, // 90% in stock
            lastUpdated: new Date(),
            distance: pharmacy.distance,
            url: '#'
        };
    }).sort((a, b) => a.finalPrice - b.finalPrice);
}

/**
 * Get generic alternatives
 */
export async function getGenericAlternatives(
    medicationName: string
): Promise<string | null> {
    try {
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicationName}"&limit=1`;

        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return result.openfda?.generic_name?.[0] || null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching generic alternatives:', error);
        return null;
    }
}
