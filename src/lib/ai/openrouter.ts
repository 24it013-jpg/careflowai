/**
 * OpenRouter AI Service
 * Helper to call AI models via OpenRouter's SDK
 */

import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-nano-30b-a3b:free';
export const BACKUP_MODEL = import.meta.env.VITE_OPENROUTER_BACKUP_MODEL || 'qwen/qwen3-next-80b-a3b-instruct:free';
export const TERTIARY_MODEL = import.meta.env.VITE_OPENROUTER_TERTIARY_MODEL || 'stepfun/step-3.5-flash:free';

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
});

export interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system' | 'model';
    content: string;
}

/**
 * Call OpenRouter API with text prompt
 */
export async function callOpenRouter(
    prompt: string,
    systemPrompt?: string,
    chatHistory: any[] = [],
    options: any = {}
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('VITE_OPENROUTER_API_KEY is not defined in .env.local');
    }

    const messages: any[] = [];
    
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }

    // Adapt chat history to OpenRouter/OpenAI format
    const adaptedHistory = chatHistory.map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content || (Array.isArray(m.parts) ? m.parts[0]?.text : '')
    }));

    messages.push(...adaptedHistory);
    messages.push({ role: 'user', content: prompt });

    try {
        const response: any = await openrouter.chat.send({
            model: options.model || DEFAULT_MODEL,
            messages,
            temperature: options.temperature ?? 0.3,
            max_tokens: options.max_tokens ?? 2048,
        } as any);

        // The OpenRouter SDK returns the choice directly or via choices property
        const text = response.choices?.[0]?.message?.content || response.message?.content || '';
        
        if (!text) {
            throw new Error('OpenRouter returned an empty response');
        }

        return text;
    } catch (error: any) {
        console.error('OpenRouter SDK Error:', error);
        throw error;
    }
}

/**
 * Stream OpenRouter API response
 */
export async function* streamOpenRouter(
    prompt: string,
    systemPrompt?: string,
    chatHistory: any[] = [],
    options: any = {}
) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is missing');
    }

    const messages: any[] = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    
    messages.push(...chatHistory.map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content || (Array.isArray(m.parts) ? m.parts[0]?.text : '')
    })));
    
    messages.push({ role: 'user', content: prompt });

    const stream = await (openrouter.chat.send as any)({
        model: options.model || DEFAULT_MODEL,
        messages,
        stream: true,
        temperature: options.temperature ?? 0.3
    });

    for await (const chunk of stream) {
        const content = (chunk as any).choices?.[0]?.delta?.content;
        if (content) {
            yield content;
        }

        if ((chunk as any).usage) {
            console.log("Usage stats:", (chunk as any).usage);
        }
    }
}

/**
 * Legacy Vision Support - Fallback to fetch for Vision if SDK doesn't support specific parts easily
 */
export async function callOpenRouterVision(
    prompt: string,
    base64Image: string,
    mimeType: string = 'image/jpeg',
    options: any = {}
): Promise<string> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    const body: any = {
        model: options.model || DEFAULT_MODEL,
        messages: [
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
        ],
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
        throw new Error(`OpenRouter Vision error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}
