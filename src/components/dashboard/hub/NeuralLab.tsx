import { motion } from "framer-motion";
import { useHealthSimulator } from "@/hooks/useHealthSimulator";
import { Moon, Zap, Droplets, Info } from "lucide-react";

export function NeuralLab() {
    const {
        sleepHours,
        activityMinutes,
        hydrationLiters,
        setSimulationValue,
        simulatedScore,
        verdict,
        resetSimulation
    } = useHealthSimulator();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                        Neural Lab Simulation
                    </h3>
                    <p className="text-white/50 text-sm mt-1">Test lifestyle variables to see your future NHI</p>
                </div>
                <button
                    onClick={resetSimulation}
                    className="px-3 py-1 text-xs border border-white/10 rounded-full text-white/70 hover:bg-white/5 transition-colors"
                >
                    Reset Baseline
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Simulation Controls */}
                <div className="space-y-8">
                    {/* Sleep Simulation */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70 flex items-center gap-2">
                                <Moon className="w-4 h-4 text-purple-400" /> Sleep Duration
                            </span>
                            <span className="text-cyan-400 font-mono">{sleepHours}h</span>
                        </div>
                        <input
                            type="range"
                            min="3"
                            max="12"
                            value={sleepHours}
                            onChange={(e) => setSimulationValue('sleepHours', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>

                    {/* Activity Simulation */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" /> Daily Activity
                            </span>
                            <span className="text-cyan-400 font-mono">{activityMinutes} min</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="180"
                            step="15"
                            value={activityMinutes}
                            onChange={(e) => setSimulationValue('activityMinutes', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>

                    {/* Hydration Simulation */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-white/70 flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-400" /> Hydration Level
                            </span>
                            <span className="text-cyan-400 font-mono">{hydrationLiters}L</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={hydrationLiters}
                            onChange={(e) => setSimulationValue('hydrationLiters', parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>
                </div>

                {/* Simulation Results (Digital Twin Output) */}
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/5 relative group">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                    <div className="relative text-center">
                        <span className="text-xs uppercase tracking-widest text-white/30 font-bold">Projected NHI</span>
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-400 to-cyan-600 mt-2">
                            {simulatedScore}
                        </div>

                        <div className="mt-8 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl max-w-xs mx-auto">
                            <div className="flex items-start gap-3">
                                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-white/80 leading-relaxed text-left">
                                    <span className="font-bold text-cyan-400 block mb-1 uppercase tracking-tighter">Digital Twin Verdict</span>
                                    {verdict}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[80px] -z-10" />
                </div>
            </div>
        </motion.div>
    );
}
