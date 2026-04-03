import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Command } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AICommandModule() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Background Holographic Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                        <Sparkles className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">AI Command</h3>
                        <p className="text-xs text-slate-400">Powered by Gemini 2.0</p>
                    </div>
                </div>

                <div className="relative group/input">
                    <Command className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${isFocused ? 'text-purple-400' : 'text-slate-500'}`} />
                    <Input
                        placeholder="Ask about your health..."
                        className="pl-12 pr-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-purple-500/50 transition-all text-base shadow-inner"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <AnimatePresence>
                        {query.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center justify-center text-slate-900 transition-colors"
                            >
                                <ArrowRight className="size-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                {["Check potential interactions", "Analyze visible symptoms", "Analyze health trends"].map((suggestion, i) => (
                    <button
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-all whitespace-nowrap"
                        onClick={() => setQuery(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
