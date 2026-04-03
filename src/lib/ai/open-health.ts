import { callAI } from './gemini';

export interface OpenHealthConditionOption {
    id: string;
    label: string;
    /** Shown as placeholder for “focus / subtype” */
    focusPlaceholder: string;
}

/** Topics aligned with OpenHealth’s multi-disease scope (education only — no trained models in-browser). */
export const OPEN_HEALTH_CONDITIONS: OpenHealthConditionOption[] = [
    { id: 'heart', label: 'Heart & cardiovascular disease', focusPlaceholder: 'e.g. high blood pressure, post-MI recovery' },
    { id: 'diabetes', label: 'Diabetes mellitus', focusPlaceholder: 'e.g. type 2, newly diagnosed, gestational' },
    { id: 'breast', label: 'Breast cancer (awareness & survivorship)', focusPlaceholder: 'e.g. during chemo, hormone therapy' },
    { id: 'parkinson', label: "Parkinson's disease", focusPlaceholder: 'e.g. early motor symptoms, medications' },
    { id: 'brain', label: 'Brain tumor (educational overview)', focusPlaceholder: 'e.g. glioma, meningioma, pituitary — general info only' },
    { id: 'kidney', label: 'Kidney disease (CKD)', focusPlaceholder: 'e.g. stage 3, dialysis, post-transplant' },
    { id: 'liver', label: 'Liver disease', focusPlaceholder: 'e.g. NAFLD, hepatitis C, cirrhosis' },
    { id: 'lung', label: 'Lung disease', focusPlaceholder: 'e.g. COPD, asthma, pulmonary fibrosis' },
];

const EDU_SYSTEM = `You are a careful medical education assistant for patients and caregivers.
Rules:
- Provide general, evidence-informed education — NOT a personal diagnosis or treatment plan.
- Use clear Markdown with the headings requested.
- Encourage follow-up with qualified clinicians for decisions.
- If imaging or emergencies are mentioned, tell the user to seek in-person or emergency care when appropriate.`;

/**
 * Mirrors OpenHealth’s `/food/<disease>/<tumor_type>` style LLM output: overview, symptoms, treatments, diet.
 */
export async function generateConditionGuide(
    conditionLabel: string,
    focusOrSubtype: string,
    userNotes?: string
): Promise<string> {
    const prompt = `Topic: ${conditionLabel}
Specific angle, subtype, or stage (if any): ${focusOrSubtype || 'General overview'}
Notes from the user (optional, may be empty): ${userNotes?.trim() || 'None'}

Write Markdown with these sections (use ### headings exactly):
### Overview
### Common symptoms (population-level; not about this specific user)
### How care is usually approached (high level; tests and meds are examples only)
### Foods often emphasized or encouraged
### Foods often limited or avoided (general patterns; respect allergies and prescriptions)
### Red flags — when to seek urgent or emergency care
### Practical next steps before a clinic visit

Keep each section concise but useful. No invented statistics; say "varies by person" when needed.`;

    return callAI(prompt, EDU_SYSTEM, [], { temperature: 0.35 });
}

export async function summarizeHeartCheckIn(
    fields: Record<string, string>,
    vitalsLine: string
): Promise<string> {
    const prompt = `The user completed a heart-health questionnaire (values are self-reported; not verified).

**Vitals snapshot from their CAREflow dashboard:** ${vitalsLine}

**Questionnaire (typical heart-risk style fields, raw values):**
${Object.entries(fields)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}

In Markdown:
1. Briefly restate what numbers might suggest in **general educational** terms (no diagnosis).
2. List 3–5 topics they could discuss with a clinician or cardio team.
3. List lifestyle themes (movement, sleep, stress, sodium, smoking) without prescribing.
4. Clear disclaimer: this is not medical advice.

Keep tone calm and actionable.`;

    return callAI(prompt, EDU_SYSTEM, [], { temperature: 0.3 });
}

export async function summarizeDiabetesCheckIn(
    fields: Record<string, string>,
    vitalsLine: string
): Promise<string> {
    const prompt = `The user entered diabetes-related questionnaire values (self-reported).

**Vitals / context:** ${vitalsLine}

**Fields:**
${Object.entries(fields)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}

Respond in Markdown:
- Educational interpretation only (no "you have diabetes" unless explaining what clinicians look at generally).
- Typical follow-up tests or discussions (A1c, eye/foot checks, meds — as general themes).
- Nutrition patterns often discussed (carb consistency, fiber, sugary drinks) — not a meal plan.
- When to seek urgent care (e.g. very high sugars with symptoms).
- Disclaimer that this tool does not replace a clinician.`;

    return callAI(prompt, EDU_SYSTEM, [], { temperature: 0.3 });
}
