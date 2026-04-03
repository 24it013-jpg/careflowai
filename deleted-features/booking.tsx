import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, CalendarCheck, Star, Check, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Doctors Data
const doctors = [
    { id: 1, name: "Dr. Sarah Chen", specialty: "Cardiologist", rating: 4.9, location: "Heart Center, NY", image: "/placeholder-doc1.jpg", price: "$150", available: ["10:00 AM", "2:30 PM", "4:15 PM"] },
    { id: 2, name: "Dr. James Wilson", specialty: "Dermatologist", rating: 4.8, location: "Skin Clinic, NY", image: "/placeholder-doc2.jpg", price: "$120", available: ["9:15 AM", "11:30 AM", "3:45 PM"] },
    { id: 3, name: "Dr. Emily Brooks", specialty: "General Practitioner", rating: 5.0, location: "City Health", image: "/placeholder-doc3.jpg", price: "$90", available: ["8:00 AM", "1:00 PM"] },
];

export default function Booking() {
    const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "confirmed">("idle");

    const handleBook = () => {
        if (!selectedSlot) return;
        setBookingStatus("booking");
        setTimeout(() => setBookingStatus("confirmed"), 2000);
    };

    return (
        <div className="min-h-screen bg-[#030a02] text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-lime-500/30">
            {/* Premium Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[50%] w-[60%] h-[60%] bg-lime-500/20 rounded-full blur-[150px] -translate-x-1/2 mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[40%] left-[10%] w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[80px] mix-blend-screen" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-emerald-400">
                        <span className="p-2 bg-lime-500/10 border border-lime-500/20 rounded-lg text-lime-400">
                            <CalendarCheck className="size-6" />
                        </span>
                        One-Tap Booking
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">Instant appointments with top-rated specialists.</p>
                </header>

                <div className="grid gap-6">
                    {doctors.map((doc) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "group border rounded-3xl p-6 transition-all duration-300 relative overflow-hidden cursor-pointer backdrop-blur-sm",
                                selectedDoc === doc.id 
                                    ? "bg-lime-500/10 border-lime-500/60 shadow-[0_0_30px_rgba(132,204,22,0.15)] premium-glass-panel" 
                                    : "bg-white/5 border-white/10 hover:border-lime-500/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(132,204,22,0.08)]"
                            )}
                            onClick={() => {
                                if (selectedDoc !== doc.id) {
                                    setSelectedDoc(doc.id);
                                    setSelectedSlot(null);
                                    setBookingStatus("idle");
                                }
                            }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Doctor Info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="size-16 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 flex-shrink-0 overflow-hidden">
                                        <User className="size-8 text-slate-400" />
                                        {/* <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" /> */}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-lime-300 transition-colors flex items-center gap-2">
                                            {doc.name}
                                            <ArrowRight className={cn("size-4 text-lime-400 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                                        </h3>
                                        <p className="text-lime-400 font-medium">{doc.specialty}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-500 border border-yellow-500/20">
                                                <Star className="size-3 text-yellow-500 fill-yellow-500" /> {doc.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3 text-slate-500" /> {doc.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Slots & Action */}
                                <AnimatePresence>
                                    {selectedDoc === doc.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="w-full md:w-auto flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6"
                                        >
                                            <h4 className="text-sm text-slate-400 uppercase tracking-wider md:hidden">Available Slots</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {doc.available.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedSlot(slot); }}
                                                        className={cn(
                                                            "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                                                            selectedSlot === slot
                                                                ? "bg-lime-500 text-black border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                                                                : "bg-black/40 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                                                        )}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>

                                            <Button
                                                onClick={(e) => { e.stopPropagation(); handleBook(); }}
                                                disabled={!selectedSlot || bookingStatus !== "idle"}
                                                className={cn(
                                                    "w-full rounded-xl font-bold transition-all duration-300 h-12",
                                                    bookingStatus === "confirmed"
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white border border-green-400/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                                        : "bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-black border-0 shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:shadow-[0_0_20px_rgba(132,204,22,0.5)] disabled:opacity-40 disabled:shadow-none"
                                                )}
                                            >
                                                {bookingStatus === "idle" && (selectedSlot ? `Book for ${doc.price}` : "Select a Time")}
                                                {bookingStatus === "booking" && <Clock className="size-4 animate-spin mr-2" />}
                                                {bookingStatus === "booking" && "Confirming..."}
                                                {bookingStatus === "confirmed" && <span className="flex items-center gap-2"><Check className="size-4" /> Confirmed!</span>}
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {selectedDoc !== doc.id && (
                                    <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-medium px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                        Tap to view availability
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
