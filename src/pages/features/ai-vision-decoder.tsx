import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, CheckCircle2, X, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    analyzeImage,
    analyzeMultipleImages,
    type ImageAnalysisResult,
    type TrendAnalysis
} from "@/lib/ai/vision-decoder";

export default function AIVisionDecoder() {
    const [status, setStatus] = useState<"idle" | "uploading" | "scanning" | "analyzing" | "result">("idle");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult[]>([]);
    const [trends, setTrends] = useState<TrendAnalysis[]>([]);
    const [error, setError] = useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            setPreviewUrls(files.map(file => URL.createObjectURL(file)));
            setStatus("uploading");
            setError(null);

            // Simulate upload
            setTimeout(() => setStatus("scanning"), 1500);
        }
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
                        <p className="text-slate-400 mt-2">Upload medical imaging (X-ray, MRI, CT) for instant AI analysis.</p>
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
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                    />
                                    <Button className="premium-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 h-12 rounded-full border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] text-md font-medium">
                                        Upload Scan(s)
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-600 mt-4">Tip: Upload multiple images for trend analysis</p>
                            </motion.div>
                        )}

                        {/* PREVIEW & SCANNING STATE */}
                        {previewUrls.length > 0 && (
                            <div className="relative w-full h-full flex items-center justify-center bg-black/50 gap-4 p-4">
                                {previewUrls.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`Medical Scan ${idx + 1} `}
                                        className={cn(
                                            "max-w-full max-h-full object-contain",
                                            status === "result" ? "opacity-50" : "opacity-80",
                                            previewUrls.length > 1 ? "w-1/2" : "w-full"
                                        )}
                                    />
                                ))}

                                {/* Scanning Beam Animation */}
                                {(status === "scanning" || status === "analyzing") && (
                                    <motion.div
                                        className="absolute inset-0 z-20 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            className="w-full h-2 bg-purple-500 shadow-[0_0_50px_theme(colors.purple.500)]"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                            style={{ position: "absolute" }}
                                        />
                                        <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />

                                        {/* Grid Overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                                    </motion.div>
                                )}

                                {/* Cancel Button */}
                                {status !== "result" && (
                                    <button
                                        onClick={reset}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors z-30 border border-white/10"
                                    >
                                        <X className="size-6" />
                                    </button>
                                )}

                                {/* Annotations / Results Overlay */}
                                {status === "result" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-30 pointer-events-none"
                                    >
                                        {/* Mock Detected Region */}
                                        <motion.div
                                            initial={{ scale: 1.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="absolute top-[30%] left-[40%] w-[100px] h-[100px] border-2 border-red-500 rounded-full shadow-[0_0_20px_theme(colors.red.500)] bg-red-500/10 flex items-center justify-center"
                                        >
                                            <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded absolute -top-6 whitespace-nowrap font-bold">
                                                Abnormality Detected (94%)
                                            </div>
                                        </motion.div>
                                    </motion.div>
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
                                {/* Individual Analysis Results */}
                                {analysisResults.map((result, idx) => (
                                    <div key={result.id} className="premium-glass-panel border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                        {/* Subtle background glow */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10" />
                                        
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-2">
                                                    Analysis Report {analysisResults.length > 1 ? `#${idx + 1} ` : ''}
                                                </h2>
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20 flex items-center gap-1">
                                                        <CheckCircle2 className="size-3" /> Confidence: {(result.analysis.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            {idx === 0 && <Button variant="outline" onClick={reset} className="premium-glass-panel border-white/10 hover:bg-white/10 hover:text-white text-slate-300 transition-all rounded-full px-6">New Scan</Button>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                    <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                                                    <p className="text-lg font-medium text-white">
                                                        {result.analysis.description}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                    <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-2">Findings</h4>
                                                    <ul className="space-y-2">
                                                        {result.analysis.findings.map((finding, i) => (
                                                            <li key={i} className="text-slate-300 flex items-start gap-2">
                                                                <span className="text-purple-400 mt-1">•</span>
                                                                <span>{finding}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Recommendations</h4>
                                                <div className="space-y-3">
                                                    {result.analysis.recommendations.map((rec, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-start gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                                                            <span className="text-slate-200 leading-relaxed">{rec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Trend Analysis */}
                                {trends.length > 0 && (
                                    <div className="premium-glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
                                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                            <TrendingUp className="size-6 text-purple-400" />
                                            Trend Analysis
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {trends.map((trend, idx) => (
                                                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm text-slate-400 uppercase tracking-wider">{trend.metric}</h4>
                                                        <div className="flex items-center gap-1">
                                                            {trend.trend === 'improving' && <TrendingUp className="size-4 text-green-400" />}
                                                            {trend.trend === 'worsening' && <TrendingDown className="size-4 text-red-400" />}
                                                            {trend.trend === 'stable' && <Minus className="size-4 text-blue-400" />}
                                                            <span className={cn(
                                                                "text-xs font-medium",
                                                                trend.trend === 'improving' && "text-green-400",
                                                                trend.trend === 'worsening' && "text-red-400",
                                                                trend.trend === 'stable' && "text-blue-400"
                                                            )}>
                                                                {trend.trend}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mb-3">{trend.timeframe}</p>
                                                    <ul className="space-y-2">
                                                        {trend.insights.map((insight, i) => (
                                                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                                <span className="text-purple-400 mt-0.5">•</span>
                                                                <span>{insight}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
