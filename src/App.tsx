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
const SmartReminders = lazy(() => import('@/pages/features/smart-reminders'));
const Telemedicine = lazy(() => import('@/pages/features/telemedicine'));
const UnifiedHealthVault = lazy(() => import('@/pages/features/unified-health-vault'));
const NearbyCareLocator = lazy(() => import('@/pages/features/nearby-care'));
const ExpenseLedger = lazy(() => import('@/pages/features/expense-ledger'));
const RefillPredictor = lazy(() => import('@/pages/features/refill-predictor'));

const FamilyHealthHub = lazy(() => import('@/pages/features/family-hub'));
const Booking = lazy(() => import('@/pages/features/booking'));
const DietNutrition = lazy(() => import('@/pages/features/diet-nutrition'));
const MentalHealth = lazy(() => import('@/pages/features/mental-health'));
const IntegrationsPage = lazy(() => import('@/pages/settings/integrations'));
const SymptomChecker = lazy(() => import('@/pages/features/symptom-checker'));
const MedicationTracker = lazy(() => import('@/pages/features/medication-tracker'));
const Achievements = lazy(() => import('@/pages/features/achievements'));
const Leaderboard = lazy(() => import('@/pages/features/leaderboard'));
const DailyQuests = lazy(() => import('@/pages/features/daily-quests'));
const HealthAvatar = lazy(() => import('@/pages/features/health-avatar'));
const WearableSimulator = lazy(() => import('@/pages/features/wearable-simulator'));
const SleepVisualizer = lazy(() => import('@/pages/features/sleep-visualizer'));
const MoodJournal = lazy(() => import('@/pages/features/mood-journal'));
const LabResults = lazy(() => import('@/pages/features/lab-results'));
const AnatomyAR = lazy(() => import('@/pages/features/anatomy-ar'));
const BMICalculator = lazy(() => import('@/pages/features/bmi-calculator'));
const VoiceAgent = lazy(() => import('@/pages/features/voice-agent'));

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
                        <Route path="med-check" element={<AIMedCheck />} />
                        <Route path="scribe" element={<AmbientScribe />} />
                        <Route path="specialist" element={<SpecialistMatch />} />
                        <Route path="reminders" element={<SmartReminders />} />
                        <Route path="telemedicine" element={<Telemedicine />} />
                        <Route path="vault" element={<UnifiedHealthVault />} />
                        <Route path="nearby" element={<NearbyCareLocator />} />
                        <Route path="ledger" element={<ExpenseLedger />} />
                        <Route path="refills" element={<RefillPredictor />} />

                        <Route path="family" element={<FamilyHealthHub />} />
                        <Route path="booking" element={<Booking />} />
                        <Route path="diet" element={<DietNutrition />} />
                        <Route path="mental-health" element={<MentalHealth />} />

                        {/* Settings Routes */}
                        <Route path="settings/integrations" element={<IntegrationsPage />} />
                        <Route path="symptom-checker" element={<SymptomChecker />} />
                        <Route path="medications" element={<MedicationTracker />} />
                        <Route path="achievements" element={<Achievements />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="quests" element={<DailyQuests />} />
                        <Route path="avatar" element={<HealthAvatar />} />
                        <Route path="wearable" element={<WearableSimulator />} />
                        <Route path="sleep" element={<SleepVisualizer />} />
                        <Route path="mood" element={<MoodJournal />} />
                        <Route path="labs" element={<LabResults />} />
                        <Route path="bmi" element={<BMICalculator />} />
                        <Route path="voice-agent" element={<VoiceAgent />} />
                    </Route>
                </Route>

                {/* Standalone Feature Routes (no dashboard layout) */}
                <Route path="/anatomy-ar" element={<AnatomyAR />} />

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
