import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { MedicineImageRecognitionPanel } from '@/components/medication/medicine-image-recognition-panel';

export default function AIMedCheck() {
    return (
        <div className="min-h-screen bg-black text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-teal-500/30">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 flex items-center gap-3">
                        <motion.span
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] text-teal-400 backdrop-blur-md"
                        >
                            <Camera className="size-7" />
                        </motion.span>
                        AI Med Check
                    </h1>
                    <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                        Medicine Scanner provides detailed medicine information by scanning packaging, labels, or pills. CAREflow uses your existing vision setup to describe what it sees.
                    </p>
                </motion.div>

                <MedicineImageRecognitionPanel />
            </div>
        </div>
    );
}
