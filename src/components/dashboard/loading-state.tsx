import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLoading() {
    return (
        <div className="flex h-screen w-full bg-[#050510] overflow-hidden relative text-white">
            {/* Background elements to match the app */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Sidebar Skeleton */}
            <div className="hidden md:flex flex-col w-64 h-full border-r border-white/10 p-4 space-y-6 z-10 bg-black/20 backdrop-blur-sm">
                <Skeleton className="h-8 w-32 bg-white/10 rounded-lg mb-8" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-md bg-white/10" />
                        <Skeleton className="h-4 w-24 bg-white/5 rounded-md" />
                    </div>
                ))}
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                {/* Header Skeleton */}
                <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
                    <Skeleton className="h-8 w-64 bg-white/5 rounded-lg" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                        <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                        <Skeleton className="h-10 w-32 rounded-full bg-white/10" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Welcome Area */}
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-96 bg-white/10 rounded-lg" />
                        <Skeleton className="h-4 w-64 bg-white/5 rounded-md" />
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="premium-glass-panel h-36 rounded-3xl p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-4 w-24 bg-white/10 rounded-md" />
                                    <Skeleton className="h-10 w-10 rounded-2xl bg-white/10" />
                                </div>
                                <Skeleton className="h-8 w-32 bg-white/20 rounded-lg" />
                            </div>
                        ))}
                    </div>

                    {/* Main Chart Area */}
                    <div className="premium-glass-panel h-96 w-full rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-8">
                            <Skeleton className="h-6 w-48 bg-white/10 rounded-md" />
                            <Skeleton className="h-8 w-32 bg-white/10 rounded-full" />
                        </div>
                        <Skeleton className="h-64 w-full bg-white/5 rounded-2xl" />
                    </div>

                    {/* Recent Activity List */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48 bg-white/10 rounded-lg mb-4" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="premium-glass-panel flex items-center justify-between p-5 rounded-2xl mb-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-56 bg-white/10 rounded-md" />
                                        <Skeleton className="h-3 w-32 bg-white/5 rounded-md" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-24 bg-white/10 rounded-full" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
