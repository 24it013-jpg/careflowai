import { useState, useEffect } from "react";
import { useHealthData } from "./use-health-data";

export interface ForecastPoint {
    time: string;
    bpm: number;
    spo2: number;
}

export function useHealthForecaster() {
    const { vitals } = useHealthData();
    const [prediction, setPrediction] = useState<ForecastPoint[]>([]);
    const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
    const [insight, setInsight] = useState("");

    useEffect(() => {
        // Mocking the forecasting engine
        // In a real app, this would use a time-series model or an AI endpoint
        const generateForecast = () => {
            const now = new Date();
            const forecast: ForecastPoint[] = [];

            // Assume 4 hour projection with 1-hour intervals
            for (let i = 1; i <= 4; i++) {
                const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000);
                const timeStr = `${futureTime.getHours().toString().padStart(2, '0')}:00`;

                // Add some realistic variance based on current vitals
                // We'll simulate a slight trend (e.g., if temp is rising, HR might slightly increase)
                const hrVariance = (Math.random() - 0.5) * 4;
                const spo2Variance = (Math.random() - 0.5) * 1;

                forecast.push({
                    time: timeStr,
                    bpm: Math.round(vitals.heartRate + hrVariance),
                    spo2: Math.min(100, Math.max(90, vitals.spo2 + spo2Variance))
                });
            }
            setPrediction(forecast);

            // Calculate Risk Assessment
            if (vitals.heartRate > 100 || vitals.temperature > 100.5 || vitals.spo2 < 95) {
                setRiskLevel("high");
                setInsight("Critical trend detected. Immediate rest and hydration advised.");
            } else if (vitals.heartRate > 90 || vitals.temperature > 99.5) {
                setRiskLevel("medium");
                setInsight("Rising metabolic activity detected. Monitor rest levels.");
            } else {
                setRiskLevel("low");
                setInsight("Stable neural trajectory. Your systems are performing optimally.");
            }
        };

        generateForecast();
        const interval = setInterval(generateForecast, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [vitals]);

    return { prediction, riskLevel, insight };
}
