import { motion } from "framer-motion";
import { Calendar, Pill, ChevronRight, User, MapPin } from "lucide-react";

export function UpcomingCareModule() {
    const upcoming = [
        { type: "appointment", title: "Dr. Sarah Chen", details: "Pulmonologist • Follow-up", time: "Oct 24, 09:30 AM", location: "Memorial Health Center", icon: User },
        { type: "medication", title: "Lisinopril 10mg Refill", details: "3 doses remaining", time: "Refill by Oct 26", location: "CVS Pharmacy", icon: Pill },
    ];

    return (
        <motion.div
            className="col-span-1 md:col-span-2 lg:col-span-4 row-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col group will-change-transform"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
                    <Calendar className="size-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Upcoming Care</h3>
                    <p className="text-xs text-slate-400">Scheduled events & actions</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {upcoming.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item cursor-pointer"
                    >
                        <div className="flex items-start gap-4 mb-3">
                            <div className={`p-2 rounded-xl shrink-0 ${item.type === 'appointment' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                <item.icon className="size-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                                <p className="text-xs text-slate-400 truncate">{item.details}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-3" />
                                <span className="truncate max-w-[120px]">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <span>{item.time}</span>
                                <ChevronRight className="size-2.5 group-hover/item:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="mt-6 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all uppercase tracking-widest shadow-inner">
                View Full Calendar
            </button>
        </motion.div>
    );
}
