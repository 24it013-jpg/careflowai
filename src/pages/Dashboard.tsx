import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/hub/DashboardHeader";
import { ScrollContainer } from "@/components/dashboard/hub/ScrollContainer";
import { QuickActionsHub } from "@/components/dashboard/hub/QuickActionsHub";
import { OptimizedVitalsMonitor } from "@/components/dashboard/hub/OptimizedVitalsMonitor";
import { TimelineScroller } from "@/components/dashboard/hub/TimelineScroller";
import { FeatureGrid } from "@/components/dashboard/hub/FeatureGrid";
import { HealthAnalytics } from "@/components/dashboard/hub/HealthAnalytics";
import { OnboardingFlow } from "@/components/dashboard/hub/OnboardingFlow";
import { NotificationCenter } from "@/components/dashboard/hub/NotificationCenter";
import { AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [unreadCount] = useState(3);

    useEffect(() => {
        const seen = localStorage.getItem("careflow_onboarding_complete");
        if (!seen) setShowOnboarding(true);
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem("careflow_onboarding_complete", "true");
        setShowOnboarding(false);
    };

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Onboarding Overlay */}
            <AnimatePresence>
                {showOnboarding && <OnboardingFlow onComplete={completeOnboarding} />}
            </AnimatePresence>

            {/* Notification Center */}
            <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

            {/* Fixed Header */}
            <DashboardHeader
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onNotifClick={() => setNotifOpen(true)}
                unreadCount={unreadCount}
            />

            {/* Scrollable Content */}
            <ScrollContainer className="flex-1 relative">
                <div className="px-4 md:px-8 pl-4 md:pl-28 py-8 space-y-8 max-w-[1800px] mx-auto">

                    {/* Quick Actions Hub - Top spacing added since Welcome is gone */}
                    <section id="quick-actions" className="scroll-mt-32 pt-4">
                        <QuickActionsHub />
                    </section>

                    {/* Live Vitals */}
                    <section id="vitals" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-4">
                        <OptimizedVitalsMonitor />

                        {/* Health Summary Card */}
                        <div className="premium-glass-panel !rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">Health Status</h3>
                                    <p className="text-xs text-slate-400">Overall wellness summary</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-sm font-medium text-slate-300">Cardiovascular</span>
                                    <span className="text-sm font-bold text-emerald-400">Excellent</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-sm font-medium text-slate-300">Respiratory</span>
                                    <span className="text-sm font-bold text-emerald-400">Good</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-sm font-medium text-slate-300">Metabolic</span>
                                    <span className="text-sm font-bold text-blue-400">Normal</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section id="timeline" className="scroll-mt-4">
                        <TimelineScroller />
                    </section>

                    {/* Feature Grid */}
                    <section id="features" className="scroll-mt-4">
                        <FeatureGrid />
                    </section>

                    {/* Real-Time Health Analytics */}
                    <section id="analytics" className="scroll-mt-4">
                        <HealthAnalytics />
                    </section>

                    {/* Bottom Spacing */}
                    <div className="h-12" />
                </div>
            </ScrollContainer>
        </div>
    );
}
