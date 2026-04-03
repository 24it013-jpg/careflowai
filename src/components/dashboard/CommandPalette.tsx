import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Activity, Brain, Shield, Zap, Globe, Cpu,
    Stethoscope, Pill, MapPin, DollarSign, RefreshCw,
    Map, Users, Calendar, Heart, HeartPulse, Watch, Moon, BookOpen,
    FlaskConical, LayoutDashboard, ArrowRight
} from "lucide-react";

interface CommandItem {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    path: string;
    category: string;
    color: string;
}

const ALL_COMMANDS: CommandItem[] = [
    { id: "dashboard", label: "Dashboard", description: "Main overview", icon: LayoutDashboard, path: "/dashboard", category: "Navigation", color: "text-blue-400" },
    { id: "vision", label: "AI Vision Decoder", description: "Analyze medical images with AI", icon: Brain, path: "/dashboard/vision", category: "AI Tools", color: "text-purple-400" },
    { id: "med-check", label: "AI Med Check", description: "Medicine photo & label AI", icon: Pill, path: "/dashboard/med-check", category: "AI Tools", color: "text-rose-400" },
    { id: "open-health", label: "Open Health Hub", description: "Condition education & heart/diabetes check-ins", icon: HeartPulse, path: "/dashboard/open-health", category: "AI Tools", color: "text-sky-400" },
    { id: "scribe", label: "Ambient Scribe", description: "AI-powered clinical notes", icon: BookOpen, path: "/dashboard/scribe", category: "AI Tools", color: "text-amber-400" },
    { id: "specialist", label: "Specialist Match", description: "Find the right specialist", icon: Stethoscope, path: "/dashboard/specialist", category: "Care", color: "text-emerald-400" },
    { id: "telemedicine", label: "Telemedicine", description: "Video consultations", icon: Activity, path: "/dashboard/telemedicine", category: "Care", color: "text-cyan-400" },
    { id: "nearby", label: "Nearby Care", description: "Find clinics & hospitals", icon: MapPin, path: "/dashboard/nearby", category: "Navigation", color: "text-rose-400" },
    { id: "refills", label: "Refill Predictor", description: "Smart prescription refills", icon: RefreshCw, path: "/dashboard/refills", category: "Care", color: "text-purple-400" },
    { id: "body-map", label: "Body Map", description: "Interactive anatomy explorer", icon: Map, path: "/dashboard/body-map", category: "Tools", color: "text-orange-400" },
    { id: "diet", label: "Diet & Nutrition", description: "Nutrition tracking & plans", icon: Heart, path: "/dashboard/diet", category: "Wellness", color: "text-emerald-400" },
    { id: "symptom-checker", label: "Symptom Checker", description: "AI symptom analysis", icon: Stethoscope, path: "/dashboard/symptom-checker", category: "AI Tools", color: "text-rose-400" },
    { id: "medications", label: "Medication Tracker", description: "Track your medications", icon: Pill, path: "/dashboard/medications", category: "Care", color: "text-amber-400" },
    { id: "sleep", label: "Sleep Visualizer", description: "Analyze sleep patterns", icon: Moon, path: "/dashboard/sleep", category: "Wellness", color: "text-indigo-400" },
    { id: "mood", label: "Mood Journal", description: "Track emotional wellbeing", icon: BookOpen, path: "/dashboard/mood", category: "Wellness", color: "text-pink-400" },
    { id: "globe", label: "Global Pulse", description: "Worldwide health trends", icon: Globe, path: "/dashboard", category: "Analytics", color: "text-blue-400" },
    { id: "cpu", label: "Neural Stream", description: "AI processing monitor", icon: Cpu, path: "/dashboard", category: "Analytics", color: "text-purple-400" },
];

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const filtered = query.trim()
        ? ALL_COMMANDS.filter(
            (c) =>
                c.label.toLowerCase().includes(query.toLowerCase()) ||
                c.description.toLowerCase().includes(query.toLowerCase()) ||
                c.category.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_COMMANDS.slice(0, 8);

    const execute = useCallback((item: CommandItem) => {
        navigate(item.path);
        onClose();
        setQuery("");
    }, [navigate, onClose]);

    useEffect(() => {
        setSelected(0);
    }, [query]);

    useEffect(() => {
        if (!open) {
            setQuery("");
            setSelected(0);
        }
    }, [open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && filtered[selected]) execute(filtered[selected]);
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, filtered, selected, execute, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-2xl rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                            <Search className="w-5 h-5 text-white/30 shrink-0" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search features, pages, actions..."
                                className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-base"
                            />
                            <div className="flex items-center gap-1.5">
                                <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/30 text-[10px] font-mono">ESC</kbd>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                            {filtered.length === 0 ? (
                                <div className="py-12 text-center text-white/20 text-sm">
                                    No results for "{query}"
                                </div>
                            ) : (
                                <>
                                    {!query && (
                                        <p className="px-5 py-2 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                                            Quick Access
                                        </p>
                                    )}
                                    {filtered.map((item, i) => (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => execute(item)}
                                            onMouseEnter={() => setSelected(i)}
                                            className={`w-full flex items-center gap-4 px-5 py-3 transition-colors text-left ${selected === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0`}>
                                                <item.icon className={`w-4 h-4 ${item.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium">{item.label}</p>
                                                <p className="text-white/30 text-xs truncate">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{item.category}</span>
                                                {selected === i && <ArrowRight className="w-3.5 h-3.5 text-white/30" />}
                                            </div>
                                        </motion.button>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-[10px] text-white/20">
                            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd> Navigate</span>
                            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd> Open</span>
                            <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">ESC</kbd> Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
