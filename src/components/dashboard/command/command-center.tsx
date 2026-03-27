import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Command as CommandIcon,
    Zap,
    User,
    Settings,
    ShieldAlert,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FEATURES } from '../medical-magic/medical-apps-data';
import { useAIChat } from '@/hooks/use-ai-chat';

export function CommandCenter() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { openChat } = useAIChat();
    const inputRef = useRef<HTMLInputElement>(null);

    // List of quick actions
    const quickActions = [
        { id: 'ai-help', title: 'Ask AI Assistant', icon: Zap, action: () => openChat("How can I help you today?") },
        { id: 'sos', title: 'Trigger Emergency SOS', icon: ShieldAlert, action: () => navigate('/dashboard/sos'), color: 'text-red-400' },
        { id: 'profile', title: 'View Profile', icon: User, action: () => navigate('/dashboard/profile') },
        { id: 'settings', title: 'Settings', icon: Settings, action: () => navigate('/dashboard/settings') },
    ];

    // Filtered results
    const filteredFeatures = FEATURES.filter(f =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
    );

    const allItems = [
        ...quickActions.map(a => ({ ...a, type: 'action' })),
        ...filteredFeatures.map(f => ({ ...f, type: 'feature' }))
    ];

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        if (open) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleAction = (item: any) => {
        if (item.type === 'action' && item.action) {
            item.action();
        } else if (item.type === 'feature' && item.link) {
            navigate(item.link);
        }
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % allItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (allItems[selectedIndex]) {
                handleAction(allItems[selectedIndex]);
            }
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        {/* Search Input Area */}
                        <div className="flex items-center px-4 border-b border-white/5 bg-white/5">
                            <Search className="size-5 text-white/40 mr-3" />
                            <input
                                ref={inputRef}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search features, actions, or ask AI..."
                                className="w-full py-5 bg-transparent border-none focus:outline-none text-white placeholder:text-white/20 text-lg"
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">ESC</span>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 scrollbar-hide">
                            {/* Quick Actions Section */}
                            {search === '' && (
                                <div className="px-2 pt-2">
                                    <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2 px-2">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.map((action, idx) => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleAction({ ...action, type: 'action' })}
                                                onMouseEnter={() => setSelectedIndex(idx)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                                    selectedIndex === idx ? "bg-white/10 ring-1 ring-white/20" : "bg-white/[0.02] hover:bg-white/5"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-lg bg-black/40 border border-white/10", action.color || "text-white/60")}>
                                                    <action.icon className="size-4" />
                                                </div>
                                                <span className="text-sm font-medium text-white/80">{action.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Results Section */}
                            <div className="px-2">
                                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2 px-2">
                                    {search === '' ? 'Popular Features' : 'Search Results'}
                                </h3>
                                <div className="space-y-1">
                                    {(search === '' ? filteredFeatures.slice(0, 8) : filteredFeatures).map((feature, idx) => {
                                        const actualIdx = search === '' ? idx + quickActions.length : idx;
                                        return (
                                            <button
                                                key={feature.id}
                                                onClick={() => handleAction({ ...feature, type: 'feature' })}
                                                onMouseEnter={() => setSelectedIndex(actualIdx)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                                                    selectedIndex === actualIdx ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/[0.05]"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2.5 rounded-xl bg-black/40 border border-white/10", feature.color)}>
                                                        <feature.icon className="size-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-sm font-semibold text-white/90">{feature.title}</div>
                                                        <div className="text-xs text-white/40">{feature.description}</div>
                                                    </div>
                                                </div>
                                                <ArrowRight className={cn(
                                                    "size-4 transition-all",
                                                    selectedIndex === actualIdx ? "text-white translate-x-0 opacity-100" : "text-white/0 -translate-x-2 opacity-0"
                                                )} />
                                            </button>
                                        );
                                    })}

                                    {filteredFeatures.length === 0 && search !== '' && (
                                        <div className="py-12 flex flex-col items-center justify-center text-center">
                                            <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 mb-4">
                                                <Zap className="size-8 text-white/10" />
                                            </div>
                                            <p className="text-white/40 text-sm">No features found for "{search}"</p>
                                            <p className="text-white/20 text-xs mt-1">Try searching for 'vision', 'meds', or 'doctor'</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest">
                                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">↑↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest">
                                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Enter</kbd>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                                <CommandIcon className="size-3" />
                                <span>Command Center</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
