import { useState, useEffect } from "react";

import { healthDataService } from "@/lib/integrations/health-data";
import { nutritionDataService } from "@/lib/integrations/nutrition-data";
import { ConnectedProvider, HealthProvider } from "@/lib/integrations/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";
import { Activity, RefreshCw, CheckCircle2 } from "lucide-react";

export default function IntegrationsPage() {
    const [healthProviders, setHealthProviders] = useState<ConnectedProvider[]>([]);
    const [nutritionProviders, setNutritionProviders] = useState<ConnectedProvider[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [syncing, setSyncing] = useState<string | null>(null);

    useEffect(() => {
        setHealthProviders(healthDataService.getProviders());
        setNutritionProviders(nutritionDataService.getProviders());
    }, []);

    const handleToggleHealth = async (provider: ConnectedProvider) => {
        setLoading(provider.id);
        try {
            if (provider.isConnected) {
                await healthDataService.disconnectProvider(provider.id as HealthProvider);
                toast.success(`Disconnected from ${provider.name}`);
            } else {
                await healthDataService.connectProvider(provider.id as HealthProvider);
                toast.success(`Connected to ${provider.name}`);
            }
            setHealthProviders(healthDataService.getProviders());
        } catch (error) {
            toast.error("Failed to update connection");
        } finally {
            setLoading(null);
        }
    };

    const handleToggleNutrition = async (provider: ConnectedProvider) => {
        setLoading(provider.id);
        try {
            if (provider.isConnected) {
                await nutritionDataService.disconnectProvider(provider.id);
                toast.success(`Disconnected from ${provider.name}`);
            } else {
                await nutritionDataService.connectProvider(provider.id);
                toast.success(`Connected to ${provider.name}`);
            }
            setNutritionProviders(nutritionDataService.getProviders());
        } catch (error) {
            toast.error("Failed to update connection");
        } finally {
            setLoading(null);
        }
    };

    const handleSync = async (provider: ConnectedProvider, type: 'health' | 'nutrition') => {
        setSyncing(provider.id);
        try {
            if (type === 'health') {
                await healthDataService.syncData(provider.id as HealthProvider);
                setHealthProviders(healthDataService.getProviders());
            } else {
                await nutritionDataService.syncData(provider.id);
                setNutritionProviders(nutritionDataService.getProviders());
            }
            toast.success(`Synced data from ${provider.name}`);
        } catch (error) {
            toast.error("Sync failed");
        } finally {
            setSyncing(null);
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Connected Apps & Devices
                </h1>
                <p className="text-muted-foreground">
                    Manage your health data sources and connected applications.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            Health & Fitness
                        </CardTitle>
                        <CardDescription>
                            Sync activity, vitals, and sleep data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {healthProviders.map((provider) => (
                            <ProviderRow
                                key={provider.id}
                                provider={provider}
                                loading={loading === provider.id}
                                syncing={syncing === provider.id}
                                onToggle={() => handleToggleHealth(provider)}
                                onSync={() => handleSync(provider, 'health')}
                            />
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-xl">🥗</span>
                            Nutrition & Diet
                        </CardTitle>
                        <CardDescription>
                            Sync calories and macronutrients
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {nutritionProviders.map((provider) => (
                            <ProviderRow
                                key={provider.id}
                                provider={provider}
                                loading={loading === provider.id}
                                syncing={syncing === provider.id}
                                onToggle={() => handleToggleNutrition(provider)}
                                onSync={() => handleSync(provider, 'nutrition')}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProviderRow({
    provider,
    loading,
    syncing,
    onToggle,
    onSync
}: {
    provider: ConnectedProvider;
    loading: boolean;
    syncing: boolean;
    onToggle: () => void;
    onSync: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-2xl">{provider.icon}</div>
                <div>
                    <div className="font-medium flex items-center gap-2">
                        {provider.name}
                        {provider.isConnected && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Connected
                            </span>
                        )}
                    </div>
                    {provider.lastSync && (
                        <div className="text-xs text-muted-foreground mt-1">
                            Last synced: {new Date(provider.lastSync).toLocaleTimeString()}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {provider.isConnected && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSync}
                        disabled={syncing || loading}
                        className={syncing ? "animate-spin text-blue-600" : "text-muted-foreground hover:text-blue-600"}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                )}
                <Switch
                    checked={provider.isConnected}
                    onCheckedChange={onToggle}
                    disabled={loading}
                />
            </div>
        </div>
    );
}
