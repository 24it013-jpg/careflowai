import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle } from "lucide-react";

const VITALS_HISTORY = [
    { time: '08:00', hr: 72, spo2: 98, temp: 98.6 },
    { time: '10:00', hr: 75, spo2: 97, temp: 98.7 },
    { time: '12:00', hr: 82, spo2: 98, temp: 98.8 },
    { time: '14:00', hr: 78, spo2: 98, temp: 98.6 },
    { time: '16:00', hr: 74, spo2: 99, temp: 98.5 },
    { time: '18:00', hr: 70, spo2: 98, temp: 98.4 },
    { time: '20:00', hr: 68, spo2: 98, temp: 98.4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-white text-xs font-bold mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-[11px] text-slate-300">
                            {entry.name}: <span className="text-white font-bold">{entry.value}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function VitalsTrendsModule() {
    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-6 row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group will-change-transform"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                        <Activity className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Physiological Trends</h3>
                        <p className="text-xs text-slate-400">24-hour biometric analysis</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                        <TrendingUp className="size-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Stable</span>
                    </div>
                </div>
            </div>

            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VITALS_HISTORY}>
                        <defs>
                            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="hr"
                            name="Heart Rate"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorHr)"
                        />
                        <Area
                            type="monotone"
                            dataKey="spo2"
                            name="SpO2 %"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSpo2)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Resting HR</p>
                    <p className="text-xl font-bold text-white">68 <span className="text-[10px] text-slate-400 font-normal uppercase">bpm</span></p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Avg SpO2</p>
                    <p className="text-xl font-bold text-white">98 <span className="text-[10px] text-slate-400 font-normal uppercase">%</span></p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Core Temp</p>
                    <p className="text-xl font-bold text-white">98.6 <span className="text-[10px] text-slate-400 font-normal uppercase">°F</span></p>
                </div>
            </div>
        </motion.div>
    );
}
