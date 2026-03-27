import { useEffect, useRef } from "react";
import { useHealthData } from "./use-health-data";
import { toast } from "sonner";

export function useAIProctor() {
    const { vitals } = useHealthData();
    const lastAlertTime = useRef<{ [key: string]: number }>({});

    useEffect(() => {
        const now = Date.now();
        const ALERT_COOLDOWN = 60000; // 1 minute cooldown per alert type

        // Heart Rate Check
        if (vitals.heartRate > 100 || vitals.heartRate < 50) {
            if (!lastAlertTime.current.heartRate || now - lastAlertTime.current.heartRate > ALERT_COOLDOWN) {
                toast.warning("Abnormal Heart Rate Detected", {
                    description: `AI Analysis: Your heart rate is ${vitals.heartRate} BPM. Consider relaxing or checking if you're experiencing any discomfort.`,
                    duration: 5000,
                });
                lastAlertTime.current.heartRate = now;
            }
        }

        // SpO2 Check
        if (vitals.spo2 < 95) {
            if (!lastAlertTime.current.spo2 || now - lastAlertTime.current.spo2 > ALERT_COOLDOWN) {
                toast.error("Low SpO2 Level Detected", {
                    description: `AI Analysis: Your oxygen level is at ${vitals.spo2}%. Please ensure you're in a well-ventilated area and take deep breaths.`,
                    duration: 5000,
                });
                lastAlertTime.current.spo2 = now;
            }
        }

        // Temperature Check
        if (vitals.temperature > 101) {
            if (!lastAlertTime.current.temperature || now - lastAlertTime.current.temperature > ALERT_COOLDOWN) {
                toast.warning("High Temperature Detected", {
                    description: `AI Analysis: Fever detected at ${vitals.temperature}°F. Stay hydrated and monitor for other symptoms.`,
                    duration: 5000,
                });
                lastAlertTime.current.temperature = now;
            }
        }
    }, [vitals]);
}
