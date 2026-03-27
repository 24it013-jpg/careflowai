import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Calendar, ArrowRight, Stethoscope, Filter, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data
const SPECIALISTS = [
    {
        id: 1,
        name: "Dr. Sarah Chen",
        specialty: "Cardiologist",
        hospital: "Heart Center of Excellence",
        rating: 4.9,
        reviews: 128,
        distance: "2.4 miles",
        image: "SC",
        color: "bg-blue-500",
        badges: ["Top Rated", "Available"]
    },
    {
        id: 2,
        name: "Dr. Michael Ross",
        specialty: "Neurologist",
        hospital: "City General Hospital",
        rating: 4.8,
        reviews: 94,
        distance: "4.1 miles",
        image: "MR",
        color: "bg-purple-500",
        badges: ["Expert"]
    },
    {
        id: 3,
        name: "Dr. Emily Hayes",
        specialty: "Dermatologist",
        hospital: "Hayes Skin Clinic",
        rating: 4.9,
        reviews: 215,
        distance: "1.2 miles",
        image: "EH",
        color: "bg-rose-500",
        badges: ["Video Visit"]
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        specialty: "Orthopedic Surgeon",
        hospital: "Sports Med Institute",
        rating: 4.7,
        reviews: 86,
        distance: "5.5 miles",
        image: "JW",
        color: "bg-orange-500",
        badges: ["Surgeon"]
    }
];

export default function SpecialistMatch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null);
    const [bookingStatus, setBookingStatus] = useState<"idle" | "booked">("idle");

    const handleOneTapBook = () => {
        setBookingStatus("booked");
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#10b981']
        });
        setTimeout(() => setBookingStatus("idle"), 3000);
    };

    const filteredSpecialists = SPECIALISTS.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-blue-500/30">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[30%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-light tracking-tight flex items-center justify-center md:justify-start gap-4 mb-4 text-white">
                        <span className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-sm">
                            <Stethoscope className="size-8" />
                        </span>
                        Specialist Match
                    </h1>
                    <p className="text-white/50 text-xl font-light max-w-2xl">
                        AI-powered matching to find the perfect specialist based on your symptoms, location, and insurance.
                    </p>
                </header>

                {/* Search Bar */}
                <div className="relative max-w-2xl mb-16 group mx-auto md:mx-0">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:bg-blue-500/20 transition-all duration-500 opacity-50" />
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl backdrop-blur-md">
                        <Search className="ml-4 text-white/40 size-6" />
                        <Input
                            className="border-none bg-transparent text-lg h-14 focus-visible:ring-0 placeholder:text-white/30 text-white"
                            placeholder="Search by specialty, condition, or doctor name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="ghost" className="mr-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl">
                            <Filter className="size-5" />
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 px-8 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95">
                            Find
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* List */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredSpecialists.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    layoutId={`card-${doc.id}`}
                                    onClick={() => setSelectedSpecialist(doc.id)}
                                    className={cn(
                                        "group cursor-pointer rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md",
                                        selectedSpecialist === doc.id
                                            ? "bg-white/10 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className={cn("size-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg", doc.color)}>
                                            {doc.image}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={cn("text-xl font-medium transition-colors", selectedSpecialist === doc.id ? "text-white" : "text-white/90 group-hover:text-white")}>{doc.name}</h3>
                                                    <p className="text-blue-400 font-medium">{doc.specialty}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                                                    <Star className="size-4 text-amber-500 fill-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                                    <span className="font-bold text-white">{doc.rating}</span>
                                                    <span className="text-xs text-white/30">({doc.reviews})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="size-3.5" /> {doc.hospital}
                                                </span>
                                                <span className="size-1 bg-white/20 rounded-full" />
                                                <span className="font-mono text-xs">{doc.distance}</span>
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                {doc.badges?.map(badge => (
                                                    <span key={badge} className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/5 text-white/40">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="self-center">
                                            <div className={cn(
                                                "p-3 rounded-full transition-all duration-500",
                                                selectedSpecialist === doc.id ? "bg-blue-500 text-white rotate-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/5 text-white/30 -rotate-45 group-hover:bg-white/10 group-hover:text-white"
                                            )}>
                                                <ArrowRight className="size-5" />
                                            </div>
                                        </div>
                                    </div>
                                    {selectedSpecialist === doc.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Details Panel */}
                    <div className="relative hidden lg:block">
                        <div className="sticky top-8">
                            <AnimatePresence mode="wait">
                                {selectedSpecialist ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

                                        {(() => {
                                            const doc = SPECIALISTS.find(d => d.id === selectedSpecialist)!;
                                            return (
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-6 mb-8">
                                                        <div className={cn("size-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl", doc.color)}>
                                                            {doc.image}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-3xl font-light text-white mb-1">{doc.name}</h2>
                                                            <p className="text-xl text-blue-400 font-medium">{doc.specialty}</p>
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                    Available Today
                                                                </span>
                                                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20 uppercase tracking-widest flex items-center gap-1.5">
                                                                    <div className="size-1.5 rounded-full bg-purple-500" />
                                                                    Video Visit
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6 mb-8">
                                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                                            <h4 className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                                                                <Shield className="size-3" /> About
                                                            </h4>
                                                            <p className="text-white/70 leading-relaxed font-light">
                                                                Dr. {doc.name.split(' ')[1]} is a top-rated specialist with over 15 years of experience.
                                                                Passionate about patient-centered care and utilizing the latest medical technologies.
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white/5 rounded-3xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
                                                                <div className="text-3xl font-light text-white mb-1 group-hover:scale-110 transition-transform origin-center inline-block">15+</div>
                                                                <div className="text-[10px] text-white/30 uppercase tracking-widest">Years Exp.</div>
                                                            </div>
                                                            <div className="bg-white/5 rounded-3xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
                                                                <div className="text-3xl font-light text-white mb-1 group-hover:scale-110 transition-transform origin-center inline-block">2k+</div>
                                                                <div className="text-[10px] text-white/30 uppercase tracking-widest">Patients</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={handleOneTapBook}
                                                        className={cn(
                                                            "w-full h-16 text-lg rounded-2xl shadow-xl transition-all duration-300 group relative overflow-hidden border border-transparent",
                                                            bookingStatus === "booked"
                                                                ? "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-white"
                                                                : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)] text-white"
                                                        )}
                                                    >
                                                        {bookingStatus === "booked" ? (
                                                            <div className="flex items-center gap-2">
                                                                <Check className="size-6" />
                                                                <span>Confirmed!</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="size-5 group-hover:scale-110 transition-transform" />
                                                                <span>One-Tap Book</span>
                                                            </div>
                                                        )}
                                                    </Button>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-[600px] flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm"
                                    >
                                        <div className="p-6 bg-white/5 rounded-full mb-6 relative">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                                            <Stethoscope className="size-16 opacity-40 text-blue-300 relative z-10" />
                                        </div>
                                        <h3 className="text-2xl font-light text-white mb-3">Select a Specialist</h3>
                                        <p className="max-w-xs mx-auto text-white/40">
                                            Choose a doctor from the list to view their full profile and availability.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
