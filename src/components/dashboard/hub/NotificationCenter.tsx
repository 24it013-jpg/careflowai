import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, Calendar, Users, Settings, X, CheckCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    category: "health" | "reminder" | "community" | "system";
    title: string;
    body: string;
    time: string;
    read: boolean;
    icon: any;
    color: string;
}

const NOTIFICATIONS: Notification[] = [
    { id: "n1", category: "health", title: "Heart Rate Spike Detected", body: "Your BPM reached 112 at 2:34 PM. Consider a short breathing exercise.", time: "5m ago", read: false, icon: Heart, color: "text-red-400" },
    { id: "n2", category: "reminder", title: "Medication Due", body: "Vitamin D3 (2000 IU) is scheduled for 1:00 PM.", time: "12m ago", read: false, icon: Calendar, color: "text-amber-400" },
    { id: "n3", category: "community", title: "Hive Challenge Update", body: "The 10k Step Exodus is 68% complete! 24,500 participants.", time: "1h ago", read: false, icon: Users, color: "text-emerald-400" },
    { id: "n4", category: "health", title: "Sleep Score Ready", body: "Last night: 82/100. Deep sleep improved by 14% vs. last week.", time: "8h ago", read: true, icon: Heart, color: "text-blue-400" },
    { id: "n5", category: "system", title: "Oracle Forecast Updated", body: "Your 7-day health forecast has been recalculated based on new data.", time: "1d ago", read: true, icon: Settings, color: "text-purple-400" },
];

const CATEGORY_LABELS: Record<string, string> = {
    health: "Health Alert",
    reminder: "Reminder",
    community: "Community",
    system: "System",
};

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState(NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-4 top-4 bottom-4 z-50 w-96 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Bell className="size-5 text-white" />
                                <h2 className="font-bold text-white">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="size-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                                    >
                                        <CheckCheck className="size-3" /> All Read
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
                                    <Bell className="size-10" />
                                    <p className="text-sm">All caught up!</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {notifications.map((notif) => (
                                        <motion.div
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 40, height: 0 }}
                                            className={cn(
                                                "p-4 rounded-2xl border relative group transition-all",
                                                notif.read
                                                    ? "bg-white/[0.02] border-white/5"
                                                    : "bg-white/[0.04] border-white/10"
                                            )}
                                        >
                                            {!notif.read && (
                                                <div className="absolute top-4 right-4 size-2 rounded-full bg-blue-400" />
                                            )}
                                            <div className="flex items-start gap-3">
                                                <div className={cn("size-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0", notif.color)}>
                                                    <notif.icon className="size-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                                                            {CATEGORY_LABELS[notif.category]}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-white leading-tight">{notif.title}</p>
                                                    <p className="text-xs text-white/40 mt-1 leading-relaxed">{notif.body}</p>
                                                    <p className="text-[10px] text-white/20 mt-2">{notif.time}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => dismiss(notif.id)}
                                                className="absolute top-3 right-3 size-5 rounded-lg bg-white/5 items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 flex"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Bell Icon with Badge (for use in header)
export function NotificationBell({ onClick, count }: { onClick: () => void; count: number }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
            <Bell className="size-4" />
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 size-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center"
                >
                    {count}
                </motion.span>
            )}
        </motion.button>
    );
}
