import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Wind, 
    Zap, 
    Heart, 
    Play, 
    Info, 
    Activity, 
    ChevronRight, 
    Youtube,
    CheckCircle2,
    Flame,
    Moon,
    Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHealthData } from "@/hooks/use-health-data";
import { FitnessAIAssistant } from "@/components/dashboard/ai/FitnessAIAssistant";

interface VideoSuggestion {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    category: "Breathing" | "Yoga" | "Fitness" | "Stress Relief";
    duration: string;
}

export default function FitnessYogaCenter() {
    const { vitals } = useHealthData();
    const [selectedVideo, setSelectedVideo] = useState<VideoSuggestion | null>(null);
    const [suggestions, setSuggestions] = useState<VideoSuggestion[]>([]);
    
    // User health metrics for local calculation (mocking input for now)
    const [weight, setWeight] = useState(85); // Overweight example
    const [stressLevel, setStressLevel] = useState(75); // High stress example

    useEffect(() => {
        generateSuggestions();
    }, [vitals, weight, stressLevel]);

    const generateSuggestions = () => {
        const newSuggestions: VideoSuggestion[] = [];

        // 1. Stress/BP logic
        if (stressLevel > 60 || vitals.heartRate > 90) {
            newSuggestions.push({
                id: "stress-1",
                title: "10-Minute Stress Relief Yoga",
                description: "Gentle stretches and poses to lower cortisol and relax your nervous system.",
                youtubeId: "hJbRpHZr_d0",
                category: "Stress Relief",
                duration: "10 min"
            });
        }

        // 2. Breathing/BP logic
        if (vitals.heartRate > 85 || stressLevel > 50) {
            newSuggestions.push({
                id: "breath-1",
                title: "Box Breathing for Heart Rate Control",
                description: "Clinical breathing technique used to rapidly lower blood pressure and heart rate.",
                youtubeId: "tEmt1Znux58",
                category: "Breathing",
                duration: "5 min"
            });
        }

        // 3. Weight/Overweight logic
        if (weight > 80) {
            newSuggestions.push({
                id: "fit-1",
                title: "Low-Impact Cardio for Weight Loss",
                description: "Burn calories without stressing your joints. Perfect for weight management.",
                youtubeId: "50kH47ZztHs",
                category: "Fitness",
                duration: "20 min"
            });
        }

        // Default suggestion
        newSuggestions.push({
            id: "yoga-1",
            title: "Morning Full Body Yoga",
            description: "A balanced flow to start your day with energy and focus.",
            youtubeId: "v7AYKMP6rOE",
            category: "Yoga",
            duration: "15 min"
        });

        setSuggestions(newSuggestions);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white/90 p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-hidden relative">
            {/* Neural Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 space-y-8 pb-20">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <Wind className="size-6" />
                            </div>
                            <span className="text-xs font-black tracking-[0.3em] text-emerald-400 uppercase">Vital Harmony</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Fitness & Yoga</h1>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Driven Training Center</p>
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Health Sync</p>
                            <p className="text-xs font-bold text-blue-400">BP & Heart Rate Monitored</p>
                        </div>
                        <div className="size-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4 mb-8">
                        Personalized fitness and yoga recommendations based on your real-time health data. Improve your strength, flexibility, and overall well-being with AI-guided workouts.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: AI Suggestions & Inputs */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-glass-panel rounded-[2.5rem] p-8 space-y-6 border-white/5 shadow-2xl"
                        >
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] mb-4">AI Prescriptions</h3>
                            
                            <div className="space-y-4">
                                {suggestions.map((video) => (
                                    <motion.button
                                        key={video.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedVideo(video)}
                                        className={cn(
                                            "w-full text-left p-5 rounded-3xl border transition-all flex items-center gap-4 group",
                                            selectedVideo?.id === video.id 
                                                ? "bg-emerald-500/10 border-emerald-500/30" 
                                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "size-12 rounded-2xl flex items-center justify-center shrink-0",
                                            video.category === "Breathing" ? "bg-blue-500/20 text-blue-400" :
                                            video.category === "Yoga" ? "bg-purple-500/20 text-purple-400" :
                                            video.category === "Fitness" ? "bg-orange-500/20 text-orange-400" :
                                            "bg-emerald-500/20 text-emerald-400"
                                        )}>
                                            {video.category === "Breathing" && <Wind className="size-6" />}
                                            {video.category === "Yoga" && <Smile className="size-6" />}
                                            {video.category === "Fitness" && <Flame className="size-6" />}
                                            {video.category === "Stress Relief" && <Moon className="size-6" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{video.category} • {video.duration}</span>
                                                <Youtube className="size-3 text-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm font-bold text-white truncate">{video.title}</p>
                                        </div>
                                        <ChevronRight className="size-4 text-white/20 group-hover:text-white/60 transition-colors" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Interactive Health Context */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6"
                        >
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em]">Condition Context</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] font-black text-white/20 uppercase mb-2">Weight Focus</p>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={weight} 
                                            onChange={(e) => setWeight(parseInt(e.target.value))}
                                            className="bg-transparent text-xl font-bold w-12 outline-none text-white"
                                        />
                                        <span className="text-xs text-white/30">kg</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[10px] font-black text-white/20 uppercase mb-2">Stress Level</p>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number" 
                                            value={stressLevel} 
                                            onChange={(e) => setStressLevel(parseInt(e.target.value))}
                                            className="bg-transparent text-xl font-bold w-12 outline-none text-white"
                                        />
                                        <span className="text-xs text-white/30">%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Video Player & AI Advice */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {selectedVideo ? (
                                    <motion.div 
                                        key={selectedVideo.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="premium-glass-panel rounded-[3rem] p-0 border-white/5 shadow-2xl relative overflow-hidden"
                                    >
                                        {/* Video Aspect Ratio Box */}
                                        <div className="aspect-video w-full bg-black relative">
                                            <iframe 
                                                width="100%" 
                                                height="100%" 
                                                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`} 
                                                title="YouTube video player" 
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                                allowFullScreen
                                                className="absolute inset-0"
                                            />
                                        </div>

                                        <div className="p-8 space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-black text-white tracking-tighter mb-2">{selectedVideo.title}</h2>
                                                <p className="text-white/60 font-medium text-xs leading-relaxed">{selectedVideo.description}</p>
                                            </div>
                                            <div className="h-px bg-white/10 w-full" />
                                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-blue-100/70 text-[11px] leading-relaxed italic">
                                                "AI Protocol: Focus on deep nasal inhalation. If heart rate exceeds 110 BPM, pause and rest."
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-[400px] flex flex-col items-center justify-center text-center p-8 premium-glass-panel rounded-[3rem] border-white/5 border-dashed border-2"
                                    >
                                        <Play className="size-12 text-blue-400 mb-4 opacity-50" />
                                        <h2 className="text-xl font-black text-white mb-2 tracking-tight">Select your prescription</h2>
                                        <p className="text-white/40 text-xs font-medium">Click on an AI-suggested session on the left to begin.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-[600px]">
                            <FitnessAIAssistant />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
