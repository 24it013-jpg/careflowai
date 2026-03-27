"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface BodyPartProps {
    d: string;
    id: string;
    label: string;
    onClick?: (id: string) => void;
    active?: boolean;
}

const BodyPart = ({ d, id, label, onClick, active }: BodyPartProps) => (
    <path
        d={d}
        className={cn(
            "fill-muted/20 stroke-muted-foreground/50 transition-all duration-300 cursor-pointer hover:fill-primary/20 hover:stroke-primary",
            active && "fill-destructive/20 stroke-destructive animate-pulse"
        )}
        strokeWidth="2"
        onClick={() => onClick?.(id)}
        data-tooltip={label}
    />
);

export function BodyMap({ className, onPartClick }: { className?: string; onPartClick?: (part: string) => void }) {
    const [activePart, setActivePart] = useState<string | null>(null);

    const handlePartClick = (part: string) => {
        setActivePart(part === activePart ? null : part);
        onPartClick?.(part);
    };

    return (
        <svg
            viewBox="0 0 200 400"
            className={cn("w-full h-full max-h-[400px]", className)}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Wireframe / Cyberpunk grid lines in background */}
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Head */}
            <BodyPart
                id="head"
                label="Head"
                d="M100 20 C85 20 75 35 75 50 C75 75 85 85 100 85 C115 85 125 75 125 50 C125 35 115 20 100 20 Z"
                onClick={handlePartClick}
                active={activePart === "head"}
            />
            {/* Torso */}
            <BodyPart
                id="torso"
                label="Torso"
                d="M75 90 L125 90 L135 190 L65 190 Z"
                onClick={handlePartClick}
                active={activePart === "torso"}
            />
            {/* Arms */}
            <BodyPart
                id="left-arm"
                label="Left Arm"
                d="M70 95 L50 110 L40 180 L55 180 L65 110 Z"
                onClick={handlePartClick}
                active={activePart === "left-arm"}
            />
            <BodyPart
                id="right-arm"
                label="Right Arm"
                d="M130 95 L150 110 L160 180 L145 180 L135 110 Z"
                onClick={handlePartClick}
                active={activePart === "right-arm"}
            />
            {/* Legs */}
            <BodyPart
                id="left-leg"
                label="Left Leg"
                d="M65 195 L60 300 L75 350 L85 350 L90 300 L95 195 Z"
                onClick={handlePartClick}
                active={activePart === "left-leg"}
            />
            <BodyPart
                id="right-leg"
                label="Right Leg"
                d="M105 195 L110 300 L125 350 L115 350 L140 300 L135 195 Z" // Adjusted vector
                // Fixing path to be symmetrical-ish
                onClick={handlePartClick}
                active={activePart === "right-leg"}
            />
            <path
                d="M105 195 L110 300 L120 350 L135 350 L140 300 L135 195 Z"
                className={cn(
                    "fill-muted/20 stroke-muted-foreground/50 transition-all duration-300 cursor-pointer hover:fill-primary/20 hover:stroke-primary",
                    activePart === "right-leg" && "fill-destructive/20 stroke-destructive animate-pulse"
                )}
                strokeWidth="2"
                onClick={() => handlePartClick("right-leg")}
            />

        </svg>
    );
}
