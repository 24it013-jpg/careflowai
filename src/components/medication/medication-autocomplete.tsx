import { useState, useEffect, useRef } from 'react';
import { Search, Pill, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { searchMedications, getCommonMedications, debounce, MedicationSuggestion } from '@/lib/ai/medication-autocomplete';

interface MedicationAutocompleteProps {
    onSelect: (medication: MedicationSuggestion) => void;
    placeholder?: string;
    className?: string;
}

export function MedicationAutocomplete({ onSelect, placeholder, className }: MedicationAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<MedicationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const debouncedSearch = useRef(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setSuggestions(getCommonMedications());
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const results = await searchMedications(searchQuery);
            setSuggestions(results);
            setIsLoading(false);
        }, 300)
    ).current;

    // Handle input change
    useEffect(() => {
        if (query.trim()) {
            setIsOpen(true);
            debouncedSearch(query);
        } else {
            setSuggestions(getCommonMedications());
            setIsOpen(false);
        }
    }, [query, debouncedSearch]);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % suggestions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (medication: MedicationSuggestion) => {
        onSelect(medication);
        setQuery('');
        setIsOpen(false);
        setSuggestions(getCommonMedications());
        setSelectedIndex(0);
    };

    return (
        <div className={cn('relative', className)}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || 'Search medications...'}
                    className="pl-10 pr-10 bg-white border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[400px] overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-500">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                                <p className="mt-2 text-sm">Searching medications...</p>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="py-2">
                                {!query && (
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Common Medications
                                    </div>
                                )}
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={`${suggestion.brandName}-${suggestion.genericName}-${index}`}
                                        onClick={() => handleSelect(suggestion)}
                                        className={cn(
                                            'w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors flex items-start gap-3',
                                            selectedIndex === index && 'bg-teal-50'
                                        )}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="p-2 bg-teal-100 rounded-lg">
                                                <Pill className="size-4 text-teal-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-slate-900 truncate">
                                                {suggestion.brandName || suggestion.genericName}
                                            </div>
                                            {suggestion.brandName && suggestion.genericName && (
                                                <div className="text-sm text-slate-600 truncate">
                                                    Generic: {suggestion.genericName}
                                                </div>
                                            )}
                                            {suggestion.dosageForm && (
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded-full">
                                                        {suggestion.dosageForm}
                                                    </span>
                                                    {suggestion.route && (
                                                        <span className="px-2 py-0.5 bg-slate-100 rounded-full">
                                                            {suggestion.route}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {suggestion.manufacturer && (
                                                <div className="text-xs text-slate-400 mt-1 truncate">
                                                    {suggestion.manufacturer}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <Pill className="size-12 mx-auto mb-3 text-slate-300" />
                                <p className="font-medium">No medications found</p>
                                <p className="text-sm mt-1">Try a different search term</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
