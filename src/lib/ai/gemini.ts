/**
 * Gemini AI Service
 * Helper to call Google's Gemini models via fetch
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const DEFAULT_MODEL = 'gemini-1.5-flash';

export interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text?: string;
            }[];
        };
        finishReason: string;
    }[];
}

export interface CallGeminiOptions {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: 'application/json' | 'text/plain';
}

export interface GeminiContent {
    role: 'user' | 'model' | 'system';
    parts: { text: string }[];
}

/**
 * Call Gemini API with text prompt
 */
export async function callGemini(
    prompt: string,
    systemPrompt?: string,
    chatHistory: GeminiContent[] = [],
    options: CallGeminiOptions = {}
): Promise<string> {
    const model = options.model || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const contents: any[] = [
        ...chatHistory.map(item => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: item.parts
        })),
        {
            role: 'user',
            parts: [{ text: prompt }]
        }
    ];

    const body: any = {
        contents,
        generationConfig: {
            temperature: options.temperature ?? 0.3,
            maxOutputTokens: options.maxOutputTokens ?? 2048,
        }
    };

    if (systemPrompt) {
        body.system_instruction = {
            parts: [{ text: systemPrompt }]
        };
    }

    if (options.responseMimeType === 'application/json') {
        body.generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', error);
        throw new Error(`Gemini API error: ${error.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
        throw new Error('Gemini returned an empty response');
    }

    return text;
}

/**
 * Call Gemini API with image and text
 */
export async function callGeminiVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: CallGeminiOptions = {}
): Promise<string> {
    const model = options.model || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const body: any = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image
                    }
                }
            ]
        }],
        generationConfig: {
            temperature: options.temperature ?? 0.3,
            maxOutputTokens: options.maxOutputTokens ?? 2048,
        }
    };

    if (options.responseMimeType === 'application/json') {
        body.generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Gemini Vision API Error:', error);
        throw new Error(`Gemini Vision API error: ${error.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;

    if (!text) {
        throw new Error('Gemini Vision returned an empty response');
    }

    return text;
}
