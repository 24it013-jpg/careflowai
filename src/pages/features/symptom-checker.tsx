import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, AlertTriangle, CheckCircle, Stethoscope, Sparkles, User, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AIResponseCard } from "@/components/ui/ai-response-card";

interface Message {
    id: string;
    role: "user" | "ai";
    text: string;
    triage?: "self-care" | "doctor" | "emergency";
    conditions?: { name: string; confidence: number; color: string }[];
}

const SYMPTOM_RESPONSES: Record<string, Message> = {
    default: {
        id: "ai-1",
        role: "ai",
        text: "Neural analysis complete. Based on your symptom profile, I've identified several potential markers. Please review the confidence scores below.",
        conditions: [
            { name: "Common Cold / Rhinovirus", confidence: 72, color: "text-blue-400" },
            { name: "Seasonal Allergies", confidence: 18, color: "text-teal-400" },
            { name: "Viral Sinusitis", confidence: 10, color: "text-purple-400" },
        ],
        triage: "self-care",
    },
    chest: {
        id: "ai-2",
        role: "ai",
        text: "CRITICAL ALERT: Your reported symptoms indicate potential thoracic distress. High-priority triage protocol activated. Seek immediate diagnostic evaluation.",
        conditions: [
            { name: "Musculoskeletal Pain", confidence: 45, color: "text-amber-400" },
            { name: "Gastroesophageal Reflux", confidence: 30, color: "text-blue-400" },
            { name: "Acute Cardiac Syndrome (Risk)", confidence: 25, color: "text-red-400" },
        ],
        triage: "emergency",
    },
    headache: {
        id: "ai-3",
        role: "ai",
        text: "Diagnostic sweep finished. The reported cephalic discomfort patterns are consistent with several common pathologies.",
        conditions: [
            { name: "Tension-Type Headache", confidence: 60, color: "text-blue-400" },
            { name: "Migraine with Aura", confidence: 28, color: "text-purple-400" },
            { name: "Cervicogenic Pain", confidence: 12, color: "text-teal-400" },
        ],
        triage: "doctor",
    },
};

const TRIAGE_CONFIG = {
    "self-care": { label: "Standard Home-care Protocol", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", icon: CheckCircle },
    "doctor": { label: "Professional Consultation Advised", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Stethoscope },
    "emergency": { label: "Immediate Emergency Triage Required", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

const QUICK_SYMPTOMS = ["Chronic Fatigue", "Chest tightness", "Migraine", "Slight Fever", "Recurring Nausea"];

export default function SymptomChecker() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", role: "ai", text: "Systems online. I am CAREflow's diagnostic assistant. Describe your physiological state in detail to begin a differential analysis." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const lower = text.toLowerCase();
            const response = lower.includes("chest") ? SYMPTOM_RESPONSES.chest
                : (lower.includes("head") || lower.includes("migraine")) ? SYMPTOM_RESPONSES.headache
                    : SYMPTOM_RESPONSES.default;
            setMessages(prev => [...prev, { ...response, id: `ai-${Date.now()}` }]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col font-sans relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-5 mb-10"
                >
                    <div className="size-14 rounded-[1.25rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/20 border border-white/10">
                        <Brain className="size-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Symptom Checker</h1>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Powered Diagnostic Analysis</p>
                    </div>
                    <div className="ml-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Core Status: Optimal</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4 mb-8">
                        Get instant AI-driven assessments for your symptoms. Our checker provides triage protocols and potential conditions to help you decide on the next steps for your health.
                    </p>
                </motion.div>

                {/* Chat Container */}
                <div className="flex-1 overflow-hidden flex flex-col premium-glass-panel rounded-[2.5rem] border border-white/5 bg-white/[0.01] mb-8 shadow-2xl relative">
                    <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-950/40 to-transparent pointer-events-none z-10" />
                    
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                                >
                                    <div className={cn(
                                        "size-10 rounded-xl flex items-center justify-center shrink-0 border",
                                        msg.role === "user" ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : "bg-purple-500/20 border-purple-500/30 text-purple-300"
                                    )}>
                                        {msg.role === "user" ? <User className="size-5" /> : <Sparkles className="size-5" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[75%] space-y-4",
                                        msg.role === "user" ? "items-end text-right" : "items-start"
                                    )}>
                                        {msg.role === "ai" ? (
                                            <div className="flex-1 space-y-4">
                                                <AIResponseCard 
                                                    content={msg.text}
                                                    title="Symptom Analysis"
                                                    source="Diagnostic Engine"
                                                    compact={true}
                                                    className="!bg-white/5 !border-white/10 !text-slate-100"
                                                />
                                                
                                                {msg.conditions && (
                                                    <div className="grid gap-3">
                                                        {msg.conditions.map((cond, i) => (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.1 * i }}
                                                                key={i}
                                                                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                                                            >
                                                                <span className="text-sm font-medium">{cond.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-purple-500" style={{ width: `${cond.confidence}%` }} />
                                                                    </div>
                                                                    <span className={cn("text-[10px] font-bold w-8", cond.color)}>{cond.confidence}%</span>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}

                                                {msg.triage && (
                                                    <div className={cn(
                                                        "p-4 rounded-2xl border flex items-center gap-4",
                                                        TRIAGE_CONFIG[msg.triage].bg
                                                    )}>
                                                        <div className={cn("p-2 rounded-xl bg-white/5", TRIAGE_CONFIG[msg.triage].color)}>
                                                            {(() => {
                                                                const Icon = TRIAGE_CONFIG[msg.triage].icon;
                                                                return <Icon className="size-5" />;
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">AI Triage Protocol</p>
                                                            <p className={cn("text-sm font-bold", TRIAGE_CONFIG[msg.triage].color)}>
                                                                {TRIAGE_CONFIG[msg.triage].label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="px-5 py-3 rounded-2xl rounded-tr-none bg-purple-600 text-white text-sm leading-relaxed shadow-lg shadow-purple-500/20">
                                                {msg.text}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="size-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                                    <Sparkles className="size-5" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 flex items-center gap-2">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                                            className="size-1.5 rounded-full bg-purple-400"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} className="h-4" />
                    </div>

                    {/* Quick Selection Footer */}
                    <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                           {QUICK_SYMPTOMS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group mb-4"
                >
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                        placeholder="State your physiological symptoms for neural synthesis..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] px-8 py-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.05] transition-all backdrop-blur-3xl shadow-2xl"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(input)}
                        className="absolute right-3 top-3 bottom-3 px-6 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
                        disabled={!input.trim()}
                    >
                        <Send className="size-5" />
                    </motion.button>
                </motion.div>

                <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] mb-4">
                    Clinical AI Overlay · Automated Health Triage Network
                </p>
            </div>
        </div>
    );
}
