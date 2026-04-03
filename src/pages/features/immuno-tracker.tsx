import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShieldCheck, Calendar, Bell, Plus, Clock, 
    CheckCircle2, AlertCircle, Info, Sparkles, 
    ArrowRight, MapPin, FileText, Share2, 
    Trash2, Download, Filter, Eye, Activity, 
    Stethoscope, Pill, Syringe
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
import { AIResponseCard } from "@/components/ui/ai-response-card";

interface Vaccine {
    id: string;
    name: string;
    date: string;
    type: 'mandatory' | 'recommended' | 'travel';
    status: 'completed' | 'upcoming' | 'overdue';
    doses: number;
    currentDose: number;
    description: string;
    provider?: string;
}

const INITIAL_VACCINES: Vaccine[] = [
    {
        id: '1',
        name: 'Influenza (Flu)',
        date: '2024-11-15',
        type: 'recommended',
        status: 'completed',
        doses: 1,
        currentDose: 1,
        description: 'Annual flu vaccination for seasonal protection.',
        provider: 'Max Healthcare'
    },
    {
        id: '2',
        name: 'Hepatitis B',
        date: '2025-06-20',
        type: 'mandatory',
        status: 'upcoming',
        doses: 3,
        currentDose: 2,
        description: 'Final dose of the Hepatitis B series.',
        provider: 'Apollo Clinics'
    },
    {
        id: '3',
        name: 'Tetanus Booster',
        date: '2023-01-10',
        type: 'mandatory',
        status: 'completed',
        doses: 1,
        currentDose: 1,
        description: 'Routine 10-year tetanus booster.',
        provider: 'Government Hospital'
    }
];

export default function ImmunoTracker() {
    const [vaccines, setVaccines] = useState<Vaccine[]>(INITIAL_VACCINES);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSchedule, setAiSchedule] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("schedule");

    // Age Consultation State
    const [ageInput, setAgeInput] = useState("");
    const [isConsulting, setIsConsulting] = useState(false);
    const [consultationResult, setConsultationResult] = useState<string | null>(null);

    const getVaccineStats = useMemo(() => {
        const completed = vaccines.filter(v => v.status === 'completed').length;
        const upcoming = vaccines.filter(v => v.status === 'upcoming').length;
        const overdue = vaccines.filter(v => v.status === 'overdue').length;
        const total = vaccines.length;
        return { completed, upcoming, overdue, total, completionRate: Math.round((completed / total) * 100) };
    }, [vaccines]);

    const runImmunoAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            const context = vaccines.map(v => `${v.name}: ${v.status} (${v.date})`).join(', ');
            const prompt = `Based on this vaccination history: ${context}, provide:
            1. Recommendations for missing essential vaccines based on standard Indian health guidelines for an adult.
            2. Upcoming booster schedules for the next 5 years.
            3. Travel vaccination advice for someone planning a trip to South-East Asia.
            Keep it professional, evidence-based, and concise.`;
            
            const result = await callOpenRouter(prompt, "You are a specialized Immunization & Public Health Expert. You provide accurate vaccination schedules and advice based on standard medical guidelines.");
            setAiSchedule(result);
            setActiveTab("analysis");
        } catch (error) {
            console.error("Immuno Analysis Error:", error);
            toast.error("Failed to generate Immunization Insights.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAgeConsultation = async () => {
        if (!ageInput.trim()) {
            toast.error("Please enter an age or age group.");
            return;
        }

        setIsConsulting(true);
        try {
            const prompt = `A user says: "${ageInput}". Provide a detailed and authoritative list of vaccines this person should take, specifically following the Indian healthcare system standards (IAP/WHO guidelines). 
            Structure the answer into:
            1. Mandatory Vaccines (Must have)
            2. Recommended Vaccines (Highly suggested)
            3. Lifestyle/Travel Vaccines (If applicable)
            4. Important notes or next steps.
            
            Keep the tone professional, helpful, and clear. Use bullet points for readability.`;

            const result = await callOpenRouter(prompt, "You are a specialized Immunization Consultant for the Indian healthcare system.");
            setConsultationResult(result);
        } catch (error) {
            console.error("Consultation Error:", error);
            toast.error("Failed to fetch vaccine recommendations.");
        } finally {
            setIsConsulting(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-200 p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <ShieldCheck className="size-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Immuno Tracker</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Advanced Immunization Management</p>
                            </div>
                        </motion.div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Stay on top of your vaccinations with AI-driven tracking. Monitor your immunization status, get reminders for boosters, and access expert health advice.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={runImmunoAnalysis}
                            disabled={isAnalyzing}
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            {isAnalyzing ? "Optimizing Schedule..." : <><Sparkles className="size-4 mr-2" /> AI Predictor</>}
                        </Button>
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-black/40 border-white/5 p-6 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Immuno Compliance</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-white">{getVaccineStats.completionRate}%</span>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">High</Badge>
                        </div>
                        <Progress value={getVaccineStats.completionRate} className="h-1 bg-white/5 mt-4" />
                    </Card>
                    <Card className="bg-black/40 border-white/5 p-6 flex flex-col justify-between">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Completed</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-white">{getVaccineStats.completed}</span>
                            <CheckCircle2 className="size-8 text-emerald-400/20" />
                        </div>
                    </Card>
                    <Card className="bg-black/40 border-white/5 p-6 flex flex-col justify-between">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Upcoming</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-white">{getVaccineStats.upcoming}</span>
                            <Calendar className="size-8 text-blue-400/20" />
                        </div>
                    </Card>
                    <Card className="bg-black/40 border-white/5 p-6 flex flex-col justify-between border-rose-500/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Overdue</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-black text-rose-400">{getVaccineStats.overdue}</span>
                            <AlertCircle className="size-8 text-rose-400/20" />
                        </div>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-black/40 border border-white/5 p-1">
                        <TabsTrigger value="schedule" className="data-[state=active]:bg-white/10">
                            <Calendar className="size-4 mr-2" /> Unified Schedule
                        </TabsTrigger>
                        <TabsTrigger value="consultation" className="data-[state=active]:bg-white/10">
                            <Stethoscope className="size-4 mr-2 text-rose-400" /> AI Consultation
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="data-[state=active]:bg-white/10">
                            <Sparkles className="size-4 mr-2 text-emerald-400" /> AI Insights
                        </TabsTrigger>
                        <TabsTrigger value="certificates" className="data-[state=active]:bg-white/10">
                            <FileText className="size-4 mr-2 text-blue-400" /> Certificates
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="consultation" className="mt-8">
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden min-h-[500px] relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500" />
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                                        <Stethoscope className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black">Vaccine AI Consultant</CardTitle>
                                        <CardDescription>Enter your age or health profile to get detailed vaccine recommendations in India.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                        <Input 
                                            value={ageInput}
                                            onChange={(e) => setAgeInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAgeConsultation()}
                                            placeholder="e.g. I'm 18 years old, or My child is 6 months old..." 
                                            className="pl-12 bg-white/5 border-white/10 focus:ring-rose-500/20 py-6 text-base"
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleAgeConsultation}
                                        disabled={isConsulting || !ageInput.trim()}
                                        className="bg-rose-600 hover:bg-rose-500 text-white px-8 h-auto font-black uppercase tracking-widest text-[10px]"
                                    >
                                        {isConsulting ? "Consulting AI..." : "Get Advice"}
                                    </Button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isConsulting ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-24 space-y-4"
                                        >
                                            <div className="size-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                                            <p className="text-rose-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Analyzing Indian Medical Protocols...</p>
                                        </motion.div>
                                    ) : consultationResult ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <AIResponseCard 
                                                title="Personalized Vaccine Consultation"
                                                source="AI Immunization Consultant"
                                                content={consultationResult}
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                            <div className="p-6 rounded-full bg-white/5 mb-6">
                                                <Stethoscope className="size-12 opacity-10" />
                                            </div>
                                            <p className="font-bold text-center max-w-md">Our AI consultant is ready. Enter your age to see which vaccines are required for your life stage.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="schedule" className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {vaccines.map((v) => (
                                <Card key={v.id} className="bg-black/40 border-white/5 group hover:border-white/10 transition-all overflow-hidden relative">
                                    <div className={cn(
                                        "absolute top-0 left-0 w-1 h-full",
                                        v.status === 'completed' ? "bg-emerald-500" : v.status === 'upcoming' ? "bg-blue-500" : "bg-rose-500"
                                    )} />
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-4 rounded-2xl bg-white/5",
                                                    v.status === 'completed' ? "text-emerald-400" : v.status === 'upcoming' ? "text-blue-400" : "text-rose-400"
                                                )}>
                                                    <Syringe className="size-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white">{v.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[9px] uppercase font-black py-0 border-white/10 text-slate-500">{v.type}</Badge>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{v.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={cn(
                                                "uppercase font-black tracking-widest text-[9px]",
                                                v.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                v.status === 'upcoming' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            )}>
                                                {v.status}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-xs text-slate-400 leading-relaxed mb-6">{v.description}</p>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
                                                <span className="text-xs font-bold text-white">Dose {v.currentDose} of {v.doses}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5">
                                                    Details
                                                </Button>
                                                {v.status !== 'completed' && (
                                                    <Button size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white">
                                                        Mark Done
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            
                            <button className="h-full min-h-[200px] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-4 text-slate-500 group">
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                                    <Plus className="size-8" />
                                </div>
                                <span className="font-black text-xs uppercase tracking-widest">Add New Vaccine</span>
                            </button>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-8">
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden min-h-[400px]">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black">AI Immunization Strategy</CardTitle>
                                        <CardDescription>Advanced predictive scheduling and regional compliance analysis.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="prose prose-invert max-w-none">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <div className="size-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        <p className="text-emerald-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Processing Regional Health Data...</p>
                                    </div>
                                ) : aiSchedule ? (
                                    <div className="space-y-6">
                                        <AIResponseCard 
                                            title="AI Immunization Strategy"
                                            source="Predictive Health Engine"
                                            content={aiSchedule}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                        <Syringe className="size-16 mb-4 opacity-10" />
                                        <p className="font-bold">Run AI Predictor to generate your personalized immunization roadmap.</p>
                                        <Button 
                                            variant="link" 
                                            className="text-emerald-400 mt-2 font-bold uppercase tracking-widest text-[10px]"
                                            onClick={runImmunoAnalysis}
                                        >
                                            Run Predictor Analysis
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="certificates" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "COVID-19 Certificate", date: "2023-05-12", size: "1.2 MB", format: "PDF" },
                                { name: "Hepatitis B Record", date: "2024-02-15", size: "0.8 MB", format: "JPG" },
                                { name: "Annual Flu Record", date: "2024-11-20", size: "1.5 MB", format: "PDF" },
                            ].map((cert, i) => (
                                <Card key={i} className="bg-black/40 border-white/5 group hover:border-white/10 transition-all cursor-pointer overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                                <FileText className="size-6" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Download className="size-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Share2 className="size-4" /></button>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-sm text-white mb-1 truncate">{cert.name}</h4>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>{cert.date}</span>
                                            <span>{cert.format} · {cert.size}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            
                            <button className="aspect-video rounded-[2rem] border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 group">
                                <Plus className="size-6" />
                                <span className="font-black text-[9px] uppercase tracking-widest">Add Certificate</span>
                            </button>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
