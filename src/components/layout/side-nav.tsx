import { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FEATURES, AppFeature } from "@/components/dashboard/medical-magic/medical-apps-data";
import { LayoutDashboard, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/hooks/use-sidebar-store";

// Optimization: Use professional cubic-bezier for liquid motion signature
const LIQUID_EASE = [0.23, 1, 0.32, 1];

export function SideNav() {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { isOpen: isDesktopOpen, setIsOpen: setIsDesktopOpen } = useSidebarStore();
    const location = useLocation();

    // Close mobile nav on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Sidebar is fully expanded only when hovered
    const isExpanded = isHovered;

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
                    width: isMobileOpen || isHovered ? "18rem" : (isDesktopOpen ? "5.5rem" : "0rem"),
                    x: isMobileOpen || isDesktopOpen || isHovered ? 0 : -100,
                    opacity: isDesktopOpen || isHovered || isMobileOpen ? 1 : 0
                }}
                transition={{ 
                    duration: 0.5, 
                    ease: LIQUID_EASE
                }}
                className={cn(
                    "fixed left-0 top-0 h-screen z-40 bg-black/30 backdrop-blur-2xl border-r border-white/5 pt-24 pb-6 flex flex-col shadow-[20px_0_50px_-15px_rgba(0,0,0,0.5)] md:shadow-none group/sidebar will-change-[width,transform,opacity]",
                    !isMobileOpen && !isDesktopOpen && !isHovered && "pointer-events-none"
                )}
                onMouseEnter={() => (isDesktopOpen || isMobileOpen) && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Ambient Background Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-1/4 -left-1/2 w-full h-1/2 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 -left-1/2 w-full h-1/2 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-premium px-3 space-y-4 relative z-10">
                    {/* Dashboard Home */}
                    <div className="px-1">
                        <MemoizedNavItem
                            feature={{
                                id: "dashboard",
                                title: "Dashboard",
                                description: "Main Hub",
                                icon: LayoutDashboard,
                                color: "text-blue-400",
                                link: "/dashboard",
                            }}
                            isExpanded={isExpanded}
                            isActive={location.pathname === "/dashboard"}
                        />
                    </div>

                    <div className="px-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* App Features */}
                    <div className="space-y-1">
                        <motion.div 
                            animate={{ 
                                opacity: isExpanded ? 1 : 0,
                                x: isExpanded ? 0 : -10
                            }}
                            transition={{ duration: 0.3, ease: LIQUID_EASE }}
                            className={cn(
                                "px-5 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]",
                                !isExpanded && "pointer-events-none h-0 py-0 overflow-hidden"
                            )}
                        >
                            Health Applications
                        </motion.div>
                        <div className="px-1 space-y-1">
                            {FEATURES.map((feature) => (
                                <MemoizedNavItem
                                    key={feature.id}
                                    feature={feature}
                                    isExpanded={isExpanded}
                                    isActive={location.pathname.startsWith(feature.link)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer/Collapse Indicator */}
                <div className="px-4 py-6 border-t border-white/5 mt-auto bg-black/20 backdrop-blur-md relative z-10">
                    <div className={cn("flex items-center transition-all duration-300", isExpanded ? "justify-between" : "justify-center")}>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="size-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                        <Menu className="size-4 text-white/70" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div 
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="p-2 rounded-xl bg-white/5 text-slate-400 cursor-pointer border border-white/5 transition-colors"
                        >
                            <ChevronRight className={cn("size-4 transition-transform duration-500", isExpanded ? "rotate-180" : "")} />
                        </motion.div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

const NavItem = ({ feature, isExpanded, isActive }: { feature: Partial<AppFeature>, isExpanded: boolean, isActive: boolean }) => {
    const Icon = feature.icon!;

    return (
        <Link
            to={feature.link!}
            className="block group/item relative"
        >
            <div className={cn(
                "relative flex items-center gap-4 transition-all duration-500 border will-change-[padding,margin,background-color]",
                isExpanded ? "p-3 rounded-2xl mx-2" : "p-2 rounded-xl justify-center mx-2",
                isActive
                    ? "bg-white/[0.03] text-white border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10 border-transparent"
            )}>
                {/* Active Liquid Indicator */}
                {isActive && (
                    <motion.div
                        layoutId="activeBar"
                        className="absolute -left-1 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-full z-20 shadow-[0_0_15px_rgba(59,130,246,1)] will-change-transform"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                )}

                {/* Glow Background for Active Item */}
                {isActive && (
                    <motion.div
                        layoutId="activeHighlight"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/5 rounded-[inherit] z-0"
                    />
                )}

                <span className={cn(
                    "flex items-center justify-center size-9 shrink-0 rounded-xl transition-all duration-500 relative z-10 will-change-transform",
                    isActive 
                        ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-1 ring-white/20" 
                        : "bg-white/5 group-hover/item:bg-white/10 group-hover/item:shadow-lg group-hover/item:ring-1 group-hover/item:ring-white/10"
                )}>
                    <Icon className={cn("size-5 transition-transform duration-500 group-hover/item:scale-110", isActive ? "text-white" : "text-slate-400 group-hover/item:text-white")} />
                </span>

                <div className="flex-1 overflow-hidden whitespace-nowrap relative z-10">
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            x: isExpanded ? 0 : -20
                        }}
                        transition={{ duration: 0.4, ease: LIQUID_EASE }}
                        className="flex flex-col will-change-[opacity,transform]"
                    >
                        <span className={cn(
                            "font-bold text-sm leading-none mb-1 transition-colors",
                            isActive ? "text-white" : "text-slate-300 group-hover/item:text-white"
                        )}>
                            {feature.title}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">
                            {feature.description || 'Module'}
                        </span>
                    </motion.div>
                </div>

                {/* Right Arrow for expanded state */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.3, ease: LIQUID_EASE }}
                            className={cn(
                                "transition-all duration-500 relative z-10",
                                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/item:opacity-50 group-hover/item:translate-x-0"
                            )}
                        >
                            <ChevronRight className={cn("size-3", isActive ? "text-blue-400" : "text-slate-600")} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hover Tooltip for collapsed state */}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap shadow-2xl">
                    <p className="text-xs font-bold text-white">{feature.title}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mt-0.5">{feature.description}</p>
                </div>
            )}
        </Link>
    );
};

const MemoizedNavItem = memo(NavItem);
