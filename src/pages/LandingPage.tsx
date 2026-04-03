import { WarpBackground } from "@/components/landing/WarpBackground";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { FloatingNav } from "@/components/landing/FloatingNav";
import { AnalogueHero } from "@/components/landing/AnalogueHero";
import { HeartPulseSection } from "@/components/landing/HeartPulseSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <FloatingNav />

            {/* Hero */}
            <div className="relative">
                <WarpBackground />
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    <ShaderAnimation />
                </div>
                <AnalogueHero />
            </div>

            {/* Stats / Social Proof */}
            <StatsSection />

            {/* Heart Pulse */}
            <HeartPulseSection />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Features */}
            <div id="features">
                <FeatureShowcase />
            </div>

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Pricing */}
            <PricingSection />

            {/* Footer */}
            <Footer />
        </main>
    );
}
