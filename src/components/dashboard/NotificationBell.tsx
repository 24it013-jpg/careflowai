import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, AlertTriangle, Info, Heart, Activity } from "lucide-react";
import { useState } from "react";

interface Notification {
    id: string;
    type: "alert" | "info" | "success" | "vitals";
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "alert",
        title: "Critical Alert",
        message: "Patient #4821 — Heart rate elevated to 142 BPM. Immediate attention required.",
        time: "2m ago",
        read: false,
    },
    {
        id: "2",
        type: "vitals",
        title: "Vitals Update",
        message: "Wearable sync complete. All 12 monitored patients within normal ranges.",
        time: "8m ago",
        read: false,
    },
    {
        id: "3",
        type: "success",
        title: "Lab Results Ready",
        message: "Blood panel for Sarah Johnson (ID: 3892) is now available in the vault.",
        time: "15m ago",
        read: false,
    },
    {
        id: "4",
        type: "info",
        title: "Appointment Reminder",
        message: "Telemedicine session with Dr. Chen starts in 30 minutes.",
        time: "25m ago",
        read: true,
    },
    {
        id: "5",
        type: "success",
        title: "Prescription Sent",
        message: "Refill for Metformin 500mg dispatched to City Pharmacy.",
        time: "1h ago",
        read: true,
    },
];

const typeConfig = {
    alert: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    vitals: { icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
};

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const dismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
                <Bell className="w-5 h-5 text-white/70" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-12 w-96 z-50 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-white/60" />
                                    <span className="text-white font-semibold text-sm">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-white/20">
                                        <Heart className="w-8 h-8 mb-3" />
                                        <p className="text-sm">All caught up!</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => {
                                        const config = typeConfig[notif.type];
                                        return (
                                            <motion.div
                                                key={notif.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className={`relative flex gap-3 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${!notif.read ? "bg-white/[0.02]" : ""}`}
                                            >
                                                {/* Unread dot */}
                                                {!notif.read && (
                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                )}

                                                {/* Icon */}
                                                <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center mt-0.5`}>
                                                    <config.icon className={`w-4 h-4 ${config.color}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs font-semibold mb-0.5">{notif.title}</p>
                                                    <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{notif.message}</p>
                                                    <p className="text-white/20 text-[10px] mt-1.5">{notif.time}</p>
                                                </div>

                                                {/* Dismiss */}
                                                <button
                                                    onClick={() => dismiss(notif.id)}
                                                    className="shrink-0 text-white/20 hover:text-white/50 transition-colors mt-0.5"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-white/5">
                                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    View all notifications →
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
