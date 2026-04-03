import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const SHORTCUT_GROUPS = [
    {
        title: "Navigation",
        shortcuts: [
            { keys: ["H"], description: "Dashboard Home" },
            { keys: ["M"], description: "Medications" },
            { keys: ["S"], description: "Symptom Checker" },
            { keys: ["T"], description: "Telemedicine" },
        ]
    },
    {
        title: "Arena",
        shortcuts: [
            { keys: ["A"], description: "Achievements" },
            { keys: ["Q"], description: "Daily Quests" },
        ]
    },
    {
        title: "Health Tools",
        shortcuts: [
            { keys: ["J"], description: "Mood Journal" },
            { keys: ["P"], description: "Sleep Visualizer" },
        ]
    },
    {
        title: "General",
        shortcuts: [
            { keys: ["?"], description: "Show this help panel" },
            { keys: ["Esc"], description: "Close any panel" },
        ]
    }
];

export function KeyboardShortcutsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    useKeyboardShortcuts();

    useEffect(() => {
        const open = () => setIsOpen(true);
        window.addEventListener("careflow:shortcuts-open", open);
        return () => window.removeEventListener("careflow:shortcuts-open", open);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            {/* Trigger button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs font-bold shadow-lg shadow-black/20"
                title="Keyboard shortcuts (?)"
            >
                <Keyboard className="size-3.5" />
                <span className="hidden sm:inline">Shortcuts</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">?</kbd>
            </motion.button>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="pointer-events-auto w-full max-w-2xl bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center gap-3 p-6 border-b border-white/5">
                                    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Keyboard className="size-5 text-white/60" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Keyboard Shortcuts</h2>
                                        <p className="text-xs text-white/30">Power-user navigation</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="ml-auto size-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>

                                {/* Shortcuts Grid */}
                                <div className="p-6 grid grid-cols-2 gap-6">
                                    {SHORTCUT_GROUPS.map((group) => (
                                        <div key={group.title}>
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">{group.title}</p>
                                            <div className="space-y-2">
                                                {group.shortcuts.map((shortcut) => (
                                                    <div key={shortcut.description} className="flex items-center justify-between">
                                                        <span className="text-sm text-white/50">{shortcut.description}</span>
                                                        <div className="flex items-center gap-1">
                                                            {shortcut.keys.map(k => (
                                                                <kbd key={k} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/60 font-mono">
                                                                    {k}
                                                                </kbd>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-6 pb-5 text-center">
                                    <p className="text-[10px] text-white/20">Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Esc</kbd> to close</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
