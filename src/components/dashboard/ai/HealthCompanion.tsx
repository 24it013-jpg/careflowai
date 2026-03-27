import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Send,
    X,
    Bot,
    Sparkles,
    ChevronRight,
    Loader2,
    Trash2,
    Activity,
    Pill,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VoiceTranscriptionService, TranscriptionResult } from '@/lib/ai/voice-transcription';
import { useAIChat } from '@/hooks/use-ai-chat';
import { useHealthData } from '@/hooks/use-health-data';
import { useEmergencyStore } from '@/hooks/use-emergency-store';
import { cn } from '@/lib/utils';
import { callGemini } from '@/lib/ai/gemini';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
}

const QUICK_ACTIONS = [
    { label: "Analyze my heart rate", icon: Heart },
    { label: "Check medication interactions", icon: Pill },
    { label: "Give me a health summary", icon: Activity },
];

export function HealthCompanion() {
    const { isOpen, setIsOpen, initialMessage } = useAIChat();
    const { vitals, medications, allergies } = useHealthData();
    const { setCountdownActive, setCountdownValue } = useEmergencyStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    const voiceService = useRef<VoiceTranscriptionService | null>(null);

    // Calculate NHI Score for AI context
    const calculateNHI = () => {
        let score = 100;
        if (vitals.heartRate > 100 || vitals.heartRate < 50) score -= 15;
        else if (vitals.heartRate > 90 || vitals.heartRate < 60) score -= 5;
        if (vitals.spo2 < 95) score -= 20;
        else if (vitals.spo2 < 97) score -= 10;
        if (vitals.temperature > 100 || vitals.temperature < 97) score -= 10;
        return score;
    };

    const nhiScore = calculateNHI();
    const getStatus = () => {
        if (nhiScore > 90) return "Peak Potential";
        if (nhiScore > 80) return "Optimal";
        if (nhiScore > 70) return "Stabilized";
        return "Observation Required";
    };

    useEffect(() => {
        voiceService.current = new VoiceTranscriptionService();

        return () => {
            voiceService.current?.stop();
        };
    }, []);

    useEffect(() => {
        if (initialMessage && isOpen && messages.length === 0) {
            handleSubmit(undefined, initialMessage);
        }
    }, [initialMessage, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, transcript]);

    const toggleListening = () => {
        if (!voiceService.current) return;

        if (isListening) {
            voiceService.current.stop();
            setIsListening(false);
            if (transcript) {
                setInput(transcript);
                setTranscript('');
            }
        } else {
            setIsListening(true);
            voiceService.current.onResult((result: TranscriptionResult) => {
                setTranscript(result.text);
                if (result.isFinal) {
                    setInput(result.text);
                    setTranscript('');
                    setIsListening(false);
                    voiceService.current?.stop();
                }
            });
            voiceService.current.onError((error) => {
                console.error('Voice Error:', error);
                setIsListening(false);
            });
            voiceService.current.start({ continuous: true, interimResults: true });
        }
    };

    const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
        if (e) e.preventDefault();
        const content = customInput || input;
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Emergency Keyword Detection
        const emergencyKeywords = ["help", "emergency", "sos", "heart attack", "can't breathe", "pain", "bleeding"];
        const isEmergency = emergencyKeywords.some(key => content.toLowerCase().includes(key));

        if (isEmergency) {
            setCountdownActive(true);
            setCountdownValue(5);

            const emergencyMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "🚨 **EMERGENCY DETECTED**: I am initiating the Guardian Mode SOS countdown. Please remain calm as I prepare to notify emergency services and your designated contacts. If this is a mistake, you can cancel the countdown on the screen.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, emergencyMsg]);
            setIsLoading(false);
            return;
        }

        try {
            const systemPrompt = `You are the Omni-AI Health Companion, a premium medical assistant. You provide personalized health insights, analyze vitals, and help with medications. Be professional, direct yet empathetic, and use formatting for clarity. Always include a short medical disclaimer.
                            
                            Current Patient Status: ${getStatus()} (NHI: ${nhiScore}/100)
                            
                            Biometric Context:
                            - Vitals: Heart Rate: ${vitals.heartRate} BPM, SpO2: ${vitals.spo2}%, Temp: ${vitals.temperature}°F
                            - Medications: ${medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ') || 'None reported'}
                            - Allergies: ${allergies.map(a => `${a.allergen} (${a.severity})`).join(', ') || 'No known allergies'}
                            
                            Medical Memory Instructions:
                            1. Use the specific vitals and NHI score to tailor your advice.
                            2. If the user asks about their "status" or "health", reference the NHI and specific vitals.
                            3. If medications are present, keep them in mind for interactions.
                            4. If vitals are abnormal (status: Observation Required), emphasize professional consultation.`;

            const chatHistory = messages.slice(-5).map(m => ({
                role: m.role as 'user' | 'model',
                parts: [{ text: m.content }]
            }));

            const response = await callGemini(content, systemPrompt, chatHistory);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having difficulty connecting to my medical database. Please try again in a moment.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => setMessages([]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[380px] h-[550px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Sparkles className="size-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-tight">Health Companion</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Neural Link Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                                    onClick={clearChat}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
                            <div className="space-y-6 pb-4">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-6 px-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                                            <div className="relative p-6 bg-white/5 border border-white/10 rounded-full">
                                                <Bot className="size-10 text-blue-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-bold text-white text-lg">Omni-AI Active</p>
                                            <p className="text-sm text-slate-400 leading-relaxed px-4">
                                                I'm linked to your Neural Health Index ({nhiScore}/100). How can I assist with your <span className="text-blue-400 font-semibold">{getStatus()}</span> state today?
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 w-full pt-2">
                                            {QUICK_ACTIONS.map((action, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs justify-start gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 text-slate-300 rounded-xl py-5"
                                                    onClick={() => handleSubmit(undefined, action.label)}
                                                >
                                                    <action.icon className="size-4 text-blue-400" />
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence initial={false}>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "flex gap-3",
                                                message.role === 'user' ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <Avatar className="size-8 border border-white/10 shrink-0">
                                                <AvatarFallback className={cn(
                                                    "text-[10px] font-bold",
                                                    message.role === 'user' ? "bg-blue-600 text-white" : "bg-slate-700 text-blue-400"
                                                )}>
                                                    {message.role === 'user' ? 'YOU' : <Sparkles className="size-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={cn(
                                                "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]",
                                                message.role === 'user'
                                                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10"
                                                    : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none"
                                            )}>
                                                {message.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isLoading && (
                                    <div className="flex gap-3">
                                        <Avatar className="size-8 border border-white/10 shrink-0">
                                            <AvatarFallback className="bg-slate-700 text-blue-400">
                                                <Loader2 className="size-4 animate-spin" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-white/5 border border-white/10 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-3">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                            </div>
                                            <span className="text-xs font-medium tracking-wide">Syncing Data...</span>
                                        </div>
                                    </div>
                                )}

                                {isListening && transcript && (
                                    <div className="flex flex-row-reverse gap-3">
                                        <div className="rounded-2xl px-4 py-3 text-sm bg-blue-600/50 text-white/70 italic border border-blue-500/30">
                                            {transcript}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-5 border-t border-white/10 bg-white/5">
                            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                                <div className="flex-1 relative group">
                                    <Input
                                        placeholder={isListening ? "Listening..." : "Ask your health context..."}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={isLoading || isListening}
                                        className="w-full bg-white/5 border-white/10 focus-visible:ring-blue-500/50 rounded-2xl h-12 pr-12 text-slate-100 placeholder:text-slate-500"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "size-8 rounded-xl transition-all",
                                                isListening ? "text-rose-500 bg-rose-500/10" : "text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"
                                            )}
                                            onClick={toggleListening}
                                        >
                                            {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim() || isListening}
                                    className="size-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:opacity-90 rounded-2xl shadow-lg shadow-blue-500/20 shrink-0"
                                >
                                    {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Sparkle Orb */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative size-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500",
                    isOpen
                        ? "bg-slate-900 border border-white/20 rotate-90"
                        : "bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 shadow-blue-500/40"
                )}
            >
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md animate-pulse opacity-50" />
                {isOpen ? (
                    <ChevronRight className="size-8 text-white" />
                ) : (
                    <Bot className="size-8 text-white drop-shadow-lg" />
                )}

                {/* Particle/Glow Effect */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -top-1 -right-1 size-5 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center"
                        >
                            <div className="size-1.5 bg-white rounded-full animate-ping" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
