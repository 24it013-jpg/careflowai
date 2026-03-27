import { motion } from "framer-motion";
import { Utensils, Leaf, Flame, ChevronRight, Apple, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DietNutritionAI() {

    const meals = [
        { id: 1, type: "Breakfast", name: "Avocado & Egg Toast", cal: 350, protein: "18g", fat: "12g", carb: "30g", image: "🥑" },
        { id: 2, type: "Lunch", name: "Quinoa Salmon Bowl", cal: 550, protein: "40g", fat: "20g", carb: "45g", image: "🥗" },
        { id: 3, type: "Dinner", name: "Grilled Chicken Veggies", cal: 450, protein: "35g", fat: "10g", carb: "15g", image: "🍗" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-orange-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[110px] mix-blend-screen pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Utensils className="size-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">Diet & Nutrition AI</h1>
                            <p className="text-sm text-white/40">Metabolic health optimization · Real-time nutritional analysis</p>
                        </div>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Col: Daily Overview */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Calories", val: "1,350", target: "2,000", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
                                { label: "Protein", val: "95g", target: "140g", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                                { label: "Carbs", val: "120g", target: "200g", icon: Apple, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                                { label: "Fat", val: "45g", target: "70g", icon: Leaf, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-[2rem] premium-glass-panel border-white/5 flex flex-col justify-between h-40 group hover:border-orange-500/30 transition-all"
                                >
                                    <div className={cn("p-2.5 rounded-xl w-fit border transition-transform group-hover:scale-110", stat.bg)}>
                                        <stat.icon className={cn("size-4", stat.color)} />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-black block text-white tracking-tight">{stat.val}</span>
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Target: {stat.target}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Today's Meals */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-4">Fuel Log</h3>
                            <div className="space-y-4">
                                {meals.map((meal, i) => (
                                    <motion.div
                                        key={meal.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="p-6 rounded-[2.5rem] premium-glass-panel border-white/5 flex items-center gap-6 group hover:border-orange-500/20 transition-all cursor-pointer"
                                    >
                                        <div className="size-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                                            {meal.image}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{meal.type}</p>
                                                    <h4 className="font-bold text-lg text-white group-hover:text-orange-200 transition-colors">{meal.name}</h4>
                                                </div>
                                                <span className="text-[11px] font-bold text-white/20 bg-white/5 px-3 py-1 rounded-full">{meal.cal} kcal</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20">{meal.protein} Protein</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{meal.carb} Carbs</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">{meal.fat} Fat</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-white/20 group-hover:text-white transition-colors">
                                            <ChevronRight className="size-5" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: AI Suggestions */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[2.5rem] premium-glass-panel border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="size-4 animate-pulse" /> Neural Insights
                                </h3>
                                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-white/30 hover:text-white hover:bg-white/5">
                                    <RefreshCw className="size-3 mr-1" /> SYNC
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                                        <span className="text-orange-300 font-black block mb-2 uppercase tracking-tight flex items-center gap-2">
                                            <AlertCircleIcon className="size-4" /> Protein Deficit
                                        </span>
                                        You're trending 15% below your target. Consider adding a Greek yogurt snack to optimize muscle synthesis today.
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-all cursor-pointer group">
                                    <h4 className="font-bold text-sm mb-1 text-white group-hover:text-orange-300 transition-colors">Optimal Next Snack</h4>
                                    <p className="text-xs text-white/40 mb-4">Almonds & Dark Chocolate</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold bg-black/40 px-3 py-1 rounded-full text-orange-300 border border-orange-500/20">200 KCAL</span>
                                        <span className="text-[10px] font-bold bg-black/40 px-3 py-1 rounded-full text-white/30 border border-white/10">6G PROTEIN</span>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(249, 115, 22, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-600/20"
                            >
                                Generate Weekly Plan
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function AlertCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
    )
}
