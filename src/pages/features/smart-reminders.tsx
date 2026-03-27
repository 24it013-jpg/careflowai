import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Clock, CheckCircle, Bell, Plus, Calendar, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Reminder {
    id: string;
    medication: string;
    dosage: string;
    time: string;
    taken: boolean;
    type: "pill" | "liquid" | "injection";
}

const INITIAL_REMINDERS: Reminder[] = [
    { id: "1", medication: "Lisinopril", dosage: "10mg", time: "08:00 AM", taken: false, type: "pill" },
    { id: "2", medication: "Vitamin D3", dosage: "2000 IU", time: "08:00 AM", taken: true, type: "pill" },
    { id: "3", medication: "Metformin", dosage: "500mg", time: "01:00 PM", taken: false, type: "pill" },
    { id: "4", medication: "Insulin Glargine", dosage: "20 units", time: "09:00 PM", taken: false, type: "injection" },
];

export default function SmartReminders() {
    const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const markTaken = (id: string) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: true } : r));
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ec4899', '#a855f7', '#3b82f6'] // Pink, Purple, Blue
        });
    };

    const undoTaken = (id: string) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: false } : r));
    };

    const progress = (reminders.filter(r => r.taken).length / reminders.length) * 100;

    return (
        <div className="min-h-screen bg-[#060810] text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-pink-500/30">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] right-[15%] w-[700px] h-[700px] rounded-full blur-[150px]" style={{background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute bottom-[5%] left-[5%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute top-[60%] left-[50%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-light tracking-tight flex items-center gap-3 mb-2 text-white">
                            <span className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)] backdrop-blur-sm">
                                <Bell className="size-6" />
                            </span>
                            Smart Reminders
                        </h1>
                        <p className="text-white/50 text-lg font-light">Stay on track with your medication adherence.</p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                        <div className="text-right">
                            <div className="text-[10px] text-white/40 uppercase font-mono tracking-widest mb-1">Today's Progress</div>
                            <div className="text-3xl font-light text-white tabular-nums tracking-tighter">{Math.round(progress)}%</div>
                        </div>
                        <div className="relative size-16">
                            <svg className="size-full -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-white/5" fill="none" />
                                <circle
                                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4"
                                    className="text-pink-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                                    fill="none"
                                    strokeDasharray="176"
                                    strokeDashoffset={176 - (176 * progress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Zap className="size-5 text-pink-400 fill-pink-500/20" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Schedule */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="premium-glass-panel rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <h3 className="text-xl font-light text-white flex items-center gap-3">
                                    <Calendar className="size-5 text-pink-400" />
                                    Today's Schedule
                                </h3>
                                <div className="text-sm text-white/40 font-mono">
                                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {reminders.map((reminder) => (
                                    <motion.div
                                        key={reminder.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm",
                                            reminder.taken
                                                ? "bg-green-500/5 border-green-500/20 opacity-60 hover:opacity-100"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "size-12 rounded-xl flex items-center justify-center transition-colors shadow-lg",
                                                reminder.taken ? "bg-green-500/20 text-green-400" : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                            )}>
                                                {reminder.type === "pill" ? <Pill className="size-6" /> : <Plus className="size-6" />}
                                            </div>
                                            <div>
                                                <h4 className={cn("text-lg font-medium transition-all", reminder.taken ? "text-white/40 line-through decoration-white/20" : "text-white")}>
                                                    {reminder.medication}
                                                </h4>
                                                <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                                                    <span className="font-mono">{reminder.dosage}</span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="flex items-center gap-1.5 font-mono">
                                                        <Clock className="size-3.5" /> {reminder.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {reminder.taken ? (
                                                <Button
                                                    onClick={() => undoTaken(reminder.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-white/30 hover:text-white hover:bg-white/10 rounded-full"
                                                    title="Undo"
                                                >
                                                    <X className="size-5" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => markTaken(reminder.id)}
                                                    className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 hover:from-pink-500 hover:via-rose-400 hover:to-pink-600 text-white rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all hover:scale-105 active:scale-95 font-medium px-6 border-0"
                                                >
                                                    Take
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats or Add */}
                    <div className="space-y-6">
                        <div className="premium-glass-panel border-pink-500/20 rounded-3xl p-6 relative overflow-hidden group" style={{background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.05) 100%)'}}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <Plus className="size-32 text-pink-400 rotate-12" />
                            </div>
                            <h3 className="text-xl font-light mb-6 flex items-center gap-3 text-white relative z-10">
                                <span className="p-1.5 bg-pink-500/20 rounded-lg border border-pink-500/30"><Plus className="size-4 text-pink-400" /></span>
                                Refill Predictor
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Metformin</span>
                                        <span className="text-pink-400 font-bold font-mono text-xs border border-pink-500/30 px-1.5 py-0.5 rounded bg-pink-500/10">5 DAYS LEFT</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500 w-[15%] shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Lisinopril</span>
                                        <span className="text-emerald-400 font-bold font-mono text-xs border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">20 DAYS LEFT</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-medium rounded-xl h-10 transition-all">
                                    Order Refills
                                </Button>
                            </div>
                        </div>

                        <div className="premium-glass-panel rounded-3xl p-6">
                            <h3 className="text-lg font-light text-white mb-4">Adherence Streak</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-4xl font-light text-white tracking-tighter">12 <span className="text-lg text-white/40">Days</span></span>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="size-8 rounded-full bg-green-500 border-[3px] border-black flex items-center justify-center shadow-lg">
                                            <CheckCircle className="size-4 text-black fill-black/10" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-white/40">Keep it up! You're doing great.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
