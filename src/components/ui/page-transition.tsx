import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: React.ReactNode;
}

const variants = {
    initial: { opacity: 0, y: 12, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(2px)" },
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
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 flex flex-col"
        >
            {children}
        </motion.div>
    );
}
