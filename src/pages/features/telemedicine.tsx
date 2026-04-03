import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, MicOff, Camera, CameraOff, PhoneOff,
    MessageSquare, User,
    Maximize, Minimize, Paperclip, Send,
    MonitorUp, PencilLine, Languages, ReceiptText,
    X, CheckCircle2, CreditCard, Pill, Video, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";
import TeleWhiteboard from "@/components/telemedicine/tele-whiteboard";
import PrescriptionForm from "@/components/telemedicine/prescription-form";
import { toast } from "sonner";
import { VideoCallManager } from "@/components/telemedicine/video-call-manager";

// Mock Data for Chat
const INITIAL_MESSAGES = [
    { id: 1, sender: "doctor", text: "Hello! I'm Dr. Smith. How can I help you today?", time: "10:00 AM" },
    { id: 2, sender: "patient", text: "Hi Doctor, I've been having a persistent headache for 3 days.", time: "10:01 AM" },
];

interface PrescriptionData {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export default function Telemedicine() {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);

    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState("");
    const [transcript, setTranscript] = useState<string[]>([]);
    const [connectionQuality, setConnectionQuality] = useState(3); // 0-3 bars
    const [fullscreen, setFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [callMethod, setCallMethod] = useState<"jitsi" | "meet" | "whatsapp">("jitsi");
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulate connection quality changes
    useEffect(() => {
        if (!isCallActive) return;
        const interval = setInterval(() => {
            setConnectionQuality(Math.floor(Math.random() * 2) + 2); // 2 or 3 bars
        }, 5000);
        return () => clearInterval(interval);
    }, [isCallActive]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Web Speech API Simulation for Transcription
    useEffect(() => {
        let timer: any;
        if (isTranscribing && isCallActive) {
            timer = setInterval(() => {
                const phrases = [
                    "Checking blood pressure...",
                    "Patient reports persistent migraines.",
                    "Recommend follow-up MRI.",
                    "Dosage adjusted to 500mg.",
                    "Normal sinus rhythm observed."
                ];
                const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
                setTranscript(prev => [...prev, `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Dr. Smith: ${randomPhrase}`]);
            }, 6000);
        }
        return () => clearInterval(timer);
    }, [isTranscribing, isCallActive]);

    const toggleCall = async () => {
        if (!isCallActive) {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Camera API is unavailable. This usually happens when the application is not running on a secure context (HTTPS) or localhost.");
                }

                // Request camera permission for self-view
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Start call animation
                setIsCallActive(true);
                setIsTranscribing(true);
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#4ade80', '#3b82f6']
                });
                toast.success("Call Connected", { description: "Secure encrypted session established" });
            } catch (err: any) {
                console.warn("Camera Warning:", err?.message || err);
                toast.error("Camera Error", { description: err.message || "Please allow camera access for the consultation." });
                // Still allow call start for demo purposes even if camera fails
                setIsCallActive(true);
            }
        } else {
            // Stop camera stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setIsCallActive(false);
            setIsScreenSharing(false);
            setIsWhiteboardOpen(false);
            setIsTranscribing(false);
            setShowSummary(true);
        }
    };

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: messages.length + 1,
            sender: "patient",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage("");

        // Auto-reply simulation
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: "doctor",
                text: "I see. Does the pain radiate anywhere else?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2000);
    };

    const handlePrescription = (data: PrescriptionData) => {
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            sender: "doctor",
            text: `📝 New Prescription Issued: ${data.medication} (${data.dosage})`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        toast.info("Prescription issued and shared in chat");
    };

    const handlePayment = () => {
        setIsPaymentComplete(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => setShowSummary(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020d1a] text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-cyan-500/30">
            {/* Premium Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[130px] mix-blend-screen" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute top-[60%] left-[50%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[90px] mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight flex items-center gap-4 text-white mb-4"
                    >
                        <span className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 shadow-lg shadow-rose-500/10">
                            <Video className="size-8" />
                        </span>
                        Telemedicine
                    </motion.h1>
                    <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed">
                        Connect with top healthcare professionals from the comfort of your home. Experience secure video calls, instant prescriptions, and digital summaries of your consultations.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)] min-h-[600px]">

                    {/* Main Video Area */}
                    <motion.div
                        className={cn(
                            "premium-glass-panel lg:col-span-2 rounded-[2rem] overflow-hidden relative shadow-2xl",
                            fullscreen && "fixed inset-0 z-50 rounded-none w-screen h-screen m-0 border-none bg-black"
                        )}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Header Overlay */}
                        <AnimatePresence>
                            {isCallActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100" alt="Doc" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-white drop-shadow-md">Dr. Sarah Smith</h3>
                                            <p className="text-sm text-cyan-400 drop-shadow-md">Cardiologist • Session Active</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-medium">
                                        <Wifi className={cn("h-4 w-4", connectionQuality > 1 ? "text-emerald-400" : "text-amber-400")} />
                                        <span className="text-xs">HD (1080p)</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Video/Shared Content Area */}
                        <div className="w-full h-full flex items-center justify-center relative bg-black/50">
                            {isCallActive ? (
                                <div className="relative w-full h-full">
                                    <VideoCallManager
                                        isCallActive={isCallActive}
                                        isWhiteboardOpen={isWhiteboardOpen}
                                        isScreenSharing={isScreenSharing}
                                        callMethod={callMethod}
                                        onMethodChange={setCallMethod}
                                    />

                                    {isWhiteboardOpen && (
                                        <div className="absolute inset-0 z-10 p-4 bg-white/5 backdrop-blur-lg">
                                            <TeleWhiteboard />
                                        </div>
                                    )}

                                    {/* Self View */}
                                    <motion.div
                                        drag
                                        dragConstraints={{ left: -300, right: 0, top: 0, bottom: 300 }}
                                        className="absolute bottom-6 right-6 w-48 h-36 bg-black/80 rounded-2xl border border-white/10 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing z-20 group backdrop-blur-md"
                                    >
                                        {isCameraOff ? (
                                            <div className="w-full h-full flex items-center justify-center text-white/30">
                                                <CameraOff className="h-8 w-8" />
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover scale-x-[-1] opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="text-[10px] text-white/70 font-medium bg-black/60 px-2 py-1 rounded-full border border-white/10">You</span>
                                        </div>
                                    </motion.div>

                                    {/* Overlay Gradient for controls */}
                                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                                </div>
                            ) : (
                                <div className="text-center space-y-8 relative z-10">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-150" />
                                        <div className="h-32 w-32 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mx-auto relative z-10 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-md">
                                            <User className="h-12 w-12 text-cyan-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-light text-white mb-2">Ready to consult?</h3>
                                        <p className="text-white/40 max-w-sm mx-auto">Your medical sub-specialist session is prepared in a HIPAA-compliant virtual room.</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={toggleCall}
                                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl px-10 h-14 text-lg shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] border border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95"
                                    >
                                        Start Session Now
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Controls Bar */}
                        <AnimatePresence>
                            {isCallActive && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-4 z-30"
                                >
                                    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsMuted(!isMuted)}
                                            className={cn(
                                                "rounded-2xl h-12 w-12 transition-all hover:bg-white/10",
                                                isMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "text-white/80"
                                            )}
                                        >
                                            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsCameraOff(!isCameraOff)}
                                            className={cn(
                                                "rounded-2xl h-12 w-12 transition-all hover:bg-white/10",
                                                isCameraOff ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "text-white/80"
                                            )}
                                        >
                                            {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                                        </Button>

                                        <div className="w-px h-8 bg-white/10 mx-1" />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIsScreenSharing(!isScreenSharing);
                                                setIsWhiteboardOpen(false);
                                            }}
                                            className={cn(
                                                "rounded-2xl h-12 w-12 transition-all hover:bg-white/10",
                                                isScreenSharing ? "bg-cyan-500/20 text-cyan-400" : "text-white/80"
                                            )}
                                        >
                                            <MonitorUp className="h-5 w-5" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIsWhiteboardOpen(!isWhiteboardOpen);
                                                setIsScreenSharing(false);
                                            }}
                                            className={cn(
                                                "rounded-2xl h-12 w-12 transition-all hover:bg-white/10",
                                                isWhiteboardOpen ? "bg-orange-500/20 text-orange-400" : "text-white/80"
                                            )}
                                        >
                                            <PencilLine className="h-5 w-5" />
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={toggleCall}
                                            className="rounded-2xl h-12 w-12 bg-red-500/80 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] ml-2"
                                        >
                                            <PhoneOff className="h-5 w-5" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsTranscribing(!isTranscribing)}
                                            className={cn(
                                                "rounded-2xl h-12 w-12 transition-all hover:bg-white/10 ml-2",
                                                isTranscribing ? "bg-emerald-500/20 text-emerald-400" : "text-white/80"
                                            )}
                                        >
                                            <Languages className="h-5 w-5" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-2xl h-12 w-12 text-white/80 hover:bg-white/10 transition-all"
                                            onClick={() => setFullscreen(!fullscreen)}
                                        >
                                            {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Sidebar (Chat, Prescription, Transcription) */}
                    {!fullscreen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-glass-panel rounded-[2rem] flex flex-col overflow-hidden shadow-xl"
                        >
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                                <TabsList className="bg-black/20 w-full rounded-none h-16 p-2 border-b border-white/5 grid grid-cols-3 gap-2">
                                    <TabsTrigger value="chat" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 hover:text-white/80 transition-all">
                                        <MessageSquare className="h-4 w-4 mr-2" /> Chat
                                    </TabsTrigger>
                                    <TabsTrigger value="rx" className="rounded-xl data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 text-white/50 hover:text-white/80 transition-all">
                                        <Pill className="h-4 w-4 mr-2" /> RX
                                    </TabsTrigger>
                                    <TabsTrigger value="transcript" className="rounded-xl data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 text-white/50 hover:text-white/80 transition-all">
                                        <ReceiptText className="h-4 w-4 mr-2" /> Note
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="chat" className="flex-1 flex flex-col m-0 outline-none">
                                    <ScrollArea className="flex-1 p-6">
                                        <div className="space-y-6 pb-4">
                                            {messages.map((msg) => (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={cn(
                                                        "flex flex-col max-w-[90%]",
                                                        msg.sender === "patient" ? "ml-auto items-end" : "mr-auto items-start"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "px-4 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-sm",
                                                        msg.sender === "patient"
                                                            ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/20 rounded-br-none"
                                                            : "bg-white/5 text-white/90 rounded-bl-none border border-white/10"
                                                    )}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-white/30 mt-1.5 px-1 font-mono">
                                                        {msg.time}
                                                    </span>
                                                </motion.div>
                                            ))}
                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>

                                    <div className="p-4 border-t border-white/5 bg-black/20">
                                        <form onSubmit={sendMessage} className="flex gap-3">
                                            <Button type="button" variant="ghost" size="icon" className="h-12 w-12 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                                                <Paperclip className="h-5 w-5" />
                                            </Button>
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type message..."
                                                className="bg-white/5 border-white/10 focus:border-cyan-500/50 rounded-2xl h-12 text-white placeholder:text-white/20"
                                            />
                                            <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
                                                <Send className="h-5 w-5 text-white" />
                                            </Button>
                                        </form>
                                    </div>
                                </TabsContent>

                                <TabsContent value="rx" className="flex-1 m-0 outline-none">
                                    <ScrollArea className="h-full">
                                        <div className="p-4">
                                            <PrescriptionForm onPrescribe={handlePrescription} />
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="transcript" className="flex-1 m-0 outline-none flex flex-col">
                                    <div className="p-4 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Real-time AI Scribe
                                        </span>
                                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Auto-transcribing</Badge>
                                    </div>
                                    <ScrollArea className="flex-1 p-6">
                                        <div className="space-y-4">
                                            {transcript.length === 0 && (
                                                <div className="flex flex-col items-center justify-center pt-20 text-center opacity-40">
                                                    <Languages className="h-12 w-12 mb-2 text-white/20" />
                                                    <p className="text-sm text-white/40">Speak to start transcription</p>
                                                </div>
                                            )}
                                            {transcript.map((line, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-sm text-white/70 pb-3 border-b border-white/5 last:border-0 font-light"
                                                >
                                                    {line}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    )}
                </div>

                {/* Session Summary / Payment Modal */}
                <AnimatePresence>
                    {showSummary && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="premium-glass-panel rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

                                {isPaymentComplete ? (
                                    <div className="p-12 text-center space-y-6 relative z-10">
                                        <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                            <CheckCircle2 className="h-12 w-12" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-light text-white mb-2">Transaction Complete</h2>
                                            <p className="text-white/40">Session record and invoice have been sent to your medical records.</p>
                                        </div>
                                        <Button onClick={() => setShowSummary(false)} className="w-full h-14 rounded-2xl bg-white text-black font-medium text-lg hover:bg-white/90">
                                            Back to Dashboard
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center relative z-10">
                                            <div>
                                                <h2 className="text-2xl font-light text-white">Session Summary</h2>
                                                <p className="text-sm text-white/40 mt-1">Duration: 18 minutes • Dr. Sarah Smith</p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setShowSummary(false)} className="rounded-full hover:bg-white/10 text-white/60">
                                                <X className="h-6 w-6" />
                                            </Button>
                                        </div>
                                        <div className="p-8 space-y-6 relative z-10">
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm py-3 border-b border-white/5">
                                                    <span className="text-white/60">Consultation Fee</span>
                                                    <span className="text-white font-mono">$120.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm py-3 border-b border-white/5">
                                                    <span className="text-white/60">Insurance Coverage</span>
                                                    <span className="text-emerald-400 font-mono">-$90.00</span>
                                                </div>
                                                <div className="flex justify-between text-xl pt-2">
                                                    <span className="font-light text-white">Total</span>
                                                    <span className="text-cyan-400 font-bold">$30.00</span>
                                                </div>
                                            </div>

                                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5 flex items-center gap-4">
                                                <div className="h-12 w-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/60">
                                                    <CreditCard className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                                                    <p className="text-xs text-white/30">Ready for quick checkout</p>
                                                </div>
                                                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Primary</Badge>
                                            </div>

                                            <Button onClick={handlePayment} className="w-full h-16 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2">
                                                Pay $30.00 & Close Session
                                            </Button>

                                            <p className="text-[11px] text-center text-white/20">
                                                A summary of this appointment will be available in your Health Vault records.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
