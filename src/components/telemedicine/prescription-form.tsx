
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pill, FileText, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionData {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

interface PrescriptionFormProps {
    onPrescribe: (data: PrescriptionData) => void;
}

export default function PrescriptionForm({ onPrescribe }: PrescriptionFormProps) {
    const [formData, setFormData] = useState({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            onPrescribe(formData);

            // Reset success after 3 seconds
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-slate-700">Digital Prescription</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
                <div className="space-y-2">
                    <Label htmlFor="medication">Medication Name</Label>
                    <div className="relative">
                        <Pill className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            id="medication"
                            placeholder="e.g. Amoxicillin"
                            className="pl-9"
                            value={formData.medication}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, medication: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input
                            id="dosage"
                            placeholder="e.g. 500mg"
                            value={formData.dosage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dosage: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                            id="frequency"
                            placeholder="e.g. 2x daily"
                            value={formData.frequency}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, frequency: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                        id="duration"
                        placeholder="e.g. 7 days"
                        value={formData.duration}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, duration: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="instructions">Pharmacist Instructions</Label>
                    <Textarea
                        id="instructions"
                        placeholder="Special instructions for the pharmacist or patient..."
                        className="h-24 resize-none"
                        value={formData.instructions}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, instructions: e.target.value })}
                    />
                </div>

                <div className="pt-4 mt-auto">
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 mb-6 italic text-sm text-slate-500">
                        "Electronically signed by Dr. Sarah Smith"
                    </div>

                    <Button
                        className={cn(
                            "w-full h-12 rounded-full transition-all text-slate-900",
                            isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
                        )}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Issuing..."
                        ) : isSuccess ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" /> Issued Successfully
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="h-4 w-4" /> Issue Digital Prescription
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
