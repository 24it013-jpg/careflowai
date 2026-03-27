import { ReactNode, useEffect, useRef } from "react";

interface ScrollContainerProps {
    children: ReactNode;
    className?: string;
}

export function ScrollContainer({ children, className = "" }: ScrollContainerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Smooth scroll performance optimization
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Add parallax or other scroll effects here if needed
                    ticking = false;
                });
                ticking = true;
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={scrollRef}
            className={`overflow-y-auto overflow-x-hidden ${className}`}
            style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch"
            }}
        >
            {children}
        </div>
    );
}
