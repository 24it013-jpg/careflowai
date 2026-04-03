import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, X, Minimize2, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "ai";
    text: string;
    timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
    default: "Based on your current health data, everything looks within normal range. Your heart rate variability suggests good recovery. Is there anything specific you'd like to explore?",
    heart: "Your average heart rate today is 72 BPM — well within the optimal zone of 60-100 BPM. Your HRV trend shows excellent cardiovascular adaptability. Keep up the consistent activity!",
    sleep: "Your sleep score last night was 82/100. You achieved 1.8 hours of deep sleep, which is above the community average of 1.4h. Your REM cycles were consistent — a great sign for cognitive recovery.",
    stress: "Your stress resilience score is 65/100 — 12% above the Hive average. The breathing sessions in the Resilience Center are clearly working. I recommend a 5-minute session before your 3 PM meeting.",
    diet: "Based on your activity level and metabolic data, I estimate you need approximately 2,400 calories today. Prioritize protein (150g+) to support your current fitness goals.",
    medication: "Your medication adherence this week is 86%. You missed Vitamin D3 on Tuesday afternoon. Maintaining a consistent schedule is key for optimal results.",
    exercise: "Your VO2 Max estimate is 42 ml/kg/min — above average for your age group. A 30-minute cardio session today would push your weekly score to 91, your personal best!",
    forecast: "The Oracle predicts your health score will reach 91 by Monday — a 15-point improvement from today. The key driver is your improving sleep consistency over the past 5 days.",
};

const QUICK_PROMPTS = [
    "How's my heart rate?",
    "Analyze my sleep",
    "Stress levels?",
    "Today's forecast",
    "Exercise advice",
    "Medication status",
];

const getAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("heart") || lower.includes("bpm") || lower.includes("pulse")) return AI_RESPONSES.heart;
    if (lower.includes("sleep") || lower.includes("rest") || lower.includes("rem")) return AI_RESPONSES.sleep;
    if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("calm")) return AI_RESPONSES.stress;
    if (lower.includes("diet") || lower.includes("food") || lower.includes("calorie") || lower.includes("nutrition")) return AI_RESPONSES.diet;
    if (lower.includes("medication") || lower.includes("pill") || lower.includes("medicine")) return AI_RESPONSES.medication;
    if (lower.includes("exercise") || lower.includes("workout") || lower.includes("fitness") || lower.includes("vo2")) return AI_RESPONSES.exercise;
    if (lower.includes("forecast") || lower.includes("predict") || lower.includes("oracle") || lower.includes("future")) return AI_RESPONSES.forecast;
    return AI_RESPONSES.default;
};

export function AIHealthChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro",
            role: "ai",
            text: "Hello! I'm your CAREflow AI Health Assistant. I have access to all your health data and can answer questions about your vitals, sleep, medications, fitness, and more. How can I help you today?",
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: "ai",
                text: getAIResponse(text),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1200 + Math.random() * 800);
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 flex items-center justify-center"
                    >
                        <MessageCircle className="size-6 text-white" />
                        <span className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "fixed bottom-6 right-6 z-50 w-96 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden",
                            isMinimized ? "h-16" : "h-[560px]"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 shrink-0">
                            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Bot className="size-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">CAREflow AI</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online · Health Intelligence</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(m => !m)}
                                    className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <Minimize2 className="size-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Quick Prompts */}
                                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-b border-white/5 shrink-0">
                                    {QUICK_PROMPTS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => sendMessage(p)}
                                            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all uppercase tracking-wider"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {messages.map(msg => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                                        >
                                            <div className={cn(
                                                "size-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                                msg.role === "ai" ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-white/10"
                                            )}>
                                                {msg.role === "ai" ? <Sparkles className="size-3.5 text-white" /> : <User className="size-3.5 text-white/60" />}
                                            </div>
                                            <div className={cn(
                                                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                                msg.role === "ai"
                                                    ? "bg-white/[0.04] border border-white/10 text-white/80"
                                                    : "bg-blue-600/30 border border-blue-500/30 text-white"
                                            )}>
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                                            <div className="size-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                                <Sparkles className="size-3.5 text-white" />
                                            </div>
                                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                                                        className="size-1.5 rounded-full bg-blue-400"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-white/5 flex gap-2 shrink-0">
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                                        placeholder="Ask about your health..."
                                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => sendMessage(input)}
                                        className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                                    >
                                        <Send className="size-4 text-white" />
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
