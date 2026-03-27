import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FEATURES, AppFeature } from "@/components/dashboard/medical-magic/medical-apps-data";
import { LayoutDashboard, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SideNav() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile nav on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <>
            {/* Mobile Trigger */}
            <div className="fixed top-5 left-4 z-50 md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)} className="bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-sm">
                    {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isExpanded ? "18rem" : "5rem",
                    x: isMobileOpen ? 0 : 0 // Handle mobile visibility via class
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "fixed left-0 top-0 h-screen z-40 bg-black/20 backdrop-blur-xl border-r border-white/10 pt-24 pb-6 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out",
                    // Mobile: hidden by default, slide in when open
                    !isMobileOpen && "-translate-x-full md:translate-x-0"
                )}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-3 space-y-2">
                    {/* Dashboard Home */}
                    <NavItem
                        feature={{
                            id: "dashboard",
                            title: "Dashboard",
                            description: "Overview",
                            icon: LayoutDashboard,
                            color: "text-blue-400",
                            link: "/dashboard",
                        }}
                        isExpanded={isExpanded}
                        isActive={location.pathname === "/dashboard"}
                    />

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3 mx-2" />

                    {/* App Features */}
                    <div className="space-y-1.5">
                        <div className={cn("px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-300", isExpanded ? "opacity-100" : "opacity-0 hidden")}>
                            Apps
                        </div>
                        {FEATURES.map((feature) => (
                            <NavItem
                                key={feature.id}
                                feature={feature}
                                isExpanded={isExpanded}
                                isActive={location.pathname.startsWith(feature.link)}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer/Collapse Indicator */}
                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className={cn("flex items-center transition-all duration-300", isExpanded ? "justify-end" : "justify-center")}>
                        <div className="p-2 rounded-full bg-white/5 text-slate-400">
                            <ChevronRight className={cn("size-4 transition-transform duration-500", isExpanded ? "rotate-180" : "")} />
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

function NavItem({ feature, isExpanded, isActive }: { feature: Partial<AppFeature>, isExpanded: boolean, isActive: boolean }) {
    const Icon = feature.icon!;

    return (
        <Link
            to={feature.link!}
            className="block group"
        >
            <div className={cn(
                "relative flex items-center gap-4 transition-all duration-300 border border-transparent",
                isExpanded ? "p-3 rounded-2xl" : "p-2 rounded-xl justify-center",
                isActive
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/5"
            )}>
                {/* Active Indicator Dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeNavDot"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full hidden md:block"
                    />
                )}

                <span className={cn(
                    "flex items-center justify-center size-8 shrink-0 rounded-xl transition-all duration-300",
                    isActive ? "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30" : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-sm"
                )}>
                    <Icon className={cn("size-5", isActive ? feature.color : "text-slate-400 group-hover:text-white")} />
                </span>

                <div className="flex-1 overflow-hidden whitespace-nowrap">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            x: isExpanded ? 0 : -10
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col"
                    >
                        <span className="font-semibold text-sm leading-none mb-0.5">{feature.title}</span>
                        {/* Optional Description if needed, fits well with expanded view */}
                        {/* <span className="text-[10px] text-slate-400 font-normal">{feature.description}</span> */}
                    </motion.div>
                </div>

                {/* Chevron for expanded active state */}
                {isExpanded && isActive && (
                    <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-blue-400">
                        <ChevronRight className="size-3" />
                    </motion.div>
                )}
            </div>
        </Link>
    );
}
