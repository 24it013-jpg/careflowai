import { motion } from "framer-motion";
import { Home, Activity, Clock, Grid3x3, BarChart3, Sparkles } from "lucide-react";
import { NeuralStream } from "./NeuralStream";
import { NotificationBell } from "./NotificationCenter";
import { useHealthForecaster } from "@/hooks/use-health-forecaster";
import { useHealthData } from "@/hooks/use-health-data";

interface DashboardHeaderProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    onNotifClick?: () => void;
    unreadCount?: number;
}

const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "vitals", label: "Vitals", icon: Activity },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "features", label: "Features", icon: Grid3x3 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function DashboardHeader({ activeSection, onSectionChange, onNotifClick, unreadCount = 0 }: DashboardHeaderProps) {
    const { riskLevel } = useHealthForecaster();
    const { vitals } = useHealthData();

    const scrollToSection = (id: string) => {
        onSectionChange(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Calculate dynamic greeting context
    const getGreetingContext = () => {
        if (riskLevel === 'high') return "Alert: System Stress Detected";
        if (vitals.heartRate < 65) return "Deep Focus Mode Possible";
        return "Peak Neural Synchronization";
    };

    return (
        <motion.header
            className="relative z-40 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="px-6 py-3">
                <div className="flex items-center justify-between max-w-[1700px] mx-auto gap-8">
                    {/* Greeting Section */}
                    <div className="hidden lg:block animate-in fade-in slide-in-from-left-4 duration-500 min-w-[240px]">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, Alex</h1>
                            <div className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                <Sparkles className="size-3 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-xs text-blue-400/80 font-bold uppercase tracking-widest flex items-center gap-2">
                            {getGreetingContext()}
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center gap-1 bg-white/[0.03] backdrop-blur-md p-1 rounded-full border border-white/10 shadow-inner">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`relative px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 group ${isActive
                                        ? "text-blue-400 bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/40"
                                        : "text-slate-500 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className={`size-3.5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right Side: Neural Stream + Notification Bell */}
                    <div className="flex items-center gap-4">
                        {/* Neural Stream Ticker */}
                        <div className="hidden xl:block flex-1 max-w-md border-l border-white/10 pl-8 h-[70px]">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />
                                Neural Intelligence Stream
                            </div>
                            <NeuralStream />
                        </div>

                        {/* Notification Bell */}
                        <NotificationBell onClick={onNotifClick ?? (() => { })} count={unreadCount} />
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
