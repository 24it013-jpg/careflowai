/**
 * Medication Autocomplete Service
 * Provides real-time medication search using FDA OpenFDA API
 */

export interface MedicationSuggestion {
    brandName: string;
    genericName: string;
    dosageForm?: string;
    route?: string;
    manufacturer?: string;
    ndc?: string; // National Drug Code
}

/**
 * Search medications with autocomplete
 * Debounced search function for real-time suggestions
 */
export async function searchMedications(
    query: string,
    limit: number = 10
): Promise<MedicationSuggestion[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        // Search both brand and generic names
        const brandUrl = `https://api.fda.gov/drug/ndc.json?search=brand_name:${encodeURIComponent(query)}*&limit=${limit}`;
        const genericUrl = `https://api.fda.gov/drug/ndc.json?search=generic_name:${encodeURIComponent(query)}*&limit=${limit}`;

        const [brandResponse, genericResponse] = await Promise.allSettled([
            fetch(brandUrl),
            fetch(genericUrl)
        ]);

        const suggestions: MedicationSuggestion[] = [];
        const seenNames = new Set<string>();

        // Process brand name results
        if (brandResponse.status === 'fulfilled' && brandResponse.value.ok) {
            const data = await brandResponse.value.json();
            if (data.results) {
                data.results.forEach((result: any) => {
                    const brandName = result.brand_name || '';
                    const genericName = result.generic_name || '';
                    const key = `${brandName.toLowerCase()}-${genericName.toLowerCase()}`;

                    if (!seenNames.has(key) && brandName) {
                        seenNames.add(key);
                        suggestions.push({
                            brandName,
                            genericName,
                            dosageForm: result.dosage_form,
                            route: result.route?.[0],
                            manufacturer: result.labeler_name,
                            ndc: result.product_ndc
                        });
                    }
                });
            }
        }

        // Process generic name results
        if (genericResponse.status === 'fulfilled' && genericResponse.value.ok) {
            const data = await genericResponse.value.json();
            if (data.results) {
                data.results.forEach((result: any) => {
                    const brandName = result.brand_name || '';
                    const genericName = result.generic_name || '';
                    const key = `${brandName.toLowerCase()}-${genericName.toLowerCase()}`;

                    if (!seenNames.has(key) && genericName) {
                        seenNames.add(key);
                        suggestions.push({
                            brandName,
                            genericName,
                            dosageForm: result.dosage_form,
                            route: result.route?.[0],
                            manufacturer: result.labeler_name,
                            ndc: result.product_ndc
                        });
                    }
                });
            }
        }

        // Sort by relevance (exact matches first)
        return suggestions.sort((a, b) => {
            const aExact = a.brandName.toLowerCase().startsWith(query.toLowerCase()) ||
                a.genericName.toLowerCase().startsWith(query.toLowerCase());
            const bExact = b.brandName.toLowerCase().startsWith(query.toLowerCase()) ||
                b.genericName.toLowerCase().startsWith(query.toLowerCase());

            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        }).slice(0, limit);

    } catch (error) {
        console.error('Error searching medications:', error);
        return [];
    }
}

/**
 * Get common medications for quick add
 */
export function getCommonMedications(): MedicationSuggestion[] {
    return [
        { brandName: 'Tylenol', genericName: 'Acetaminophen', dosageForm: 'Tablet' },
        { brandName: 'Advil', genericName: 'Ibuprofen', dosageForm: 'Tablet' },
        { brandName: 'Lipitor', genericName: 'Atorvastatin', dosageForm: 'Tablet' },
        { brandName: 'Glucophage', genericName: 'Metformin', dosageForm: 'Tablet' },
        { brandName: 'Zestril', genericName: 'Lisinopril', dosageForm: 'Tablet' },
        { brandName: 'Synthroid', genericName: 'Levothyroxine', dosageForm: 'Tablet' },
        { brandName: 'Norvasc', genericName: 'Amlodipine', dosageForm: 'Tablet' },
        { brandName: 'Prilosec', genericName: 'Omeprazole', dosageForm: 'Capsule' },
        { brandName: 'Zocor', genericName: 'Simvastatin', dosageForm: 'Tablet' },
        { brandName: 'Coumadin', genericName: 'Warfarin', dosageForm: 'Tablet' }
    ];
}

/**
 * Debounce helper for search input
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
