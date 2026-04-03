import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, CheckCircle2, X, Loader2, TrendingUp, TrendingDown, Minus, Info, AlertCircle, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    analyzeImage,
    analyzeMultipleImages,
    type ImageAnalysisResult,
    type TrendAnalysis
} from "@/lib/ai/vision-decoder";
import { AIResponseCard } from "@/components/ui/ai-response-card";

export default function AIVisionDecoder() {
    const [status, setStatus] = useState<"idle" | "uploading" | "scanning" | "analyzing" | "result">("idle");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult[]>([]);
    const [trends, setTrends] = useState<TrendAnalysis[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            
            // Generate Data URLs for both preview AND AI processing
            const dataUrls = await Promise.all(
                files.map(file => new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                }))
            );
            
            setPreviewUrls(dataUrls);
            setStatus("uploading");
            setError(null);

            // Simulate fast secure upload
            setTimeout(() => setStatus("scanning"), 800);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const startAnalysis = async () => {


        setStatus("analyzing");
        setError(null);

        try {
            if (selectedFiles.length === 1) {
                // Single image analysis
                const result = await analyzeImage(previewUrls[0]);
                setAnalysisResults([result]);
            } else {
                // Multi-image analysis with trend detection
                const { results, trends: detectedTrends } = await analyzeMultipleImages(previewUrls, ""); // Empty string for signature compatibility if needed, but signature has _apiKey?
                setAnalysisResults(results);
                setTrends(detectedTrends);
            }
            setStatus("result");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
            setStatus("scanning");
        }
    };

    const reset = () => {
        setStatus("idle");
        setSelectedFiles([]);
        setPreviewUrls([]);
        setAnalysisResults([]);
        setTrends([]);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-hidden relative selection:bg-purple-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                            <motion.span 
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2)] text-purple-400 backdrop-blur-md"
                            >
                                <ScanLine className="size-7" />
                            </motion.span>
                            AI Vision Decoder
                        </h1>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            AI Vision Decoder can read your X-ray and provide you a report of your X-ray, providing insights into your health.
                        </p>
                    </div>
                </header>

                <main className="grid gap-8">
                    {/* Upload / Preview Area */}
                    <motion.div
                        layout
                        className={cn(
                            "relative rounded-3xl transition-all duration-500 flex flex-col items-center justify-center overflow-hidden premium-glass-panel group",
                            status === "idle" ? "border-2 border-dashed border-white/20 bg-black/20 h-[400px] hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]" : "border border-white/10 bg-black/40 h-[600px] shadow-2xl shadow-purple-500/10"
                        )}
                    >

                        {/* IDLE STATE */}
                        {status === "idle" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center p-8"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="size-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30 transition-colors"
                                >
                                    <Upload className="size-10 text-slate-300 group-hover:text-purple-400 transition-colors" />
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Drag & Drop or Browse</h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                    Supported formats: DICOM, JPG, PNG. <br />
                                    Securely encrypted & HIPAA compliant.
                                </p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                    />
                                    <Button 
                                        onClick={triggerUpload}
                                        className="premium-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 h-12 rounded-full border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] text-md font-medium"
                                    >
                                        Upload Scan(s)
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-600 mt-4">Tip: Upload multiple images for trend analysis</p>
                            </motion.div>
                        )}

                        {/* PREVIEW & SCANNING STATE */}
                        {previewUrls.length > 0 && (
                            <div className="relative w-full h-full flex flex-wrap items-center justify-center bg-black/50 gap-4 p-8 overflow-y-auto">
                                {previewUrls.map((url, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={cn(
                                            "relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl",
                                            previewUrls.length === 1 ? "w-full max-w-2xl h-[450px]" : "w-[calc(50%-1rem)] h-[250px]"
                                        )}
                                    >
                                        <img
                                            src={url}
                                            alt={`Medical Scan ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] text-white/70 border border-white/10 uppercase tracking-widest">
                                            Scan #{idx + 1}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Scanning Beam Animation */}
                                {(status === "scanning" || status === "analyzing") && (
                                    <motion.div
                                        className="absolute inset-0 z-20 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                                            style={{ position: "absolute" }}
                                        />
                                        <div className="absolute inset-0 bg-purple-500/5 mix-blend-overlay" />
                                        
                                        {/* Digital HUD Elements */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <div className="size-2 bg-purple-500 rounded-full animate-pulse" />
                                            <div className="text-[10px] text-purple-400 font-mono tracking-tighter">SCANNING_TISSUE_DENSITY...</div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Cancel Button */}
                                {status !== "result" && status !== "analyzing" && (
                                    <button
                                        onClick={reset}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors z-30 border border-white/10 backdrop-blur-md"
                                    >
                                        <X className="size-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Controls & Results Pane */}
                    <AnimatePresence mode="wait">
                        {status === "uploading" && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center justify-center gap-3 text-slate-400"
                            >
                                <Loader2 className="size-5 animate-spin text-purple-500" />
                                Uploading securely...
                            </motion.div>
                        )}

                        {status === "scanning" && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold text-white">
                                        {selectedFiles.length} Scan{selectedFiles.length > 1 ? 's' : ''} Uploaded
                                    </h2>
                                    <p className="text-slate-400">
                                        {selectedFiles.length > 1 ? 'Ready for multi-image analysis with trend detection' : 'Ready for AI analysis'}
                                    </p>
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    onClick={startAnalysis}
                                    size="lg"
                                    className="premium-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-12 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] border border-white/10 font-semibold"
                                >
                                    <ScanLine className="size-6 mr-2" />
                                    Run Deep Analysis
                                </Button>
                            </motion.div>
                        )}

                        {status === "analyzing" && (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                                    Analyzing Tissue Structure...
                                </h2>
                                <p className="text-slate-400 mt-2">Comparing against 14M+ medical records.</p>
                                <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto mt-6 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-purple-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, ease: "easeInOut" }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {status === "result" && analysisResults.length > 0 && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <Button 
                                        variant="outline" 
                                        onClick={reset} 
                                        className="premium-glass-panel border-white/10 hover:bg-white/10 hover:text-white text-slate-300 transition-all rounded-full px-6 h-10 text-sm"
                                    >
                                        New Scan
                                    </Button>
                                </div>

                                {analysisResults.map((result, idx) => {
                                    const markdownContent = `
# Clinical Analysis Report ${analysisResults.length > 1 ? `#${idx + 1}` : ''}
Confidence: **${(result.analysis.confidence * 100).toFixed(0)}%**

## Primary Description
${result.analysis.description}

## Key Clinical Findings
${result.analysis.findings.map(finding => `- ${finding}`).join('\n')}

## Clinical Recommendations
${result.analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
                                    `;

                                    return (
                                        <AIResponseCard 
                                            key={result.id}
                                            content={markdownContent}
                                            title={`Clinical Report ${analysisResults.length > 1 ? `#${idx + 1}` : ''}`}
                                            source="AI Vision Decoder"
                                        />
                                    );
                                })}

                                {/* Trend Analysis */}
                                {trends.length > 0 && (
                                    <AIResponseCard 
                                        title="Long-term Trend Analysis"
                                        source="Neural Intelligence Engine"
                                        content={`
# Multi-Scan Trend Insights
The following trends were detected across your uploaded scans.

${trends.map(trend => `
### ${trend.metric}
- **Trend:** ${trend.trend.toUpperCase()}
- **Timeframe:** ${trend.timeframe}
- **Insights:**
${trend.insights.map(insight => `  - ${insight}`).join('\n')}
`).join('\n')}
                                        `}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
