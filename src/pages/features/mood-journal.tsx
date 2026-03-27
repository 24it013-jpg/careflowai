import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MOODS = [
    { emoji: "😄", label: "Great", value: 5, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { emoji: "🙂", label: "Good", value: 4, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    { emoji: "😐", label: "Okay", value: 3, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    { emoji: "😔", label: "Low", value: 2, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
    { emoji: "😞", label: "Bad", value: 1, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
];

const TAGS = ["Anxious", "Energetic", "Focused", "Tired", "Stressed", "Calm", "Happy", "Sad", "Motivated", "Overwhelmed", "Grateful", "Irritable"];

const PAST_ENTRIES = [
    { date: "Feb 17", mood: 4, emoji: "🙂", tags: ["Focused", "Energetic"], note: "Had a productive morning. Workout felt great." },
    { date: "Feb 16", mood: 3, emoji: "😐", tags: ["Tired", "Stressed"], note: "Long day at work. Skipped lunch." },
    { date: "Feb 15", mood: 5, emoji: "😄", tags: ["Happy", "Motivated"], note: "Best sleep in weeks. Feeling unstoppable." },
    { date: "Feb 14", mood: 2, emoji: "😔", tags: ["Anxious", "Overwhelmed"], note: "Too much on my plate today." },
    { date: "Feb 13", mood: 4, emoji: "🙂", tags: ["Calm", "Grateful"], note: "Good meditation session. Feeling balanced." },
];

// 7x4 heatmap grid (28 days)
const HEATMAP = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    mood: Math.floor(Math.random() * 5) + 1,
}));

const MOOD_COLORS = ["", "bg-red-500/60", "bg-orange-500/60", "bg-amber-500/60", "bg-blue-500/60", "bg-emerald-500/60"];

const AI_INSIGHTS = [
    "Your mood is 23% higher on days you log 7+ hours of sleep.",
    "Stress tags appear most on Mondays and Thursdays.",
    "Your best moods correlate with morning workouts.",
    "You've maintained a positive mood trend for 5 consecutive days.",
];

export default function MoodJournal() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [note, setNote] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = () => {
        if (!selectedMood) return;
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setSelectedMood(null);
        setSelectedTags([]);
        setNote("");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[110px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Brain className="size-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white">Mood Journal</h1>
                    <p className="text-sm text-white/40">Daily emotional tracking · AI pattern analysis</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Log Today's Mood */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8">How are you feeling today?</h3>

                        {/* Mood Picker */}
                        <div className="flex gap-4 mb-8">
                            {MOODS.map(mood => (
                                <motion.button
                                    key={mood.value}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedMood(mood.value)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all duration-300",
                                        selectedMood === mood.value 
                                            ? mood.bg.replace("border-", "border-indigo-500/50 ") + " shadow-lg shadow-indigo-500/10"
                                            : "bg-white/[0.03] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <span className="text-4xl filter drop-shadow-md">{mood.emoji}</span>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedMood === mood.value ? mood.color : "text-white/30")}>{mood.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="mb-8">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Descripors & Context</p>
                            <div className="flex flex-wrap gap-2.5">
                                {TAGS.map(tag => (
                                    <motion.button
                                        key={tag}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                            "px-4 py-2 rounded-2xl text-xs font-bold border transition-all",
                                            selectedTags.includes(tag)
                                                ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/10"
                                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                        )}
                                    >
                                        {tag}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Voice your thoughts... what's on your mind?"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 resize-none h-32 transition-all"
                        />

                        <motion.button
                            whileHover={selectedMood ? { scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" } : {}}
                            whileTap={selectedMood ? { scale: 0.98 } : {}}
                            onClick={handleSubmit}
                            disabled={!selectedMood}
                            className={cn(
                                "w-full mt-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
                                selectedMood
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/20"
                                    : "bg-white/5 text-white/20 cursor-not-allowed"
                            )}
                        >
                            {submitted ? "✓ Insight Logged" : "Sync Today's Reflection"}
                        </motion.button>
                    </div>

                    {/* Past Entries */}
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <TrendingUp className="size-4 text-purple-400" /> Recent Reflection History
                        </h3>
                        <div className="space-y-4">
                            {PAST_ENTRIES.map((entry, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                    className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                    <span className="text-3xl filter drop-shadow-sm">{entry.emoji}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-black text-white">{entry.date}</span>
                                            <div className="flex gap-1.5">
                                                {entry.tags.map(t => (
                                                    <span key={t} className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400/80 border border-purple-500/20">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/40 leading-relaxed font-medium">{entry.note}</p>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <div key={j} className={cn("size-2 rounded-full", j < entry.mood ? "bg-purple-500" : "bg-white/10")} />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    {/* 28-Day Heatmap */}
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5">
                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calendar className="size-4 text-pink-400" /> 28-Day Mood Map
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                            {HEATMAP.map((d, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    className={cn("aspect-square rounded-[4px] shadow-sm", MOOD_COLORS[d.mood])}
                                    title={`Day ${d.day}: ${MOODS[d.mood - 1]?.label}`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase">Low</span>
                            <div className="flex gap-1.5">
                                {MOOD_COLORS.slice(1).map((c, i) => (
                                    <div key={i} className={cn("size-2 rounded-sm", c)} />
                                ))}
                            </div>
                            <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase">High</span>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="p-8 rounded-[2.5rem] premium-glass-panel border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
                        <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="size-4 animate-pulse" /> Neural Insights
                        </h3>
                        <div className="space-y-4">
                            {AI_INSIGHTS.map((insight, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.3 }}
                                    className="flex gap-3 text-xs text-white/60 leading-relaxed font-medium">
                                    <div className="size-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                    {insight}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Trend Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-8 rounded-[2.5rem] premium-glass-panel border-white/5"
            >
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <TrendingUp className="size-4 text-indigo-400" /> Weekly Mood Trajectory
                </h3>
                <div className="flex items-end gap-3 h-32 px-4">
                    {PAST_ENTRIES.slice().reverse().map((e, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${e.mood * 20}%` }}
                                whileHover={{ scaleX: 1.1 }}
                                className="w-full rounded-xl bg-gradient-to-t from-purple-600/50 to-indigo-500/50 shadow-lg shadow-purple-500/5 group-hover:from-purple-500 group-hover:to-indigo-400 transition-all"
                            />
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{e.date.split(" ")[1]}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
    );
}

