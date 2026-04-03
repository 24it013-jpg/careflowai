import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Shield, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    status: "optimal" | "stable" | "alert";
    vitals: {
        hr: number;
        score: number;
    };
    lastSync: string;
    avatar: string;
}

const INITIAL_MEMBERS: FamilyMember[] = [
    {
        id: "1",
        name: "Sarah Henderson",
        relation: "Spouse",
        status: "optimal",
        vitals: { hr: 72, score: 94 },
        lastSync: "Live",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        id: "2",
        name: "Robert Henderson",
        relation: "Parent",
        status: "alert",
        vitals: { hr: 88, score: 68 },
        lastSync: "2m ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
    },
    {
        id: "3",
        name: "Emma Henderson",
        relation: "Child",
        status: "stable",
        vitals: { hr: 78, score: 82 },
        lastSync: "Live",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    }
];

export function FamilySync() {
    const [members, setMembers] = useState(INITIAL_MEMBERS);

    // Simulate real-time updates for family members
    useEffect(() => {
        const interval = setInterval(() => {
            setMembers(prev => prev.map(m => {
                if (m.relation === "Child") {
                    return {
                        ...m,
                        vitals: {
                            ...m.vitals,
                            hr: Math.floor(75 + Math.random() * 10)
                        }
                    };
                }
                return m;
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-blue-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Family Alpha Circle
                    </h3>
                    <p className="text-white/40 text-sm mt-1">Real-time physiological synchronization</p>
                </div>
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                    <Plus className="size-4" />
                </button>
            </div>

            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                    {members.map((member) => (
                        <motion.div
                            key={member.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4 group/item hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <img src={member.avatar} alt={member.name} className="size-12 rounded-full border-2 border-white/10" />
                                <div className={cn(
                                    "absolute bottom-0 right-0 size-3 rounded-full border-2 border-black",
                                    member.status === "optimal" ? "bg-emerald-500" :
                                        member.status === "stable" ? "bg-blue-500" : "bg-rose-500"
                                )} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
                                    <span className="text-[10px] text-white/30 font-mono">{member.lastSync}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{member.relation}</span>
                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                                        <Heart className="size-2.5 text-rose-400 fill-rose-400/20" />
                                        <span className="text-[10px] font-bold text-white/70">{member.vitals.hr}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Score Gauge */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-[10px] font-bold text-white/20 uppercase">NHI</div>
                                <div className={cn(
                                    "text-lg font-black",
                                    member.vitals.score > 90 ? "text-emerald-400" :
                                        member.vitals.score > 75 ? "text-blue-400" : "text-rose-400"
                                )}>
                                    {member.vitals.score}
                                </div>
                            </div>

                            <button className="p-1 rounded-lg hover:bg-white/10 text-white/10 group-hover/item:text-white/40 transition-colors">
                                <MoreVertical className="size-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Bottom Insight */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Shield className="size-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                    <div className="text-xs font-bold text-white">Circle Security Active</div>
                    <div className="text-[10px] text-white/40 truncate italic">"All connections encrypted with quantum-safe protocols."</div>
                </div>
                <div className="ml-auto size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
        </motion.div>
    );
}
