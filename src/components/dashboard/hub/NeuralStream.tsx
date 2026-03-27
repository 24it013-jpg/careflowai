import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Bell, Brain } from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";

interface StreamItem {
    id: string;
    text: string;
    type: "info" | "success" | "warning";
    timestamp: Date;
}

export function NeuralStream() {
    const { vitals } = useHealthData();
    const [items, setItems] = useState<StreamItem[]>([]);

    useEffect(() => {
        const events = [
            { condition: () => vitals.heartRate > 100, text: "Elevated heart rate detected (BPM > 100)", type: "warning" },
            { condition: () => vitals.heartRate < 60, text: "Circadian rhythm stabilizing", type: "success" },
            { condition: () => vitals.spo2 < 95, text: "SpO2 variance detected", type: "warning" },
            { condition: () => vitals.temperature > 99, text: "Mild metabolic rise detected", type: "info" },
            { condition: () => true, text: "Neural Health Index Synchronized", type: "success" },
        ];

        const generateEvent = () => {
            const possibleEvents = events.filter(e => e.condition());
            const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

            const newItem: StreamItem = {
                id: Math.random().toString(36).substring(7),
                text: randomEvent.text,
                type: randomEvent.type as any,
                timestamp: new Date()
            };

            setItems(prev => [newItem, ...prev].slice(0, 3));
        };

        const interval = setInterval(generateEvent, 8000); // One event every 8 seconds
        generateEvent();

        return () => clearInterval(interval);
    }, [vitals]);

    return (
        <div className="flex flex-col gap-1.5 h-full overflow-hidden">
            <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-colors"
                    >
                        <div className={`p-1 rounded-md ${item.type === 'warning' ? 'bg-amber-500/10' :
                            item.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                            }`}>
                            {item.type === 'warning' ? <Bell className="size-3 text-amber-400" /> :
                                item.type === 'success' ? <Zap className="size-3 text-emerald-400" /> :
                                    <Brain className="size-3 text-blue-400" />}
                        </div>
                        <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                            {item.text}
                        </span>
                        <span className="ml-auto text-[9px] text-white/10 font-mono">
                            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
