import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Info, ArrowRight, Zap, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Term {
    id: string;
    title: string;
    description: string;
    category: "Cardiology" | "Neurology" | "Metabolic";
    intensity: "Low" | "Moderate" | "Critical";
}

const MEDICAL_KNOWLEDGE: Term[] = [
    {
        id: "1",
        title: "BPM Variance",
        description: "The fluctuation in intervals between heartbeats. Higher variance often indicates better cardiovascular fitness and stress resilience.",
        category: "Cardiology",
        intensity: "Moderate"
    },
    {
        id: "2",
        title: "Neural Synchronization",
        description: "The degree to which different regions of the brain are firing in rhythmic patterns. Essential for deep focus and cognitive recovery.",
        category: "Neurology",
        intensity: "Critical"
    },
    {
        id: "3",
        title: "Metabolic Efficiency",
        description: "How effectively your body converts nutrients into energy. High efficiency translates to sustained vitality throughout the day.",
        category: "Metabolic",
        intensity: "Low"
    },
    {
        id: "4",
        title: "Circadian Phase",
        description: "Your internal 24-hour clock that regulates sleep-wake cycles and metabolic peak times.",
        category: "Neurology",
        intensity: "Moderate"
    }
];

export function MedicalIntelligence() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

    const filteredTerms = MEDICAL_KNOWLEDGE.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group"
        >
            <div className="absolute -top-24 -left-24 size-48 bg-purple-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-400" />
                        Medical Intelligence Base
                    </h3>
                    <p className="text-white/40 text-sm mt-1">Contextual health wisdom at your core</p>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Brain className="size-4 text-purple-400" />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6 z-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search health concepts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10 transition-all"
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 z-10">
                {filteredTerms.map((term) => (
                    <motion.div
                        key={term.id}
                        layout
                        onClick={() => setSelectedTerm(selectedTerm?.id === term.id ? null : term)}
                        className={cn(
                            "p-4 rounded-2xl border transition-all cursor-pointer group/card",
                            selectedTerm?.id === term.id
                                ? "bg-purple-500/10 border-purple-400/30 shadow-[0_0_16px_rgba(167,139,250,0.1)]"
                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20"
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{term.category}</span>
                            <div className={cn(
                                "size-1.5 rounded-full",
                                term.intensity === "Critical" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" :
                                    term.intensity === "Moderate" ? "bg-amber-500" : "bg-emerald-500"
                            )} />
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1 group-hover/card:text-purple-300 transition-colors">{term.title}</h4>

                        <AnimatePresence>
                            {selectedTerm?.id === term.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-xs text-white/50 leading-relaxed mt-2 pt-2 border-t border-white/10">
                                        {term.description}
                                    </p>
                                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 mt-3 uppercase tracking-tighter hover:gap-2 transition-all">
                                        Deep Dive in Papers <ArrowRight className="size-3" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {filteredTerms.length === 0 && (
                    <div className="text-center py-8">
                        <Info className="size-8 text-white/10 mx-auto mb-3" />
                        <p className="text-sm text-white/30">No intelligence entries found.</p>
                    </div>
                )}
            </div>

            {/* AI Assistant Hook */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-between group/hook cursor-pointer">
                <div>
                    <div className="text-xs font-bold text-white">Ask The Sentinel</div>
                    <div className="text-[10px] text-white/40">Ask anything about your clinical data</div>
                </div>
                <Zap className="size-4 text-purple-400 group-hover/hook:scale-125 transition-transform" />
            </div>
        </motion.div>
    );
}
