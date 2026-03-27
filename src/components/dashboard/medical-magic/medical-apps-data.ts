import {
    ScanEye,
    Stethoscope,
    Pill,
    ShieldAlert,
    Database,
    MapPin,
    Wallet,
    RefreshCcw,
    Video,

    Mic,
    Users,
    CalendarCheck,
    Utensils,
    Brain,
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
        id: "med-check",
        title: "AI Med-Check",
        description: "Prevent drug interactions.",
        icon: ShieldAlert,
        color: "text-emerald-400",
        link: "/dashboard/med-check",
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
        id: "med-reminders",
        title: "Smart Reminders",
        description: "Never miss a dose.",
        icon: Pill,
        color: "text-pink-400",
        link: "/dashboard/reminders",
        colSpan: "col-span-6 md:col-span-4 lg:col-span-3"
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
        id: "health-vault",
        title: "Unified Vault",
        description: "Secure records.",
        icon: Database,
        color: "text-amber-400",
        link: "/dashboard/vault",
        colSpan: "col-span-6 md:col-span-4 lg:col-span-3"
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
        id: "expense-ledger",
        title: "Expense Ledger",
        description: "Track medical costs.",
        icon: Wallet,
        color: "text-green-400",
        link: "/dashboard/ledger",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
    {
        id: "refill-predictor",
        title: "Refill Predictor",
        description: "AI Stock tracking.",
        icon: RefreshCcw,
        color: "text-cyan-400",
        link: "/dashboard/refills",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
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
        id: "family-hub",
        title: "Family Hub",
        description: "Manage profiles.",
        icon: Users,
        color: "text-orange-400",
        link: "/dashboard/family",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
    {
        id: "booking",
        title: "One-Tap Booking",
        description: "Instant access.",
        icon: CalendarCheck,
        color: "text-lime-400",
        link: "/dashboard/booking",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
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
        id: "mental-health",
        title: "Mind Monitor",
        description: "Mood & wellness tracker.",
        icon: Brain,
        color: "text-violet-400",
        link: "/dashboard/mental-health",
        colSpan: "col-span-6 md:col-span-3 lg:col-span-2"
    },
    {
        id: "anatomy-ar",
        title: "AR Anatomy",
        description: "Real-time hand anatomy AR.",
        icon: Scan,
        color: "text-cyan-400",
        link: "/anatomy-ar",
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4"
    },

];
