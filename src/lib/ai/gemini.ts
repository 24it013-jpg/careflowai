/**
 * Google Gemini AI Service
 * Directly interacts with Google's Generative AI API REST endpoint
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

/**
 * Call Gemini API with text prompt
 */
export async function callGemini(
    prompt: string,
    systemPrompt?: string,
    chatHistory: GeminiMessage[] = [],
    options: any = {}
): Promise<string> {
    if (!GEMINI_API_KEY) {
        console.error('VITE_GEMINI_API_KEY is not defined in .env.local');
        throw new Error('AI Service is not configured. Please check your API key.');
    }

    const contents = [...chatHistory];
    contents.push({
        role: 'user',
        parts: [{ text: prompt }]
    });

    const body: any = {
        contents,
        generationConfig: {
            temperature: options.temperature ?? 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: options.max_tokens ?? 4096,
        }
    };

    if (systemPrompt) {
        body.systemInstruction = {
            parts: [{ text: systemPrompt }]
        };
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Gemini API Error:', error);
            throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('Gemini Response Format Error:', data);
            throw new Error('Gemini returned an empty or invalid response');
        }

        return text;
    } catch (error: any) {
        console.error('Gemini Service Error:', error);
        throw error;
    }
}

/**
 * Call Gemini API with image and text (Multimodal)
 */
export async function callGeminiVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: any = {}
): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('AI Service is not configured. Please check your API key.');
    }

    const body = {
        contents: [
            {
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image
                        }
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: options.temperature ?? 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: options.max_tokens ?? 4096,
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini Vision API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('Gemini Vision returned an empty response');
        }

        return text;
    } catch (error: any) {
        console.error('Gemini Vision Service Error:', error);
        throw error;
    }
}
