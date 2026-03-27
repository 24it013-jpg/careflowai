import { motion } from "framer-motion";
import {
    FileText,
    Download,
    Share2,
    Activity,
    Thermometer,
    Droplets,
    LineChart,
    Stethoscope,
    Info,
    ArrowLeft
} from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";
import { useHealthForecaster } from "@/hooks/use-health-forecaster";
import { cn } from "@/lib/utils";

interface ClinicalReportProps {
    onClose: () => void;
}

export function ClinicalReport({ onClose }: ClinicalReportProps) {
    const { vitals } = useHealthData();
    const { riskLevel, insight } = useHealthForecaster();

    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const vitalMetrics = [
        { label: "Heart Rate", value: `${vitals.heartRate} BPM`, status: vitals.heartRate > 100 || vitals.heartRate < 60 ? "Warning" : "Normal", icon: Activity },
        { label: "Blood Oxygen", value: `${vitals.spo2}%`, status: vitals.spo2 < 95 ? "Warning" : "Optimal", icon: Droplets },
        { label: "Body Temp", value: `${vitals.temperature}°F`, status: vitals.temperature > 99.5 ? "Elevated" : "Normal", icon: Thermometer },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            {/* Report Container */}
            <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                        >
                            <ArrowLeft className="size-5" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="size-5 text-blue-400" />
                                Clinical Synthesis Report
                            </h2>
                            <p className="text-xs text-white/30 font-mono mt-0.5 uppercase tracking-widest">UID: CF-992-AXL-001</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">
                            <Share2 className="size-3.5" />
                            Share Securely
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20">
                            <Download className="size-3.5" />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Identification & Summary */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Patient Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40 text-sm">Full Name</span>
                                        <span className="text-white font-medium text-sm">Alex Henderson</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40 text-sm">Date of Birth</span>
                                        <span className="text-white font-medium text-sm">May 12, 1988 (35y)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/40 text-sm">Report Generated</span>
                                        <span className="text-white font-medium text-sm">{reportDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl border flex gap-4",
                                riskLevel === 'high' ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                            )}>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    riskLevel === 'high' ? "bg-rose-500/20" : "bg-emerald-500/20"
                                )}>
                                    <Stethoscope className={cn("size-6", riskLevel === 'high' ? "text-rose-400" : "text-emerald-400")} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Clinical Status: {riskLevel.toUpperCase()}</h4>
                                    <p className="text-xs text-white/60 leading-relaxed italic">
                                        "Automated triage assessment suggests {riskLevel === 'high' ? 'immediate clinical review' : 'continuing routine monitoring'} based on longitudinal metabolic markers."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LineChart className="size-16 text-blue-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Intelligence Synthesis</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {insight}
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-bold uppercase">Neuro-Sync</span>
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 font-bold uppercase">Vitals Logbook</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Grid */}
                    <div>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6">Physiological Snapshot</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {vitalMetrics.map((metric, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <metric.icon className="size-5 text-blue-400" />
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                            metric.status === "Normal" || metric.status === "Optimal"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-amber-500/20 text-amber-400"
                                        )}>
                                            {metric.status}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                                    <div className="text-xs text-white/30 font-medium">{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4 items-start">
                        <Info className="size-5 text-white/30 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-white/40 leading-relaxed">
                            <strong className="text-white/60">NOTICE:</strong> This report is generated by CAREflow AI's autonomous diagnostic engine using real-time telemetry. It is intended to assist medical professionals and should not be used as the sole basis for critical medical decisions. AI synthesis may have limitations in complex edge-case pathologies.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <div>© 2026 CAREflow Medical Systems</div>
                    <div className="flex gap-4">
                        <span>P-SECURE: 256-BIT</span>
                        <span>HIPAA COMPLIANT</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
