/**
 * OpenRouter AI Service
 * Helper to call AI models via OpenRouter's OpenAI-compatible API
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const DEFAULT_MODEL = 'openrouter/free'; // Uses the free models router for automatic selection

export interface OpenRouterResponse {
    id: string;
    choices: {
        message: {
            content: string;
            role: string;
        };
        finish_reason: string;
    }[];
}

export interface CallOpenRouterOptions {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' | 'text' };
}

export interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string | (OpenRouterContentPart[]);
}

export interface OpenRouterContentPart {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
        url: string;
    };
}

/**
 * Call OpenRouter API with text prompt
 */
export async function callOpenRouter(
    prompt: string,
    systemPrompt?: string,
    chatHistory: OpenRouterMessage[] = [],
    options: CallOpenRouterOptions = {}
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        console.error('VITE_OPENROUTER_API_KEY is not defined in .env.local');
        throw new Error('AI Service is not configured. Please check your API key.');
    }

    const model = options.model || DEFAULT_MODEL;
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const messages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push(...chatHistory);
    messages.push({ role: 'user', content: prompt });

    const body: any = {
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 2048,
    };

    if (options.response_format) {
        body.response_format = options.response_format;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'CAREflow Ai',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        console.error('OpenRouter API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            error: error
        });
        throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    const text = data.choices[0]?.message?.content;

    if (!text) {
        throw new Error('OpenRouter returned an empty response');
    }

    return text;
}

/**
 * Call OpenRouter API with image and text (Multimodal)
 */
export async function callOpenRouterVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: CallOpenRouterOptions = {}
): Promise<string> {
    const model = options.model || DEFAULT_MODEL;
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const messages: OpenRouterMessage[] = [
        {
            role: 'user',
            content: [
                { type: 'text', text: prompt },
                {
                    type: 'image_url',
                    image_url: {
                        url: `data:${mimeType};base64,${base64Image}`
                    }
                }
            ]
        }
    ];

    const body: any = {
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 2048,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'CAREflow Ai',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('OpenRouter Vision API Error:', error);
        throw new Error(`OpenRouter Vision API error: ${error.error?.message || response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    const text = data.choices[0]?.message?.content;

    if (!text) {
        throw new Error('OpenRouter Vision returned an empty response');
    }

    return text;
}
