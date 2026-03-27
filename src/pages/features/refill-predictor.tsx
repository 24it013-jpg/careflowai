import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, RefreshCcw, TrendingDown, Check, Package, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RefillPredictor() {
    const [medications, setMedications] = useState([
        { id: 1, name: "Atorvastatin", dosage: "20mg", stock: 12, total: 30, daysLeft: 12, status: "low" },
        { id: 2, name: "Metformin", dosage: "500mg", stock: 45, total: 60, daysLeft: 22, status: "good" },
        { id: 3, name: "Lisinopril", dosage: "10mg", stock: 4, total: 30, daysLeft: 4, status: "critical" },
    ]);

    const [orderedId, setOrderedId] = useState<number | null>(null);

    const handleOrder = (id: number) => {
        setOrderedId(id);
        setTimeout(() => {
            setMedications(medications.map(med =>
                med.id === id ? { ...med, stock: med.total, daysLeft: 30, status: "good" } : med
            ));
            setOrderedId(null);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12">
                    <h1 className="text-4xl font-light tracking-tight flex items-center gap-4 text-white mb-4">
                        <span className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-sm">
                            <RefreshCcw className="size-8" />
                        </span>
                        AI Refill Predictor
                    </h1>
                    <p className="text-white/50 text-lg font-light max-w-2xl">
                        Smart inventory tracking for your medications. Our AI predicts stock levels and auto-suggests refills.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Col: Inventory List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-light text-white">Current Inventory</h2>
                            <div className="text-xs text-white/40 font-mono border border-white/10 px-2 py-1 rounded bg-white/5">UPDATED TODAY</div>
                        </div>

                        {medications.map((med) => (
                            <motion.div
                                key={med.id}
                                layout
                                className={cn(
                                    "p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md group",
                                    med.status === "critical" ? "bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]" :
                                        med.status === "low" ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" :
                                            "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-2xl shadow-inner",
                                            med.status === "critical" ? "bg-red-500/20 text-red-400" :
                                                med.status === "low" ? "bg-amber-500/20 text-amber-400" :
                                                    "bg-cyan-500/20 text-cyan-400"
                                        )}>
                                            <Pill className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-xl text-white tracking-wide">{med.name}</h3>
                                            <p className="text-sm text-white/50">{med.dosage}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("text-3xl font-light block tabular-nums tracking-tighter",
                                            med.status === "critical" ? "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                                                med.status === "low" ? "text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" :
                                                    "text-white"
                                        )}>
                                            {med.daysLeft}
                                        </span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Days Left</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-6 relative z-10">
                                    <motion.div
                                        className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]",
                                            med.status === "critical" ? "bg-red-500 text-red-500" :
                                                med.status === "low" ? "bg-amber-500 text-amber-500" :
                                                    "bg-cyan-500 text-cyan-500"
                                        )}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(med.stock / med.total) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </div>

                                <div className="flex justify-between items-center relative z-10">
                                    <span className="text-sm text-white/40 font-mono">
                                        <span className={cn("text-white font-medium", med.status !== 'good' && "text-white/90")}>{med.stock}</span>
                                        <span className="mx-1">/</span>
                                        {med.total} <span className="hidden sm:inline">tablets</span>
                                    </span>

                                    {(med.status === "critical" || med.status === "low") && (
                                        <Button
                                            size="sm"
                                            disabled={orderedId === med.id}
                                            onClick={() => handleOrder(med.id)}
                                            className={cn("rounded-xl px-5 transition-all duration-300 border h-10 shadow-lg",
                                                orderedId === med.id
                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                    : "bg-white text-black hover:bg-white/90 border-transparent hover:scale-105 active:scale-95"
                                            )}
                                        >
                                            {orderedId === med.id ? (
                                                <span className="flex items-center gap-2"><Check className="size-4" /> Ordered</span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {med.status === "critical" && <AlertTriangle className="size-3.5" />}
                                                    Refill Now
                                                </span>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Col: Usage Stats & Prediction */}
                    <div className="space-y-6">
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <h3 className="text-xl font-light mb-6 flex items-center gap-3 text-white">
                                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                    <TrendingDown className="size-5" />
                                </div>
                                Adherence Score
                            </h3>
                            <div className="flex items-end justify-center h-48 gap-3 px-2 mb-2">
                                {[65, 80, 45, 90, 85, 95, 98].map((value, i) => (
                                    <motion.div
                                        key={i}
                                        className={cn("flex-1 rounded-t-sm relative group cursor-pointer transition-all hover:bg-cyan-400",
                                            i === 6 ? "bg-cyan-500" : "bg-cyan-900/40"
                                        )}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${value}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            {value}% Adherence
                                        </div>
                                        <div className={cn("absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none")} />
                                        {i === 6 && <div className="absolute top-0 inset-x-0 h-full bg-cyan-500 blur-[20px] opacity-20 pointer-events-none" />}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] text-white/30 px-1 font-mono uppercase tracking-widest">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <Package className="size-32 text-cyan-400 rotate-12" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[80px]" />

                            <h3 className="text-xl font-light text-white mb-3 relative z-10">Smart Auto-Refill</h3>
                            <p className="text-white/50 text-sm mb-8 max-w-[80%] leading-relaxed relative z-10">
                                Enable auto-refill to let AI order your medication when stock drops below 5 days.
                            </p>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-7 bg-cyan-500/20 border border-cyan-500/50 rounded-full p-1 cursor-pointer hover:bg-cyan-500/30 transition-colors">
                                    <motion.div
                                        className="w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                        layoutId="toggle"
                                        initial={{ x: 28 }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                                    <Zap className="size-3.5" /> AI Enabled
                                </span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
