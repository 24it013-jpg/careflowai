import { useRef } from "react";
import { motion } from "framer-motion";
import { Pill, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const EVENTS = [
    { time: "08:00", title: "Amoxicillin", type: "med", details: "500mg", status: "taken" },
    { time: "09:00", title: "Vitamin D3", type: "med", details: "1000 IU", status: "taken" },
    { time: "10:00", title: "Dr. Sarah Smith", type: "appt", details: "Cardiology", status: "upcoming" },
    { time: "14:00", title: "Lisinopril", type: "med", details: "10mg", status: "pending" },
    { time: "16:00", title: "Physio Checkup", type: "appt", details: "Recovery", status: "upcoming" },
    { time: "18:00", title: "Metformin", type: "med", details: "850mg", status: "pending" },
    { time: "20:00", title: "Evening Walk", type: "activity", details: "30 min", status: "pending" },
];

export function TimelineScroller() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <motion.div
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 rounded-lg">
                        <Clock className="size-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">Daily Timeline</h3>
                        <p className="text-xs text-slate-400">Today's medications and appointments</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="size-4 text-slate-400" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                    >
                        <ChevronRight className="size-4 text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-[32px] left-0 right-0 h-0.5 bg-white/10 z-0" />

                {/* Scrollable Events */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                >
                    {EVENTS.map((evt, i) => (
                        <motion.div
                            key={i}
                            className="flex-shrink-0 w-[140px] group cursor-pointer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex flex-col items-center">
                                {/* Time Bubble */}
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${evt.type === 'med'
                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    : evt.type === 'appt'
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                        : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                    }`}>
                                    {evt.time}
                                </div>

                                {/* Dot on line */}
                                <div className={`w-3 h-3 rounded-full border-2 border-white relative z-10 mb-3 shadow-sm ${evt.status === 'taken'
                                    ? 'bg-emerald-500'
                                    : evt.type === 'med'
                                        ? 'bg-rose-500'
                                        : evt.type === 'appt'
                                            ? 'bg-blue-500'
                                            : 'bg-purple-500'
                                    } group-hover:scale-125 transition-transform`} />

                                {/* Card */}
                                <div className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-lg transition-all text-center">
                                    <div className="flex justify-center mb-2 text-slate-400">
                                        {evt.type === 'med' ? (
                                            <Pill className="size-4" />
                                        ) : evt.type === 'appt' ? (
                                            <Calendar className="size-4" />
                                        ) : (
                                            <Clock className="size-4" />
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-white truncate">{evt.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{evt.details}</p>
                                    {evt.status === 'taken' && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold rounded-full">
                                            ✓ TAKEN
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
