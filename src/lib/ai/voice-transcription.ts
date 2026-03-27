/**
 * Voice Transcription Service
 * Handles Web Speech API and Gemini AI integration
 */

import { callAI } from './gemini';

export interface TranscriptionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
}

export interface TranscriptionResult {
    text: string;
    confidence: number;
    isFinal: boolean;
    timestamp: Date;
}

export class VoiceTranscriptionService {
    private recognition: any;
    private isSupported: boolean;
    private onResultCallback?: (result: TranscriptionResult) => void;
    private onErrorCallback?: (error: string) => void;

    constructor() {
        // Check for Web Speech API support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.isSupported = !!SpeechRecognition;

        if (this.isSupported) {
            this.recognition = new SpeechRecognition();
        }
    }

    /**
     * Check if voice transcription is supported
     */
    isAvailable(): boolean {
        return this.isSupported;
    }

    /**
     * Start voice transcription
     */
    start(options: TranscriptionOptions = {}): void {
        if (!this.isSupported) {
            this.onErrorCallback?.('Speech recognition is not supported in this browser');
            return;
        }

        // Configure recognition
        this.recognition.continuous = options.continuous ?? true;
        this.recognition.interimResults = options.interimResults ?? true;
        this.recognition.lang = options.language ?? 'en-US';

        // Set up event handlers
        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const result = event.results[last];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            const isFinal = result.isFinal;

            this.onResultCallback?.({
                text: transcript,
                confidence,
                isFinal,
                timestamp: new Date(),
            });
        };

        this.recognition.onerror = (event: any) => {
            this.onErrorCallback?.(event.error);
        };

        this.recognition.onend = () => {
            // Auto-restart if continuous mode
            if (options.continuous) {
                this.recognition.start();
            }
        };

        // Start recognition
        try {
            this.recognition.start();
        } catch (error) {
            this.onErrorCallback?.('Failed to start speech recognition');
        }
    }

    /**
     * Stop voice transcription
     */
    stop(): void {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    /**
     * Set callback for transcription results
     */
    onResult(callback: (result: TranscriptionResult) => void): void {
        this.onResultCallback = callback;
    }

    /**
     * Set callback for errors
     */
    onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback;
    }
}

/**
 * Medical terminology autocomplete
 */
export const MEDICAL_TERMS = [
    // Symptoms
    'headache', 'migraine', 'nausea', 'vomiting', 'dizziness', 'fatigue', 'fever',
    'cough', 'dyspnea', 'chest pain', 'abdominal pain', 'diarrhea', 'constipation',

    // Vital signs
    'blood pressure', 'heart rate', 'respiratory rate', 'temperature', 'oxygen saturation',
    'pulse', 'systolic', 'diastolic',

    // Physical exam
    'auscultation', 'palpation', 'percussion', 'inspection', 'neurological exam',
    'cardiovascular exam', 'respiratory exam', 'abdominal exam',

    // Diagnoses
    'hypertension', 'diabetes', 'asthma', 'COPD', 'pneumonia', 'bronchitis',
    'gastroenteritis', 'urinary tract infection', 'cellulitis', 'anxiety', 'depression',

    // Medications
    'ibuprofen', 'acetaminophen', 'amoxicillin', 'lisinopril', 'metformin',
    'albuterol', 'omeprazole', 'atorvastatin', 'levothyroxine', 'amlodipine',

    // Medical abbreviations
    'PRN', 'BID', 'TID', 'QID', 'PO', 'IV', 'IM', 'SC', 'NPO', 'STAT',
];

/**
 * Get medical term suggestions
 */
export function getMedicalTermSuggestions(input: string, limit: number = 5): string[] {
    const lowerInput = input.toLowerCase();
    return MEDICAL_TERMS
        .filter(term => term.toLowerCase().includes(lowerInput))
        .slice(0, limit);
}

/**
 * Structure notes using OpenAI
 */
export interface SOAPNotes {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export async function structureNotesWithAI(transcript: string, _apiKey?: string): Promise<SOAPNotes> {
    try {
        const prompt = `You are a medical scribe assistant. Convert the following clinical conversation into structured SOAP notes (Subjective, Objective, Assessment, Plan). Be concise and use medical terminology appropriately. Format each section clearly with headers. Return only the structured text.`;

        const content = await callAI(`${prompt}\n\nTranscript:\n${transcript}`, undefined, [], {
            temperature: 0.3
        });

        // Parse SOAP sections from response
        const sections = {
            subjective: '',
            objective: '',
            assessment: '',
            plan: '',
        };

        const lines = content.split('\n');
        let currentSection = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.toLowerCase().startsWith('subjective:')) {
                currentSection = 'subjective';
                sections.subjective = trimmed.replace(/^subjective:/i, '').trim();
            } else if (trimmed.toLowerCase().startsWith('objective:')) {
                currentSection = 'objective';
                sections.objective = trimmed.replace(/^objective:/i, '').trim();
            } else if (trimmed.toLowerCase().startsWith('assessment:')) {
                currentSection = 'assessment';
                sections.assessment = trimmed.replace(/^assessment:/i, '').trim();
            } else if (trimmed.toLowerCase().startsWith('plan:')) {
                currentSection = 'plan';
                sections.plan = trimmed.replace(/^plan:/i, '').trim();
            } else if (trimmed && currentSection) {
                sections[currentSection as keyof SOAPNotes] += ' ' + trimmed;
            }
        }

        return sections;
    } catch (error) {
        console.error('Error structuring notes:', error);
        throw error;
    }
}

/**
 * Export notes to different formats
 */
export function exportToSOAPFormat(notes: SOAPNotes): string {
    return `SOAP NOTES
================

SUBJECTIVE:
${notes.subjective}

OBJECTIVE:
${notes.objective}

ASSESSMENT:
${notes.assessment}

PLAN:
${notes.plan}

Generated: ${new Date().toLocaleString()}
`;
}

export function exportToJSON(notes: SOAPNotes): string {
    return JSON.stringify({
        ...notes,
        timestamp: new Date().toISOString(),
    }, null, 2);
}
