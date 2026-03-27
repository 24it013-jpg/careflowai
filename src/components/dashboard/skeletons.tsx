import { cn } from "@/lib/utils"

export function ZoneSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 h-full w-full relative overflow-hidden shadow-sm", className)}>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="flex flex-col gap-4 h-full">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-white/10 rounded-md" />
                    <div className="h-5 w-5 bg-white/10 rounded-full" />
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 rounded-lg bg-white/5 w-full h-[200px]" />
            </div>
        </div>
    )
}
