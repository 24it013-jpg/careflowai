import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Shortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    description: string;
    action: () => void;
}

export function useKeyboardShortcuts() {
    const navigate = useNavigate();

    const shortcuts: Shortcut[] = [
        { key: "h", description: "Go to Dashboard", action: () => navigate("/dashboard") },
        { key: "v", description: "Go to Vitals", action: () => navigate("/dashboard") },
        { key: "a", description: "Go to Achievements", action: () => navigate("/dashboard/achievements") },
        { key: "l", description: "Go to Leaderboard", action: () => navigate("/dashboard/leaderboard") },
        { key: "q", description: "Go to Daily Quests", action: () => navigate("/dashboard/quests") },
        { key: "m", description: "Go to Medications", action: () => navigate("/dashboard/medications") },
        { key: "s", description: "Go to Symptom Checker", action: () => navigate("/dashboard/symptom-checker") },
        { key: "w", description: "Go to Wearable Simulator", action: () => navigate("/dashboard/wearable") },
        { key: "j", description: "Go to Mood Journal", action: () => navigate("/dashboard/mood") },
        { key: "r", description: "Go to Lab Results", action: () => navigate("/dashboard/labs") },
        { key: "p", description: "Go to Sleep Visualizer", action: () => navigate("/dashboard/sleep") },
        { key: "t", description: "Go to Telemedicine", action: () => navigate("/dashboard/telemedicine") },
    ];

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't fire if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

        // Show shortcut help with ?
        if (e.key === "?") {
            const event = new CustomEvent("careflow:shortcuts-open");
            window.dispatchEvent(event);
            return;
        }

        for (const shortcut of shortcuts) {
            const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
            const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
            if (e.key.toLowerCase() === shortcut.key && ctrlMatch && shiftMatch) {
                e.preventDefault();
                shortcut.action();
                return;
            }
        }
    }, [navigate]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return shortcuts;
}
