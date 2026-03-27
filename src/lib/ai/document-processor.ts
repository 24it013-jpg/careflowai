export interface ProcessedDocument {
    id: string;
    name: string;
    type: 'labs' | 'imaging' | 'prescriptions' | 'genetic' | 'other';
    date: string;
    patientName?: string;
    provider?: string;
    summary: string;
    extractedText: string;
    fhirResource?: any;
}

import { callAIVision } from './gemini';

export async function processDocument(file: File): Promise<ProcessedDocument> {
    const base64 = await fileToBase64(file);

    try {
        const prompt = `You are a medical document analyzer. Analyze the provided document (image or text) and return a JSON object with the following fields:
          - type: one of ['labs', 'imaging', 'prescriptions', 'genetic', 'other']
          - date: ISO date string of document
          - patientName: Name of patient if found
          - provider: Healthcare provider/facility name
          - summary: 2-3 sentence summary of the document purpose and key findings
          - extractedText: Full text extraction (OCR)
          
          Return ONLY the JSON object.`;

        const jsonString = await callAIVision(prompt, base64);
        const analysis = JSON.parse(jsonString);

        return {
            id: crypto.randomUUID(),
            name: file.name,
            ...analysis
        };
    } catch (error) {
        console.error('Error processing document:', error);
        throw new Error('Failed to analyze medical document');
    }
}

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
}
