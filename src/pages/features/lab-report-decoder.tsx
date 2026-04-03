import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    FileSearch, 
    CheckCircle2, 
    X, 
    Loader2, 
    Download, 
    AlertCircle, 
    FileText, 
    Activity, 
    Droplets, 
    TestTube,
    ChevronRight,
    ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeImage, type ImageAnalysisResult } from "@/lib/ai/vision-decoder";
import { toast } from "sonner";
import { AIResponseCard } from "@/components/ui/ai-response-card";

export default function LabReportDecoder() {
    const [status, setStatus] = useState<"idle" | "uploading" | "scanning" | "analyzing" | "result">("idle");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [analysisResults, setAnalysisResults] = useState<ImageAnalysisResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);
            
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
            const results = await Promise.all(
                previewUrls.map(url => analyzeImage(url, undefined, "This is a laboratory report (Blood/Urine/Biochemistry). Please extract values, reference ranges, and flag abnormalities."))
            );
            setAnalysisResults(results);
            setStatus("result");
            toast.success("Analysis Complete", {
                description: "Your lab report has been decoded successfully."
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
            setStatus("scanning");
            toast.error("Analysis Failed", {
                description: "Could not decode the report. Please check image quality."
            });
        }
    };

    const downloadReport = () => {
        const reportContent = analysisResults.map((res, idx) => {
            return `
LAB REPORT ANALYSIS #${idx + 1}
---------------------------
Date: ${res.timestamp.toLocaleDateString()}
Description: ${res.analysis.description}

FINDINGS:
${res.analysis.findings.map(f => `- ${f}`).join('\n')}

RECOMMENDATIONS:
${res.analysis.recommendations.map(r => `- ${r}`).join('\n')}

Disclaimer: AI-generated analysis. Consult a doctor.
            `;
        }).join('\n\n');

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CAREflow-Lab-Report-${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.info("Report Downloaded", {
            description: "Your digital analysis has been saved."
        });
    };

    const reset = () => {
        setStatus("idle");
        setSelectedFiles([]);
        setPreviewUrls([]);
        setAnalysisResults([]);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-hidden relative selection:bg-emerald-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                            <motion.span 
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] text-cyan-400 backdrop-blur-md"
                            >
                                <FileSearch className="size-7" />
                            </motion.span>
                            Lab Report Decoder
                        </h1>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Upload your medical lab reports (blood, urine, biochemistry) to get an instant AI-powered summary. Understand your results, identify trends, and get personalized health insights.
                        </p>
                    </div>
                </header>

                <main className="grid gap-8">
                    {/* Upload / Preview Area */}
                    <motion.div
                        layout
                        className={cn(
                            "relative rounded-3xl transition-all duration-500 flex flex-col items-center justify-center overflow-hidden premium-glass-panel group",
                            status === "idle" ? "border-2 border-dashed border-white/20 bg-black/20 h-[400px] hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "border border-white/10 bg-black/40 h-[600px] shadow-2xl shadow-emerald-500/10"
                        )}
                    >
                        {status === "idle" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="size-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/30 transition-colors"
                                >
                                    <Upload className="size-10 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Upload Lab Reports</h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                    Upload clear photos or scans of your blood/urine tests. <br />
                                    AI will extract and explain your values.
                                </p>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" multiple />
                                <Button onClick={triggerUpload} className="premium-button bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 h-12 rounded-full border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] text-md font-medium">
                                    Browse Files
                                </Button>
                            </motion.div>
                        )}

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
                                        <img src={url} alt="Lab Report" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[10px] text-white/70 border border-white/10 uppercase tracking-widest">
                                            Report #{idx + 1}
                                        </div>
                                    </motion.div>
                                ))}

                                {(status === "scanning" || status === "analyzing") && (
                                    <motion.div className="absolute inset-0 z-20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <motion.div
                                            className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_30px_rgba(16,185,129,0.8)]"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                                            style={{ position: "absolute" }}
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <div className="text-[10px] text-emerald-400 font-mono tracking-tighter">DECODING_LAB_VALUES...</div>
                                        </div>
                                    </motion.div>
                                )}

                                {status !== "result" && status !== "analyzing" && (
                                    <button onClick={reset} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors z-30 border border-white/10 backdrop-blur-md">
                                        <X className="size-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Controls & Results Pane */}
                    <AnimatePresence mode="wait">
                        {status === "scanning" && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                                <Button onClick={startAnalysis} size="lg" className="premium-button bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-12 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] border border-white/10 font-semibold">
                                    <ClipboardCheck className="size-6 mr-2" />
                                    Extract Values
                                </Button>
                            </motion.div>
                        )}

                        {status === "analyzing" && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                                    AI Clinical Reasoning...
                                </h2>
                                <p className="text-slate-400 mt-2">Correlating biomarkers and reference ranges.</p>
                                <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto mt-6 overflow-hidden">
                                    <motion.div className="h-full bg-emerald-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "easeInOut" }} />
                                </div>
                            </motion.div>
                        )}

                        {status === "result" && analysisResults.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
                                <div className="flex items-center justify-between">
                                    <Button variant="outline" onClick={reset} className="premium-glass-panel border-white/10 hover:bg-white/10 hover:text-white text-slate-300 rounded-full px-6">New Upload</Button>
                                </div>

                                {analysisResults.map((result, idx) => {
                                    const markdownContent = `
# Laboratory Report Decoding #${idx + 1}
Status: **Analyzed**

## Clinical Summary
${result.analysis.description}

## Parameters & Abnormalities
${result.analysis.findings.map(finding => `- ${finding}`).join('\n')}

## Clinical Recommendations
${result.analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
                                    `;

                                    return (
                                        <AIResponseCard 
                                            key={result.id}
                                            content={markdownContent}
                                            title={`Lab Report Analysis #${idx + 1}`}
                                            source="Lab Decoder AI"
                                        />
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
