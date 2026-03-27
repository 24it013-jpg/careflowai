import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle, Clock, Utensils, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIInteractionSummary, FoodInteraction, SupplementInteraction } from '@/lib/ai/interaction-analyzer';

interface InteractionSummaryProps {
    summary: AIInteractionSummary;
    foodInteractions?: FoodInteraction[];
    supplementInteractions?: SupplementInteraction[];
    className?: string;
}

export function InteractionSummary({
    summary,
    foodInteractions = [],
    supplementInteractions = [],
    className
}: InteractionSummaryProps) {
    const severityConfig = {
        minor: {
            icon: Info,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            iconBg: 'bg-yellow-100'
        },
        moderate: {
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            iconBg: 'bg-amber-100'
        },
        severe: {
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            iconBg: 'bg-red-100'
        }
    };

    const config = severityConfig[summary.severity];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('space-y-4', className)}
        >
            {/* Main Interaction Summary */}
            <div className={cn(
                'border-2 rounded-2xl p-6',
                config.bg,
                config.border
            )}>
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className={cn('p-3 rounded-xl', config.iconBg)}>
                        <Icon className={cn('size-6', config.color)} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className={cn('text-lg font-semibold', config.color)}>
                                {summary.severity.charAt(0).toUpperCase() + summary.severity.slice(1)} Interaction
                            </h3>
                            <span className={cn(
                                'px-2.5 py-1 text-xs font-medium rounded-lg',
                                config.iconBg,
                                config.color
                            )}>
                                Risk Level: {summary.riskLevel}/10
                            </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            {summary.plainLanguageSummary}
                        </p>
                    </div>
                </div>

                {/* Clinical Significance */}
                {summary.clinicalSignificance && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">
                            Clinical Significance
                        </h4>
                        <p className="text-sm text-slate-700">
                            {summary.clinicalSignificance}
                        </p>
                    </div>
                )}

                {/* Action Items */}
                {summary.actionItems && summary.actionItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-teal-600" />
                            Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                            {summary.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Monitoring Requirements */}
                {summary.monitoringRequired && summary.monitoringRequired.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Clock className="size-4 text-blue-600" />
                            Monitoring Required
                        </h4>
                        <ul className="space-y-2">
                            {summary.monitoringRequired.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Food Interactions */}
            {foodInteractions.length > 0 && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Utensils className="size-5 text-orange-600" />
                        Food & Beverage Interactions
                    </h4>
                    <div className="space-y-4">
                        {foodInteractions.map((interaction, index) => (
                            <div key={index} className="border-l-4 border-orange-400 pl-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h5 className="font-semibold text-slate-900">
                                        {interaction.food}
                                    </h5>
                                    <span className={cn(
                                        'px-2.5 py-1 text-xs font-medium rounded-lg',
                                        interaction.severity === 'severe'
                                            ? 'bg-red-100 text-red-700'
                                            : interaction.severity === 'moderate'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                    )}>
                                        {interaction.severity}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 mb-2">
                                    {interaction.description}
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">Recommendation:</span> {interaction.recommendation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Supplement Interactions */}
            {supplementInteractions.length > 0 && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Pill className="size-5 text-purple-600" />
                        Supplement Interactions
                    </h4>
                    <div className="space-y-4">
                        {supplementInteractions.map((interaction, index) => (
                            <div key={index} className="border-l-4 border-purple-400 pl-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h5 className="font-semibold text-slate-900">
                                        {interaction.food}
                                    </h5>
                                    <span className={cn(
                                        'px-2.5 py-1 text-xs font-medium rounded-lg',
                                        interaction.severity === 'severe'
                                            ? 'bg-red-100 text-red-700'
                                            : interaction.severity === 'moderate'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                    )}>
                                        {interaction.severity}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 mb-2">
                                    {interaction.description}
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="font-medium">Recommendation:</span> {interaction.recommendation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
