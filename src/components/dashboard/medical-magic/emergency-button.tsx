import { useEffect } from "react";
import { Siren, Phone, X, Heart, Pill, Users, Info, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEmergencyStore } from "@/hooks/use-emergency-store";
import { useHealthData } from "@/hooks/use-health-data";
import { cn } from "@/lib/utils";

export function EmergencyButton() {
    const {
        isSOSActive,
        isCountdownActive,
        countdownValue,
        emergencyContacts,
        emergencyNotes,
        setSOSActive,
        setCountdownActive,
        setCountdownValue
    } = useEmergencyStore();

    const { vitals, medications, allergies } = useHealthData();

    useEffect(() => {
        let interval: any;
        if (isCountdownActive && countdownValue > 0) {
            interval = setInterval(() => {
                setCountdownValue(countdownValue - 1);
            }, 1000);
        } else if (countdownValue === 0) {
            setCountdownActive(false);
            setSOSActive(true);
            clearInterval(interval!);
        }
        return () => clearInterval(interval);
    }, [isCountdownActive, countdownValue, setCountdownValue, setCountdownActive, setSOSActive]);

    const handleActivate = () => {
        setCountdownActive(true);
        setCountdownValue(5);
    };

    const handleCancel = () => {
        setCountdownActive(false);
        setSOSActive(false);
        setCountdownValue(5);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                layoutId="emergency-trigger"
                onClick={handleActivate}
                className={cn(
                    "fixed bottom-8 right-8 z-50 group flex items-center justify-center size-16 rounded-full shadow-lg transition-all duration-300 border-4 border-[#121212]",
                    isSOSActive || isCountdownActive ? "bg-red-900 border-red-500 scale-125" : "bg-red-600 hover:scale-110 shadow-[0_0_40px_-5px_theme(colors.red.600)]"
                )}
            >
                {(isSOSActive || isCountdownActive) ? (
                    <Siren className="size-8 text-red-100 animate-pulse" />
                ) : (
                    <>
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                        <Siren className="size-8 text-slate-900 group-hover:rotate-12 transition-transform duration-300" />
                    </>
                )}
            </motion.button>

            {/* Emergency Overlay & Responder HUD */}
            <AnimatePresence>
                {(isCountdownActive || isSOSActive) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
                    >
                        {/* Status Header */}
                        <div className="w-full max-w-4xl flex flex-col items-center mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="flex items-center gap-3 px-6 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-4"
                            >
                                <Siren className="size-5 text-red-500" />
                                <span className="text-red-500 font-black tracking-widest uppercase">
                                    {isCountdownActive ? "SOS Initiating..." : "SOS ACTIVE - Guardian Mode"}
                                </span>
                            </motion.div>

                            {isCountdownActive ? (
                                <div className="text-center">
                                    <h2 className="text-8xl font-black text-white mb-2">{countdownValue}</h2>
                                    <p className="text-slate-400 font-bold tracking-widest uppercase">Cancelling in {countdownValue}s...</p>
                                </div>
                            ) : (
                                <h1 className="text-4xl md:text-6xl font-black text-white text-center uppercase tracking-tighter">
                                    Medical <span className="text-red-500">Emergency</span>
                                </h1>
                            )}
                        </div>

                        {/* Responder HUD Content */}
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Live Vitals Column */}
                            <div className="space-y-6">
                                <HUDCard title="Live Vitals" icon={Activity} color="red">
                                    <div className="grid grid-cols-1 gap-4">
                                        <VitalDisplay label="Heart Rate" value={`${vitals.heartRate} BPM`} icon={Heart} color="rose" />
                                        <VitalDisplay label="SpO2" value={`${vitals.spo2}%`} icon={Activity} color="blue" />
                                        <VitalDisplay label="Temp" value={`${vitals.temperature}°F`} icon={Activity} color="orange" />
                                    </div>
                                </HUDCard>

                                <HUDCard title="Emergency Notes" icon={Info} color="orange">
                                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                                        "{emergencyNotes}"
                                    </p>
                                </HUDCard>
                            </div>

                            {/* Medical Background Column */}
                            <div className="space-y-6">
                                <HUDCard title="Current Medications" icon={Pill} color="blue">
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                        {medications.length > 0 ? medications.map((med, idx) => (
                                            <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                <div className="font-bold text-white text-xs">{med.name}</div>
                                                <div className="text-[10px] text-slate-400">{med.dosage} • {med.frequency}</div>
                                            </div>
                                        )) : <p className="text-slate-500 text-xs py-4 text-center">No active medications</p>}
                                    </div>
                                </HUDCard>

                                <HUDCard title="Known Allergies" icon={X} color="rose">
                                    <div className="flex flex-wrap gap-2">
                                        {allergies.length > 0 ? allergies.map((a, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                                                {a.allergen} ({a.severity})
                                            </span>
                                        )) : <p className="text-slate-500 text-xs text-center w-full py-2">No known allergies</p>}
                                    </div>
                                </HUDCard>
                            </div>

                            {/* Emergency Contacts Column */}
                            <div className="space-y-6">
                                <HUDCard title="Emergency Contacts" icon={Users} color="green">
                                    <div className="space-y-3">
                                        {emergencyContacts.map((contact) => (
                                            <div key={contact.id} className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-white">{contact.name}</span>
                                                    <span className="text-[10px] uppercase tracking-wider text-green-500 font-black">{contact.relationship}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Phone className="size-3" />
                                                    {contact.phone}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </HUDCard>

                                <div className="space-y-3 mt-auto">
                                    <Button size="lg" className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                                        <Phone className="size-6 mr-3" />
                                        CALL 911
                                    </Button>
                                    <Button variant="outline" size="lg" className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold" onClick={handleCancel}>
                                        <X className="size-5 mr-3" />
                                        CANCEL SOS
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Instructions */}
                        <div className="mt-12 text-center max-w-2xl px-6">
                            <p className="text-slate-500 text-sm italic">
                                responder instructions: this patient has identified you as a primary caregiver or responder.
                                the above information is synchronized with their health vault.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function HUDCard({ title, icon: Icon, color, children }: { title: string; icon: any; color: "red" | "orange" | "blue" | "green" | "rose"; children: React.ReactNode }) {
    const colors = {
        red: "border-red-500/30 text-red-500 bg-red-500/5",
        orange: "border-orange-500/30 text-orange-500 bg-orange-500/5",
        blue: "border-blue-500/30 text-blue-400 bg-blue-500/5",
        green: "border-green-500/30 text-green-500 bg-green-500/5",
        rose: "border-rose-500/30 text-rose-500 bg-rose-500/5",
    };

    return (
        <div className={cn("rounded-2xl border p-5 backdrop-blur-md", colors[color])}>
            <div className="flex items-center gap-2 mb-4">
                <Icon className="size-5" />
                <h3 className="font-black uppercase tracking-widest text-xs">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function VitalDisplay({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-white/5", `text-${color}-500`)}>
                    <Icon className="size-5" />
                </div>
                <span className="text-sm font-medium text-slate-400">{label}</span>
            </div>
            <span className="text-xl font-black text-white">{value}</span>
        </div>
    );
}
