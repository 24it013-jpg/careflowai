import { ProcessedDocument } from '../ai/document-processor';

export interface FHIRResource {
    resourceType: string;
    id: string;
    status: string;
    type?: {
        text: string;
    };
    subject?: {
        display: string;
    };
    date?: string;
    author?: Array<{
        display: string;
    }>;
    description?: string;
    content: Array<{
        attachment: {
            contentType: string;
            title: string;
        };
    }>;
}

export function mapToFHIRDocumentReference(doc: ProcessedDocument): FHIRResource {
    return {
        resourceType: "DocumentReference",
        id: doc.id,
        status: "current",
        type: {
            text: doc.type.toUpperCase()
        },
        subject: doc.patientName ? {
            display: doc.patientName
        } : undefined,
        date: doc.date,
        author: doc.provider ? [{
            display: doc.provider
        }] : undefined,
        description: doc.summary,
        content: [
            {
                attachment: {
                    contentType: "application/pdf", // Default assumption
                    title: doc.name
                }
            }
        ]
    };
}

export function exportToJSON(resource: FHIRResource): string {
    return JSON.stringify(resource, null, 2);
}
