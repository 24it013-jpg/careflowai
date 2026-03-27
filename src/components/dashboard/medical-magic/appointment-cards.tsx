import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from "recharts";

const APPOINTMENTS = [
    {
        doctor: "Dr. Samantha Martin",
        specialty: "Cardiologist",
        title: "Cardiogram",
        date: "02 Aug",
        // Using classes for gradient glass effect
        colorClass: "bg-gradient-to-br from-orange-500/20 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40",
        iconColor: "text-orange-400",
        chartType: "wave",
        data: [{ v: 10 }, { v: 15 }, { v: 8 }, { v: 12 }, { v: 20 }, { v: 14 }, { v: 18 }, { v: 10 }, { v: 15 }, { v: 8 }]
    },
    {
        doctor: "Michel Corrins",
        specialty: "Cardiologist",
        title: "Blood Pressure",
        date: "27 July",
        colorClass: "bg-gradient-to-br from-violet-500/20 to-violet-600/5 border-violet-500/20 hover:border-violet-500/40",
        iconColor: "text-violet-400",
        chartType: "bar",
        data: [{ v: 40 }, { v: 60 }, { v: 30 }, { v: 80 }, { v: 50 }, { v: 70 }, { v: 45 }]
    },
    {
        doctor: "Dr. Angela Mathews",
        specialty: "Cardiologist",
        title: "Blood Monitor",
        date: "27 July",
        colorClass: "bg-gradient-to-br from-teal-500/20 to-teal-600/5 border-teal-500/20 hover:border-teal-500/40",
        iconColor: "text-teal-400",
        chartType: "smooth",
        data: [{ v: 10 }, { v: 25 }, { v: 15 }, { v: 35 }, { v: 20 }, { v: 40 }, { v: 30 }]
    }
];

export function AppointmentCards() {
    return (
        <div className="flex flex-col gap-5 h-full">
            {APPOINTMENTS.map((apt, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.15) }}
                    className={cn(
                        "relative p-5 rounded-[2rem] border backdrop-blur-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300",
                        apt.colorClass
                    )}
                >
                    {/* Header: Dr Info */}
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <Avatar className="h-10 w-10 border border-white/10 shadow-sm">
                            <AvatarImage src={`/avatars/0${index + 1}.png`} />
                            <AvatarFallback className="bg-white/10 text-white text-xs">DR</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-sm text-white leading-tight">{apt.doctor}</h3>
                            <p className="text-slate-300 text-xs">{apt.specialty}</p>
                        </div>
                    </div>

                    {/* Content: Title, Date, Chart */}
                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <span className="block text-lg font-bold mb-1 text-white">{apt.title}</span>
                            <span className="text-slate-300 text-xs font-medium">{apt.date}</span>
                        </div>

                        {/* Mini Chart Visualization */}
                        <div className="h-10 w-24">
                            <ResponsiveContainer width="100%" height="100%">
                                {apt.chartType === 'bar' ? (
                                    <BarChart data={apt.data}>
                                        <Bar dataKey="v" fill="rgba(255,255,255,0.5)" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                ) : (
                                    <AreaChart data={apt.data}>
                                        <Area
                                            type={apt.chartType === 'wave' ? "linear" : "monotone"}
                                            dataKey="v"
                                            stroke="rgba(255,255,255,0.8)"
                                            strokeWidth={2}
                                            fill="none"
                                        />
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Arrow Button */}
                    <div className="absolute bottom-5 right-5 z-10">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/10",
                            "bg-white/10 hover:bg-white/20"
                        )}>
                            <ArrowUpRight className={cn("size-4 text-white")} />
                        </div>
                    </div>

                    {/* Decorative Background Circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                </motion.div>
            ))}
        </div>
    );
}
