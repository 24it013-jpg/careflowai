import { motion } from 'framer-motion';
import { Pill, X, AlertTriangle, DollarSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MedicationCardProps {
    id: string;
    name: string;
    genericName?: string;
    dosage: string;
    frequency?: string;
    purpose?: string;
    bestPrice?: {
        pharmacy: string;
        price: number;
    };
    interactionCount?: number;
    interactionSeverity?: 'minor' | 'moderate' | 'severe';
    onRemove: (id: string) => void;
    onClick?: () => void;
}

export function MedicationCard({
    id,
    name,
    genericName,
    dosage,
    frequency,
    purpose,
    bestPrice,
    interactionCount,
    interactionSeverity,
    onRemove,
    onClick
}: MedicationCardProps) {
    const severityColors = {
        minor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        moderate: 'text-amber-600 bg-amber-50 border-amber-200',
        severe: 'text-red-600 bg-red-50 border-red-200'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                'bg-white border-2 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group',
                interactionSeverity ? severityColors[interactionSeverity] : 'border-slate-200 hover:border-teal-300'
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                    'flex-shrink-0 p-2.5 rounded-xl',
                    interactionSeverity
                        ? interactionSeverity === 'severe'
                            ? 'bg-red-100'
                            : interactionSeverity === 'moderate'
                                ? 'bg-amber-100'
                                : 'bg-yellow-100'
                        : 'bg-teal-100'
                )}>
                    <Pill className={cn(
                        'size-5',
                        interactionSeverity
                            ? interactionSeverity === 'severe'
                                ? 'text-red-600'
                                : interactionSeverity === 'moderate'
                                    ? 'text-amber-600'
                                    : 'text-yellow-600'
                            : 'text-teal-600'
                    )} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate">
                                {name}
                            </h4>
                            {genericName && genericName.toLowerCase() !== name.toLowerCase() && (
                                <p className="text-sm text-slate-600 truncate">
                                    Generic: {genericName}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(id);
                            }}
                            className="flex-shrink-0 size-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>

                    {/* Dosage & Frequency */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                            {dosage}
                        </span>
                        {frequency && (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                                {frequency}
                            </span>
                        )}
                    </div>

                    {/* Purpose */}
                    {purpose && (
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                            <span className="font-medium">For:</span> {purpose}
                        </p>
                    )}

                    {/* Alerts & Info */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {/* Interaction Warning */}
                        {interactionCount && interactionCount > 0 && (
                            <div className={cn(
                                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                                interactionSeverity === 'severe'
                                    ? 'bg-red-100 text-red-700'
                                    : interactionSeverity === 'moderate'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-yellow-100 text-yellow-700'
                            )}>
                                <AlertTriangle className="size-3.5" />
                                <span>
                                    {interactionCount} Interaction{interactionCount > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}

                        {/* Best Price */}
                        {bestPrice && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                                <DollarSign className="size-3.5" />
                                <span>
                                    ${bestPrice.price.toFixed(2)} at {bestPrice.pharmacy}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-xs text-teal-600">
                    <Info className="size-3.5" />
                    <span>Click for detailed information</span>
                </div>
            </div>
        </motion.div>
    );
}
