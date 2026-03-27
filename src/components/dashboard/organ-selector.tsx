import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const ORGANS = [
    { id: "heart", label: "Heart" },
    { id: "lungs", label: "Lungs" },
    { id: "head", label: "Head" },
    { id: "legs", label: "Legs" },
    { id: "stomach", label: "Stomach" },
    { id: "eyes", label: "Eyes" },
    { id: "dna", label: "DNA" },
];

interface OrganSelectorProps {
    selectedOrgan: string;
    onSelect: (organ: string) => void;
}

export function OrganSelector({ selectedOrgan, onSelect }: OrganSelectorProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-1">
            {ORGANS.map((organ) => {
                const isSelected = selectedOrgan === organ.id;

                return (
                    <button
                        key={organ.id}
                        onClick={() => onSelect(organ.id)}
                        className={cn(
                            "relative px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all z-0 overflow-hidden flex-shrink-0",
                            isSelected
                                ? "text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="active-organ-tab"
                                className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {organ.label}
                    </button>
                );
            })}
        </div>
    );
}
