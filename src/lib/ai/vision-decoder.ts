/**
 * AI Vision Decoder — uses callAIVision / callAI (OpenRouter vision models, then Gemini).
 */

import { callAIVision, callAI } from './gemini';

function getBase64FromImageUrl(imageUrl: string): { data: string, mimeType: string } | null {
    if (imageUrl.startsWith('data:')) {
        const parts = imageUrl.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        return { data: parts[1], mimeType };
    }
    return null;
}

export interface ImageAnalysisResult {
    id: string;
    imageUrl: string;
    analysis: {
        description: string;
        findings: string[];
        recommendations: string[];
        confidence: number;
    };
    timestamp: Date;
}

export interface TrendAnalysis {
    metric: string;
    trend: 'improving' | 'stable' | 'worsening';
    change: number;
    timeframe: string;
    insights: string[];
}

/**
 * Analyze a single medical image (OpenRouter vision → Gemini).
 */
export async function analyzeImage(
    imageUrl: string,
    _apiKey?: string, // Kept for signature compatibility
    context?: string
): Promise<ImageAnalysisResult> {
    try {
        const imageData = getBase64FromImageUrl(imageUrl);
        if (!imageData) {
            throw new Error('Only data URLs are supported for image analysis currently.');
        }

        const prompt = `Analyze this medical report/image.
        Provide a professional clinical analysis with the following structure:
        1. **Description**: A clear, concise summary of what the image shows.
        2. **Findings**: A list of specific clinical observations or abnormalities.
        3. **Recommendations**: Suggested next steps or follow-up actions.
        4. **Confidence**: A numeric value between 0 and 1 representing the AI's confidence in this analysis.

        Context: ${context || 'General medical screening'}
        
        Important: If this is a lab report or document, extract the key values and explain their significance. If it is an imaging scan (X-ray/MRI), describe the anatomical structures and any deviations from normal.`;

        const content = await callAIVision(prompt, imageData.data, imageData.mimeType);

        // Parse the response into structured data
        const findings: string[] = [];
        const recommendations: string[] = [];
        let description = '';
        let confidence = 0.85;

        // Enhanced parsing for medical structure
        const lines: string[] = content.split('\n').map(l => l.trim()).filter(Boolean);
        let currentSection: 'description' | 'findings' | 'recommendations' | 'none' = 'none';

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Check for section headers
            if (lowerLine.includes('description')) {
                currentSection = 'description';
                continue;
            } else if (lowerLine.includes('finding')) {
                currentSection = 'findings';
                continue;
            } else if (lowerLine.includes('recommendation')) {
                currentSection = 'recommendations';
                continue;
            } else if (lowerLine.includes('confidence')) {
                const match = line.match(/0?\.\d+/);
                if (match) confidence = parseFloat(match[0]);
                continue;
            }

            // Extract content based on section
            const cleanLine = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            if (!cleanLine) continue;

            if (currentSection === 'description' && !description) {
                description = cleanLine;
            } else if (currentSection === 'findings') {
                findings.push(cleanLine);
            } else if (currentSection === 'recommendations') {
                recommendations.push(cleanLine);
            }
        }

        // Fallback if parsing failed
        if (!description) description = content.split('\n')[0].substring(0, 150);
        if (findings.length === 0) findings.push("Detailed analysis completed. See description for insights.");
        if (recommendations.length === 0) recommendations.push("Consult with a specialist for clinical correlation.");

        return {
            id: crypto.randomUUID(),
            imageUrl,
            analysis: {
                description,
                findings,
                recommendations,
                confidence,
            },
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Image analysis error:', error);
        throw error;
    }
}

/**
 * Analyze multiple images and detect trends
 */
export async function analyzeMultipleImages(
    imageUrls: string[],
    apiKey: string,
    context?: string
): Promise<{ results: ImageAnalysisResult[]; trends: TrendAnalysis[] }> {
    // Analyze all images
    const results = await Promise.all(
        imageUrls.map(url => analyzeImage(url, apiKey, context))
    );

    // Detect trends across images
    const trends = detectTrends(results);

    return { results, trends };
}

/**
 * Detect trends across multiple image analyses
 */
function detectTrends(results: ImageAnalysisResult[]): TrendAnalysis[] {
    if (results.length < 2) {
        return [];
    }

    const trends: TrendAnalysis[] = [];

    // Sort by timestamp
    const sortedResults = [...results].sort((a, b) =>
        a.timestamp.getTime() - b.timestamp.getTime()
    );

    // Analyze confidence trend
    const confidences = sortedResults.map(r => r.analysis.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const firstConfidence = confidences[0];
    const lastConfidence = confidences[confidences.length - 1];
    const confidenceChange = ((lastConfidence - firstConfidence) / firstConfidence) * 100;

    trends.push({
        metric: 'Analysis Confidence',
        trend: confidenceChange > 5 ? 'improving' : confidenceChange < -5 ? 'worsening' : 'stable',
        change: confidenceChange,
        timeframe: `${sortedResults.length} images`,
        insights: [
            `Average confidence: ${(avgConfidence * 100).toFixed(1)}%`,
            confidenceChange > 0
                ? 'Image quality or clarity is improving over time'
                : 'Consider higher quality images for better analysis',
        ],
    });

    // Analyze findings frequency
    const allFindings = sortedResults.flatMap(r => r.analysis.findings);
    const findingCounts = new Map<string, number>();

    allFindings.forEach(finding => {
        const normalized = finding.toLowerCase().trim();
        findingCounts.set(normalized, (findingCounts.get(normalized) || 0) + 1);
    });

    // Find recurring findings
    const recurringFindings = Array.from(findingCounts.entries())
        .filter(([_, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    if (recurringFindings.length > 0) {
        trends.push({
            metric: 'Recurring Findings',
            trend: 'stable',
            change: 0,
            timeframe: `${sortedResults.length} images`,
            insights: recurringFindings.map(([finding, count]) =>
                `"${finding}" appears in ${count} images`
            ),
        });
    }

    return trends;
}

/**
 * Compare two images side-by-side
 */
export async function compareImages(
    imageUrl1: string,
    imageUrl2: string,
    _apiKey?: string // Kept for signature compatibility
): Promise<{ comparison: string; differences: string[]; similarities: string[] }> {
    try {
        const imageData1 = getBase64FromImageUrl(imageUrl1);
        const imageData2 = getBase64FromImageUrl(imageUrl2);

        if (!imageData1 || !imageData2) {
            throw new Error('Only data URLs are supported for image comparison currently.');
        }

        const describePrompt =
            'Describe this medical image in detail: visible anatomy or structures, any notable findings, image quality. Be concise but specific.';

        const analysis1 = await callAIVision(describePrompt, imageData1.data, imageData1.mimeType);
        const analysis2 = await callAIVision(describePrompt, imageData2.data, imageData2.mimeType);

        const content = await callAI(
            `Two medical images were analyzed separately.\n\n` +
                `**Image 1 analysis:**\n${analysis1}\n\n**Image 2 analysis:**\n${analysis2}\n\n` +
                `Compare them. Respond with clear sections titled: Comparison, Differences, Similarities. ` +
                `Use bullet points under Differences and Similarities.`,
            undefined,
            [],
            { temperature: 0.35 }
        );

        // Parse response
        const lines: string[] = content.split('\n').filter((line: string) => line.trim());
        const differences: string[] = [];
        const similarities: string[] = [];
        let comparison = '';

        let currentSection = 'comparison';
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('difference')) {
                currentSection = 'differences';
                continue;
            } else if (lowerLine.includes('similar')) {
                currentSection = 'similarities';
                continue;
            } else if (lowerLine.includes('comparison')) {
                currentSection = 'comparison';
                continue;
            }

            if (currentSection === 'comparison' && !comparison) {
                comparison = line.replace(/^\*\*Comparison:\*\*\s*/i, '');
            } else if (currentSection === 'differences') {
                differences.push(line.replace(/^[-•*]\s*/, ''));
            } else if (currentSection === 'similarities') {
                similarities.push(line.replace(/^[-•*]\s*/, ''));
            }
        }

        return {
            comparison: comparison || content.substring(0, 200),
            differences: differences.length > 0 ? differences : ['No significant differences detected'],
            similarities: similarities.length > 0 ? similarities : ['Images appear similar'],
        };
    } catch (error) {
        console.error('Image comparison error:', error);
        throw error;
    }
}
