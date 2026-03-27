"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const timeline = [
    { time: "08:00 AM", med: "Metformin", dose: "500g", taken: true },
    { time: "01:00 PM", med: "Vitamin D", dose: "1000IU", taken: false, active: true },
    { time: "08:00 PM", med: "Lisinopril", dose: "10mg", taken: false },
];

export function Zone06CareCommand() {
    return (
        <div className="col-span-1 md:col-span-1 row-span-2 grid grid-rows-2 gap-4">
            {/* Medication Schedule */}
            <Card className="glass-card row-span-1 flex flex-col bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="size-4 text-blue-400" />
                        Med Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pr-1">
                    <div className="space-y-3 relative pl-4 border-l border-white/10 ml-2">
                        {timeline.map((item, i) => (
                            <div key={i} className="relative">
                                <div className={cn(
                                    "absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-background",
                                    item.taken ? "bg-emerald-500 border-emerald-500" : item.active ? "bg-primary border-primary animate-pulse" : "bg-muted border-muted-foreground"
                                )} />
                                <div className={cn(
                                    "p-2 rounded-lg border flex justify-between items-center transition-all",
                                    item.active ? "bg-blue-500/10 border-blue-500/50" : "bg-transparent border-transparent hover:bg-white/5"
                                )}>
                                    <div>
                                        <p className={cn("text-xs font-semibold", item.taken && "line-through text-muted-foreground")}>{item.med}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.time} • {item.dose}</p>
                                    </div>
                                    {item.active && (
                                        <Button size="sm" variant="outline" className="h-6 text-[10px] bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white">
                                            Take
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Telemedicine & Alerts */}
            <div className="grid grid-rows-2 gap-4">
                {/* Telemedicine Node */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center p-4">
                    <div className="p-3 rounded-full bg-blue-500/20 mb-2 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,209,255,0.3)]">
                        <Video className="size-6 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Start Tele-Visit</h3>
                    <p className="text-[10px] text-blue-400/80">Dr. Chen is available</p>
                </Card>

                {/* Interaction Alert */}
                <Card className="bg-destructive/10 border-destructive/20 flex flex-row items-center p-4 gap-3">
                    <div className="p-2 rounded-full bg-destructive/20 shrink-0 animate-pulse">
                        <AlertTriangle className="size-5 text-destructive" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-destructive">Interaction Alert</h4>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            Aspirin may interact with your new prescription.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
