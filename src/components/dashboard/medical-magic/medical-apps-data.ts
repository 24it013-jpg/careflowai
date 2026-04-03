import {
    ScanEye,
    Stethoscope,
    Pill,
    HeartPulse,
    ShieldAlert,
    Database,
    MapPin,
    Wallet,
    RefreshCcw,
    Video,
    ClipboardCheck,
    Dumbbell,
    Brain,
    Shield,
    Zap,
    ShieldCheck,
    Mic,
    Users,
    CalendarCheck,
    Utensils,
    Scan,
} from "lucide-react";

export interface AppFeature {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    link: string;
    colSpan?: string; // Class for grid column span
}

// The 15 Features as defined by the user
export const FEATURES: AppFeature[] = [
    {
        id: "vision-decoder",
        title: "AI Vision Decoder",
        description: "Analyze X-rays & MRIs instantly.",
        icon: ScanEye,
        color: "text-purple-400",
        link: "/dashboard/vision",
        colSpan: "col-span-12 md:col-span-8 lg:col-span-6"
    },
    {
        id: "lab-decoder",
        title: "Lab Report Decoder",
        description: "Decode blood & urine tests.",
        icon: ClipboardCheck,
        color: "text-emerald-400",
        link: "/dashboard/lab-reports",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "med-check",
        title: "AI Med-Check",
        description: "Photo medicine & label recognition.",
        icon: ShieldAlert,
        color: "text-emerald-400",
        link: "/dashboard/med-check",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "open-health",
        title: "Open Health Hub",
        description: "Condition guides, diet focus & check-ins.",
        icon: HeartPulse,
        color: "text-sky-400",
        link: "/dashboard/open-health",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "specialist",
        title: "Specialist Match",
        description: "Find the perfect doctor.",
        icon: Stethoscope,
        color: "text-blue-400",
        link: "/dashboard/specialist",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "care-locator",
        title: "Care Locator",
        description: "Find help nearby.",
        icon: MapPin,
        color: "text-red-400",
        link: "/dashboard/nearby",
        colSpan: "col-span-6 md:col-span-4 lg:col-span-3"
    },
    {
        id: "ambient-scribe",
        title: "Ambient Scribe",
        description: "Voice-to-notes.",
        icon: Mic,
        color: "text-fuchsia-400",
        link: "/dashboard/scribe",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
    {
        id: "diet-nutrition",
        title: "Diet AI",
        description: "Meal plans & analysis.",
        icon: Utensils,
        color: "text-orange-400",
        link: "/dashboard/diet",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
    {
        id: "anatomy-ar",
        title: "AR Anatomy",
        description: "Real-time hand anatomy AR.",
        icon: Scan,
        color: "text-cyan-400",
        link: "/dashboard/anatomy-ar",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },
    {
        id: "fitness-yoga",
        title: "Fitness & Yoga",
        description: "AI Workouts & Breathing.",
        icon: Dumbbell,
        color: "text-blue-400",
        link: "/dashboard/fitness-yoga",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },
    {
        id: "voice-agent",
        title: "AI Voice Nurse",
        description: "ElevenLabs Voice Agent.",
        icon: Mic,
        color: "text-blue-400",
        link: "/dashboard/voice-agent",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },
    {
        id: "expense-calculator",
        title: "Medical Expense Hub",
        description: "Bill analysis & cost calculator.",
        icon: Wallet,
        color: "text-indigo-400",
        link: "/dashboard/expense-calculator",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },
    {
        id: "mental-health",
        title: "Neural Sanctuary",
        description: "AI Therapy & Meditation.",
        icon: Brain,
        color: "text-purple-400",
        link: "/dashboard/mental-health",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },
    {
        id: "health-vault",
        title: "Neural Health Vault",
        description: "AI-indexed medical records.",
        icon: Shield,
        color: "text-blue-400",
        link: "/dashboard/health-vault",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "longevity",
        title: "Longevity Hub",
        description: "Biohacking & Performance.",
        icon: Zap,
        color: "text-amber-400",
        link: "/dashboard/longevity",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "immuno-tracker",
        title: "Immuno-Tracker",
        description: "AI Vaccination Management.",
        icon: ShieldCheck,
        color: "text-emerald-400",
        link: "/dashboard/immuno-tracker",
        colSpan: "col-span-12 md:col-span-4 lg:col-span-3"
    },
    {
        id: "telemedicine",
        title: "Telemedicine",
        description: "Virtual consults.",
        icon: Video,
        color: "text-indigo-400",
        link: "/dashboard/telemedicine",
        colSpan: "col-span-6 md:col-span-4 lg:col-span-3"
    },
    {
        id: "refill-predictor",
        title: "Refill Predictor",
        description: "AI Stock tracking.",
        icon: RefreshCcw,
        color: "text-orange-400",
        link: "/dashboard/refills",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
];
