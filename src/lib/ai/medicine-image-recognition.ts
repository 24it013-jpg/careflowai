import { callAI, callAIVision } from './gemini';

/** Mirrors the reference “medicine recognition” app: vision description + medical relevance gate. */
const VISION_PROMPT = `You support medication safety and health literacy. Analyze ONLY what is visible in the image.

Respond in clear Markdown with these sections:

### What is visible
Identify objects (e.g. medicine box, blister pack, prescription label, loose pills/capsules, OTC bottle, medical device, or clinical image type if obvious).

### Text and labeling
Transcribe readable text: brand or generic names, strength (mg/mL), dosing instructions, warnings — only if actually legible. If blurred, say so.

### Interpretation (non-diagnostic)
Brief, cautious notes about what this might represent in plain language. Do NOT diagnose. If the image is not medicine-related, say that clearly.

### Limitations
Note blur, glare, crop, or anything that limits certainty.

Rules: Never invent names or doses not visible. If unsure, say you cannot tell. Educational only — not a substitute for a pharmacist or clinician.`;

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const comma = dataUrl.indexOf(',');
            resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
        };
        reader.onerror = () => reject(new Error('Could not read the image file.'));
        reader.readAsDataURL(file);
    });
}

function parseYesNo(text: string): boolean | null {
    const t = text.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (t.startsWith('yes') || t === 'y') return true;
    if (t.startsWith('no') || t === 'n') return false;
    return null;
}

export type MedicineImageRecognitionResult =
    | { success: true; analysis: string }
    | { success: false; code: 'not_medical' | 'invalid_file' | 'error'; message: string };

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Upload an image; run vision + lightweight text validation (same stack as the rest of the app).
 */
export async function recognizeMedicineOrMedicalImage(file: File): Promise<MedicineImageRecognitionResult> {
    if (!file.type.startsWith('image/')) {
        return {
            success: false,
            code: 'invalid_file',
            message: 'Please choose an image (JPEG, PNG, or WebP).',
        };
    }
    if (file.size > MAX_BYTES) {
        return {
            success: false,
            code: 'invalid_file',
            message: 'Image must be 8 MB or smaller.',
        };
    }

    const mime = file.type || 'image/jpeg';
    let base64: string;
    try {
        base64 = await fileToBase64(file);
    } catch {
        return { success: false, code: 'error', message: 'Could not read the image.' };
    }

    let analysis: string;
    try {
        analysis = await callAIVision(VISION_PROMPT, base64, mime, { temperature: 0.35 });
    } catch (e) {
        return {
            success: false,
            code: 'error',
            message: e instanceof Error ? e.message : 'Vision analysis failed. Check your API keys and try again.',
        };
    }

    const clipped = analysis.length > 14000 ? `${analysis.slice(0, 14000)}\n…` : analysis;

    try {
        const verdict = await callAI(
            `Here is an AI description of an uploaded image. Is this description primarily about **medicines, pharmacy products, prescription/OTC labels, pills or capsules, drug packaging**, or **clinical/medical diagnostic imagery** (X-ray, wound care, etc.)?\n\nReply with exactly one word: Yes or No.\n\n---\n${clipped}`,
            'Answer only Yes or No. No other words.',
            [],
            { temperature: 0 }
        );
        const yn = parseYesNo(verdict);
        if (yn === false) {
            return {
                success: false,
                code: 'not_medical',
                message:
                    'This does not look medicine- or medical-image-related. Upload a clearer photo of a prescription, label, medicine box, pills, or a medical image.',
            };
        }
    } catch {
        /* If gating fails, still return analysis — better UX than blocking */
    }

    return { success: true, analysis };
}
