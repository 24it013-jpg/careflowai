import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, Activity, Moon, Clock, Heart, 
    ArrowUpRight, TrendingUp, Info, AlertCircle,
    Sparkles, RefreshCcw, Coffee, Sun, 
    Dumbbell, Utensils, Brain, Shield, ChevronRight
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

interface BioMarker {
    id: string;
    name: string;
    value: number;
    unit: string;
    trend: number;
    status: 'optimal' | 'normal' | 'concerning';
    icon: any;
    color: string;
}

const BIO_MARKERS: BioMarker[] = [
    { id: 'hrv', name: 'HRV', value: 78, unit: 'ms', trend: 5, status: 'optimal', icon: Heart, color: 'text-rose-400' },
    { id: 'sleep', name: 'Deep Sleep', value: 1.8, unit: 'h', trend: -12, status: 'normal', icon: Moon, color: 'text-indigo-400' },
    { id: 'stress', name: 'Stress Index', value: 34, unit: '%', trend: -8, status: 'optimal', icon: Activity, color: 'text-emerald-400' },
    { id: 'recovery', name: 'Recovery', value: 92, unit: '%', trend: 15, status: 'optimal', icon: Zap, color: 'text-amber-400' },
];

export default function LongevityDashboard() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const getLongevityScore = useMemo(() => {
        // Mock score calculation
        return 88;
    }, []);

    const runBioAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const context = BIO_MARKERS.map(b => `${b.name}: ${b.value}${b.unit} (${b.status})`).join(', ');
            const prompt = `Based on these bio-markers: ${context}, provide specific AI-driven longevity advice for anti-aging and peak performance. Include:
            1. Supplement recommendations.
            2. Sleep optimization techniques.
            3. Exercise adjustments.
            Keep it concise and high-performance focused.`;
            
            const result = await callOpenRouter(prompt, "You are a specialized Longevity & Biohacking Expert. You provide elite health optimization advice based on physiological data.");
            setAiAdvice(result);
            setActiveTab("advice");
        } catch (error) {
            console.error("Bio Analysis Error:", error);
            toast.error("Failed to generate Longevity Insights.");
        } finally {
            setIsAnalyzing(false);
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
                            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 ring-1 ring-amber-500/20 shadow-lg shadow-amber-500/10">
                                <Zap className="size-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Longevity Hub</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Guided Biohacking & Performance</p>
                            </div>
                        </motion.div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Optimize your health for longevity with AI-driven biohacking advice. Monitor key biomarkers, receive personalized supplement recommendations, and improve your daily performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={runBioAnalysis}
                            disabled={isAnalyzing}
                            className="border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            {isAnalyzing ? "Analyzing Bio-Matrix..." : <><Sparkles className="size-4 mr-2" /> Bio-Analysis</>}
                        </Button>
                    </div>
                </div>

                {/* Main Longevity Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Score Gauge */}
                    <Card className="lg:col-span-4 bg-black/40 border-white/5 backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center p-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Vital Longevity Score</h3>
                        <div className="relative size-48">
                            <svg className="size-full" viewBox="0 0 100 100">
                                <circle className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                                <motion.circle 
                                    className="text-amber-500" 
                                    strokeWidth="6" 
                                    strokeDasharray="264" 
                                    initial={{ strokeDashoffset: 264 }}
                                    animate={{ strokeDashoffset: 264 - (264 * getLongevityScore) / 100 }}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="42" cx="50" cy="50" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black tracking-tighter text-white">{getLongevityScore}</span>
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Optimal</span>
                            </div>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-8 leading-relaxed max-w-[200px]">Your biological markers suggest a vitality level 12% above average.</p>
                    </Card>

                    {/* Bio-Marker Grid */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BIO_MARKERS.map((marker) => (
                            <Card key={marker.id} className="bg-black/40 border-white/5 hover:border-white/10 transition-all group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={cn("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform", marker.color)}>
                                            <marker.icon className="size-6" />
                                        </div>
                                        <div className={cn(
                                            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                                            marker.trend > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                                        )}>
                                            <TrendingUp className={cn("size-3", marker.trend < 0 && "rotate-180")} />
                                            {Math.abs(marker.trend)}%
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{marker.name}</p>
                                            <h4 className="text-3xl font-black text-white tracking-tight">{marker.value}<span className="text-sm text-slate-500 ml-1">{marker.unit}</span></h4>
                                        </div>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] uppercase font-black tracking-widest",
                                            marker.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        )}>
                                            {marker.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-black/40 border border-white/5 p-1">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                            <Activity className="size-4 mr-2" /> Performance Matrix
                        </TabsTrigger>
                        <TabsTrigger value="advice" className="data-[state=active]:bg-white/10">
                            <Sparkles className="size-4 mr-2 text-amber-400" /> AI Insights
                        </TabsTrigger>
                        <TabsTrigger value="protocols" className="data-[state=active]:bg-white/10">
                            <Shield className="size-4 mr-2 text-blue-400" /> Bio-Protocols
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Circadian Rhythm", value: 92, icon: Sun, color: "text-amber-400", desc: "Aligned with natural light cycles." },
                                { title: "Cognitive Load", value: 45, icon: Brain, color: "text-purple-400", desc: "Optimal mental processing state." },
                                { title: "Metabolic Efficiency", value: 78, icon: Utensils, color: "text-emerald-400", desc: "High fat-burning adaptation." },
                            ].map((stat, i) => (
                                <Card key={i} className="bg-black/40 border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                                <stat.icon className="size-5" />
                                            </div>
                                            <span className="text-2xl font-black text-white">{stat.value}%</span>
                                        </div>
                                        <h4 className="font-bold text-sm tracking-wide">{stat.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
                                        <Progress value={stat.value} className="h-1 bg-white/5" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="advice" className="mt-8">
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden min-h-[400px]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black">AI Longevity Analysis</CardTitle>
                                        <CardDescription>Personalized performance optimization and anti-aging guidance.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="prose prose-invert max-w-none">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <div className="size-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                        <p className="text-amber-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Processing Physiological Matrix...</p>
                                    </div>
                                ) : aiAdvice ? (
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 leading-relaxed whitespace-pre-wrap text-slate-300 shadow-2xl">
                                            {aiAdvice}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-2 mb-3 text-amber-400">
                                                    <Pill className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Stacks</span>
                                                </div>
                                                <p className="text-sm font-bold text-white mb-1">NMN & Resveratrol</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Optimal Anti-Aging Stack</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-2 mb-3 text-blue-400">
                                                    <Coffee className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Focus</span>
                                                </div>
                                                <p className="text-sm font-bold text-white mb-1">L-Theanine Cycle</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Cognitive Flow Protocol</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-2 mb-3 text-rose-400">
                                                    <Dumbbell className="size-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Training</span>
                                                </div>
                                                <p className="text-sm font-bold text-white mb-1">Zone 2 Cardio</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Mitochondrial Efficiency</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                        <Zap className="size-16 mb-4 opacity-10" />
                                        <p className="font-bold">Initialize Bio-Analysis to unlock AI Longevity insights.</p>
                                        <Button 
                                            variant="link" 
                                            className="text-amber-400 mt-2 font-bold uppercase tracking-widest text-[10px]"
                                            onClick={runBioAnalysis}
                                        >
                                            Run Matrix Analysis
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="protocols" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Dopamine Detox", duration: "24 Hours", difficulty: "High", impact: "High", icon: RefreshCcw, color: "text-rose-400" },
                                { title: "NSDR Meditation", duration: "20 Mins", difficulty: "Low", impact: "Medium", icon: Brain, color: "text-purple-400" },
                                { title: "Cold Thermogenesis", duration: "3 Mins", difficulty: "Medium", impact: "High", icon: Zap, color: "text-blue-400" },
                                { title: "Fast-Mimicking Diet", duration: "5 Days", difficulty: "High", impact: "Max", icon: Utensils, color: "text-emerald-400" },
                            ].map((protocol, i) => (
                                <Card key={i} className="bg-black/40 border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("p-4 rounded-2xl bg-white/5 group-hover:rotate-12 transition-transform", protocol.color)}>
                                                <protocol.icon className="size-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-white mb-1">{protocol.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{protocol.duration}</span>
                                                    <span className="size-1 rounded-full bg-slate-800" />
                                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{protocol.difficulty} Diff</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact</span>
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{protocol.impact}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
