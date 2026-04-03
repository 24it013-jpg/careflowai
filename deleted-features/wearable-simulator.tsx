import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, Thermometer, Wind, Activity, Camera, ClipboardList,
    TrendingUp, CheckCircle, AlertCircle, Loader2, Fingerprint,
    Droplets, Scale, ChevronRight, Info, Trash2, BarChart3,
    Sparkles, ShieldCheck, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCameraHeartRate } from "@/hooks/use-camera-ppg";
import { useHealthData, VitalReading, HealthDataStore } from "@/hooks/use-health-data";
import { Button } from "@/components/ui/button";

// ─── Mini Waveform Display ────────────────────────────────────────────────────
function WaveformDisplay({ data, color = "#10b981" }: { data: number[]; color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length < 2) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        data.forEach((v, i) => {
            const x = (i / (data.length - 1)) * W;
            const y = H - ((v - min) / range) * H * 0.8 - H * 0.1;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
    }, [data, color]);
    return <canvas ref={canvasRef} width={600} height={120} className="w-full h-full opacity-80" />;
}

// ─── Trend Mini Chart ─────────────────────────────────────────────────────────
function TrendChart({ readings, field, color, unit }: {
    readings: VitalReading[];
    field: keyof VitalReading;
    color: string;
    unit: string;
}) {
    const values = readings
        .filter(r => r[field] !== undefined)
        .slice(0, 20)
        .reverse()
        .map(r => r[field] as number);

    if (values.length < 2) {
        return (
            <div className="flex items-center justify-center h-24 text-white/10 text-[10px] font-black uppercase tracking-widest">
                Insufficient Data Flux
            </div>
        );
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const W = 400;
    const H = 80;

    const points = values.map((v, i) => ({
        x: (i / (values.length - 1)) * W,
        y: H - ((v - min) / range) * H * 0.7 - H * 0.15,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
        <div className="relative pt-4">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20 overflow-visible">
                <defs>
                    <linearGradient id={`grad-${field as string}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={`${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`}
                    fill={`url(#grad-${field as string})`}
                />
                <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={pathD} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" 
                />
            </svg>
            <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-3">
                <span>Range: {min}–{max}</span>
                <span>Delta: {Math.round(values[values.length-1] - values[0])} {unit}</span>
            </div>
        </div>
    );
}

// ─── Camera Heart Rate Section ────────────────────────────────────────────────
function CameraHRSection({ onSave }: { onSave: (bpm: number) => void }) {
    const { bpm, state, progress, signalStrength, waveformData, error, startMeasurement, stopMeasurement } = useCameraHeartRate();
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (bpm) {
            onSave(bpm);
            setSaved(true);
        }
    };

    const stateConfig = {
        idle: { label: "Ready for biometric capture", color: "text-white/20", icon: Fingerprint, glow: "" },
        requesting: { label: "Establishing sensor link...", color: "text-blue-400", icon: Loader2, glow: "shadow-blue-500/20" },
        calibrating: { label: "Aligning fingertip to lens...", color: "text-amber-400", icon: Loader2, glow: "shadow-amber-500/20" },
        measuring: { label: "Decoding heart rate frequency...", color: "text-emerald-400", icon: Activity, glow: "shadow-emerald-500/20" },
        done: { label: "Extraction complete", color: "text-emerald-400", icon: CheckCircle, glow: "shadow-emerald-500/20" },
        error: { label: error || "Sensor failure", color: "text-red-400", icon: AlertCircle, glow: "shadow-red-500/20" },
    };

    const cfg = stateConfig[state];

    return (
        <div className="space-y-8">
            {/* Status Panel */}
            <div className={cn(
                "p-10 rounded-[3rem] border transition-all relative overflow-hidden flex flex-col items-center text-center",
                state === "measuring" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"
            )}>
                <div className={cn("size-20 rounded-[2.5rem] bg-slate-900 border border-white/10 flex items-center justify-center mb-6 transition-all", cfg.glow)}>
                    <cfg.icon className={cn("size-10", cfg.color, (state === "requesting" || state === "calibrating" || state === "measuring") && "animate-spin")} />
                </div>
                <h3 className={cn("text-xl font-black uppercase tracking-widest mb-2", cfg.color)}>{cfg.label}</h3>
                <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.3em]">
                    {state === "measuring" ? `Signal integrity: ${signalStrength}%` : "Maintain steady contact with lens"}
                </p>

                {/* Main Progress Ring / Result */}
                <div className="my-10 relative size-48">
                    <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                        <motion.circle 
                            cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" 
                            className={cfg.color}
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {state === "done" && bpm ? (
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <span className={cn("text-7xl font-black tracking-tighter tabular-nums", cfg.color)}>{bpm}</span>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center mt-[-10px]">BPM</p>
                            </motion.div>
                        ) : (
                            <div className="text-center">
                                <span className="text-4xl font-black text-white/10 tabular-nums">{progress}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Waveform */}
                <div className="w-full h-24 bg-black/40 rounded-3xl border border-white/5 overflow-hidden p-4">
                    <WaveformDisplay data={waveformData} color={state === "measuring" ? "#10b981" : "#334155"} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {state === "idle" || state === "done" || state === "error" ? (
                    <Button
                        onClick={() => { setSaved(false); startMeasurement(); }}
                        className="flex-1 py-10 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/20 h-auto"
                    >
                        {state === "done" ? "Recalibrate Sensors" : "Initialize Bioscan"}
                    </Button>
                ) : (
                    <Button
                        onClick={stopMeasurement}
                        variant="outline"
                        className="flex-1 py-10 rounded-[2rem] border-white/10 hover:bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.3em] h-auto"
                    >
                        Abort Capture
                    </Button>
                )}

                {state === "done" && !saved && (
                    <Button
                        onClick={handleSave}
                        className="flex-1 py-10 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.3em] h-auto shadow-2xl shadow-emerald-600/20"
                    >
                        Commit to Core
                    </Button>
                )}
            </div>
            
            {saved && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center text-emerald-400 font-black text-[10px] uppercase tracking-[0.5em]">
                    ✓ Biometric Data Synchronized
                </motion.div>
            )}
        </div>
    );
}

// ─── Manual Entry Section ─────────────────────────────────────────────────────
function ManualEntrySection({ onSave }: { onSave: (data: Partial<VitalReading>) => void }) {
    const [form, setForm] = useState({
        temperature: "",
        temperatureUnit: "F" as "F" | "C",
        spo2: "",
        bpSystolic: "",
        bpDiastolic: "",
        weight: "",
        weightUnit: "lbs" as "lbs" | "kg",
        notes: "",
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        const reading: Partial<VitalReading> = {};
        if (form.temperature) {
            let temp = parseFloat(form.temperature);
            if (form.temperatureUnit === "C") temp = temp * 9 / 5 + 32;
            reading.temperature = parseFloat(temp.toFixed(1));
        }
        if (form.spo2) reading.spo2 = parseFloat(form.spo2);
        if (form.bpSystolic) reading.bloodPressureSystolic = parseInt(form.bpSystolic);
        if (form.bpDiastolic) reading.bloodPressureDiastolic = parseInt(form.bpDiastolic);
        if (form.weight) {
            let w = parseFloat(form.weight);
            if (form.weightUnit === "kg") w = w * 2.20462;
            reading.weight = parseFloat(w.toFixed(1));
        }
        if (form.notes) reading.notes = form.notes;

        if (Object.keys(reading).length === 0) return;
        onSave(reading);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const fields = [
        { label: "Core Temp", icon: Thermometer, color: "text-amber-400", value: form.temperature, key: "temperature", unit: `°${form.temperatureUnit}`, 
          onUnitToggle: () => setForm(f => ({ ...f, temperatureUnit: f.temperatureUnit === "F" ? "C" : "F" })) },
        { label: "Oxygen Sat", icon: Wind, color: "text-blue-400", value: form.spo2, key: "spo2", unit: "%" },
        { label: "Systolic", icon: Activity, color: "text-purple-400", value: form.bpSystolic, key: "bpSystolic", unit: "mmHg" },
        { label: "Diastolic", icon: Activity, color: "text-purple-300", value: form.bpDiastolic, key: "bpDiastolic", unit: "mmHg" },
        { label: "Bone Mass", icon: Scale, color: "text-emerald-400", value: form.weight, key: "weight", unit: form.weightUnit,
          onUnitToggle: () => setForm(f => ({ ...f, weightUnit: f.weightUnit === "lbs" ? "kg" : "lbs" })) },
    ];

    return (
        <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-6">
                {fields.map((field) => (
                    <div key={field.label} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <field.icon className={cn("size-6", field.color)} />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{field.label}</span>
                            </div>
                            {field.onUnitToggle && (
                                <button onClick={field.onUnitToggle} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase hover:text-white transition-colors">
                                    {field.unit}
                                </button>
                            )}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <input
                                type="number"
                                step="0.1"
                                value={field.value}
                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                placeholder="00.0"
                                className="bg-transparent text-5xl font-black text-white w-full outline-none placeholder:text-white/5 tracking-tighter tabular-nums"
                            />
                            {!field.onUnitToggle && <span className="text-xs font-black text-white/10 uppercase">{field.unit}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] block mb-4">Observation Notes</span>
                <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Document subjective biometric feedback..."
                    rows={3}
                    className="w-full bg-transparent text-white font-medium text-sm outline-none placeholder:text-white/5 resize-none pb-2 border-b border-white/5 focus:border-white/20 transition-all"
                />
            </div>

            <Button
                onClick={handleSave}
                disabled={saved}
                className={cn(
                    "w-full py-10 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all h-auto",
                    saved ? "bg-emerald-500 text-slate-950" : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/20"
                )}
            >
                {saved ? "Data Ingested Successfully" : "Finalize Data Input"}
            </Button>
        </div>
    );
}

// ─── Trends Section ───────────────────────────────────────────────────────────
function TrendsSection({ history, onClear }: { history: VitalReading[]; onClear: () => void }) {
    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const trendCards = [
        { label: "Heart Rhythm", field: "heartRate" as const, color: "#f87171", unit: "BPM", icon: Heart, iconColor: "text-rose-400" },
        { label: "Oxygen Saturation", field: "spo2" as const, color: "#60a5fa", unit: "%", icon: Wind, iconColor: "text-blue-400" },
        { label: "Thermal Variance", field: "temperature" as const, color: "#fbbf24", unit: "°F", icon: Thermometer, iconColor: "text-amber-400" },
        { label: "Systolic Pressure", field: "bloodPressureSystolic" as const, color: "#a78bfa", unit: "mmHg", icon: Activity, iconColor: "text-purple-400" },
    ];

    return (
        <div className="space-y-10">
            {history.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] rounded-[3.5rem] border border-dashed border-white/5">
                    <BarChart3 className="size-16 mx-auto mb-6 opacity-10" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">No Historical Data Flux Detected</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {trendCards.map(({ label, field, color, unit, icon: Icon, iconColor }) => (
                            <div key={field} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("size-5", iconColor)} />
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{label}</span>
                                    </div>
                                    <TrendingUp className="size-4 text-white/5 group-hover:text-white/20 transition-colors" />
                                </div>
                                <TrendChart readings={history} field={field} color={color} unit={unit} />
                            </div>
                        ))}
                    </div>

                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Data Ingestion History</h3>
                            <button onClick={onClear} className="text-[10px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2">
                                <Trash2 className="size-3" /> Purge Records
                            </button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                            {history.slice(0, 30).map((r) => (
                                <div key={r.id} className="flex items-center gap-6 p-6 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5 group">
                                    <div className="text-[10px] font-black text-white/10 w-32 shrink-0 group-hover:text-white/30">{formatTime(r.timestamp)}</div>
                                    <div className="flex flex-wrap gap-4 flex-1">
                                        {r.heartRate && <span className="text-sm text-rose-400 font-black tracking-tight">{r.heartRate} BPM</span>}
                                        {r.spo2 && <span className="text-sm text-blue-400 font-black tracking-tight">{r.spo2}% SpO₂</span>}
                                        {r.temperature && <span className="text-sm text-amber-400 font-black tracking-tight">{r.temperature}°F</span>}
                                        {r.bloodPressureSystolic && <span className="text-sm text-purple-400 font-black tracking-tight">{r.bloodPressureSystolic}/{r.bloodPressureDiastolic} mmHg</span>}
                                    </div>
                                    <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        r.source === "camera" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                                    )}>
                                        {r.source}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Insights Section ─────────────────────────────────────────────────────────
function InsightsSection({ vitals }: { vitals: HealthDataStore["vitals"] }) {
    const insights: { icon: React.ElementType; color: string; bg: string; title: string; body: string; type: "good" | "warn" | "info" }[] = [];

    // Simplified logic for example purposes
    if (vitals.heartRate > 0) {
        if (vitals.heartRate <= 80) insights.push({ icon: Heart, color: "text-emerald-400", bg: "bg-emerald-500/5", title: "Cardiac Efficiency Peak", body: "Current rhythm indicates high cardiovascular adaptive capacity.", type: "good" });
        else insights.push({ icon: Heart, color: "text-amber-400", bg: "bg-amber-500/5", title: "Elevated Metabolic Load", body: "Heart rate above optimal resting window. Monitor for stress markers.", type: "warn" });
    }

    if (vitals.spo2 >= 95) insights.push({ icon: Wind, color: "text-blue-400", bg: "bg-blue-500/5", title: "Oxygen Saturation Normal", body: "Systemic oxygenation levels maintained within safe operational bounds.", type: "good" });
    
    insights.push({ icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/5", title: "AI Diagnostic Overlay", body: "Neural synthesis suggests optimal hydration is mitigating current thermal drift.", type: "info" });

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {insights.map((ins, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("p-8 rounded-[2.5rem] border border-white/5 flex gap-6 items-start relative overflow-hidden group hover:border-white/20 transition-all", ins.bg)}
                    >
                        <div className={cn("size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", ins.color.replace('text-', 'bg-').replace('400', '500'))}>
                            <ins.icon className="size-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className={cn("text-xl font-black tracking-tight mb-2 uppercase", ins.color)}>{ins.title}</h4>
                            <p className="text-xs text-white/40 leading-relaxed font-medium">{ins.body}</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    </motion.div>
                ))}
            </div>
            <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 text-center">
                <ShieldCheck className="size-8 text-white/10 mx-auto mb-4" />
                <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em] leading-relaxed">
                    Clinical Data Integrity Shield Active<br />Not a Substitute for Professional Medical Diagnosis
                </p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
    { id: "camera", label: "Bioscan", icon: Camera },
    { id: "manual", label: "Manual Input", icon: ClipboardList },
    { id: "trends", label: "Patterns", icon: TrendingUp },
    { id: "insights", label: "Analysis", icon: Activity },
];

export default function VitalsHub() {
    const [activeTab, setActiveTab] = useState("camera");
    const { vitals, vitalHistory, addVitalReading, clearHistory } = useHealthData();

    const handleCameraHRSave = (bpm: number) => {
        addVitalReading({ timestamp: Date.now(), heartRate: bpm, source: "camera" });
    };

    const handleManualSave = (data: Partial<VitalReading>) => {
        addVitalReading({ timestamp: Date.now(), source: "manual", ...data } as Omit<VitalReading, "id">);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-rose-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-5 mb-3">
                            <div className="size-16 rounded-[2rem] bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-2xl shadow-rose-500/30 border border-white/20">
                                <Activity className="size-9 text-white animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Vitals Core</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Central Biometric Monitoring Hub</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex bg-white/[0.03] border border-white/5 p-2 rounded-[2.5rem]">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-8 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab.id
                                        ? "bg-white/10 text-white shadow-xl border border-white/10"
                                        : "text-white/30 hover:text-white/50"
                                )}
                            >
                                <tab.icon className="size-4" />
                                <span className="hidden md:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </header>

                {/* Sub-Header Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {[
                        { label: "Pulse", value: vitals.heartRate || "--", unit: "BPM", color: "text-rose-400", icon: Heart },
                        { label: "Ox-Level", value: vitals.spo2 || "--", unit: "%", color: "text-blue-400", icon: Wind },
                        { label: "Thermal", value: vitals.temperature || "--", unit: "°F", color: "text-amber-400", icon: Thermometer },
                        { label: "Force", value: vitals.bloodPressureSystolic ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` : "--/--", unit: "mmHg", color: "text-purple-400", icon: Activity },
                    ].map((stat) => (
                        <div key={stat.label} className="p-8 rounded-[2.5rem] premium-glass-panel border border-white/10 group transition-all hover:bg-white/[0.04]">
                            <div className="flex items-center gap-3 mb-4">
                                <stat.icon className={cn("size-4", stat.color)} />
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
                            </div>
                            <p className={cn("text-3xl font-black tracking-tight tabular-nums", stat.color)}>{stat.value}</p>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">{stat.unit}</p>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        {activeTab === "camera" && <CameraHRSection onSave={handleCameraHRSave} />}
                        {activeTab === "manual" && <ManualEntrySection onSave={handleManualSave} />}
                        {activeTab === "trends" && <TrendsSection history={vitalHistory} onClear={clearHistory} />}
                        {activeTab === "insights" && <InsightsSection vitals={vitals} />}
                    </motion.div>
                </AnimatePresence>
                
                {activeTab === "camera" && (
                    <div className="mt-12 flex justify-center">
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] flex items-center gap-3">
                            <Zap className="size-3" /> External Sensor Priority: Active
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
