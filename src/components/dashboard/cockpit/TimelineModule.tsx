import { motion } from "framer-motion";
import { Pill, Calendar, Clock, ChevronRight } from "lucide-react";

const EVENTS = [
    { time: "08:00", title: "Amoxicillin", type: "med", details: "500mg • Taken" },
    { time: "09:00", title: "Vitamin D3", type: "med", details: "1000 IU • Taken" },
    { time: "10:00", title: "Dr. Sarah Smith", type: "appt", details: "Cardiology • Upcoming" },
    { time: "14:00", title: "Lisinopril", type: "med", details: "10mg • Pending" },
    { time: "16:00", title: "Physio Checkup", type: "appt", details: "Recovery" },
];

export function TimelineModule() {
    return (
        <motion.div
            id="timeline"
            className="col-span-1 md:col-span-2 lg:col-span-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center scroll-mt-32"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Clock className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Daily Timeline</h3>
                        <p className="text-xs text-slate-400">Today's Schedule</p>
                    </div>
                </div>
                <button className="text-xs text-indigo-400 hover:text-indigo-300">View Calendar</button>
            </div>

            <div className="relative">
                {/* Horizontal time line */}
                <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-white/10" />

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {EVENTS.map((evt, i) => (
                        <div key={i} className="flex-shrink-0 w-[140px] group cursor-pointer">
                            <div className="flex flex-col items-center">
                                {/* Time Bubble */}
                                <div className={`px-2 py-1 rounded-full text-xs font-mono mb-2 border ${evt.type === 'med' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                    {evt.time}
                                </div>

                                {/* Dot on line */}
                                <div className={`w-3 h-3 rounded-full border-2 border-[#0F0F0F] relative z-10 mb-3 ${evt.type === 'med' ? 'bg-pink-500' : 'bg-blue-500'} group-hover:scale-125 transition-transform`} />

                                {/* Card */}
                                <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
                                    <div className="flex justify-center mb-2 text-slate-400">
                                        {evt.type === 'med' ? <Pill className="size-4" /> : <Calendar className="size-4" />}
                                    </div>
                                    <p className="text-sm font-semibold text-white truncate w-full">{evt.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate w-full">{evt.details}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* View All Button */}
                    <div className="flex-shrink-0 w-[60px] flex items-center justify-center pt-8">
                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
