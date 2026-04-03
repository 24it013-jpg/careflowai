import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 md:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col justify-between h-full min-h-[300px] shadow-sm"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px]">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Profile"
                                className="w-full h-full rounded-full bg-slate-900/50 backdrop-blur-sm"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Alex Carter</h2>
                        <p className="text-sm text-slate-400">Premium Member</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
                    <User className="size-5" />
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Health Score</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-emerald-400">92</span>
                        <span className="text-xs text-emerald-500 mb-1">Excellent</span>
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Plan</p>
                    <div className="flex items-center gap-2 mt-1">
                        <ShieldCheck className="size-5 text-indigo-400" />
                        <span className="text-sm font-medium text-white">Elite Pro</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-auto pt-6 border-t border-white/10 flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    View Profile
                </Button>
                <Button variant="outline" className="flex-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                    Switch User
                </Button>
            </div>
        </motion.div>
    );
}
