import { Droplets, Heart, Activity, Syringe } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const VITALS = [
    {
        label: "Blood Pressure",
        value: "112/75",
        icon: Droplets,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "group-hover:border-rose-500/30",
        shape: "rounded-3xl"
    },
    {
        label: "Heart Rate",
        value: "72 bpm",
        icon: Heart,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "group-hover:border-blue-500/30",
        shape: "rounded-3xl"
    },
    {
        label: "Blood Oxygen",
        value: "98%",
        icon: Activity,
        color: "text-teal-400",
        bg: "bg-teal-500/10",
        border: "group-hover:border-teal-500/30",
        shape: "rounded-3xl"
    },
    {
        label: "Glucose",
        value: "95 mg/dL",
        icon: Syringe,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "group-hover:border-emerald-500/30",
        shape: "rounded-3xl"
    }
];

export function VitalsGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {VITALS.map((vital, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    className={cn(
                        "group relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center gap-5 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1",
                        vital.shape
                    )}
                >
                    {/* Icon Circle */}
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300", vital.bg)}>
                        <vital.icon className={cn("size-7 transition-colors duration-300", vital.color)} />
                    </div>

                    {/* Data */}
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">{vital.label}</p>
                        <p className="text-white text-2xl font-bold tracking-tight">{vital.value}</p>
                    </div>

                    {/* Decorative Border on Hover */}
                    <div className={cn(
                        "absolute inset-0 rounded-[inherit] border-2 border-transparent transition-colors duration-300 pointer-events-none",
                        vital.border
                    )} />
                </motion.div>
            ))}
        </div>
    );
}
