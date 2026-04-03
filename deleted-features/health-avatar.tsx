import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Moon, Brain, Dumbbell, Droplets, Star, TrendingUp, Award, Shield, Sparkles, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATS = [
    { label: "Vitality", value: 88, color: "from-rose-500 to-pink-600", icon: Heart, bg: "bg-rose-500/10", desc: "Cardiac & Circulatory Health" },
    { label: "Energy", value: 74, color: "from-amber-500 to-orange-600", icon: Zap, bg: "bg-amber-500/10", desc: "Metabolic Efficiency" },
    { label: "Recovery", value: 82, color: "from-indigo-500 to-blue-600", icon: Moon, bg: "bg-indigo-500/10", desc: "Sleep & Repair Cycles" },
    { label: "Focus", value: 91, color: "from-purple-500 to-violet-600", icon: Brain, bg: "bg-purple-500/10", desc: "Cognitive Performance" },
    { label: "Strength", value: 67, color: "from-orange-500 to-red-600", icon: Dumbbell, bg: "bg-orange-500/10", desc: "Musculoskeletal Output" },
    { label: "Hydration", value: 63, color: "from-cyan-500 to-blue-600", icon: Droplets, bg: "bg-cyan-500/10", desc: "Internal Homeostasis" },
];

const CURRENT_LEVEL = 3;
const XP_PROGRESS = 65;

const AVATAR_TRAITS = [
    { label: "Class", value: "Health Sentinel", color: "text-blue-400" },
    { label: "Title", value: "The Consistent", color: "text-amber-400" },
    { label: "Aura", value: "Emerald Vitality", color: "text-emerald-400" },
    { label: "Rank", value: "Diamond III", color: "text-cyan-400" },
];

export default function HealthAvatar() {
    const overallScore = Math.round(STATS.reduce((s, st) => s + st.value, 0) / STATS.length);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Background architectural elements */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-5 mb-3">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-white/10 group">
                                <Shield className="size-8 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Identity Core</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Biometric Evolution & Avatar Status</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 border-none rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                            Sync External Data
                        </Button>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Panel: The Avatar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5"
                    >
                        <div className="premium-glass-panel rounded-[3.5rem] p-10 md:p-14 border border-white/10 relative overflow-hidden flex flex-col items-center">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                            
                            {/* Avatar Stage */}
                            <div className="relative mb-14">
                                {/* Outer energy rings */}
                                <motion.div 
                                    animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-40px] rounded-full border border-dashed border-emerald-500/20" 
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-20px] rounded-full border border-emerald-500/40" 
                                />
                                
                                <div className="relative size-56 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.1)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
                                    <motion.div 
                                        animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-[120px] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] select-none"
                                    >
                                        🧬
                                    </motion.div>
                                    
                                    {/* Scanline Effect */}
                                    <motion.div 
                                        animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-px bg-emerald-400/30 blur-sm" 
                                    />
                                </div>

                                {/* Level Floating Badge */}
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-amber-500 border border-amber-300 text-slate-900 font-black text-xs uppercase tracking-widest shadow-xl"
                                >
                                    Level {CURRENT_LEVEL}
                                </motion.div>
                            </div>

                            <div className="text-center w-full relative z-10">
                                <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Sentinel Apex</h2>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-10">Identity Verified · Tier 03 Access</p>
                                
                                {/* Progress Section */}
                                <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Evolution Progress</p>
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{XP_PROGRESS}% Towards Tier 04</p>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${XP_PROGRESS}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Overall Core</p>
                                            <p className="text-3xl font-black text-white">{overallScore}<span className="text-xs text-white/20 ml-1">BPS</span></p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Rank Status</p>
                                            <p className="text-3xl font-black text-emerald-400">Elite</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Traits Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {AVATAR_TRAITS.map(trait => (
                                        <div key={trait.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">{trait.label}</span>
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", trait.color)}>{trait.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Detailed Metadata */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Attributes Grid */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                <TrendingUp className="size-4" /> Biometric Attributes
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {STATS.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 group hover:border-white/20 transition-all hover:bg-white/[0.05]"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn("size-12 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform", stat.bg)}>
                                                <stat.icon className="size-6 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-white tracking-tighter">{stat.value}<span className="text-[10px] text-white/20 ml-1">/100</span></p>
                                                <p className={cn("text-[8px] font-black uppercase tracking-widest", stat.color.replace('from-', 'text-'))}>{stat.label}</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-white/30 font-medium mb-4">{stat.desc}</p>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.value}%` }}
                                                transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                                                className={cn("h-full bg-gradient-to-r shadow-lg", stat.color)} 
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Evolution Path */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                            className="premium-glass-panel rounded-[2.5rem] p-10 border border-white/10"
                        >
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">Evolution Vector</h3>
                            <div className="flex items-center gap-0">
                                {["Base", "Core", "Sentinel", "Guardian", "Elite", "Legend"].map((stage, i) => (
                                    <div key={stage} className="flex items-center flex-1 group cursor-pointer">
                                        <div className={cn(
                                            "size-10 rounded-2xl flex items-center justify-center text-[10px] font-black border-2 shrink-0 transition-all",
                                            i < CURRENT_LEVEL 
                                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                                                : i === CURRENT_LEVEL
                                                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                                : "bg-white/5 border-white/10 text-white/20"
                                        )}>
                                            {i < CURRENT_LEVEL ? "✓" : i + 1}
                                        </div>
                                        {i < 5 && (
                                            <div className={cn("flex-1 h-px transition-colors", i < CURRENT_LEVEL ? "bg-emerald-500/30" : "bg-white/10")} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                {["Novice", "Internal", "Sentinel", "Guardian", "Apex", "Divine"].map((stage, i) => (
                                    <div key={stage} className="text-center w-10">
                                        <p className={cn("text-[9px] font-black uppercase tracking-widest", i === CURRENT_LEVEL ? "text-blue-400" : "text-white/20")}>{stage}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recommendation Banner */}
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-white/10 flex items-center justify-between group cursor-pointer hover:from-blue-600/30 hover:to-emerald-600/30 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="size-14 rounded-3xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform">
                                    <Sparkles className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white tracking-tight leading-none mb-1">Upgrade Potential</h4>
                                    <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest italic">Neural pattern suggests rapid evolution possible in 'Focus' category.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-white hover:bg-transparent group-hover:translate-x-2 transition-transform">
                                <ChevronRight className="size-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AttributeRadar() {
    // This would be a SVG radar chart in a real implementation
    // For now we'll skip to keep it clean and focused on the premium aesthetics
    return null;
}
