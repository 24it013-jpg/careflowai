import { callGemini } from './gemini';

export interface SpecialistSuggestion {
    type: 'MBBS' | 'BHMS' | 'Orthopedic' | 'Cardiologist' | 'Neurologist' | 'Dermatologist' | 'General Physician' | 'Other';
    reason: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
}

export interface AIAnalysis {
    symptoms: string;
    possibleConditions: string[];
    suggestedSpecialists: SpecialistSuggestion[];
}

const SYSTEM_PROMPT = `You are a medical triage assistant. Analyze user symptoms and suggest:
1. Potential conditions (disclaimer: not a diagnosis).
2. The type of doctor they should see (MBBS, BHMS, Orthopedic, Cardiologist, etc.).
3. Urgency level.

Output MUST be valid JSON:
{
  "possibleConditions": ["condition 1", "condition 2"],
  "suggestedSpecialists": [
    { "type": "Specialty Name", "reason": "Why this specialty", "urgency": "low/medium/high/emergency" }
  ]
}`;

export async function analyzeSymptomsForSpecialist(symptoms: string): Promise<AIAnalysis> {
    try {
        const response = await callGemini(
            `Analyze these symptoms: ${symptoms}`,
            SYSTEM_PROMPT
        );
        
        // Clean the response if it contains markdown code blocks
        const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);

        return {
            symptoms,
            possibleConditions: parsed.possibleConditions || [],
            suggestedSpecialists: parsed.suggestedSpecialists || []
        };
    } catch (error) {
        console.error('AI Specialist Analysis Error:', error);
        // Fallback for demo/error purposes
        return {
            symptoms,
            possibleConditions: ["Unable to analyze at this time"],
            suggestedSpecialists: [{ type: "General Physician", reason: "Consult a primary care doctor for evaluation.", urgency: "medium" }]
        };
    }
}
