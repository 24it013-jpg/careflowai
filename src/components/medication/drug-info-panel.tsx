import {
    Info,
    AlertTriangle,
    ShieldAlert,
    Activity,
    FileText,
    Printer,
    Share2,
    ScrollText,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DrugInfo } from '@/lib/ai/medication-checker';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrugInfoPanelProps {
    medicationName: string;
    drugInfo: DrugInfo;
    isOpen?: boolean;
    onClose?: () => void;
}

export function DrugInfoPanel({ medicationName, drugInfo, isOpen, onClose }: DrugInfoPanelProps) {
    const [activeSection, setActiveSection] = useState<string>('overview');

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-blue-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-teal-600" />
                                {drugInfo.brandName || medicationName}
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 mt-1">
                                {drugInfo.genericName && <span className="font-medium mr-2">Generic: {drugInfo.genericName}</span>}
                            </DialogDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={handlePrint} title="Print">
                                <Printer className="w-5 h-5 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Share">
                                <Share2 className="w-5 h-5 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onClose?.()} title="Close">
                                <X className="w-5 h-5 text-slate-600" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-2 overflow-y-auto">
                        <NavButton
                            active={activeSection === 'overview'}
                            onClick={() => setActiveSection('overview')}
                            icon={<Info className="w-4 h-4" />}
                            label="Overview"
                        />
                        <NavButton
                            active={activeSection === 'side-effects'}
                            onClick={() => setActiveSection('side-effects')}
                            icon={<Activity className="w-4 h-4" />}
                            label="Side Effects"
                        />
                        <NavButton
                            active={activeSection === 'warnings'}
                            onClick={() => setActiveSection('warnings')}
                            icon={<AlertTriangle className="w-4 h-4" />}
                            label="Warnings"
                        />
                        <NavButton
                            active={activeSection === 'contraindications'}
                            onClick={() => setActiveSection('contraindications')}
                            icon={<ShieldAlert className="w-4 h-4" />}
                            label="Contraindications"
                        />
                        <NavButton
                            active={activeSection === 'pregnancy'}
                            onClick={() => setActiveSection('pregnancy')}
                            icon={<ScrollText className="w-4 h-4" />}
                            label="Pregnancy & Nursing"
                        />
                    </div>

                    {/* Content Area */}
                    <ScrollArea className="flex-1 p-6 h-[60vh] md:h-auto">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <AnimatePresence mode="wait">
                                {activeSection === 'overview' && (
                                    <ContentSection key="overview" title="Medication Overview">
                                        <p className="text-slate-700 leading-relaxed mb-4">
                                            {drugInfo.description || "No description available."}
                                        </p>
                                    </ContentSection>
                                )}

                                {activeSection === 'side-effects' && (
                                    <ContentSection key="side-effects" title="Side Effects">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-slate-800">Common Side Effects</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {drugInfo.sideEffects.length > 0 ? (
                                                    drugInfo.sideEffects.map((effect, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <div className={`w-2 h-2 rounded-full ${effect.severity === 'severe' ? 'bg-red-500' :
                                                                effect.severity === 'moderate' ? 'bg-amber-500' : 'bg-blue-500'
                                                                }`} />
                                                            <span className="text-slate-700">{effect.effect}</span>
                                                            <Badge variant="outline" className="ml-auto text-xs">{effect.frequency}</Badge>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-500 italic">No specific side effects listed.</p>
                                                )}
                                            </div>
                                        </div>
                                    </ContentSection>
                                )}

                                {activeSection === 'warnings' && (
                                    <ContentSection key="warnings" title="Warnings & Precautions">
                                        <div className="space-y-3">
                                            {drugInfo.warnings.length > 0 ? (
                                                drugInfo.warnings.map((warning, idx) => (
                                                    <div key={idx} className="flex gap-3 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                        <p className="text-amber-900 text-sm">{warning}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 italic">No specific warnings listed.</p>
                                            )}
                                        </div>
                                    </ContentSection>
                                )}

                                {activeSection === 'contraindications' && (
                                    <ContentSection key="contraindications" title="Contraindications">
                                        <div className="space-y-3">
                                            {drugInfo.contraindications.length > 0 ? (
                                                drugInfo.contraindications.map((item, idx) => (
                                                    <div key={idx} className="flex gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                                        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <p className="text-red-900 text-sm">{item}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 italic">No specific contraindications listed.</p>
                                            )}
                                        </div>
                                    </ContentSection>
                                )}

                                {activeSection === 'pregnancy' && (
                                    <ContentSection key="pregnancy" title="Pregnancy & Nursing">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                                                        Cat
                                                    </span>
                                                    Pregnancy Category
                                                </h4>
                                                <p className="text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                    {drugInfo.pregnancyCategory || "Information not available."}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-800 mb-2">Nursing Mothers</h4>
                                                <p className="text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                    {drugInfo.breastfeedingWarning || "Information not available."}
                                                </p>
                                            </div>
                                        </div>
                                    </ContentSection>
                                )}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
                ? 'bg-teal-100 text-teal-800'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            {icon}
            {label}
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600" />}
        </button>
    );
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
        >
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">{title}</h3>
            {children}
        </motion.div>
    );
}
