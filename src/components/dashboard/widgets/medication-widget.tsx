import { motion } from "framer-motion";
import { Pill, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MedicationWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[300px] shadow-sm hover:border-white/20 transition-all"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Pill className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Medications</h3>
                        <p className="text-xs text-slate-400">Next dose in 45m</p>
                    </div>
                </div>
                <Link to="/features/medications">
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 text-xs">
                        View All
                    </Button>
                </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {[
                    { name: "Amoxicillin", dose: "500mg", time: "08:00 AM", taken: true },
                    { name: "Vitamin D3", dose: "1000 IU", time: "09:00 AM", taken: true },
                    { name: "Lisinopril", dose: "10mg", time: "02:00 PM", taken: false, next: true },
                    { name: "Metformin", dose: "500mg", time: "08:00 PM", taken: false },
                ].map((med, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${med.next ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${med.taken ? 'bg-emerald-500/10 text-emerald-400' : med.next ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-slate-400'}`}>
                                <Pill className="size-4" />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${med.taken ? 'text-slate-500 line-through' : 'text-white'}`}>{med.name}</p>
                                <p className="text-xs text-slate-400">{med.dose}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {med.taken ? (
                                <Check className="size-4 text-emerald-400" />
                            ) : (
                                <span className={`text-xs font-mono px-2 py-1 rounded ${med.next ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                                    {med.time}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
