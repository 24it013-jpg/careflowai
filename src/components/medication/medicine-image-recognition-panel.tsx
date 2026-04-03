import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, ScanLine, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { recognizeMedicineOrMedicalImage } from '@/lib/ai/medicine-image-recognition';
import { AIResponseCard } from '@/components/ui/ai-response-card';

export function MedicineImageRecognitionPanel() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const clear = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        setAnalysis(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    }, [previewUrl]);

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
        setAnalysis(null);
        setError(null);
    };

    const run = async () => {
        if (!file) return;
        setBusy(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await recognizeMedicineOrMedicalImage(file);
            if (result.success) {
                setAnalysis(result.analysis);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-glass-panel border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px] -z-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/25 text-teal-400">
                            <Camera className="size-5" />
                        </span>
                        Upload &amp; analyze
                    </h2>
                    <p className="text-white/50 text-sm mt-2 max-w-2xl leading-relaxed">
                        Boxes, blisters, prescription labels, loose pills, or clear medical imagery. JPEG, PNG, or WebP
                        · max 8&nbsp;MB.
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={onPick}
                />
                <div className="flex flex-wrap gap-2 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                        disabled={busy}
                        className="gap-2 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                    >
                        <Upload className="size-4" />
                        Choose image
                    </Button>
                    {(file || previewUrl) && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={clear}
                            disabled={busy}
                            className="gap-2 rounded-xl text-white/70 hover:text-white"
                        >
                            <Trash2 className="size-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className={cn(
                        'rounded-2xl border border-dashed flex flex-col items-center justify-center min-h-[220px] transition-colors',
                        previewUrl
                            ? 'border-white/15 bg-black/30'
                            : 'border-white/10 bg-white/[0.03] hover:border-teal-500/35'
                    )}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Selected upload preview"
                            className="max-h-[280px] w-full object-contain rounded-xl p-3"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-8 text-center text-white/40 hover:text-white/60 transition-colors"
                        >
                            <ScanLine className="size-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium">Drop an image here or tap Choose image</p>
                            <p className="text-xs mt-1 text-white/30">JPEG, PNG, WebP · max 8 MB</p>
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-4 min-h-[220px]">
                    <Button
                        type="button"
                        onClick={run}
                        disabled={!file || busy}
                        className="h-12 gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(20,184,166,0.25)] border border-white/10"
                    >
                        {busy ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Analyzing…
                            </>
                        ) : (
                            <>
                                <ScanLine className="size-4" />
                                Generate description
                            </>
                        )}
                    </Button>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="err"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-100 px-4 py-3 text-sm leading-relaxed"
                            >
                                {error}
                            </motion.div>
                        )}
                        {analysis && (
                            <div className="mt-4 space-y-6 flex-1 overflow-y-auto">
                                <AIResponseCard 
                                    content={analysis}
                                    title="Medicine Analysis Report"
                                    source="AI Med Check"
                                />
                                <p className="mt-4 pt-3 border-t border-white/10 text-xs text-white/45">
                                    Not medical advice. Confirm any medication with your pharmacist or clinician.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
}
