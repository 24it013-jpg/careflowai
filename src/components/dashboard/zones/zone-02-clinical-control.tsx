"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";
import { BodyMap } from "@/components/dashboard/body-map";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/data/mock";
import { useState } from "react";
import { toast } from "sonner";

export function Zone02ClinicalControl() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [newSymptom, setNewSymptom] = useState({ bodyPart: "", symptom: "", severity: "" });





    const mutation = useMutation({
        mutationFn: api.addSymptom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["symptoms"] });
            toast.success("Symptom Logged", { description: "Your symptom has been recorded." });
            setIsOpen(false);
            setNewSymptom({ bodyPart: "", symptom: "", severity: "" });
        },
    });

    const handleSubmit = () => {
        if (!newSymptom.symptom || !newSymptom.severity) return;
        mutation.mutate({
            bodyPart: newSymptom.bodyPart || "general",
            description: newSymptom.symptom,
            severity: parseInt(newSymptom.severity),
            status: "active",
            locationCoordinates: null
        });
    };

    return (
        <Card className="glass-card col-span-1 md:col-span-2 row-span-2 relative overflow-hidden h-[400px] bg-black/40 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

            <CardHeader className="relative z-20 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    Clinical Control
                </CardTitle>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 gap-1 bg-white/5 backdrop-blur border-white/10 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                            <Plus className="size-3" /> Log Symptom
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Activity className="text-primary size-5" /> Log New Symptom
                            </DialogTitle>
                            <DialogDescription>
                                Select a body part on the map or describe the symptom below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="symptom" className="text-right">
                                    Symptom
                                </Label>
                                <Input
                                    id="symptom"
                                    placeholder="e.g. Headache"
                                    className="col-span-3 bg-white/5 border-white/10 text-white focus:border-blue-500"
                                    value={newSymptom.symptom}
                                    onChange={(e) => setNewSymptom({ ...newSymptom, symptom: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="severity" className="text-right">
                                    Severity
                                </Label>
                                <Input
                                    id="severity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="1-10"
                                    className="col-span-3 bg-white/5 border-white/10 text-white focus:border-blue-500"
                                    value={newSymptom.severity}
                                    onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="button" onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/80" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : "Save Entry"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="h-full p-0 relative flex items-center justify-center">
                {/* 3D Body Map Visualization */}
                <div className="relative w-full h-full max-h-[350px] z-10 p-4">
                    <BodyMap
                        className="w-full h-full text-foreground/20"
                        onPartClick={(part) => setNewSymptom({ ...newSymptom, bodyPart: part })}
                    // Note: BodyMap needs to accept activeParts array to highlight all. For now, it highlights local state. 
                    // To fully link, we'd pass activeParts prop, but the current BodyMap component only takes `active` (boolean) or local state.
                    // For this iteration, we'll just log the click.
                    />

                    {/* Abstract Glow Effect for "Hologram" feel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
                </div>

                {/* Floating Controls */}
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <Button size="icon" variant="ghost" className="rounded-full size-8 shrink-0 bg-white/10 hover:bg-white/20 text-white">
                        <span className="text-xs">3D</span>
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full size-8 shrink-0 bg-white/10 hover:bg-white/20 text-white">
                        <span className="text-xs">AR</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
