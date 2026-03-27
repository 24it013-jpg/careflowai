import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Dumbbell, 
    ChevronRight, 
    Info, 
    Scale, 
    Ruler, 
    Activity, 
    Zap,
    History as HistoryIcon,
    CheckCircle2,
    TrendingUp,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BMIResult {
    bmi: number;
    category: "Underweight" | "Normal" | "Overweight" | "Obese";
    color: string;
    description: string;
    advice: string[];
}

export default function BMICalculator() {
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [result, setResult] = useState<BMIResult | null>(null);

    const calculateBMI = () => {
        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        const bmiValueFixed = parseFloat(bmiValue.toFixed(1));

        let category: BMIResult["category"] = "Normal";
        let color = "text-emerald-400";
        let description = "Your weight is within the healthy range for your height.";
        let advice = [
            "Maintain your current balanced diet.",
            "Continue regular physical activity (150 mins/week).",
            "Monitor your BMI every 3 months."
        ];

        if (bmiValueFixed < 18.5) {
            category = "Underweight";
            color = "text-blue-400";
            description = "You are below the healthy weight range for your height.";
            advice = [
                "Focus on nutrient-dense, high-calorie foods.",
                "Consult a nutritionist for a healthy weight-gain plan.",
                "Include strength training to build muscle mass."
            ];
        } else if (bmiValueFixed >= 25 && bmiValueFixed < 30) {
            category = "Overweight";
            color = "text-amber-400";
            description = "You are slightly above the healthy weight range.";
            advice = [
                "Incorporate more fiber and whole grains into your diet.",
                "Increase daily cardiovascular exercise.",
                "Limit processed sugars and saturated fats."
            ];
        } else if (bmiValueFixed >= 30) {
            category = "Obese";
            color = "text-rose-400";
            description = "Your weight is significantly higher than the healthy range.";
            advice = [
                "Consider consulting a healthcare provider for a clinical assessment.",
                "Focus on sustainable lifestyle changes, not crash diets.",
                "Start with low-impact exercises like walking or swimming."
            ];
        }

        setResult({
            bmi: bmiValueFixed,
            category,
            color,
            description,
            advice
        });
    };

    useEffect(() => {
        calculateBMI();
    }, [weight, height]);

    return (
        <div className="min-h-screen bg-[#020617] text-white/90 p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-hidden relative">
            {/* Neural Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 space-y-8 pb-20">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                <Dumbbell className="size-6" />
                            </div>
                            <span className="text-xs font-black tracking-[0.3em] text-blue-400 uppercase">Fitness Core</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">BMI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Analysis Terminal</span></h1>
                        <p className="text-white/40 mt-2 font-medium">Precision biometric evaluation and health synthesis.</p>
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">System Status</p>
                            <p className="text-xs font-bold text-emerald-400">Biological Sync Active</p>
                        </div>
                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Interactive Controls */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-glass-panel rounded-[2.5rem] p-8 space-y-10 border-white/5 shadow-2xl"
                        >
                            {/* Height Input */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            <Ruler className="size-4" />
                                        </div>
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Height</label>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white">{height}</span>
                                        <span className="text-xs font-bold text-white/30 ml-1 uppercase">cm</span>
                                    </div>
                                </div>
                                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <input 
                                        type="range" 
                                        min="100" 
                                        max="250" 
                                        value={height} 
                                        onChange={(e) => setHeight(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    />
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                                        style={{ width: `${((height - 100) / 150) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    <span>100cm</span>
                                    <span>250cm</span>
                                </div>
                            </div>

                            {/* Weight Input */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <Scale className="size-4" />
                                        </div>
                                        <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Weight</label>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white">{weight}</span>
                                        <span className="text-xs font-bold text-white/30 ml-1 uppercase">kg</span>
                                    </div>
                                </div>
                                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <input 
                                        type="range" 
                                        min="30" 
                                        max="200" 
                                        value={weight} 
                                        onChange={(e) => setWeight(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                                    />
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                                        style={{ width: `${((weight - 30) / 170) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    <span>30kg</span>
                                    <span>200kg</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 group transition-all"
                                    onClick={() => {/* Integration with global state could go here */}}
                                >
                                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <HistoryIcon className="size-4" />
                                    </div>
                                    <span className="font-bold text-white/70 group-hover:text-white transition-colors">Sync to Health History</span>
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4"
                        >
                            <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-white/50 leading-relaxed font-medium">
                                BMI is a screening tool, not a diagnostic one. It doesn't measure body fat directly or consider muscle mass, bone density, or overall body composition.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: Analysis Display */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={result?.category}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="premium-glass-panel rounded-[3rem] p-8 md:p-12 border-white/5 shadow-2xl relative overflow-hidden"
                            >
                                {/* Results Halo */}
                                <div className={cn(
                                    "absolute top-[-10%] right-[-10%] w-[300px] h-[300px] blur-[100px] opacity-20 pointer-events-none transition-colors duration-700",
                                    result?.color.replace('text-', 'bg-')
                                )} />

                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                    {/* Main Gauge */}
                                    <div className="relative shrink-0">
                                        <svg className="size-48 transform -rotate-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            <circle 
                                                cx="96" cy="96" r="80" 
                                                stroke="currentColor" strokeWidth="12" 
                                                fill="transparent" className="text-white/5" 
                                            />
                                            <motion.circle 
                                                cx="96" cy="96" r="80" 
                                                stroke="currentColor" strokeWidth="12" 
                                                fill="transparent" 
                                                strokeDasharray="502"
                                                strokeDashoffset={502 - (502 * (Math.min(result?.bmi || 0, 40) / 40))}
                                                className={cn("transition-all duration-1000 ease-out", result?.color)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span 
                                                key={result?.bmi}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-5xl font-black text-white"
                                            >
                                                {result?.bmi}
                                            </motion.span>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">BMI Units</p>
                                        </div>
                                    </div>

                                    {/* Diagnosis Text */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <motion.p 
                                                className={cn("text-xs font-black uppercase tracking-[0.3em] mb-1.5", result?.color)}
                                            >
                                                Metabolic Assessment
                                            </motion.p>
                                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                                {result?.category}
                                            </h2>
                                        </div>
                                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                                            {result?.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                                                <Heart className="size-3 text-rose-500" /> Vitals Synced
                                            </span>
                                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                                                <Zap className="size-3 text-amber-500" /> AI Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    {/* Advice Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <TrendingUp className="size-4" /> Actionable Recommendations
                                        </h4>
                                        <div className="space-y-3">
                                            {result?.advice.map((item, i) => (
                                                <motion.div 
                                                    key={i} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                    className="flex items-start gap-3 p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-colors"
                                                >
                                                    <CheckCircle2 className={cn("size-4 mt-0.5 shrink-0", result?.color)} />
                                                    <p className="text-sm text-white/70 group-hover:text-white transition-colors">{item}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Charts/Visuals Side */}
                                    <div className="bg-black/40 border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-4 group overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        <div className="size-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
                                            <Activity className="size-8 text-blue-400 group-hover:scale-110 transition-transform" />
                                            <div className="absolute inset-x-[-10px] h-[2px] bg-blue-500/20 animate-pulse" />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <p className="text-white font-bold mb-1">Fitness Tracking</p>
                                            <p className="text-white/40 text-xs leading-relaxed max-w-[200px]">
                                                Synchronize this data with your daily activity logs for a more complete health picture.
                                            </p>
                                        </div>
                                        
                                        <Button className="w-full mt-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold py-5">
                                            View Full Fitness Report <ChevronRight className="size-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
