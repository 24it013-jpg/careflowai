import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart } from "lucide-react";

const HEART_RATE_DATA = [
    { time: '00:00', bpm: 62 },
    { time: '04:00', bpm: 58 },
    { time: '08:00', bpm: 72 },
    { time: '12:00', bpm: 85 },
    { time: '16:00', bpm: 78 },
    { time: '20:00', bpm: 70 },
    { time: '23:59', bpm: 64 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-white text-sm font-bold mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface NeuralRhythmChartProps {
    forecastData: any[];
    prediction: any[];
    lastPoint: any;
}

export function NeuralRhythmChart({ forecastData, prediction, lastPoint }: NeuralRhythmChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="premium-glass-panel rounded-3xl p-6 relative overflow-hidden group col-span-1 lg:col-span-2"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/20 rounded-lg">
                        <Heart className="size-5 text-rose-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Neural Rhythm & Foresight</h3>
                        <p className="text-xs text-slate-400">Actual data vs. 4h Projection</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-rose-400 rounded-full" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-0.5 w-4 border-t-2 border-dashed border-blue-400" />
                        <span className="text-[10px] text-blue-400 font-bold uppercase">Projected</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                        <defs>
                            <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['dataMin - 10', 'dataMax + 10']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="bpm"
                            name="Actual Heart Rate"
                            stroke="#fb7185"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorBpm)"
                            animationDuration={2000}
                            data={HEART_RATE_DATA}
                        />
                        <Area
                            type="monotone"
                            dataKey="bpm"
                            name="Projected"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorForecast)"
                            data={[lastPoint, ...prediction]}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
