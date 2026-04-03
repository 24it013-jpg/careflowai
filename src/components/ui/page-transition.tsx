import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: React.ReactNode;
}

const variants = {
    initial: { opacity: 0, scale: 0.98, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.02, filter: "blur(4px)" },
};

export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
                duration: 0.5, 
                ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for buttery smooth motion
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 }
            }}
            className="flex-1 flex flex-col"
        >
            {children}
        </motion.div>
    );
}
