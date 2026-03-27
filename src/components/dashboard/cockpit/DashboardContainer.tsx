import React from "react";
import { motion } from "framer-motion";

export function DashboardContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-full w-full bg-background relative overflow-hidden text-foreground p-4 md:p-6 font-sans">
            {/* --- Atmosphere Details --- */}

            {/* 1. Subtle Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{
                    backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 2. Ambient Glows */}
            <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* 3. Scanning Line Effect (Radar) */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-gradient-to-b from-transparent via-cyan-500 to-transparent h-[200px]"
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* --- Content Content --- */}
            <div className="relative z-10 max-w-[1920px] mx-auto">
                {children}
            </div>
        </div>
    );
}

export function BentoGrid({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4 md:gap-6 ${className}`}>
            {children}
        </div>
    );
}
