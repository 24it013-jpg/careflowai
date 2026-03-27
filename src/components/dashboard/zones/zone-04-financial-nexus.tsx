"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreditCard, MapPin, Pill } from "lucide-react";


export function Zone04FinancialNexus() {
    return (
        <div className="col-span-1 md:col-span-1 row-span-1 grid grid-rows-2 gap-4">
            {/* Expense Ledger */}
            <Card className="glass-card bg-black/40 border-white/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="size-3" /> Cost of Care (Feb)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono text-white">$420.50</div>
                    <div className="text-xs text-slate-400 mt-1 flex justify-between">
                        <span>Meds: $120</span>
                        <span>Visits: $300</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[30%]" />
                    </div>
                </CardContent>
            </Card>

            {/* Refill Predictor & Map */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card flex flex-col justify-center items-center text-center p-2 hover:bg-white/10 bg-white/5 border-white/10 transition-colors cursor-pointer group">
                    <Pill className="size-6 text-blue-400 mb-1 group-hover:animate-bounce" />
                    <div className="text-lg font-bold text-white">4 Days</div>
                    <div className="text-[10px] text-slate-400">Metformin Refill</div>
                </Card>
                <Card className="glass-card flex flex-col justify-center items-center text-center p-2 hover:bg-white/10 bg-white/5 border-white/10 transition-colors cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/10 z-0" />
                    <MapPin className="size-6 text-emerald-500 mb-1 z-10" />
                    <div className="text-lg font-bold z-10">0.8 mi</div>
                    <div className="text-[10px] text-muted-foreground z-10">CVS Pharmacy</div>
                </Card>
            </div>
        </div>
    );
}
