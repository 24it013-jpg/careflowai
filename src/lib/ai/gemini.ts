import { callOpenRouter, callOpenRouterVision } from './openrouter';

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

/**
 * Unified AI Caller with Automatic Multi-Model Fallback
 * Sequence: Gemini -> Primary OpenRouter (Nvidia) -> Backup OpenRouter (Qwen)
 */
export async function callAI(
    prompt: string,
    systemPrompt?: string,
    chatHistory: any[] = [],
    options: any = {}
): Promise<string> {
    // 1. Try Gemini first (if not explicitly forced to OpenRouter)
    if (options.provider !== 'openrouter' && import.meta.env.VITE_GEMINI_API_KEY) {
        try {
            console.log("Attempting Gemini...");
            return await callGemini(prompt, systemPrompt, chatHistory, options);
        } catch (error) {
            console.warn("Gemini failed or quota reached, falling back to OpenRouter Primary...", error);
        }
    }

    // 2. Try Primary OpenRouter (Nvidia)
    if (import.meta.env.VITE_OPENROUTER_API_KEY) {
        try {
            console.log("Attempting OpenRouter Primary (Nvidia)...");
            return await callOpenRouter(prompt, systemPrompt, chatHistory, {
                ...options,
                model: import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-nano-30b-a3b:free'
            });
        } catch (error) {
            console.warn("OpenRouter Primary failed, falling back to Backup...", error);
        }

        // 3. Try Backup OpenRouter (Qwen)
        try {
            console.log("Attempting OpenRouter Backup (Qwen)...");
            return await callOpenRouter(prompt, systemPrompt, chatHistory, {
                ...options,
                model: import.meta.env.VITE_OPENROUTER_BACKUP_MODEL || 'qwen/qwen3-next-80b-a3b-instruct:free'
            });
        } catch (error) {
            console.warn("OpenRouter Backup failed, falling back to Tertiary...", error);
        }

        // 4. Try Tertiary OpenRouter (Step-3.5-Flash)
        try {
            console.log("Attempting OpenRouter Tertiary (Step-3.5-Flash)...");
            return await callOpenRouter(prompt, systemPrompt, chatHistory, {
                ...options,
                model: import.meta.env.VITE_OPENROUTER_TERTIARY_MODEL || 'stepfun/step-3.5-flash:free'
            });
        } catch (error) {
            console.error("All AI models failed.", error);
            throw new Error("All AI services are currently unavailable. Please try again later.");
        }
    }

    throw new Error("No AI services are configured. Please check your API keys.");
}

/**
 * Unified Vision Caller with Automatic Multi-Model Fallback
 */
export async function callAIVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: any = {}
): Promise<string> {
    // 1. Try Gemini Vision first
    if (options.provider !== 'openrouter' && import.meta.env.VITE_GEMINI_API_KEY) {
        try {
            console.log("Attempting Gemini Vision...");
            return await callGeminiVision(prompt, base64Image, mimeType, options);
        } catch (error) {
            console.warn("Gemini Vision failed, falling back to OpenRouter...", error);
        }
    }

    // 2. Try OpenRouter Vision (Nvidia or specific model)
    if (import.meta.env.VITE_OPENROUTER_API_KEY) {
        try {
            console.log("Attempting OpenRouter Vision...");
            return await callOpenRouterVision(prompt, base64Image, mimeType, options);
        } catch (error) {
            console.error("All Vision models failed.", error);
            throw new Error("Vision services are currently unavailable. Please try again later.");
        }
    }

    throw new Error("No Vision services are configured.");
}
