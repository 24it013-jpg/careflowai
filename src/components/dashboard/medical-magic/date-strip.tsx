import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DateStrip() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Generate days for the selected month
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
        return {
            dateObj: date,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate().toString().padStart(2, '0'),
            isToday: date.toDateString() === new Date().toDateString(),
        };
    });

    const changeMonth = (offset: number) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
        setCurrentMonth(newMonth);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    // Scroll to selected date on mount or month change
    useEffect(() => {
        if (scrollContainerRef.current) {
            // Simple logic: if selected date is in current month, try to center it
            // For now, let's just ensure it doesn't look broken.
            // We can refine scroll position later if needed.
        }
    }, [currentMonth]);


    return (
        <div className="flex flex-col xl:flex-row gap-6 items-center justify-between w-full">

            {/* Month Selector */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-2 pr-4 flex items-center gap-4 min-w-[200px] justify-between shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => changeMonth(-1)}
                    className="h-10 w-10 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
                >
                    <ChevronLeft className="size-5" />
                </Button>
                <div className="text-center w-24">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Month</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentMonth.toISOString()}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-white font-bold text-lg block"
                        >
                            {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                        </motion.span>
                    </AnimatePresence>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => changeMonth(1)}
                    className="h-10 w-10 rounded-full text-slate-400 hover:text-white hover:bg-white/5"
                >
                    <ChevronRight className="size-5" />
                </Button>
            </div>

            {/* Day Strip */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-3 flex-1 flex items-center justify-between gap-2 overflow-hidden shadow-lg w-full"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/5 shrink-0 hidden md:flex"
                >
                    <ChevronLeft className="size-4" />
                </Button>

                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide px-2 w-full"
                >
                    {days.map((item, index) => {
                        const isActive = item.dateObj.toDateString() === selectedDate.toDateString();
                        return (
                            <div
                                key={index}
                                onClick={() => handleDateClick(item.dateObj)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-[1.2rem] transition-all duration-300 cursor-pointer border border-transparent select-none",
                                    isActive
                                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-blue-500 text-white scale-105"
                                        : "hover:bg-white/5 text-slate-400 hover:text-white",
                                    item.isToday && !isActive && "border-white/10 bg-white/5 text-white"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider mb-1",
                                    isActive ? "text-blue-100" : "opacity-70"
                                )}>
                                    {item.day}
                                </span>
                                <span className={cn(
                                    "text-lg font-bold",
                                    isActive ? "text-white" : ""
                                )}>
                                    {item.date}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/5 shrink-0 hidden md:flex"
                >
                    <ChevronRight className="size-4" />
                </Button>
            </motion.div>

        </div>
    );
}
