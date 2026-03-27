import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                    <div className="premium-glass-panel max-w-lg w-full flex flex-col items-center p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] pointer-events-none" />
                        
                        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl mb-6 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-light tracking-tight text-white mb-3 relative z-10">System Anomalies Detected</h2>
                        <p className="text-white/50 mb-8 relative z-10 text-sm">
                            The CAREflow neural engine encountered an unexpected interruption. Please re-initialize the interface.
                        </p>
                        
                        {this.state.error && (
                            <div className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl mb-8 overflow-auto text-left text-xs font-mono text-red-400/80 relative z-10">
                                {this.state.error.toString()}
                            </div>
                        )}
                        
                        <Button
                            onClick={() => window.location.reload()}
                            className="premium-button w-full h-14 bg-red-600 hover:bg-red-500 text-white rounded-2xl gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] relative z-10 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg font-medium"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Re-initialize System
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
