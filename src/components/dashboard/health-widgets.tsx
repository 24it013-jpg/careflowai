import { motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    Calendar,
    ChevronRight,
    Clock,
    MoreHorizontal,
    Pill,
    User
} from "lucide-react";
import { mockMedications, mockAppointments } from "@/lib/data/mock";

const chartData = [
    { time: "08:00", value: 65 },
    { time: "10:00", value: 72 },
    { time: "12:00", value: 68 },
    { time: "14:00", value: 74 },
    { time: "16:00", value: 78 },
    { time: "18:00", value: 75 },
    { time: "20:00", value: 70 },
];

export function HealthWidgets() {
    return (
        <div className="flex flex-col gap-6">

            {/* 1. Patient Body Analysis Chart */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-sm overflow-hidden text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity className="size-5 text-blue-400" />
                            Patient Body Analysis
                        </CardTitle>
                        <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/10">
                            Live
                        </Badge>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0EA5E9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 2. Medication List */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-sm h-full text-card-foreground">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                <Pill className="size-4 text-purple-400" />
                                Medications
                            </CardTitle>
                            <ButtonVariantGhost size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5">
                                <MoreHorizontal className="size-4" />
                            </ButtonVariantGhost>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockMedications.slice(0, 3).map((med) => (
                                <div key={med.id} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 transition-colors group-hover:bg-purple-500/20">
                                            <Pill className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{med.name}</p>
                                            <p className="text-xs text-slate-400">{med.dosage} • {med.frequency}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-purple-300 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">{med.timeOfDay[0]}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-2">
                                <ButtonVariantSecondary className="w-full text-xs font-semibold h-8 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10">View All Prescriptions</ButtonVariantSecondary>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 3. Doctor List / Schedule */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-sm h-full text-card-foreground">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                <User className="size-4 text-emerald-400" />
                                Doctors
                            </CardTitle>
                            <ButtonVariantGhost size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5">
                                <ChevronRight className="size-4" />
                            </ButtonVariantGhost>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockAppointments.slice(0, 1).map(apt => (
                                <div key={apt.id} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="size-8 ring-1 ring-white/10">
                                            <AvatarImage src="/placeholder-doctor.jpg" />
                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-400">DC</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{apt.doctorName}</p>
                                            <p className="text-xs text-slate-400">{apt.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="size-3" />
                                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                                        <Clock className="size-3 ml-2" />
                                        <span>09:00 AM</span>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-2 mt-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Now</p>
                                <div className="flex -space-x-2 overflow-hidden py-1 pl-1">
                                    {[1, 2, 3].map((_, i) => (
                                        <Avatar key={i} className="inline-block border-2 border-black ring-offset-0 hover:z-10 transition-transform hover:scale-110 cursor-pointer">
                                            <AvatarFallback className="bg-white/10 text-slate-400 text-[10px]">DR</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="flex items-center justify-center size-10 rounded-full border-2 border-black bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 cursor-pointer transition-colors z-0">
                                        +4
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

// Simple Helper Components to avoid big imports if not needed, or just standard UI
function ButtonVariantGhost({ children, className, size, ...props }: any) {
    return <button className={`hover:bg-white/10 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-colors ${className}`} {...props}>{children}</button>
}

function ButtonVariantSecondary({ children, className, ...props }: any) {
    return <button className={`bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg transition-colors ${className}`} {...props}>{children}</button>
}
