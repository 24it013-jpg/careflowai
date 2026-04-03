"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileKey, Share2 } from "lucide-react";

const historyEvents = [
    { date: "Feb 10", type: "Lab Result", title: "Blood Panel", secure: true },
    { date: "Feb 02", type: "Visit", title: "Dr. Chen", secure: true },
    { date: "Jan 28", type: "Rx", title: "Metformin Refill", secure: true },
    { date: "Jan 15", type: "Imaging", title: "Chest X-Ray", secure: true },
];

export function Zone05HealthVault() {
    return (
        <Card className="glass-card col-span-1 md:col-span-2 row-span-1 overflow-hidden flex flex-col bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white/5 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    Health Vault (Blockchain)
                </CardTitle>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-500 gap-1">
                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        VERIFIED
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors">
                        <Share2 className="size-3" /> Share
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center overflow-x-auto p-4 scrollbar-hide">
                <div className="flex items-center gap-4 min-w-full">
                    {historyEvents.map((event, i) => (
                        <div key={i} className="relative group min-w-[140px]">
                            {/* Connector Line */}
                            {i < historyEvents.length - 1 && (
                                <div className="absolute top-1/2 left-full w-4 h-0.5 bg-white/10 -translate-y-1/2" />
                            )}

                            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-2 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                                    {event.secure && <FileKey className="size-3 text-emerald-500" />}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white">{event.title}</p>
                                    <p className="text-[10px] text-slate-500">{event.type}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="min-w-[100px] flex items-center justify-center opacity-50">
                        <div className="h-0.5 w-8 bg-dashed bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
