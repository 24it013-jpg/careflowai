import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    key="back-to-top"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-44 right-12 z-50 group"
                >
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping group-hover:animate-none" />

                    {/* Button */}
                    <span className="relative flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 border border-white/10 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-200">
                        <ArrowUp className="size-5 text-white" />
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
