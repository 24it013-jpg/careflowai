import { motion, AnimatePresence } from "framer-motion";
import { Pill, CheckCircle2, XCircle, Clock, AlertTriangle, Flame, Plus, Pencil, Trash2, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type TimeSlot = "morning" | "afternoon" | "evening" | "night";
type MedStatus = "pending" | "taken" | "skipped";

interface Medication {
    id: string;
    name: string;
    dose: string;
    slot: TimeSlot;
    color: string;
    status: MedStatus;
    purpose: string;
    reminder: boolean;
}

const SLOT_CONFIG: Record<TimeSlot, { label: string; time: string; icon: string; color: string }> = {
    morning: { label: "Morning", time: "8:00 AM", icon: "🌅", color: "text-amber-400" },
    afternoon: { label: "Afternoon", time: "1:00 PM", icon: "☀️", color: "text-yellow-400" },
    evening: { label: "Evening", time: "7:00 PM", icon: "🌆", color: "text-orange-400" },
    night: { label: "Night", time: "10:00 PM", icon: "🌙", color: "text-blue-400" },
};

const INITIAL_MEDS: Medication[] = [
    { id: "m1", name: "Lisinopril", dose: "10mg", slot: "morning", color: "from-blue-500 to-cyan-500", status: "taken", purpose: "Blood Pressure", reminder: true },
    { id: "m2", name: "Metformin", dose: "500mg", slot: "morning", color: "from-purple-500 to-pink-500", status: "taken", purpose: "Blood Sugar", reminder: true },
    { id: "m3", name: "Vitamin D3", dose: "2000 IU", slot: "afternoon", color: "from-amber-500 to-orange-500", status: "pending", purpose: "Immunity", reminder: false },
    { id: "m4", name: "Omega-3", dose: "1000mg", slot: "afternoon", color: "from-teal-500 to-emerald-500", status: "pending", purpose: "Heart Health", reminder: true },
    { id: "m5", name: "Atorvastatin", dose: "20mg", slot: "night", color: "from-rose-500 to-red-500", status: "pending", purpose: "Cholesterol", reminder: true },
    { id: "m6", name: "Melatonin", dose: "5mg", slot: "night", color: "from-indigo-500 to-violet-500", status: "pending", purpose: "Sleep Aid", reminder: false },
];

const INTERACTIONS = [
    { drugs: "Lisinopril + Metformin", severity: "low", note: "Monitor blood pressure when taken together." },
    { drugs: "Atorvastatin + Omega-3", severity: "none", note: "Complementary — may enhance lipid control." },
];

export default function MedicationTracker() {
    const [meds, setMeds] = useState<Medication[]>(INITIAL_MEDS);
    const [activeSlot, setActiveSlot] = useState<TimeSlot>("morning");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const [formData, setFormData] = useState<Partial<Medication>>({});

    // Reset form when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingMed(null);
            setFormData({});
        }
    };

    const handleEditClick = (med: Medication) => {
        setEditingMed(med);
        setFormData(med);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm("Are you sure you want to delete this medication?")) {
            setMeds(prev => prev.filter(m => m.id !== id));
            toast.success("Medication deleted");
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.dose || !formData.slot) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (editingMed) {
            setMeds(prev => prev.map(m => m.id === editingMed.id ? { ...m, ...formData } as Medication : m));
            toast.success("Medication updated");
        } else {
            const newMed: Medication = {
                id: Math.random().toString(36).substr(2, 9),
                status: "pending",
                color: "from-emerald-500 to-teal-500", // Default color
                reminder: true,
                ...formData as any
            };
            setMeds(prev => [...prev, newMed]);
            toast.success("Medication added");
        }
        handleOpenChange(false);
    };

    const toggleReminder = (id: string) => {
        setMeds(prev => prev.map(m => {
            if (m.id === id) {
                const newStatus = !m.reminder;
                toast(newStatus ? "Reminder set" : "Reminder disabled", {
                    description: `Notifications ${newStatus ? "enabled" : "disabled"} for ${m.name}`
                });
                return { ...m, reminder: newStatus };
            }
            return m;
        }));
    };

    const updateStatus = (id: string, status: MedStatus) => {
        setMeds(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    const slotMeds = meds.filter(m => m.slot === activeSlot);
    const takenToday = meds.filter(m => m.status === "taken").length;
    const adherence = Math.round((takenToday / meds.length) * 100);

    return (
        <div className="min-h-screen bg-[#050a08] text-white p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px]" style={{background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute top-[50%] left-[35%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
            </div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Pill className="size-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white">Medication Tracker</h1>
                    <p className="text-sm text-white/40">Smart Schedule & Adherence Monitor</p>
                </div>
                <div className="ml-auto">
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-600 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] border-0 transition-all hover:scale-105 active:scale-95">
                                <Plus className="size-4 mr-2" /> Add Medication
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a120e] border-white/10 text-white sm:max-w-md backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle>{editingMed ? "Edit Medication" : "Add New Medication"}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right text-sm font-bold text-white/60">Name</label>
                                    <Input
                                        id="name"
                                        value={formData.name || ""}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10 text-white focus:border-emerald-500"
                                        placeholder="e.g. Aspirin"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="dose" className="text-right text-sm font-bold text-white/60">Dose</label>
                                    <Input
                                        id="dose"
                                        value={formData.dose || ""}
                                        onChange={e => setFormData({ ...formData, dose: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10 text-white focus:border-emerald-500"
                                        placeholder="e.g. 100mg"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="slot" className="text-right text-sm font-bold text-white/60">Time</label>
                                    <div className="col-span-3">
                                        <Select
                                            value={formData.slot || "morning"}
                                            onValueChange={(value: string) => setFormData({ ...formData, slot: value as TimeSlot })}
                                        >
                                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                {Object.entries(SLOT_CONFIG).map(([key, cfg]) => (
                                                    <SelectItem key={key} value={key} className="focus:bg-white/10 focus:text-white">
                                                        {cfg.label} ({cfg.time})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="purpose" className="text-right text-sm font-bold text-white/60">Purpose</label>
                                    <Input
                                        id="purpose"
                                        value={formData.purpose || ""}
                                        onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                        className="col-span-3 bg-white/5 border-white/10 text-white focus:border-emerald-500"
                                        placeholder="e.g. Pain relief"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => handleOpenChange(false)} className="text-white/60 hover:text-white hover:bg-white/10">Cancel</Button>
                                <Button onClick={handleSave} className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105">Save Medication</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                >
                    <div className="text-3xl font-black text-emerald-400">{adherence}%</div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mt-1">Today's Adherence</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                >
                    <div className="flex items-center justify-center gap-1">
                        <Flame className="size-5 text-orange-400" />
                        <div className="text-3xl font-black text-orange-400">14</div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mt-1">Day Streak</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
                >
                    <div className="text-3xl font-black text-blue-400">{takenToday}/{meds.length}</div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30 mt-1">Taken Today</p>
                </motion.div>
            </div>

            {/* Time Slot Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {(Object.keys(SLOT_CONFIG) as TimeSlot[]).map(slot => {
                    const cfg = SLOT_CONFIG[slot];
                    const slotTaken = meds.filter(m => m.slot === slot && m.status === "taken").length;
                    const slotTotal = meds.filter(m => m.slot === slot).length;
                    return (
                        <button
                            key={slot}
                            onClick={() => setActiveSlot(slot)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold whitespace-nowrap transition-all",
                                activeSlot === slot
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70"
                            )}
                        >
                            <span>{cfg.icon}</span>
                            <span>{cfg.label}</span>
                            <span className={cn("text-[10px] font-mono", slotTaken === slotTotal && slotTotal > 0 ? "text-emerald-400" : "text-white/30")}>
                                {slotTaken}/{slotTotal}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Medication Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <AnimatePresence mode="wait">
                    {slotMeds.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-2 p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-white/30"
                        >
                            No medications scheduled for this time slot.
                        </motion.div>
                    ) : slotMeds.map((med, i) => (
                        <motion.div
                            key={med.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                                "p-5 rounded-2xl border transition-all backdrop-blur-sm",
                                med.status === "taken" ? "bg-emerald-500/[0.07] border-emerald-500/25 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]" :
                                    med.status === "skipped" ? "bg-red-500/5 border-red-500/20 opacity-60" :
                                        "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn("size-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0", med.color)}>
                                    <Pill className="size-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-white">{med.name}</h3>
                                        <span className="text-xs font-mono text-white/40">{med.dose}</span>
                                    </div>
                                    <p className="text-xs text-white/40 mt-0.5">{med.purpose}</p>
                                    <p className="text-[10px] text-white/20 mt-0.5 flex items-center gap-1">
                                        <Clock className="size-3" /> {SLOT_CONFIG[med.slot].time}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleEditClick(med)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                    >
                                        <Pencil className="size-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(med.id)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                    <button
                                        onClick={() => toggleReminder(med.id)}
                                        className={cn(
                                            "p-1.5 rounded-lg transition-colors",
                                            med.reminder ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/40 hover:text-white"
                                        )}
                                    >
                                        {med.reminder ? <Bell className="size-3.5" /> : <BellOff className="size-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {med.status === "pending" && (
                                <div className="flex gap-2 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => updateStatus(med.id, "taken")}
                                        className="flex-1 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all"
                                    >
                                        <CheckCircle2 className="size-4" /> Taken
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => updateStatus(med.id, "skipped")}
                                        className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                                    >
                                        <XCircle className="size-4" /> Skip
                                    </motion.button>
                                </div>
                            )}

                            {med.status === "taken" && (
                                <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                    <CheckCircle2 className="size-4" /> Taken ✓
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Drug Interactions */}
            <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <AlertTriangle className="size-4" /> Interaction Monitor
                </h2>
                <div className="space-y-3">
                    {INTERACTIONS.map((inter, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "p-4 rounded-2xl border flex items-start gap-3",
                                inter.severity === "none" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                            )}
                        >
                            <div className={cn("size-2 rounded-full mt-1.5 shrink-0", inter.severity === "none" ? "bg-emerald-400" : "bg-amber-400")} />
                            <div>
                                <p className="text-xs font-bold text-white">{inter.drugs}</p>
                                <p className="text-xs text-white/40 mt-0.5">{inter.note}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
