import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineIndicator() {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <WifiOff className="h-4 w-4" />
            <span>You are offline</span>
        </div>
    );
}
