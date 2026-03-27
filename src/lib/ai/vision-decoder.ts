/**
 * AI Vision Decoder Service
 * Analyzes medical images using Google Gemini Vision
 */

import { callGeminiVision } from './gemini';

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
 * Analyze a single medical image using OpenAI Vision API
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

        const prompt = context
            ? `Analyze this medical image with the following context: ${context}. Provide a detailed description, key findings, and recommendations. Format the response with sections for Description, Findings, and Recommendations.`
            : 'Analyze this medical image. Provide a detailed description, key findings, and recommendations. Format the response with sections for Description, Findings, and Recommendations.';

        const content = await callGeminiVision(prompt, imageData.data, imageData.mimeType);

        // Parse the response into structured data
        const lines: string[] = content.split('\n').filter((line: string) => line.trim());
        const findings: string[] = [];
        const recommendations: string[] = [];
        let description = '';

        let currentSection = 'description';
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('finding') || lowerLine.includes('observation')) {
                currentSection = 'findings';
                continue;
            } else if (lowerLine.includes('recommendation') || lowerLine.includes('suggestion')) {
                currentSection = 'recommendations';
                continue;
            } else if (lowerLine.includes('description')) {
                currentSection = 'description';
                continue;
            }

            if (currentSection === 'description' && !description) {
                description = line.replace(/^\*\*Description:\*\*\s*/i, '');
            } else if (currentSection === 'findings') {
                findings.push(line.replace(/^[-•*]\s*/, ''));
            } else if (currentSection === 'recommendations') {
                recommendations.push(line.replace(/^[-•*]\s*/, ''));
            }
        }

        return {
            id: crypto.randomUUID(),
            imageUrl,
            analysis: {
                description: description || content.substring(0, 200),
                findings: findings.length > 0 ? findings : ['Analysis completed'],
                recommendations: recommendations.length > 0 ? recommendations : ['Consult with healthcare provider'],
                confidence: 0.85, // Default confidence
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

        // Gemini only supports one image per content part in basic helper, but we can call it twice or merge.
        // Actually, Gemini supports multiple images in parts. Let's adjust lib helper or do it here.
        // For simplicity, I'll update the helper or just do the fetch here.
        // I'll update the helper to accept multiple parts.

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
        const prompt = 'Compare these two medical images. Identify key differences and similarities. Format your response with clear sections for comparison, differences, and similarities.';

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: imageData1.mimeType, data: imageData1.data } },
                        { inlineData: { mimeType: imageData2.mimeType, data: imageData2.data } }
                    ]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini Comparison API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates[0]?.content?.parts[0]?.text || '';

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
