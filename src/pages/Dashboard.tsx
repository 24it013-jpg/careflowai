import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/hub/DashboardHeader";
import { OnboardingFlow } from "@/components/dashboard/hub/OnboardingFlow";
import { AnimatePresence } from "framer-motion";

// Cockpit Components
import { DashboardContainer, BentoGrid } from "@/components/dashboard/cockpit/DashboardContainer";
import { ClinicalIntelligenceModule } from "@/components/dashboard/cockpit/ClinicalIntelligenceModule";
import { VitalsTrendsModule } from "@/components/dashboard/cockpit/VitalsTrendsModule";
import { UpcomingCareModule } from "@/components/dashboard/cockpit/UpcomingCareModule";
import { AICommandModule } from "@/components/dashboard/cockpit/AICommandModule";
import { QuickScanModule } from "@/components/dashboard/cockpit/QuickScanModule";
import { TimelineModule } from "@/components/dashboard/cockpit/TimelineModule";
import { HealthScoreWidget } from "@/components/dashboard/gamification/health-score-widget";
import { FeatureGrid } from "@/components/dashboard/hub/FeatureGrid";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for HealthScoreWidget
const MOCK_METRICS = {
    vitals: {
        heartRate: 72,
        bloodPressure: { systolic: 118, diastolic: 76 },
        oxygenLevel: 98,
        temperature: 98.6,
    },
    medication: {
        adherenceRate: 95,
        missedDoses: 0,
    },
    activity: {
        steps: 8432,
        exerciseMinutes: 45,
        sleepHours: 7.5,
    },
    nutrition: {
        waterIntake: 1800,
        mealsLogged: 3,
    },
    mental: {
        moodScore: 8,
        stressLevel: 3,
    },
};

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const [showOnboarding, setShowOnboarding] = useState(false);

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

            {/* Fixed Header */}
            <DashboardHeader
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            {/* Dashboard Content */}
            <DashboardContainer>
                <div id="overview" className="scroll-mt-32" />
                <BentoGrid className="mb-8">
                    {/* Primary Row: Vitals Trends & Score */}
                    <VitalsTrendsModule />
                    <div className="col-span-1 md:col-span-2 lg:col-span-6 row-span-2">
                        <HealthScoreWidget metrics={MOCK_METRICS} previousScore={82} />
                    </div>

                    {/* Intelligence & Actions */}
                    <ClinicalIntelligenceModule />
                    <AICommandModule />
                    <UpcomingCareModule />

                    {/* Quick Access & Timeline */}
                    <QuickScanModule />
                    <TimelineModule />
                </BentoGrid>

                {/* Features Section */}
                <section id="features" className="scroll-mt-32 pt-8 border-t border-white/5">
                    <FeatureGrid />
                </section>

                {/* Fitness Section */}
                <section id="fitness" className="scroll-mt-32 pt-16 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-8 px-4">
                        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                            <Dumbbell className="size-6" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Fitness & Yoga Sanctuary</h2>
                    </div>
                    <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">
                        {/* We use the component logic here or a simplified preview */}
                        <div className="p-12 text-center">
                            <p className="text-slate-400 mb-6">Access your AI-prescribed fitness and yoga routines directly.</p>
                            <Button 
                                onClick={() => window.location.href = '/dashboard/fitness-yoga'}
                                className="premium-button bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-12"
                            >
                                Open Full Sanctuary
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Bottom Spacing */}
                <div className="h-12" />
            </DashboardContainer>
        </div>
    );
}
