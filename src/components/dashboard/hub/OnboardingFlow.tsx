import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Target, Zap, Sparkles, ChevronRight, Check, Activity, Moon, Dumbbell, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingFlowProps {
    onComplete: () => void;
}

const STEPS = [
    {
        id: "welcome",
        title: "Welcome to CAREflow AI",
        subtitle: "Your personal health intelligence platform",
        icon: Heart,
        color: "from-rose-500 to-pink-600",
        content: null,
    },
    {
        id: "profile",
        title: "Tell Us About You",
        subtitle: "Personalize your health experience",
        icon: Sparkles,
        color: "from-blue-500 to-indigo-600",
        content: "profile",
    },
    {
        id: "goals",
        title: "Set Your Health Goals",
        subtitle: "What matters most to you?",
        icon: Target,
        color: "from-emerald-500 to-teal-600",
        content: "goals",
    },
    {
        id: "connect",
        title: "You're All Set!",
        subtitle: "Your health journey begins now",
        icon: Zap,
        color: "from-amber-500 to-orange-600",
        content: "complete",
    },
];

const GOALS = [
    { id: "sleep", label: "Better Sleep", icon: Moon },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "nutrition", label: "Nutrition", icon: Apple },
    { id: "vitals", label: "Monitor Vitals", icon: Activity },
    { id: "stress", label: "Reduce Stress", icon: Heart },
    { id: "weight", label: "Weight Goals", icon: Target },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [step, setStep] = useState(0);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const toggleGoal = (id: string) => {
        setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6"
        >
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 size-96 bg-blue-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/5 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-10">
                    {STEPS.map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ width: i === step ? 24 : 8, opacity: i <= step ? 1 : 0.3 }}
                            className={cn("h-2 rounded-full transition-all", i <= step ? "bg-white" : "bg-white/20")}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className={cn("size-20 rounded-3xl bg-gradient-to-br mx-auto mb-6 flex items-center justify-center shadow-2xl", current.color)}
                        >
                            <current.icon className="size-10 text-white" />
                        </motion.div>

                        <h1 className="text-3xl font-black text-white mb-2">{current.title}</h1>
                        <p className="text-white/40 mb-10">{current.subtitle}</p>

                        {/* Step Content */}
                        {current.content === "profile" && (
                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-2">Your Name</label>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Alex Johnson"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-2">Age</label>
                                    <input
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        placeholder="28"
                                        type="number"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {current.content === "goals" && (
                            <div className="grid grid-cols-3 gap-3">
                                {GOALS.map(goal => (
                                    <motion.button
                                        key={goal.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleGoal(goal.id)}
                                        className={cn(
                                            "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                                            selectedGoals.includes(goal.id)
                                                ? "bg-blue-500/20 border-blue-500/40 text-white"
                                                : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70"
                                        )}
                                    >
                                        <goal.icon className="size-6" />
                                        <span className="text-xs font-bold">{goal.label}</span>
                                        {selectedGoals.includes(goal.id) && (
                                            <Check className="size-3 text-blue-400" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {current.content === "complete" && (
                            <div className="space-y-3">
                                {["AI Health Forecasting Active", "Personalized Insights Ready", "Community Sync Enabled"].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                                    >
                                        <div className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Check className="size-3 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-white/70">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3 mt-10">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all"
                        >
                            Back
                        </button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
                        className={cn(
                            "flex-1 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all",
                            `bg-gradient-to-r ${current.color}`
                        )}
                    >
                        {isLast ? "Enter CAREflow" : "Continue"}
                        <ChevronRight className="size-4" />
                    </motion.button>
                </div>

                {step === 0 && (
                    <button onClick={onComplete} className="w-full mt-4 text-xs text-white/20 hover:text-white/40 transition-colors">
                        Skip for now
                    </button>
                )}
            </div>
        </motion.div>
    );
}
