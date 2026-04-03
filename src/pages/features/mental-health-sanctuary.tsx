import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Brain, Smile, Frown, Meh, Sun, Moon, Music, 
    ChevronRight, Wind, Zap, MessageSquare, Send, 
    Sparkles, Heart, Activity, Coffee, Volume2, 
    VolumeX, Play, Pause, RefreshCcw, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { callOpenRouter } from "@/lib/ai/openrouter";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const MOODS = [
    { icon: Smile, label: "Radiant", value: "great", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Meh, label: "Steady", value: "okay", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { icon: Frown, label: "Heavy", value: "low", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { icon: Zap, label: "Restless", value: "anxious", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: Moon, label: "Quiet", value: "tired", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

const SOUNDSCAPES = [
    { id: 'rain', name: 'Neural Rain', type: 'ASMR', icon: CloudRain, color: 'text-blue-400' },
    { id: 'forest', name: 'Echo Forest', type: 'Ambient', icon: Trees, color: 'text-emerald-400' },
    { id: 'waves', name: 'Deep Ocean', type: 'Binaural', icon: Waves, color: 'text-cyan-400' },
    { id: 'white', name: 'Static Calm', type: 'White Noise', icon: Volume2, color: 'text-slate-400' },
];

import { CloudRain, Trees, Waves } from "lucide-react";

export default function MentalHealthSanctuary() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Welcome to your Mental Health Sanctuary. I'm your Neural Companion. How are you feeling today? I'm here to listen, support, and guide you through any emotional waves.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [activeTab, setActiveTab] = useState("companion");
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [stressLevel, setStressLevel] = useState(45);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const systemPrompt = `You are an empathetic, professional, and supportive AI Mental Health Companion named 'Aura'. 
            Your goal is to provide emotional support, active listening, and gentle guidance. 
            Keep responses concise, warm, and focused on the user's well-being. 
            If the user expresses severe distress or self-harm, provide resources and encourage seeking professional help. 
            Always use a soothing tone. Current user mood: ${selectedMood || 'unknown'}.`;

            const chatHistory = messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                content: m.content
            }));

            const response = await callOpenRouter(input, systemPrompt, chatHistory);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Connection to Neural Network lost. Please try again.");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-200 p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/10">
                                <Brain className="size-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Mind Sanctuary</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Empathetic Emotional Support</p>
                            </div>
                        </motion.div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Your safe space for emotional well-being. Chat with Aura, your empathetic AI companion, explore soothing soundscapes, and manage your mental health journey.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-4 py-2 bg-purple-500/10 border-purple-500/20 text-purple-400 animate-pulse">
                            Neural Sync: 98%
                        </Badge>
                    </div>
                </div>

                {/* Mood Matrix */}
                <section className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 text-center">Calibrate Emotional State</h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {MOODS.map((mood) => (
                            <motion.button
                                key={mood.value}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedMood(mood.value);
                                    toast.info(`Neural state updated: ${mood.label}`);
                                }}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-[2rem] transition-all w-32 border-2",
                                    selectedMood === mood.value
                                        ? `bg-white/10 ${mood.border} shadow-2xl shadow-purple-500/10`
                                        : "bg-white/[0.03] border-transparent hover:border-white/10"
                                )}
                            >
                                <div className={cn("p-4 rounded-2xl transition-all", mood.bg)}>
                                    <mood.icon className={cn("size-6", mood.color)} />
                                </div>
                                <span className={cn("font-black text-[10px] uppercase tracking-widest transition-colors", selectedMood === mood.value ? "text-white" : "text-slate-500")}>
                                    {mood.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Analytics & Soundscapes */}
                    <div className="space-y-8">
                        {/* Stress Monitor */}
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <Activity className="size-4 text-rose-400" /> Stress Resonance
                                    </CardTitle>
                                    <Badge variant="outline" className="text-rose-400 border-rose-400/20 bg-rose-400/5">{stressLevel}%</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative pt-2">
                                    <Progress value={stressLevel} className="h-2 bg-white/5" />
                                    <div className="absolute top-0 left-[45%] h-6 w-px bg-white/20" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                    <span>Zen Zone</span>
                                    <span>High Tension</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                        <Info className="size-4" />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">Your neural tension is slightly elevated. A 5-minute breathing cycle is recommended.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Soundscapes */}
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Volume2 className="size-4 text-blue-400" /> Neural Audio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {SOUNDSCAPES.map((sound) => (
                                    <div 
                                        key={sound.id}
                                        onClick={() => {
                                            setActiveSound(sound.id);
                                            setIsPlaying(!isPlaying || activeSound !== sound.id);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border group",
                                            activeSound === sound.id && isPlaying
                                                ? "bg-blue-500/10 border-blue-500/30"
                                                : "bg-white/5 border-transparent hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-3 rounded-xl bg-white/5", sound.color)}>
                                                <sound.icon className="size-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{sound.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sound.type}</p>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                            {activeSound === sound.id && isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: AI Companion Chat */}
                    <Card className="lg:col-span-2 bg-black/40 border-white/5 backdrop-blur-xl flex flex-col h-[700px]">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <Sparkles className="size-6 text-white" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black">Aura Neural Companion</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase font-black">Online</Badge>
                                            <span className="text-xs text-slate-500">AI-Guided Therapy Session</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" onClick={() => setMessages([messages[0]])}>
                                    <RefreshCcw className="size-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 overflow-hidden p-0 relative">
                            <ScrollArea className="h-full p-6">
                                <div className="space-y-6">
                                    {messages.map((m) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={m.id}
                                            className={cn(
                                                "flex w-full",
                                                m.role === 'user' ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                                m.role === 'user' 
                                                    ? "bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10" 
                                                    : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                                            )}>
                                                {m.content}
                                                <p className={cn(
                                                    "text-[10px] mt-2 font-bold uppercase tracking-widest",
                                                    m.role === 'user' ? "text-indigo-200" : "text-slate-500"
                                                )}>
                                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                                <div className="size-1.5 bg-purple-500 rounded-full animate-bounce" />
                                                <div className="size-1.5 bg-purple-500 rounded-full animate-bounce delay-150" />
                                                <div className="size-1.5 bg-purple-500 rounded-full animate-bounce delay-300" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <div className="p-6 border-t border-white/5 bg-black/20">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-4"
                            >
                                <Input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your thoughts..." 
                                    className="bg-white/5 border-white/10 focus:ring-purple-500/20 py-6"
                                />
                                <Button 
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 h-auto"
                                >
                                    <Send className="size-5" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-center mt-4 text-slate-600 font-bold uppercase tracking-widest">
                                Aura is an AI companion, not a replacement for professional therapy.
                            </p>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
