"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Upload, Sparkles, MoveRight } from "lucide-react";

import { useAIChat } from "@/hooks/use-ai-chat";

export function Zone03MedicalIntelligence() {
    const { openChat } = useAIChat();

    const handleReportDrop = () => {
        openChat("I'm uploading a new lab report. Please analyze it for any anomalies or trends.");
    };
    return (
        <Card className="glass-card col-span-1 md:col-span-1 row-span-1 flex flex-col bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="size-4 text-blue-400" />
                    Medical Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                {/* Drop Zone */}
                <div
                    onClick={handleReportDrop}
                    className="mt-6 border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
                >
                    <div className="bg-blue-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="size-6 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">Drop Lab Reports</p>
                    <p className="text-xs text-slate-500 mt-1">PDF or Image (Max 10MB)</p>
                </div>

                {/* Specialist Match */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Sparkles className="size-3 text-yellow-500" /> Recommended Specialist
                    </h4>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group">
                        <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src="/placeholder-doctor.jpg" />
                            <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">Dr. Sarah Chen</p>
                            <p className="text-xs text-blue-400 truncate">Pulmonologist • 98% Match</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoveRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
