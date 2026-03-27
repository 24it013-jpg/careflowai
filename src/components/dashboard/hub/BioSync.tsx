import { useState } from "react";
import { motion } from "framer-motion";
import { Watch, Smartphone, Bluetooth, CheckCircle2, RefreshCw, Zap, Battery, SignalHigh } from "lucide-react";
import { cn } from "@/lib/utils";

interface Device {
    id: string;
    name: string;
    type: "watch" | "fitness" | "phone";
    status: "connected" | "syncing" | "disconnected";
    battery: number;
    lastSync: string;
    metrics: string[];
}

const INITIAL_DEVICES: Device[] = [
    {
        id: "apple-watch",
        name: "Apple Watch Ultra 2",
        type: "watch",
        status: "connected",
        battery: 84,
        lastSync: "2 mins ago",
        metrics: ["Heart Rate", "ECG", "Sleep"]
    },
    {
        id: "oura-ring",
        name: "Oura Ring Gen 3",
        type: "fitness",
        status: "syncing",
        battery: 45,
        lastSync: "Just now",
        metrics: ["Temp", "Readiness", "Stress"]
    },
    {
        id: "iphone",
        name: "iPhone 15 Pro",
        type: "phone",
        status: "connected",
        battery: 92,
        lastSync: "5 mins ago",
        metrics: ["Steps", "Distance", "Flights"]
    }
];

export function BioSync() {
    const [devices] = useState<Device[]>(INITIAL_DEVICES);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshAll = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-full flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 size-48 bg-cyan-500/10 blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Bluetooth className="size-5 text-cyan-400" />
                        Bio-Sync Hub
                    </h2>
                    <p className="text-sm text-white/40">Multi-device Neural Synchronization</p>
                </div>
                <button
                    onClick={refreshAll}
                    className={cn(
                        "p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all",
                        isRefreshing && "animate-spin text-cyan-400"
                    )}
                >
                    <RefreshCw className="size-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {devices.map((device) => (
                    <motion.div
                        key={device.id}
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                                {device.type === "watch" && <Watch className="size-6" />}
                                {device.type === "fitness" && <Zap className="size-6" />}
                                {device.type === "phone" && <Smartphone className="size-6" />}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 text-[10px] font-mono text-white/20">
                                    <Battery className="size-3" />
                                    {device.battery}%
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-white/20">
                                    <SignalHigh className="size-3" />
                                    Active
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-white mb-1">{device.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={cn(
                                "size-1.5 rounded-full animate-pulse",
                                device.status === "connected" ? "bg-emerald-500" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            )} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                {device.status}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {device.metrics.map(metric => (
                                <span key={metric} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40">
                                    {metric}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Full System Integrity</p>
                        <p className="text-xs text-white/40">Encryption Layer: AES-256 Neural</p>
                    </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors">
                    Add Device
                </button>
            </div>
        </motion.div>
    );
}
