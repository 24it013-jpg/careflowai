import { TopNav } from "@/components/layout/top-nav";
import { EmergencyButton } from "@/components/dashboard/medical-magic/emergency-button";
import { Outlet } from "react-router-dom";

import { SideNav } from "@/components/layout/side-nav";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { HealthCompanion } from "@/components/dashboard/ai/HealthCompanion";
import { Toaster } from "@/components/ui/sonner";
import { useAIProctor } from "@/hooks/use-ai-proctor";
import { CommandCenter } from "@/components/dashboard/command/command-center";

import { WarpBackground } from "@/components/landing/WarpBackground";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { KeyboardShortcutsPanel } from "@/components/dashboard/hub/KeyboardShortcuts";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatePresence, motion } from "framer-motion";
import { BackToTop } from "@/components/ui/BackToTop";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NeuralLoadingScreen } from "@/components/ui/NeuralLoadingScreen";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
    useAIProctor();
    const [cmdOpen, setCmdOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const location = useLocation();
    const { isOpen: isSidebarOpen } = useSidebarStore();

    // Global Cmd+K / Ctrl+K shortcut to open command palette
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCmdOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Handle page loading state on route change
    useEffect(() => {
        setIsPageLoading(true);
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 800); // Artificial delay for smooth transition

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden font-sans text-white selection:bg-blue-500/30">
            {/* Page Loading Overlay */}
            <AnimatePresence>
                {isPageLoading && <NeuralLoadingScreen />}
            </AnimatePresence>

            {/* Global Shader Background Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <ShaderAnimation />
            </div>

            {/* Navigation */}
            <TopNav />
            <SideNav />

            {/* Omni-AI Health Companion */}
            <HealthCompanion />

            {/* SOS Overlay */}
            <EmergencyButton />
            <OfflineIndicator />
            <Toaster position="top-right" expand={false} richColors />
            <CommandCenter />

            {/* Keyboard Shortcuts */}
            <KeyboardShortcutsPanel />

            {/* Command Palette (Cmd+K) */}
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

            {/* Back to Top */}
            <BackToTop />

            <motion.main 
                animate={{ 
                    paddingLeft: isSidebarOpen ? "5.5rem" : "0rem"
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                    "relative pt-20 pb-0 px-0 max-w-[1800px] mx-auto h-screen overflow-y-auto flex flex-col scrollbar-premium",
                )}
            >
                <AnimatePresence mode="wait">
                    <PageTransition>
                        {children || <Outlet />}
                    </PageTransition>
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
