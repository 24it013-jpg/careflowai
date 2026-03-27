import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Save, FileText, Loader2, Copy, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    VoiceTranscriptionService,
    structureNotesWithAI,
    exportToSOAPFormat,
    type TranscriptionResult
} from "@/lib/ai/voice-transcription";

export default function AmbientScribe() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const [fullTranscript, setFullTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [structuredNotes, setStructuredNotes] = useState<{
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    } | null>(null);

    const transcriptionService = useRef<VoiceTranscriptionService | null>(null);


    // Initialize transcription service
    useEffect(() => {
        transcriptionService.current = new VoiceTranscriptionService();

        if (!transcriptionService.current.isAvailable()) {
            setError('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        }

        // Set up callbacks
        transcriptionService.current.onResult((result: TranscriptionResult) => {
            if (result.isFinal) {
                setTranscript(prev => [...prev, result.text]);
                setFullTranscript(prev => prev + ' ' + result.text);
            }
        });

        transcriptionService.current.onError((error: string) => {
            console.error('Transcription error:', error);
            setError(`Transcription error: ${error} `);
            setIsRecording(false);
        });

        return () => {
            transcriptionService.current?.stop();
        };
    }, []);

    const startRecording = () => {
        setError(null);
        setTranscript([]);
        setFullTranscript("");
        setStructuredNotes(null);
        setIsRecording(true);
        transcriptionService.current?.start({ continuous: true, interimResults: true });
    };

    const stopRecording = async () => {
        setIsRecording(false);
        transcriptionService.current?.stop();

        if (!fullTranscript.trim()) {
            setError('No transcript available to process');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const notes = await structureNotesWithAI(fullTranscript);
            setStructuredNotes(notes);
        } catch (err) {
            console.error('Error structuring notes:', err);
            setError('Failed to structure notes with AI. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        if (structuredNotes) {
            const formatted = exportToSOAPFormat(structuredNotes);
            navigator.clipboard.writeText(formatted);
        }
    };

    const downloadNotes = () => {
        if (structuredNotes) {
            const formatted = exportToSOAPFormat(structuredNotes);
            const blob = new Blob([formatted], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `soap - notes - ${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="min-h-screen bg-[#030014] text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-fuchsia-500/30">
            {/* Premium Background Effects */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 min-h-[calc(100vh-100px)]">

                {/* Left: Recording Interface */}
                <div className="flex flex-col gap-6">
                    <header>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg text-fuchsia-400">
                                <Mic className="size-6" />
                            </span>
                            Ambient Scribe
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">AI-powered voice-to-structured-notes.</p>
                    </header>

                    <div className="flex-1 premium-glass-panel rounded-3xl p-8 relative flex flex-col items-center justify-center overflow-hidden group">
                        {/* Recording Animation */}
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute size-40 rounded-full border border-fuchsia-500/30"
                                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative z-10 text-center space-y-8">
                            <div className={cn(
                                "size-32 rounded-full flex items-center justify-center transition-all duration-500 border relative group",
                                isRecording 
                                    ? "bg-red-500/20 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.5)]" 
                                    : "bg-fuchsia-500/10 border-fuchsia-500/30 hover:bg-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]"
                            )}>
                                <Mic className={cn(
                                    "size-12 transition-all duration-300",
                                    isRecording ? "text-red-400 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-fuchsia-400 group-hover:scale-110"
                                )} />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold text-white">
                                    {isRecording ? "Listening..." : "Ready to Record"}
                                </h3>
                                <div className="flex justify-center">
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle className="size-4" />
                                            {error}
                                        </div>
                                    )}
                                    {!isRecording ? (
                                        <Button
                                            onClick={startRecording}
                                            disabled={!!error && error.includes('not supported')}
                                            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-fuchsia-500/50 transform hover:-translate-y-1"
                                        >
                                            Start Recording
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={stopRecording}
                                            variant="destructive"
                                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-500/50 rounded-full px-8 py-6 text-lg gap-2 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                        >
                                            <Square className="fill-current size-5" />
                                            Stop & Process
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Transcript Snippet */}
                    <div className="h-40 premium-glass-panel rounded-2xl p-4 overflow-y-auto font-mono text-sm text-slate-300 custom-scrollbar relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#100D26]/80 pointer-events-none rounded-b-2xl" />
                        {transcript.length === 0 ? (
                            <span className="opacity-50 italic text-slate-500">Live transcript will appear here...</span>
                        ) : (
                            transcript.map((line, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-2"
                                >
                                    <span className="text-fuchsia-400 break-words mr-2">{`00:${String(i * 2).padStart(2, '0')} `}</span>
                                    {line}
                                </motion.p>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Generated Notes */}
                <div className="flex flex-col h-full mt-8 lg:mt-0">
                    <div className="flex-1 premium-glass-panel rounded-3xl p-6 md:p-8 overflow-hidden relative flex flex-col">
                        {isProcessing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030014]/60 backdrop-blur-md z-20 rounded-3xl border border-white/10">
                                <Loader2 className="size-12 text-fuchsia-500 animate-spin mb-4 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
                                <p className="text-lg text-white animate-pulse">Structuring Notes with AI...</p>
                            </div>
                        ) : !structuredNotes ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                <FileText className="size-16 mb-4" />
                                <p>Record a session to generate SOAP notes</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10 relative">
                                    <div className="absolute bottom-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-fuchsia-500/50 to-transparent" />
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-500/30">
                                            <FileText className="size-5 text-fuchsia-400" />
                                        </div>
                                        SOAP Note
                                    </h2>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={copyToClipboard}
                                            className="text-slate-300 hover:text-white hover:bg-fuchsia-500/20 transition-colors"
                                        >
                                            <Copy className="size-4 mr-2" /> Copy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={downloadNotes}
                                            className="text-slate-300 hover:text-white hover:bg-fuchsia-500/20 transition-colors"
                                        >
                                            <Download className="size-4 mr-2" /> Download
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <Section title="Subjective" content={structuredNotes.subjective} color="text-blue-400" />
                                    <Section title="Objective" content={structuredNotes.objective} color="text-emerald-400" />
                                    <Section title="Assessment" content={structuredNotes.assessment} color="text-amber-400" />
                                    <Section title="Plan" content={structuredNotes.plan} color="text-fuchsia-400" />
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 relative">
                                    <div className="absolute top-0 right-0 w-1/3 h-[1px] bg-gradient-to-l from-fuchsia-500/50 to-transparent" />
                                    <Button className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-xl h-12 text-lg border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                                        <Save className="size-5 mr-2" />
                                        Save to Health Vault
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, content, color }: { title: string, content: string, color: string }) {
    return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden backdrop-blur-sm">
            <h4 className={cn("text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2", color)}>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {title}
            </h4>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line ml-3.5">{content}</p>
        </div>
    );
}
