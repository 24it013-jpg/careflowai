import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@/components/auth/mock-auth';

import { DashboardLoading } from '@/components/dashboard/loading-state';
import { ErrorBoundary } from '@/components/ui/error-boundary';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Lazy-loaded Layouts
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

// Lazy-loaded Features
const AIVisionDecoder = lazy(() => import('@/pages/features/ai-vision-decoder'));
const AIMedCheck = lazy(() => import('@/pages/features/ai-med-check'));
const AmbientScribe = lazy(() => import('@/pages/features/ambient-scribe'));
const SpecialistMatch = lazy(() => import('@/pages/features/specialist-match'));
const Telemedicine = lazy(() => import('@/pages/features/telemedicine'));
const NearbyCareLocator = lazy(() => import('@/pages/features/nearby-care'));
const RefillPredictor = lazy(() => import('@/pages/features/refill-predictor'));

const DietNutrition = lazy(() => import('@/pages/features/diet-nutrition'));
const IntegrationsPage = lazy(() => import('@/pages/settings/integrations'));
const SymptomChecker = lazy(() => import('@/pages/features/symptom-checker'));
const MedicationTracker = lazy(() => import('@/pages/features/medication-tracker'));
const Achievements = lazy(() => import('@/pages/features/achievements'));
const DailyQuests = lazy(() => import('@/pages/features/daily-quests'));
const SleepVisualizer = lazy(() => import('@/pages/features/sleep-visualizer'));
const MoodJournal = lazy(() => import('@/pages/features/mood-journal'));
const AnatomyAR = lazy(() => import('@/pages/features/anatomy-ar'));
const FitnessYogaCenter = lazy(() => import('@/pages/features/fitness-yoga-center'));
const VoiceAgent = lazy(() => import('@/pages/features/voice-agent'));
const MedicalExpenseCalculator = lazy(() => import('@/pages/features/medical-expense-calculator'));
const MentalHealthSanctuary = lazy(() => import('@/pages/features/mental-health-sanctuary'));
const NeuralHealthVault = lazy(() => import('@/pages/features/neural-health-vault'));
const LongevityDashboard = lazy(() => import('@/pages/features/longevity-dashboard'));
const ImmunoTracker = lazy(() => import('@/pages/features/immuno-tracker'));
const OpenHealthHub = lazy(() => import('@/pages/features/open-health-hub'));
const LabReportDecoder = lazy(() => import('@/pages/features/lab-report-decoder'));

// Simple Layout Wrapper
const Layout = () => <Outlet />;

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />

                    {/* Authenticated Dashboard Routes */}
                    <Route path="/dashboard" element={
                        <ErrorBoundary>
                            <Suspense fallback={<DashboardLoading />}>
                                <SignedIn>
                                    <DashboardLayout />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </Suspense>
                        </ErrorBoundary>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="vision" element={<AIVisionDecoder />} />
                        <Route path="lab-reports" element={<LabReportDecoder />} />
                        <Route path="med-check" element={<AIMedCheck />} />
                        <Route path="scribe" element={<AmbientScribe />} />
                        <Route path="specialist" element={<SpecialistMatch />} />
                        <Route path="telemedicine" element={<Telemedicine />} />
                        <Route path="nearby" element={<NearbyCareLocator />} />
                        <Route path="refills" element={<RefillPredictor />} />

                        <Route path="diet" element={<DietNutrition />} />

                        {/* Settings Routes */}
                        <Route path="settings/integrations" element={<IntegrationsPage />} />
                        <Route path="symptom-checker" element={<SymptomChecker />} />
                        <Route path="medications" element={<MedicationTracker />} />
                        <Route path="achievements" element={<Achievements />} />
                        <Route path="quests" element={<DailyQuests />} />
                        <Route path="sleep" element={<SleepVisualizer />} />
                        <Route path="mood" element={<MoodJournal />} />
                        <Route path="fitness-yoga" element={<FitnessYogaCenter />} />
                        <Route path="voice-agent" element={<VoiceAgent />} />
                        <Route path="expense-calculator" element={<MedicalExpenseCalculator />} />
                        <Route path="mental-health" element={<MentalHealthSanctuary />} />
                        <Route path="health-vault" element={<NeuralHealthVault />} />
                        <Route path="longevity" element={<LongevityDashboard />} />
                        <Route path="immuno-tracker" element={<ImmunoTracker />} />
                        <Route path="open-health" element={<OpenHealthHub />} />
                        <Route path="anatomy-ar" element={<AnatomyAR />} />
                    </Route>
                </Route>

                {/* 404 Route - Must be last */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    // MOCK AUTH ENABLED - No Key Check Needed

    return (
        <ClerkProvider>
            <BrowserRouter>
                <Suspense fallback={<DashboardLoading />}>
                    <AnimatedRoutes />
                </Suspense>
            </BrowserRouter>
        </ClerkProvider>
    );
}
