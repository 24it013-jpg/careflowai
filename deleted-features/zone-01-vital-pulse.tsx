"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Droplets, Flame, Heart } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/data/mock";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to generate sparkline data based on a base value
const generateSparkline = (baseValue: number) => {
    return Array.from({ length: 10 }, () => ({
        value: baseValue + (Math.random() * 10 - 5)
    }));
};

const VitalCard = ({ title, value, unit, icon: Icon, color, trend }: any) => {
    // Stable sparkline data for demo (in real app, this would be historical data)
    const sparklineData = generateSparkline(parseFloat(value));

    return (
        <Card className="glass-card relative overflow-hidden group border-white/10 bg-black/40">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold flex items-baseline gap-1 text-white">
                    {value}
                    <span className="text-xs font-normal text-slate-400">{unit}</span>
                </div>
                <div className="h-[40px] mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                            <defs>
                                <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="currentColor"
                                fill={`url(#gradient-${title.replace(/\s/g, '')})`}
                                strokeWidth={2}
                                className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-blue-400'}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export function Zone01VitalPulse() {
    const { data: vitals, isLoading } = useQuery({
        queryKey: ["vitals"],
        queryFn: api.getVitals,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    const getVital = (type: string) => vitals?.find(v => v.type === type);
    const hr = getVital('heart_rate');
    const bpSys = getVital('blood_pressure_sys');
    const bpDia = getVital('blood_pressure_dia');
    const glucose = getVital('glucose');
    const temp = getVital('temperature');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <Activity className="size-5 text-primary animate-pulse" />
                    Vital Pulse
                </h2>
                <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full border border-primary/20">Live</span>
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <VitalCard
                    title="Heart Rate"
                    value={hr?.value || "--"}
                    unit={hr?.unit || "bpm"}
                    icon={Heart}
                    color="from-red-500 to-transparent"
                    trend="up"
                />
                <VitalCard
                    title="Blood Pressure"
                    value={`${bpSys?.value || "--"}/${bpDia?.value || "--"}`}
                    unit="mmHg"
                    icon={Activity}
                    color="from-blue-500 to-transparent"
                    trend="stable"
                />
                <VitalCard
                    title="Glucose"
                    value={glucose?.value || "--"}
                    unit={glucose?.unit || "mg/dL"}
                    icon={Droplets}
                    color="from-yellow-500 to-transparent"
                    trend="down"
                />
                <VitalCard
                    title="Temp"
                    value={temp?.value || "--"}
                    unit={temp?.unit || "°F"}
                    icon={Flame}
                    color="from-orange-500 to-transparent"
                    trend="stable"
                />
            </div>

            {/* Hydration & Dosage Bars could go here */}
        </div>
    );
}
