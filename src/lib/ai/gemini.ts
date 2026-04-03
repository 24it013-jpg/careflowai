import { callOpenRouter, callOpenRouterVision } from './openrouter';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/** Unversioned `gemini-1.5-flash` IDs are often retired; these IDs track current AI Studio offerings. */
const GEMINI_MODEL_CANDIDATES: string[] = [
    ...(import.meta.env.VITE_GEMINI_MODEL
        ? String(import.meta.env.VITE_GEMINI_MODEL).split(',').map((s) => s.trim()).filter(Boolean)
        : []),
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-2.5-flash',
    'gemini-2.5-flash-preview-05-20',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
].filter((m, i, a) => a.indexOf(m) === i);

const GEMINI_API_VERSIONS = ['v1', 'v1beta'] as const;

export interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

function geminiUrl(model: string, version: (typeof GEMINI_API_VERSIONS)[number]): string {
    return `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
}

async function geminiGenerateOnce(
    model: string,
    version: (typeof GEMINI_API_VERSIONS)[number],
    body: object
): Promise<string> {
    const response = await fetch(geminiUrl(model, version), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        let msg = response.statusText;
        try {
            const err = await response.json();
            msg = err?.error?.message || msg;
        } catch {
            /* ignore */
        }
        throw new Error(msg);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        console.error('Gemini Response Format Error:', data);
        throw new Error('Gemini returned an empty or invalid response');
    }

    return text;
}

/**
 * Try model × API version until one succeeds (handles retired aliases and v1/v1beta differences).
 */
async function geminiGenerate(body: object): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('AI Service is not configured. Please check your API key.');
    }

    const failures: string[] = [];
    for (const model of GEMINI_MODEL_CANDIDATES) {
        for (const version of GEMINI_API_VERSIONS) {
            try {
                return await geminiGenerateOnce(model, version, body);
            } catch (e) {
                failures.push(`${version}/${model}: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    }
    throw new Error(
        `Gemini: no working model. Tried: ${GEMINI_MODEL_CANDIDATES.join(', ')}. Details: ${failures.slice(0, 4).join(' | ')}. Set VITE_GEMINI_MODEL in .env (see Google AI Studio models list).`
    );
}

/**
 * Call Gemini API with text prompt
 */
export async function callGemini(
    prompt: string,
    systemPrompt?: string,
    chatHistory: GeminiMessage[] = [],
    options: Record<string, unknown> = {}
): Promise<string> {
    const contents = [...chatHistory];
    contents.push({
        role: 'user',
        parts: [{ text: prompt }],
    });

    const body: Record<string, unknown> = {
        contents,
        generationConfig: {
            temperature: (options.temperature as number) ?? 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: (options.max_tokens as number) ?? 4096,
        },
    };

    if (systemPrompt) {
        body.systemInstruction = {
            parts: [{ text: systemPrompt }],
        };
    }

    try {
        return await geminiGenerate(body);
    } catch (error: unknown) {
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
    options: Record<string, unknown> = {}
): Promise<string> {
    const body = {
        contents: [
            {
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType,
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: (options.temperature as number) ?? 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: (options.max_tokens as number) ?? 4096,
        },
    };

    try {
        return await geminiGenerate(body);
    } catch (error: unknown) {
        console.error('Gemini Vision Service Error:', error);
        throw error;
    }
}

async function tryOpenRouterTextChain(
    prompt: string,
    systemPrompt: string | undefined,
    chatHistory: unknown[],
    options: Record<string, unknown>
): Promise<string> {
    if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
        throw new Error('OpenRouter is not configured.');
    }

    try {
        console.log('Attempting OpenRouter Primary (Nvidia)...');
        return await callOpenRouter(prompt, systemPrompt, chatHistory, {
            ...options,
            model: import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-nano-30b-a3b:free',
        });
    } catch (error) {
        console.warn('OpenRouter Primary failed, falling back to Backup...', error);
    }

    try {
        console.log('Attempting OpenRouter Backup (Qwen)...');
        return await callOpenRouter(prompt, systemPrompt, chatHistory, {
            ...options,
            model: import.meta.env.VITE_OPENROUTER_BACKUP_MODEL || 'qwen/qwen3-next-80b-a3b-instruct:free',
        });
    } catch (error) {
        console.warn('OpenRouter Backup failed, falling back to Tertiary...', error);
    }

    console.log('Attempting OpenRouter Tertiary (Step-3.5-Flash)...');
    return await callOpenRouter(prompt, systemPrompt, chatHistory, {
        ...options,
        model: import.meta.env.VITE_OPENROUTER_TERTIARY_MODEL || 'stepfun/step-3.5-flash:free',
    });
}

/**
 * Unified text AI: OpenRouter Primary → Backup → Tertiary, then Gemini (unless `provider` pins one stack).
 * - `provider: 'gemini'` — Gemini only.
 * - `provider: 'openrouter'` — OpenRouter three-tier only (no Gemini fallback).
 */
export async function callAI(
    prompt: string,
    systemPrompt?: string,
    chatHistory: unknown[] = [],
    options: Record<string, unknown> = {}
): Promise<string> {
    if (options.provider === 'gemini') {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error('Gemini requested but VITE_GEMINI_API_KEY is not set.');
        }
        console.log('Attempting Gemini (provider=gemini)...');
        return await callGemini(prompt, systemPrompt, chatHistory as GeminiMessage[], options);
    }

    if (import.meta.env.VITE_OPENROUTER_API_KEY && options.provider !== 'gemini') {
        try {
            return await tryOpenRouterTextChain(prompt, systemPrompt, chatHistory, options);
        } catch (error) {
            if (options.provider === 'openrouter') {
                console.error('OpenRouter chain failed (openrouter-only mode).', error);
                throw new Error('All OpenRouter text models failed. Please try again later.');
            }
            console.warn('OpenRouter chain failed, falling back to Gemini...', error);
        }
    }

    if (import.meta.env.VITE_GEMINI_API_KEY && options.provider !== 'openrouter') {
        try {
            console.log('Attempting Gemini...');
            return await callGemini(prompt, systemPrompt, chatHistory as GeminiMessage[], options);
        } catch (error) {
            console.error('Gemini failed.', error);
        }
    }

    throw new Error('All AI services are currently unavailable. Please check your API keys.');
}

/**
 * Vision: OpenRouter vision-capable models first (not the text-only Nemotron/Qwen defaults),
 * then Gemini. `provider: 'gemini'` skips OpenRouter; `provider: 'openrouter'` skips Gemini.
 */
export async function callAIVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: Record<string, unknown> = {}
): Promise<string> {
    if (options.provider === 'gemini') {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error('Gemini vision requested but VITE_GEMINI_API_KEY is not set.');
        }
        console.log('Attempting Gemini Vision (provider=gemini)...');
        return await callGeminiVision(prompt, base64Image, mimeType, options);
    }

    if (import.meta.env.VITE_OPENROUTER_API_KEY && options.provider !== 'gemini') {
        try {
            console.log('Attempting OpenRouter Vision...');
            return await callOpenRouterVision(prompt, base64Image, mimeType, options);
        } catch (error) {
            if (options.provider === 'openrouter') {
                throw new Error(
                    error instanceof Error ? error.message : 'OpenRouter vision failed.'
                );
            }
            console.warn('OpenRouter Vision failed, falling back to Gemini...', error);
        }
    }

    if (import.meta.env.VITE_GEMINI_API_KEY && options.provider !== 'openrouter') {
        try {
            console.log('Attempting Gemini Vision...');
            return await callGeminiVision(prompt, base64Image, mimeType, options);
        } catch (error) {
            console.error('Gemini Vision failed.', error);
            throw new Error(
                error instanceof Error ? error.message : 'Vision services are currently unavailable.'
            );
        }
    }

    throw new Error('No Vision services are configured.');
}
