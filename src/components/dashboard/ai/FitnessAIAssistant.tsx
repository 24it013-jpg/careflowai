import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    Loader2, 
    MessageSquare,
    Heart,
    Wind,
    Flame,
    Moon,
    X,
    Maximize2,
    Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { callAI } from "@/lib/ai/gemini";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useHealthData } from "@/hooks/use-health-data";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const QUICK_QUESTIONS = [
    { label: "Best exercise for heart?", icon: Heart },
    { label: "Breathing for lung health", icon: Wind },
    { label: "How to lose weight fast?", icon: Flame },
    { label: "Yoga for stress relief", icon: Moon },
];

export function FitnessAIAssistant() {
    const { vitals } = useHealthData();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your **Vitality AI**. I'm here to help you optimize your fitness, yoga, and breathing routines. Ask me anything about weight loss, stress management, or heart and lung health.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
        if (e) e.preventDefault();
        const text = customInput || input;
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const systemPrompt = `You are the Vitality AI, an expert in fitness, yoga, and clinical wellness.
            Your goal is to provide evidence-based advice for:
            1. Weight loss (safe and sustainable methods).
            2. Stress relief through yoga and meditation.
            3. Heart health (cardiovascular exercises).
            4. Lung health (breathing techniques like Pranayama).
            
            Current Patient Vitals for context:
            - Heart Rate: ${vitals.heartRate} BPM
            - SpO2: ${vitals.spo2}%
            - Temperature: ${vitals.temperature}°F
            
            Guidelines:
            - Use formatting (bolding, bullet points) for readability.
            - Always include a short medical disclaimer.
            - If vitals are abnormal, suggest resting before exercise.
            - Be encouraging and professional.`;

            const chatHistory = messages.slice(-6).map(m => ({
                role: m.role as 'user' | 'model',
                parts: [{ text: m.content }]
            }));

            const response = await callAI(text, systemPrompt, chatHistory);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Fitness AI Error:", error);
            setMessages(prev => [...prev, {
                id: "error",
                role: "assistant",
                content: "I'm having trouble connecting to my fitness database. Please try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Sparkles className="size-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">Vitality AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Fitness Expert Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-premium"
            >
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-4 max-w-[85%]",
                            message.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "size-8 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                            message.role === "user" ? "bg-blue-600" : "bg-slate-800"
                        )}>
                            {message.role === "user" ? <User className="size-4 text-white" /> : <Bot className="size-4 text-emerald-400" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                            message.role === "user" 
                                ? "bg-blue-600 text-white rounded-tr-none" 
                                : "bg-white/5 text-slate-200 border border-white/5 rounded-tl-none markdown-content"
                        )}>
                            {message.role === 'user' ? (
                                message.content
                            ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 max-w-[85%]">
                        <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                            <Loader2 className="size-4 text-emerald-400 animate-spin" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 text-slate-400 border border-white/5 rounded-tl-none flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Input */}
            <div className="p-6 border-t border-white/10 bg-black/20">
                {/* Quick Prompts */}
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar">
                        {QUICK_QUESTIONS.map((q, idx) => (
                            <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSubmit(undefined, q.label)}
                                className="shrink-0 bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[11px] rounded-full h-8"
                            >
                                <q.icon className="size-3 mr-2 text-emerald-400" />
                                {q.label}
                            </Button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input 
                        placeholder="Ask about weight loss, yoga, heart health..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 focus-visible:ring-emerald-500/50 rounded-2xl h-12"
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="size-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20"
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
