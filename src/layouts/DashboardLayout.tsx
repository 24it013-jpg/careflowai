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
import { AIHealthChat } from "@/components/dashboard/hub/AIHealthChat";
import { KeyboardShortcutsPanel } from "@/components/dashboard/hub/KeyboardShortcuts";
import { PageTransition } from "@/components/ui/page-transition";
import { AnimatePresence } from "framer-motion";
import { BackToTop } from "@/components/ui/BackToTop";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
    useAIProctor();
    const [cmdOpen, setCmdOpen] = useState(false);

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

    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden font-sans text-white selection:bg-blue-500/30">
            {/* Warp Speed Background */}
            <WarpBackground />

            {/* Navigation */}
            <TopNav />
            <SideNav />

            {/* Omni-AI Health Companion */}
            <HealthCompanion />

            {/* SOS Overlay */}
            <EmergencyButton />
            <OfflineIndicator />
            <Toaster position="bottom-right" expand={false} richColors />
            <CommandCenter />

            {/* AI Health Chat Widget */}
            <AIHealthChat />

            {/* Keyboard Shortcuts */}
            <KeyboardShortcutsPanel />

            {/* Command Palette (Cmd+K) */}
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

            {/* Back to Top */}
            <BackToTop />

            <main className="relative pt-20 pb-0 px-0 max-w-[1800px] mx-auto h-screen overflow-y-auto flex flex-col scrollbar-premium">
                <AnimatePresence mode="wait">
                    <PageTransition>
                        {children || <Outlet />}
                    </PageTransition>
                </AnimatePresence>
            </main>
        </div>
    );
}
