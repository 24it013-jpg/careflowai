
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
            <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-32 px-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-600 rounded-2xl">
                        <Activity className="size-8 text-white" />
                    </div>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col items-center gap-6 text-center">
                    <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900">
                        CAREflow AI
                    </h1>
                    <p className="max-w-xl text-xl leading-relaxed text-slate-600">
                        Your Professional Health Management Platform
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Link
                            to="/dashboard"
                            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-white font-medium transition-all hover:bg-blue-700 hover:shadow-lg shadow-blue-600/20"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-wrap gap-8 justify-center text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-emerald-500 rounded-full" />
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-blue-500 rounded-full" />
                        <span>Medical Grade</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-teal-500 rounded-full" />
                        <span>Trusted by Healthcare Professionals</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
