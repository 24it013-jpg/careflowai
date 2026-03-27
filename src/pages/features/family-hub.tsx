import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, ChevronRight, Activity, Calendar, Heart, Shield, Bell, Settings2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FamilyMember {
    id: number;
    name: string;
    role: string;
    avatar: string;
    color: string;
    accent: string;
    status: "Healthy" | "Action Required" | "Critical";
    vitals: {
        spo2: number;
        heartRate: number;
    };
    lastSync: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
    { id: 1, name: "Sarah Miller", role: "Primary Hub Admin", avatar: "S", color: "bg-blue-500", accent: "from-blue-500/20 to-indigo-500/20", status: "Healthy", vitals: { spo2: 99, heartRate: 68 }, lastSync: "2m ago" },
    { id: 2, name: "David Miller", role: "Spouse", avatar: "D", color: "bg-emerald-500", accent: "from-emerald-500/20 to-teal-500/20", status: "Action Required", vitals: { spo2: 97, heartRate: 74 }, lastSync: "1h ago" },
    { id: 3, name: "Emma Miller", role: "Dependent (Child)", avatar: "E", color: "bg-rose-500", accent: "from-rose-500/20 to-pink-500/20", status: "Healthy", vitals: { spo2: 98, heartRate: 82 }, lastSync: "45m ago" },
    { id: 4, name: "Joseph Chen", role: "Senior Care", avatar: "J", color: "bg-amber-500", accent: "from-amber-500/20 to-orange-500/20", status: "Critical", vitals: { spo2: 94, heartRate: 88 }, lastSync: "12m ago" },
];

export default function FamilyHealthHub() {
    const [activeId, setActiveId] = useState(1);
    const activeMember = FAMILY_MEMBERS.find(m => m.id === activeId)!;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Architecture */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10">
                                <Users className="size-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Family Mesh</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Multi-Profile Health Synchronization</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <button className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                            <Bell className="size-5" />
                        </button>
                        <Button className="bg-indigo-500 text-white hover:bg-indigo-600 border-none rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
                            <Plus className="size-4 mr-2" /> Invite Member
                        </Button>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Sidebar: Members List */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Connected Profiles</h3>
                            <Settings2 className="size-4 text-white/20 cursor-pointer hover:text-white/60 transition-colors" />
                        </div>
                        <div className="space-y-3">
                            {FAMILY_MEMBERS.map((member, i) => (
                                <motion.button
                                    key={member.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setActiveId(member.id)}
                                    className={cn(
                                        "w-full p-5 rounded-[2rem] flex items-center gap-5 transition-all duration-500 text-left border relative overflow-hidden group",
                                        activeId === member.id
                                            ? "premium-glass-panel border-indigo-500/30 bg-indigo-500/5 shadow-2xl"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="relative">
                                        <div className={cn("size-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner", member.color)}>
                                            {member.avatar}
                                        </div>
                                        <div className={cn("absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-slate-950", 
                                            member.status === "Healthy" ? "bg-emerald-500" : member.status === "Critical" ? "bg-rose-500" : "bg-amber-500"
                                        )} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-bold transition-colors text-base", activeId === member.id ? "text-white" : "text-white/40 group-hover:text-white")}>
                                            {member.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{member.role}</p>
                                        </div>
                                    </div>
                                    {activeId === member.id && (
                                        <div className="size-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <ChevronRight className="size-5" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Summary Widget */}
                        <div className="mt-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 shadow-2xl shadow-indigo-600/10 relative overflow-hidden group border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all" />
                            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">Mesh Summary</h4>
                            <p className="text-xl font-bold text-white mb-6 leading-tight">All profiles synchronized. 1 intervention suggested for Joseph.</p>
                            <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 rounded-2xl font-black text-[10px] uppercase tracking-widest h-12">
                                Run Diagnostics
                            </Button>
                        </div>
                    </div>

                    {/* Right Area: Active Profile Intelligence */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="premium-glass-panel rounded-[3.5rem] p-10 md:p-14 border border-white/5 relative overflow-hidden min-h-[700px] flex flex-col"
                            >
                                {/* Decorative Gradient */}
                                <div className={cn("absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-1000 bg-gradient-to-br", activeMember.accent)} />

                                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-16 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className={cn("size-24 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl", activeMember.color)}>
                                            {activeMember.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-3">
                                                <h2 className="text-5xl font-black text-white tracking-tighter">{activeMember.name}</h2>
                                                <MoreHorizontal className="size-6 text-white/20 cursor-pointer" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">{activeMember.role}</span>
                                                <div className={cn("px-4 py-1.5 rounded-xl border flex items-center gap-2", 
                                                    activeMember.status === "Healthy" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
                                                    activeMember.status === "Critical" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                                                    "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                                )}>
                                                    <div className={cn("size-2 rounded-full animate-pulse", 
                                                        activeMember.status === "Healthy" ? "bg-emerald-500" : 
                                                        activeMember.status === "Critical" ? "bg-rose-500" : "bg-amber-500"
                                                    )} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{activeMember.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Sync Latency</p>
                                        <span className="text-2xl font-black text-white/60">{activeMember.lastSync}</span>
                                    </div>
                                </div>

                                {/* Intelligent Metrics Grid */}
                                <div className="grid md:grid-cols-2 gap-6 relative z-10 flex-1">
                                    <div className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <Activity className="size-6" />
                                            </div>
                                            <span className="text-xs font-black text-white/20 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Neural Sync</span>
                                        </div>
                                        <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6">Real-time Biometrics</h4>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">SpO2 Level</p>
                                                <p className="text-4xl font-black text-white tracking-tight">{activeMember.vitals.spo2}<span className="text-sm text-white/20 ml-1">%</span></p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Heart Rate</p>
                                                <p className="text-4xl font-black text-white tracking-tight">{activeMember.vitals.heartRate}<span className="text-sm text-white/20 ml-1">BPM</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/20 transition-all hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                <Calendar className="size-6" />
                                            </div>
                                            <span className="text-xs font-black text-indigo-400/40 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Calendar</span>
                                        </div>
                                        <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Next Care Event</h4>
                                        <p className="text-2xl font-black text-white leading-tight mb-2">Telehealth Consultation</p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <span className="text-xs font-bold text-indigo-400">Mar 24, 09:30 AM</span>
                                            <ChevronRight className="size-4 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                                                <Heart className="size-6" />
                                            </div>
                                            <span className="text-xs font-black text-rose-400/40 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Adherence</span>
                                        </div>
                                        <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6">Daily Medication</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                <span className="text-white">Overall Compliance</span>
                                                <span className="text-rose-400">88%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "88%" }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all hover:-translate-y-1 flex items-center gap-8">
                                        <div className="size-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-12 transition-transform">
                                            <Shield className="size-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white/40 uppercase tracking-widest mb-1">Insurance Data</h4>
                                            <p className="text-xl font-black text-white">Coverage Verified</p>
                                            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mt-2">Exp: 12/26</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-14 relative z-10">
                                    <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                                                <Users className="size-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white mb-1 tracking-tight">Access Lab Results & Records</p>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Shared authorization required for Davids results</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 gap-2 font-black text-[10px] uppercase tracking-widest">
                                            Request Access <ChevronRight className="size-4" />
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
