/**
 * AI Interaction Analyzer
 * Uses the same text stack as the app: OpenRouter (primary → backup → tertiary), then Gemini.
 */

import { DrugInteraction } from './medication-checker';
import { callAI } from './gemini';

export interface AIInteractionSummary {
    plainLanguageSummary: string;
    actionItems: string[];
    riskLevel: number; // 1-10 scale
    timeline: 'immediate' | 'within_24h' | 'monitor' | 'routine';
    patientFriendlyExplanation: string;
    severity: 'minor' | 'moderate' | 'severe';
    foodInteractions?: any[];
    supplementInteractions?: any[];
    clinicalSignificance?: string;
    monitoringRequired?: string[];
}

export interface FoodInteraction {
    medication: string;
    food: string;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
    recommendation: string;
}

// Supplement interactions use the same structure as food interactions
export type SupplementInteraction = FoodInteraction;

/**
 * Generate AI-powered interaction summary
 */
export async function generateInteractionSummary(
    interaction: DrugInteraction
): Promise<AIInteractionSummary> {
    const hasAi =
        Boolean(import.meta.env.VITE_OPENROUTER_API_KEY) || Boolean(import.meta.env.VITE_GEMINI_API_KEY);

    if (!hasAi) {
        return generateBasicSummary(interaction);
    }

    try {
        const prompt = `You are a medical AI assistant helping patients understand drug interactions.

Drug Interaction:
- Drug 1: ${interaction.drug1}
- Drug 2: ${interaction.drug2}
- Severity: ${interaction.severity}
- Medical Description: ${interaction.description}

Generate a response in JSON format with:
1. plainLanguageSummary: A clear, non-technical explanation (2-3 sentences)
2. actionItems: Array of 2-4 specific actions the patient should take
3. riskLevel: Number from 1-10 (1=minimal, 10=life-threatening)
4. timeline: One of: "immediate", "within_24h", "monitor", "routine"
5. patientFriendlyExplanation: Detailed but accessible explanation (4-5 sentences)

Return only the JSON object. 
Focus on being reassuring but honest. Use simple language. Avoid medical jargon.`;

        const resultText = await callAI(prompt, undefined, [], {
            temperature: 0.3,
        });

        const content = JSON.parse(resultText);

        return {
            plainLanguageSummary: content.plainLanguageSummary,
            actionItems: content.actionItems,
            riskLevel: content.riskLevel,
            timeline: content.timeline,
            patientFriendlyExplanation: content.patientFriendlyExplanation,
            severity: interaction.severity,
            clinicalSignificance: content.clinicalSignificance,
            monitoringRequired: content.monitoringRequired
        };

    } catch (error) {
        console.error('Error generating AI summary:', error);
        return generateBasicSummary(interaction);
    }
}

/**
 * Fallback basic summary generator
 */
function generateBasicSummary(interaction: DrugInteraction): AIInteractionSummary {
    const riskLevelMap = {
        'minor': 3,
        'moderate': 6,
        'severe': 9
    };

    const timelineMap = {
        'minor': 'routine' as const,
        'moderate': 'monitor' as const,
        'severe': 'immediate' as const
    };

    return {
        plainLanguageSummary: `Taking ${interaction.drug1} and ${interaction.drug2} together may cause a ${interaction.severity} interaction.`,
        actionItems: [
            interaction.recommendation,
            'Monitor for any unusual symptoms',
            'Keep a list of all your medications'
        ],
        riskLevel: riskLevelMap[interaction.severity],
        timeline: timelineMap[interaction.severity],
        patientFriendlyExplanation: interaction.description,
        severity: interaction.severity
    };
}

/**
 * Check for food and supplement interactions
 */
export async function checkFoodInteractions(
    medicationName: string
): Promise<FoodInteraction[]> {
    const interactions: FoodInteraction[] = [];

    // Common food-drug interactions database
    const foodInteractionDatabase: Record<string, FoodInteraction[]> = {
        'warfarin': [
            {
                medication: 'Warfarin',
                food: 'Vitamin K-rich foods (spinach, kale, broccoli)',
                severity: 'moderate',
                description: 'Vitamin K can reduce the effectiveness of warfarin',
                recommendation: 'Maintain consistent vitamin K intake. Don\'t suddenly increase or decrease leafy greens.'
            },
            {
                medication: 'Warfarin',
                food: 'Alcohol',
                severity: 'severe',
                description: 'Alcohol can increase bleeding risk when combined with warfarin',
                recommendation: 'Limit alcohol consumption. Discuss safe limits with your doctor.'
            }
        ],
        'lisinopril': [
            {
                medication: 'Lisinopril',
                food: 'Potassium-rich foods (bananas, oranges)',
                severity: 'moderate',
                description: 'ACE inhibitors can increase potassium levels',
                recommendation: 'Monitor potassium intake. Avoid potassium supplements unless prescribed.'
            },
            {
                medication: 'Lisinopril',
                food: 'Salt substitutes',
                severity: 'moderate',
                description: 'Many salt substitutes contain potassium',
                recommendation: 'Check labels on salt substitutes. Consult your doctor before use.'
            }
        ],
        'metformin': [
            {
                medication: 'Metformin',
                food: 'Alcohol',
                severity: 'severe',
                description: 'Alcohol increases risk of lactic acidosis with metformin',
                recommendation: 'Avoid excessive alcohol. Limit to 1-2 drinks per day maximum.'
            }
        ],
        'atorvastatin': [
            {
                medication: 'Atorvastatin',
                food: 'Grapefruit juice',
                severity: 'severe',
                description: 'Grapefruit can increase statin levels, raising risk of side effects',
                recommendation: 'Avoid grapefruit and grapefruit juice completely while taking statins.'
            }
        ],
        'simvastatin': [
            {
                medication: 'Simvastatin',
                food: 'Grapefruit juice',
                severity: 'severe',
                description: 'Grapefruit can significantly increase simvastatin levels',
                recommendation: 'Avoid grapefruit and grapefruit juice. This interaction is more severe with simvastatin.'
            }
        ],
        'levothyroxine': [
            {
                medication: 'Levothyroxine',
                food: 'Calcium-rich foods (milk, yogurt)',
                severity: 'moderate',
                description: 'Calcium can reduce absorption of thyroid medication',
                recommendation: 'Take levothyroxine on an empty stomach. Wait 4 hours before consuming calcium-rich foods.'
            },
            {
                medication: 'Levothyroxine',
                food: 'Coffee',
                severity: 'minor',
                description: 'Coffee may reduce absorption of levothyroxine',
                recommendation: 'Take medication with water. Wait 30-60 minutes before drinking coffee.'
            }
        ]
    };

    const medLower = medicationName.toLowerCase();

    // Check if medication has known food interactions
    for (const [drug, drugInteractions] of Object.entries(foodInteractionDatabase)) {
        if (medLower.includes(drug.toLowerCase())) {
            interactions.push(...drugInteractions);
        }
    }

    return interactions;
}

/**
 * Check for supplement interactions
 */
export async function checkSupplementInteractions(
    medicationName: string
): Promise<FoodInteraction[]> {
    const interactions: FoodInteraction[] = [];

    const supplementDatabase: Record<string, FoodInteraction[]> = {
        'warfarin': [
            {
                medication: 'Warfarin',
                food: 'Vitamin E supplements',
                severity: 'moderate',
                description: 'Vitamin E can increase bleeding risk',
                recommendation: 'Avoid high-dose vitamin E supplements. Consult your doctor.'
            },
            {
                medication: 'Warfarin',
                food: 'Fish oil / Omega-3',
                severity: 'moderate',
                description: 'Fish oil may increase bleeding risk',
                recommendation: 'Discuss fish oil supplements with your doctor before use.'
            },
            {
                medication: 'Warfarin',
                food: 'St. John\'s Wort',
                severity: 'severe',
                description: 'Can reduce warfarin effectiveness',
                recommendation: 'Do not take St. John\'s Wort with warfarin.'
            }
        ],
        'lisinopril': [
            {
                medication: 'Lisinopril',
                food: 'Potassium supplements',
                severity: 'severe',
                description: 'Can cause dangerous potassium levels',
                recommendation: 'Do not take potassium supplements unless prescribed by your doctor.'
            }
        ],
        'levothyroxine': [
            {
                medication: 'Levothyroxine',
                food: 'Iron supplements',
                severity: 'moderate',
                description: 'Iron can reduce thyroid medication absorption',
                recommendation: 'Take iron supplements at least 4 hours apart from levothyroxine.'
            },
            {
                medication: 'Levothyroxine',
                food: 'Calcium supplements',
                severity: 'moderate',
                description: 'Calcium can interfere with absorption',
                recommendation: 'Separate calcium supplements by 4 hours from thyroid medication.'
            }
        ]
    };

    const medLower = medicationName.toLowerCase();

    for (const [drug, drugInteractions] of Object.entries(supplementDatabase)) {
        if (medLower.includes(drug.toLowerCase())) {
            interactions.push(...drugInteractions);
        }
    }

    return interactions;
}
