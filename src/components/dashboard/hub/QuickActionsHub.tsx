import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scan, Upload, Mic, Send, Pill, Check, X, Zap, Activity, Plus } from "lucide-react";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useHealthData } from "@/hooks/use-health-data";
import { cn } from "@/lib/utils";
import { VitalsModal } from "./vitals-modal";

const QUICK_PROMPTS = [
    "What's my heart rate trend?",
    "Analyze my sleep quality",
    "Medication interactions?",
];

export function QuickActionsHub() {
    const { openChat } = useAIChat();
    const { addMedication } = useHealthData();
    const [aiInput, setAiInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [detectedMed, setDetectedMed] = useState<{
        name: string;
        dosage: string;
        frequency: string;
    } | null>(null);

    const handleAISubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiInput.trim()) return;
        openChat(aiInput);
        setAiInput("");
    };

    const handleQuickPrompt = (prompt: string) => {
        openChat(prompt);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        simulateScan();
    };

    const simulateScan = () => {
        setIsScanning(true);
        setDetectedMed(null);
        setTimeout(() => {
            setIsScanning(false);
            setDetectedMed({ name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily" });
        }, 2500);
    };

    const handleConfirmMed = () => {
        if (detectedMed) {
            addMedication({
                id: Math.random().toString(36).substring(7),
                name: detectedMed.name,
                dosage: detectedMed.dosage,
                frequency: detectedMed.frequency,
            });
            setDetectedMed(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 z-20 relative">
            {/* AI Assistant */}
            <motion.div
                className="premium-glass-panel p-6 group flex flex-col hover:border-blue-500/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="size-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_16px_rgba(96,165,250,0.15)] group-hover:shadow-[0_0_24px_rgba(96,165,250,0.25)] transition-all">
                        <Sparkles className="size-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Health Assistant</h3>
                        <p className="text-[10px] text-white/30 font-medium">Powered by neural health intelligence</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <Zap className="size-3 text-blue-400" />
                        <span className="text-[9px] text-blue-400/60 font-bold uppercase tracking-widest">Active</span>
                    </div>
                </div>

                {/* Quick prompts */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    {QUICK_PROMPTS.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleQuickPrompt(prompt)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/[0.08] text-[10px] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleAISubmit} className="space-y-3 mt-auto">
                    <div className="relative">
                        <input
                            type="text"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            placeholder="Ask anything about your health..."
                            className="w-full px-4 py-3 pr-20 bg-white/[0.04] border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <Mic className="size-3.5 text-white/30" />
                            </button>
                            <button
                                type="submit"
                                disabled={!aiInput.trim()}
                                className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors disabled:opacity-30"
                            >
                                <Send className="size-3.5 text-blue-400" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="premium-button w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]"
                    >
                        Ask AI Assistant
                    </button>
                </form>
            </motion.div>

            {/* Right Column: Split between Scanner and Quick Actions */}
            <div className="flex flex-col gap-4">
                {/* Scanner */}
                <motion.div
                    className="premium-glass-panel p-6 group flex-1 hover:border-teal-500/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="size-11 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/20 flex items-center justify-center shadow-[0_0_16px_rgba(20,184,166,0.15)] group-hover:shadow-[0_0_24px_rgba(20,184,166,0.25)] transition-all">
                            <Scan className="size-5 text-teal-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Document Scanner</h3>
                            <p className="text-[10px] text-white/30 font-medium">Neural OCR · Auto-detect meds</p>
                        </div>
                    </div>

                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "relative border-2 border-dashed rounded-2xl transition-all duration-300 h-[120px] flex items-center justify-center overflow-hidden",
                            isDragging
                                ? "border-teal-400 bg-teal-500/10 shadow-[0_0_24px_rgba(20,184,166,0.2)]"
                                : isScanning
                                    ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_24px_rgba(52,211,153,0.2)]"
                                    : detectedMed
                                        ? "border-blue-400/50 bg-blue-500/5"
                                        : "border-white/10 bg-white/[0.02] hover:border-teal-500/30 hover:bg-teal-500/5"
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {isScanning ? (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="relative size-8 mx-auto mb-2">
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                                        <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <Scan className="size-3 text-emerald-400" />
                                        </div>
                                    </div>
                                    <p className="text-emerald-400 font-bold text-xs">Scanning...</p>
                                </motion.div>
                            ) : detectedMed ? (
                                <motion.div
                                    key="detected"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full px-4"
                                >
                                    <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <Pill className="size-3 text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-white">{detectedMed.name}</p>
                                                <p className="text-[8px] text-white/40">{detectedMed.dosage}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => setDetectedMed(null)} className="size-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors">
                                                <X className="size-3" />
                                            </button>
                                            <button onClick={handleConfirmMed} className="size-6 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center text-blue-400 transition-colors">
                                                <Check className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-center text-blue-400/50">Tap check to add</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center"
                                >
                                    <div className="size-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-2">
                                        <Upload className="size-4 text-teal-400" />
                                    </div>
                                    <p className="text-white font-semibold text-xs mb-0.5">Drop files here</p>
                                    <p className="text-[9px] text-white/30">Auto-detect meds</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            disabled={isScanning || !!detectedMed}
                            onChange={(e) => { if (e.target.files?.length) simulateScan(); }}
                        />
                    </div>
                </motion.div>

                {/* Log Vitals Action */}
                <VitalsModal>
                    <motion.button
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-3xl p-4 flex items-center gap-4 group transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="size-12 rounded-2xl bg-rose-500/20 border border-rose-500/20 flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(244,63,94,0.2)] transition-all">
                            <Activity className="size-6 text-rose-500" />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-bold text-white text-sm">Log Vitals</h3>
                            <p className="text-[11px] text-white/40">Record HR, BP, SpO2 for XP</p>
                        </div>
                        <div className="size-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Plus className="size-4 text-white/40" />
                        </div>
                    </motion.button>
                </VitalsModal>
            </div>
        </div>
    );
}

