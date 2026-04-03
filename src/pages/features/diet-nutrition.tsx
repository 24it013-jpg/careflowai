import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Leaf, Flame, ChevronRight, Apple, Activity, RefreshCw, User, Scale, Ruler, Target, CheckCircle2, AlertTriangle, ArrowRight, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculateNutrition, UserNutritionStats, NutritionResult, DietPreference, Goal, ActivityLevel } from "@/lib/ai/nutrition-calculator";
import { getRecommendedMeals } from "@/lib/ai/meal-generator";
import { FoodAnalysisChat } from "@/components/dashboard/widgets/FoodAnalysisChat";
import { AIResponseCard } from "@/components/ui/ai-response-card";

export default function DietNutritionAI() {
    const [step, setStep] = useState<'onboarding' | 'results'>('onboarding');
    const [stats, setStats] = useState<UserNutritionStats>({
        age: 25,
        gender: 'male',
        weightKg: 70,
        heightCm: 175,
        activityLevel: 'moderately-active',
        goal: 'muscle-gain',
        dietPreference: 'veg'
    });
    const [results, setResults] = useState<NutritionResult | null>(null);
    const [meals, setMeals] = useState<any[]>([]);

    const handleCalculate = () => {
        const res = calculateNutrition(stats);
        setResults(res);
        const recommendedMeals = getRecommendedMeals(stats.dietPreference, stats.goal, res.targetCalories);
        setMeals(recommendedMeals);
        setStep('results');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-orange-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse delay-1000" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 ring-1 ring-orange-500/20">
                                <Utensils className="size-6" />
                            </div>
                            <span className="text-orange-400 font-bold uppercase tracking-[0.2em] text-xs">Nutrition Engine</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            Diet <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Nutrition AI</span>
                        </motion.h1>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Get a personalized nutrition plan based on your metabolic needs. Our AI calculates macros and suggests healthy meals to help you reach your goals.
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'onboarding' ? (
                        <motion.div
                            key="onboarding"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                        >
                            {/* Left Side: Information */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold">Personal Bio-Stats</h2>
                                    <p className="text-slate-400 leading-relaxed">
                                        Our AI engine uses clinical algorithms (Mifflin-St Jeor) to calculate your metabolic needs. 
                                        Provide your details to get a personalized macro-nutrient blueprint.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 text-orange-400">
                                            <Scale className="size-5" />
                                            <span className="font-bold text-sm uppercase tracking-wider">Body Weight</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="number" 
                                                value={stats.weightKg} 
                                                onChange={(e) => setStats({...stats, weightKg: Number(e.target.value)})}
                                                className="bg-transparent text-3xl font-black w-24 outline-none border-b-2 border-orange-500/20 focus:border-orange-500 transition-colors"
                                            />
                                            <span className="text-slate-500 font-bold">KG</span>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 text-blue-400">
                                            <Ruler className="size-5" />
                                            <span className="font-bold text-sm uppercase tracking-wider">Height</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="number" 
                                                value={stats.heightCm} 
                                                onChange={(e) => setStats({...stats, heightCm: Number(e.target.value)})}
                                                className="bg-transparent text-3xl font-black w-24 outline-none border-b-2 border-blue-500/20 focus:border-blue-500 transition-colors"
                                            />
                                            <span className="text-slate-500 font-bold">CM</span>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 text-emerald-400">
                                            <User className="size-5" />
                                            <span className="font-bold text-sm uppercase tracking-wider">Age & Gender</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                value={stats.age} 
                                                onChange={(e) => setStats({...stats, age: Number(e.target.value)})}
                                                className="bg-transparent text-3xl font-black w-16 outline-none border-b-2 border-emerald-500/20 focus:border-emerald-500 transition-colors"
                                            />
                                            <div className="flex flex-col gap-1">
                                                <button 
                                                    onClick={() => setStats({...stats, gender: 'male'})}
                                                    className={cn("text-[10px] px-2 py-0.5 rounded-full border border-white/10 font-bold uppercase transition-colors", stats.gender === 'male' ? "bg-blue-500 text-white border-blue-500" : "text-slate-500 hover:bg-white/5")}
                                                >Male</button>
                                                <button 
                                                    onClick={() => setStats({...stats, gender: 'female'})}
                                                    className={cn("text-[10px] px-2 py-0.5 rounded-full border border-white/10 font-bold uppercase transition-colors", stats.gender === 'female' ? "bg-rose-500 text-white border-rose-500" : "text-slate-500 hover:bg-white/5")}
                                                >Female</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="flex items-center gap-3 text-purple-400">
                                            <Leaf className="size-5" />
                                            <span className="font-bold text-sm uppercase tracking-wider">Dietary Preference</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setStats({...stats, dietPreference: 'veg'})}
                                                className={cn("flex-1 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase transition-all", stats.dietPreference === 'veg' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-white/5 text-slate-500 hover:bg-white/10")}
                                            >Vegetarian</button>
                                            <button 
                                                onClick={() => setStats({...stats, dietPreference: 'non-veg'})}
                                                className={cn("flex-1 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase transition-all", stats.dietPreference === 'non-veg' ? "bg-rose-500/20 text-rose-400 border-rose-500/50" : "bg-white/5 text-slate-500 hover:bg-white/10")}
                                            >Non-Veg</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Goal & Activity */}
                            <div className="space-y-8">
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-orange-400">
                                            <Target className="size-5" />
                                            <h3 className="font-bold uppercase tracking-widest text-sm">Primary Goal</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(['muscle-gain', 'fat-loss', 'maintenance'] as Goal[]).map((g) => (
                                                <button 
                                                    key={g}
                                                    onClick={() => setStats({...stats, goal: g})}
                                                    className={cn("px-4 py-3 rounded-2xl border border-white/10 text-xs font-bold uppercase transition-all", stats.goal === g ? "bg-orange-500 text-white border-orange-500" : "bg-white/5 text-slate-400 hover:bg-white/10")}
                                                >
                                                    {g.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-blue-400">
                                            <Activity className="size-5" />
                                            <h3 className="font-bold uppercase tracking-widest text-sm">Daily Activity Level</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {(['sedentary', 'lightly-active', 'moderately-active', 'very-active'] as ActivityLevel[]).map((level) => (
                                                <button 
                                                    key={level}
                                                    onClick={() => setStats({...stats, activityLevel: level})}
                                                    className={cn("flex items-center justify-between px-5 py-3 rounded-2xl border border-white/10 text-xs font-bold transition-all", stats.activityLevel === level ? "bg-blue-500 text-white border-blue-500" : "bg-white/5 text-slate-400 hover:bg-white/10")}
                                                >
                                                    <span className="capitalize">{level.replace('-', ' ')}</span>
                                                    {stats.activityLevel === level && <CheckCircle2 className="size-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleCalculate}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20"
                                    >
                                        Calculate Blueprint <ArrowRight className="ml-2 size-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            {/* Stats Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">BMR</p>
                                    <h4 className="text-4xl font-black">{results?.bmr}</h4>
                                    <p className="text-xs text-slate-400">Base Metabolism</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2 ring-2 ring-orange-500/20 bg-orange-500/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Target Calories</p>
                                    <h4 className="text-4xl font-black text-orange-400">{results?.targetCalories}</h4>
                                    <p className="text-xs text-slate-400">Daily Intake</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">TDEE</p>
                                    <h4 className="text-4xl font-black">{results?.tdee}</h4>
                                    <p className="text-xs text-slate-400">Total Expenditure</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Diet</p>
                                    <h4 className="text-2xl font-black uppercase tracking-widest">{stats.dietPreference === 'veg' ? "VEG" : "NON-VEG"}</h4>
                                    <p className="text-xs text-slate-400">Clinical Constraint</p>
                                </div>
                            </div>

                            {/* Macro Breakdown */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Brain className="size-6 text-orange-400" />
                                        AI Recommended Meals
                                    </h2>
                                    <div className="space-y-4">
                                        {meals.map((meal, idx) => (
                                            <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-4xl bg-white/5 size-20 flex items-center justify-center rounded-2xl ring-1 ring-white/10 group-hover:scale-110 transition-transform">{meal.image}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">{meal.type}</span>
                                                            <span className="text-sm font-black text-white/40">{meal.cal} KCAL</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold group-hover:text-orange-400 transition-colors">{meal.name}</h4>
                                                        <p className="text-xs text-slate-500 mb-2">{meal.description}</p>
                                                        <div className="flex gap-4 mt-3">
                                                            <div className="text-[10px] font-bold text-slate-500">P: <span className="text-white">{meal.protein}g</span></div>
                                                            <div className="text-[10px] font-bold text-slate-500">F: <span className="text-white">{meal.fats}g</span></div>
                                                            <div className="text-[10px] font-bold text-slate-500">C: <span className="text-white">{meal.carbs}g</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button 
                                        variant="outline"
                                        onClick={() => setStep('onboarding')}
                                        className="w-full h-14 rounded-2xl border-white/10 text-slate-400 font-bold uppercase tracking-widest hover:bg-white/5"
                                    >
                                        <RefreshCw className="mr-2 size-4" /> Recalculate Stats
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        <Sparkles className="size-6 text-orange-400" />
                                        Log Food AI
                                    </h2>
                                    <FoodAnalysisChat />
                                    
                                    <h2 className="text-2xl font-bold">Macro-Split</h2>
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-rose-400">Protein</span>
                                                <span>{results?.macros.protein}G</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '40%' }}
                                                    className="h-full bg-rose-500" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-blue-400">Carbs</span>
                                                <span>{results?.macros.carbs}G</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '35%' }}
                                                    className="h-full bg-blue-500" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-orange-400">Fats</span>
                                                <span>{results?.macros.fats}G</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '25%' }}
                                                    className="h-full bg-orange-500" 
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                                                <AlertTriangle className="size-4 text-orange-400 shrink-0 mt-0.5" />
                                                <p className="text-[10px] text-orange-200/60 leading-relaxed font-medium">
                                                    Macro calculations based on Mifflin-St Jeor formula. Ensure adequate water intake ({Math.round(stats.weightKg * 35 / 1000)}L/day).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed AI Report */}
                            <div className="lg:col-span-3 mt-12">
                                <AIResponseCard 
                                    title="Personalized Nutrition Blueprint"
                                    source="Bright Plan AI Engine"
                                    content={`
# Your Metabolic Blueprint
Based on your clinical profile, here is your personalized nutrition strategy for **${stats.goal.replace('-', ' ').toUpperCase()}**.

## Macro-Nutrient Targets
| Nutrient | Target | Calories |
| :--- | :--- | :--- |
| **Daily Calories** | **${results?.targetCalories} kcal** | 100% |
| **Protein** | ${results?.macros?.protein ?? 0}g | ${(results?.macros?.protein ?? 0) * 4} kcal |
| **Carbohydrates** | ${results?.macros?.carbs ?? 0}g | ${(results?.macros?.carbs ?? 0) * 4} kcal |
| **Fats** | ${results?.macros?.fats ?? 0}g | ${(results?.macros?.fats ?? 0) * 9} kcal |

## Recommended Meal Strategy (${stats.dietPreference.toUpperCase()})
${meals.map((meal, idx) => `
### Meal ${idx + 1}: ${meal.name}
- **Type:** ${meal.type}
- **Calories:** ${meal.calories} kcal
- **Protein:** ${meal.protein}g | **Carbs:** ${meal.carbs}g | **Fats:** ${meal.fats}g
- **Key Ingredients:** ${meal.ingredients.join(', ')}
`).join('\n')}

## Clinical Recommendations
- **Hydration:** Aim for **${(stats.weightKg * 0.035).toFixed(1)}L** of water daily.
- **Timing:** Distribute protein intake evenly across meals for optimal muscle protein synthesis.
- **Consistency:** Follow this plan for at least 4 weeks to see measurable metabolic changes.
                                    `}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
