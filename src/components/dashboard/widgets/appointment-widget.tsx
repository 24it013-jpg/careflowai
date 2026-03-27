import { motion } from "framer-motion";
import { Calendar, MapPin, Video, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppointmentWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[300px]"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Calendar className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Appointments</h3>
                        <p className="text-xs text-slate-400">2 upcoming</p>
                    </div>
                </div>
                <Link to="/features/appointments">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-xs">
                        View All
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {/* Active/Next Appointment */}
                {/* Active/Next Appointment */}
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-4 relative group hover:border-blue-500/40 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 bg-cover bg-center border border-white/10" style={{ backgroundImage: "url('https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith')" }} />
                            <div>
                                <h4 className="font-bold text-sm text-white">Dr. Sarah Smith</h4>
                                <p className="text-xs text-blue-300">Cardiologist</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                            Today, 2:30 PM
                        </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                            <Video className="size-3 mr-2" />
                            Join Call
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 border-white/10 bg-transparent text-slate-400 hover:text-white hover:bg-white/5">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Future Appointment */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                            <MapPin className="size-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">City Hospital</h4>
                            <p className="text-xs text-slate-400">MRI Scan • Tomorrow</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">10:00 AM</span>
                </div>
            </div>
        </motion.div>
    );
}
