import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Upload } from "lucide-react";

import { useAIChat } from "@/hooks/use-ai-chat";

export function QuickScanModule() {
    const { openChat } = useAIChat();
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setIsScanning(true);
        // Simulate scanning
        setTimeout(() => {
            setIsScanning(false);
            openChat("I've just scanned a medical document. Can you analyze the contents for me?");
        }, 2000);
    };

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-1 relative overflow-hidden group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <div className={`h-full w-full rounded-[20px] bg-white/5 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 relative overflow-hidden
                ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}
            `}>

                {/* Laser Scan Animation */}
                {isScanning && (
                    <motion.div
                        className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20"
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                )}

                <div className="relative z-10 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-all duration-500 
                        ${isScanning ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'}
                    `}>
                        {isScanning ? (
                            <Scan className="size-8 animate-pulse" />
                        ) : (
                            <Upload className="size-8" />
                        )}
                    </div>

                    <div>
                        <h3 className="font-bold text-white text-lg">
                            {isScanning ? "Analyzing Document..." : "Quick Scan"}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1">
                            Drag & drop medical reports, lab results, or X-rays here for instant AI analysis.
                        </p>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
            </div>
        </motion.div>
    );
}
