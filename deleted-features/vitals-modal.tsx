import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Heart, Weight } from "lucide-react";
import { useHealthData } from "@/hooks/use-health-data";
import { toast } from "sonner";

interface VitalsModalProps {
    children: React.ReactNode;
}

export function VitalsModal({ children }: VitalsModalProps) {
    const [open, setOpen] = useState(false);
    const { addVitalReading, setVitals } = useHealthData();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        heartRate: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        spo2: "",
        temperature: "",
        weight: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validation (Basic)
            if (!formData.heartRate || !formData.bloodPressureSystolic) {
                toast.error("Heart Rate and Systolic BP are required");
                setLoading(false);
                return;
            }

            const newReading = {
                timestamp: Date.now(),
                heartRate: Number(formData.heartRate),
                spo2: Number(formData.spo2) || 98,
                temperature: Number(formData.temperature) || 36.6,
                bloodPressureSystolic: Number(formData.bloodPressureSystolic),
                bloodPressureDiastolic: Number(formData.bloodPressureDiastolic) || 80,
                weight: Number(formData.weight) || 70,
                source: "manual" as const, // Cast to literal type if needed by definition
            };

            // 1. Add to history
            addVitalReading(newReading);

            // 2. Update current vitals
            setVitals({
                ...newReading,
                lastMeasured: Date.now(),
            });

            toast.success("Vitals Logged Successfully! (+50 XP)");
            setOpen(false);
            setFormData({
                heartRate: "",
                bloodPressureSystolic: "",
                bloodPressureDiastolic: "",
                spo2: "",
                temperature: "",
                weight: "",
            });
        } catch (error) {
            console.error("Failed to log vitals:", error);
            toast.error("Failed to log vitals");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="size-5 text-blue-400" />
                        Log Critical Vitals
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="heartRate" className="text-xs text-slate-400">Heart Rate (BPM)</Label>
                            <div className="relative">
                                <Heart className="absolute left-3 top-2.5 size-4 text-rose-500/50" />
                                <Input
                                    id="heartRate"
                                    name="heartRate"
                                    type="number"
                                    placeholder="72"
                                    value={formData.heartRate}
                                    onChange={handleChange}
                                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spo2" className="text-xs text-slate-400">SpO2 (%)</Label>
                            <div className="relative">
                                <Activity className="absolute left-3 top-2.5 size-4 text-cyan-500/50" />
                                <Input
                                    id="spo2"
                                    name="spo2"
                                    type="number"
                                    placeholder="98"
                                    max="100"
                                    value={formData.spo2}
                                    onChange={handleChange}
                                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bp" className="text-xs text-slate-400">Blood Pressure (mmHg)</Label>
                            <div className="flex gap-2">
                                <Input
                                    name="bloodPressureSystolic"
                                    type="number"
                                    placeholder="120"
                                    value={formData.bloodPressureSystolic}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                                />
                                <span className="text-slate-500 py-2">/</span>
                                <Input
                                    name="bloodPressureDiastolic"
                                    type="number"
                                    placeholder="80"
                                    value={formData.bloodPressureDiastolic}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-xs text-slate-400">Weight (kg)</Label>
                            <div className="relative">
                                <Weight className="absolute left-3 top-2.5 size-4 text-emerald-500/50" />
                                <Input
                                    id="weight"
                                    name="weight"
                                    type="number"
                                    placeholder="70.5"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="pl-9 bg-white/5 border-white/10 text-white focus:border-blue-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
                    >
                        {loading ? "Logging..." : "Save Vitals & Earn XP"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
