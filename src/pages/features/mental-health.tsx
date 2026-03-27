import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Smile, Frown, Meh, Sun, Moon, Music, ChevronRight, Wind, Zap } from "lucide-react";
import { cn } from "@/lib/utils";


export default function MentalHealthMonitor() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[110px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Brain className="size-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">Mind Monitor</h1>
                            <p className="text-sm text-white/40">Cognitive wellness tracking · AI-driven neural patterns</p>
                        </div>
                    </motion.div>
                </header>

                {/* Mood Selector */}
                <section className="p-10 rounded-[2.5rem] premium-glass-panel border-white/5 mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                    <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-10 text-center">Current Emotional State</h2>
                    <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        {[
                            { icon: Smile, label: "Great", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", shadow: "shadow-emerald-500/10" },
                            { icon: Meh, label: "Okay", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", shadow: "shadow-amber-500/10" },
                            { icon: Frown, label: "Low", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", shadow: "shadow-rose-500/10" },
                        ].map((mood) => (
                            <motion.button
                                key={mood.label}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedMood(mood.label)}
                                className={cn(
                                    "flex flex-col items-center gap-4 p-6 rounded-[2rem] transition-all w-40 border-2 backdrop-blur-md",
                                    selectedMood === mood.label
                                        ? `bg-white/10 ${mood.border} shadow-2xl ${mood.shadow}`
                                        : "bg-white/[0.03] border-white/5 hover:border-white/10 shadow-sm"
                                )}
                            >
                                <div className={cn("p-5 rounded-2xl transition-all group-hover:scale-110", mood.bg, selectedMood === mood.label ? "bg-opacity-30" : "")}>
                                    <mood.icon className={cn("size-8", mood.color)} />
                                </div>
                                <span className={cn("font-black text-[10px] uppercase tracking-widest transition-colors", selectedMood === mood.label ? "text-white" : "text-white/30")}>
                                    {mood.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Sleep Quality */}
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5 group hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-white/40 uppercase tracking-widest flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                                    <Moon className="size-4" />
                                </div>
                                Circadian Quality
                            </h3>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/30 tracking-tighter uppercase">
                                7-Day Matrix
                            </div>
                        </div>

                        <div className="flex items-end h-48 gap-3 mb-8 px-2">
                            {[6, 7, 5.5, 8, 7.5, 6, 8.5].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(val / 9) * 100}%` }}
                                        whileHover={{ scaleX: 1.1 }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="w-full bg-gradient-to-t from-indigo-600/40 to-indigo-400/50 rounded-xl relative group-hover/bar:from-indigo-500 transition-colors shadow-lg shadow-indigo-500/5"
                                    />
                                    <span className="text-[9px] font-bold text-white/20 uppercase">Day {i+1}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 pt-6">
                            <div>
                                <span className="text-3xl font-black text-white tracking-tight">7<span className="text-sm text-white/30 font-bold ml-1">h</span> 45<span className="text-sm text-white/30 font-bold ml-1">m</span></span>
                                <p className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-widest">Avg. Rest Duration</p>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-400 text-xs font-black flex items-center gap-1 justify-end bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                    <Zap className="size-3" /> +5%
                                </span>
                                <p className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest">Efficiency Trend</p>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5 h-full">
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                                <Sun className="size-4" />
                            </div>
                            Neural Resources
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "5-Min Anxiety Relief", type: "Neural Meditation", icon: Wind, color: "text-blue-400", bg: "bg-blue-500/5" },
                                { title: "Focus Flow", type: "Gamma Soundscape", icon: Music, color: "text-pink-400", bg: "bg-pink-500/5" },
                                { title: "Sleep Hygiene 101", type: "Cognitive Guide", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-500/5" },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ x: 8 }}
                                    className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-purple-500/20 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn("p-3 rounded-2xl transition-colors group-hover:scale-110 duration-300 border border-white/5", item.bg, item.color)}>
                                            <item.icon className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover:text-purple-200 transition-colors">{item.title}</h4>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{item.type}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-4 text-white/10 group-hover:text-white transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Explore Library
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>

    );
}
