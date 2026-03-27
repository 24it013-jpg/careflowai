import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Pill,
    Share2,
    ShieldCheck,
    RefreshCw,
    Info,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    Zap,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Medication,
    checkMedications,
    MedicationCheckResult,
    Allergy
} from '@/lib/ai/medication-checker';
import {
    AIInteractionSummary,
    generateInteractionSummary,
    checkFoodInteractions,
    checkSupplementInteractions
} from '@/lib/ai/interaction-analyzer';
import { MedicationAutocomplete } from '@/components/medication/medication-autocomplete';
import { MedicationCard } from '@/components/medication/medication-card';
import { InteractionSummary } from '@/components/medication/interaction-summary';
import { InteractionGraph } from '@/components/medication/interaction-graph';
import { PricingComparison } from '@/components/medication/pricing-comparison';
import { DrugInfoPanel } from '@/components/medication/drug-info-panel';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/use-health-data';

export default function AIMedCheck() {
    const { medications, setMedications, allergies, addAllergy, removeAllergy } = useHealthData();
    const [newAllergy, setNewAllergy] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [results, setResults] = useState<MedicationCheckResult | null>(null);
    const [activeTab, setActiveTab] = useState('interactions');
    const [aiSummaries, setAiSummaries] = useState<Map<string, AIInteractionSummary>>(new Map());
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [showDrugInfo, setShowDrugInfo] = useState(false);

    const handleAddMedication = (medicationSuggest: any) => {
        // Transform suggestion to Medication
        const newMedication: Medication = {
            name: medicationSuggest.brandName || medicationSuggest.genericName,
            genericName: medicationSuggest.genericName,
            dosage: medicationSuggest.strength ? medicationSuggest.strength[0] : undefined, // Simplification
            id: crypto.randomUUID(), // interactive list needs unique IDs
            frequency: 'Daily' // Default
        };

        if (!medications.some(m => m.name.toLowerCase() === newMedication.name.toLowerCase())) {
            setMedications([...medications, newMedication]);
            // Clear results when list changes to force re-check
            setResults(null);
            setAiSummaries(new Map());
        }
    };

    const handleRemoveMedication = (id: string) => {
        setMedications(medications.filter(m => (m as any).id !== id));
        setResults(null);
        setAiSummaries(new Map());
    };

    const handleMedicationClick = (medication: Medication) => {
        // Only show info if we have results (meaning we fetched drug info)
        if (results && results.drugInfo.has(medication.name)) {
            setSelectedMedication(medication);
            setShowDrugInfo(true);
        }
    };

    const handleAddAllergy = () => {
        if (!newAllergy.trim()) return;
        const allergy: Allergy = {
            id: crypto.randomUUID(),
            allergen: newAllergy,
            reaction: 'Unknown',
            severity: 'severe' // Default to severe for safety
        };
        addAllergy(allergy);
        setNewAllergy('');
        setResults(null); // Force re-check
    };

    const handleRemoveAllergy = (id: string) => {
        removeAllergy(id);
        setResults(null);
    };

    const handleCheck = async () => {
        if (medications.length === 0) return;

        setIsChecking(true);
        setResults(null);
        setAiSummaries(new Map());

        try {
            // Check medications for interactions
            const checkResults = await checkMedications(medications, allergies);
            setResults(checkResults);

            // Generate AI summaries for each interaction
            const summaries = new Map<string, AIInteractionSummary>();
            // Generate summaries in parallel
            await Promise.all(checkResults.interactions.map(async (interaction) => {
                try {
                    const summary = await generateInteractionSummary(interaction);

                    // Check for food interactions
                    const foodInteractions = await checkFoodInteractions(interaction.drug1);
                    const foodInteractions2 = await checkFoodInteractions(interaction.drug2);
                    // Filter duplicates
                    const allFood = [...foodInteractions, ...foodInteractions2].filter((v, i, a) => a.findIndex(t => (t.food === v.food && t.medication === v.medication)) === i);
                    summary.foodInteractions = allFood; // Add to summary object if property exists, or handle separately

                    // Check for supplement interactions
                    const supplementInteractions = await checkSupplementInteractions(interaction.drug1);
                    const supplementInteractions2 = await checkSupplementInteractions(interaction.drug2);
                    const allSupplements = [...supplementInteractions, ...supplementInteractions2].filter((v, i, a) => a.findIndex(t => (t.food === v.food && t.medication === v.medication)) === i);
                    summary.supplementInteractions = allSupplements;

                    summaries.set(`${interaction.drug1}-${interaction.drug2}`, summary);
                } catch (error) {
                    console.error('Error generating AI summary:', error);
                }
            }));

            setAiSummaries(summaries);
        } catch (error) {
            console.error('Error checking medications:', error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-teal-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 mb-2 flex items-center gap-3">
                            <motion.span 
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] text-teal-400 backdrop-blur-md"
                            >
                                <Activity className="size-7" />
                            </motion.span>
                            AI Med Check
                        </h1>
                        <p className="text-white/50 text-lg font-light max-w-2xl">
                            Advanced drug interaction analysis & safety monitoring powered by AI.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 rounded-xl border-white/10 hover:bg-white/5 text-white/70 h-12 px-6">
                            <Share2 className="size-4" />
                            Export Report
                        </Button>
                        <Button
                            onClick={handleCheck}
                            disabled={isChecking || medications.length === 0}
                            className="premium-button bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white gap-2 rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] border border-white/10 font-semibold transition-all hover:scale-105 active:scale-95 text-md"
                        >
                            {isChecking ? (
                                <>
                                    <RefreshCw className="size-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="size-4" />
                                    Run Analysis
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Medication List */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-glass-panel border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -z-10" />
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Pill className="size-5 text-teal-400" />
                                Current Medications
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-white/40 font-bold ml-1">Add Medication</label>
                                    <MedicationAutocomplete onSelect={handleAddMedication} />
                                </div>

                                <div className="space-y-3 min-h-[200px]">
                                    <AnimatePresence mode="popLayout">
                                        {medications.length > 0 ? (
                                            medications.map(med => (
                                                <MedicationCard
                                                    key={(med as any).id}
                                                    id={(med as any).id}
                                                    name={med.name}
                                                    genericName={results?.genericAlternatives?.get(med.name) || med.genericName}
                                                    dosage={med.dosage || 'N/A'}
                                                    frequency={med.frequency}
                                                    // purpose={med.condition} // Not in Medication interface currently
                                                    bestPrice={results?.pricing?.get(med.name)?.sort((a, b) => a.finalPrice - b.finalPrice)[0]}
                                                    interactionCount={results?.interactions.filter(i =>
                                                        i.drug1 === med.name || i.drug2 === med.name
                                                    ).length}
                                                    interactionSeverity={results?.interactions.find(i =>
                                                        (i.drug1 === med.name || i.drug2 === med.name) && i.severity === 'severe'
                                                    ) ? 'severe' :
                                                        results?.interactions.find(i =>
                                                            (i.drug1 === med.name || i.drug2 === med.name) && i.severity === 'moderate'
                                                        ) ? 'moderate' : undefined}
                                                    onRemove={handleRemoveMedication}
                                                    onClick={() => handleMedicationClick(med)}
                                                />
                                            ))
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5"
                                            >
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Pill className="size-6 text-white/20" />
                                                </div>
                                                <p className="text-white/40 font-light">No medications added</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Patient Profile / Allergies */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="premium-glass-panel border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -z-10" />
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="size-5 text-teal-400" />
                                Patient Allergies
                            </h2>
                            <div className="flex gap-2 mb-4">
                                <Input
                                    type="text"
                                    value={newAllergy}
                                    onChange={(e) => setNewAllergy(e.target.value)}
                                    placeholder="Enter allergy (e.g. Penicillin)"
                                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10 rounded-xl focus-visible:ring-teal-500/50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                                />
                                <Button
                                    size="sm"
                                    onClick={handleAddAllergy}
                                    disabled={!newAllergy.trim()}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 px-4"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {allergies.map(allergy => (
                                    <div key={allergy.id} className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-red-500/20">
                                        {allergy.allergen}
                                        <button onClick={() => handleRemoveAllergy(allergy.id)} className="hover:text-red-300 transition-colors">
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ))}
                                {allergies.length === 0 && <span className="text-white/30 text-sm font-light italic">No known allergies recorded.</span>}
                            </div>
                        </motion.div>

                        {/* Analysis Complete Stats */}
                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 premium-glass-panel bg-blue-500/10 border border-blue-500/20 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 mt-1">
                                        <Info className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white text-lg">Analysis Complete</h4>
                                        <p className="text-sm text-white/60 mt-1 leading-relaxed font-light">
                                            Found <span className="text-white font-medium">{results.interactions.length}</span> potential interactions.
                                            Click on any medication card for detailed drug information.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Analysis Results */}
                    <div className="lg:col-span-2 space-y-6">
                        {results ? (
                            <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="premium-glass-panel border-white/10 rounded-2xl p-1.5 w-full max-w-md mx-auto lg:mx-0 grid grid-cols-2 mb-8 shadow-2xl">
                                    <TabsTrigger
                                        value="analysis"
                                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(20,184,166,0.3)] text-white/60 hover:text-white hover:bg-white/5 py-2.5 transition-all font-medium"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Activity className="size-4" />
                                            Interaction Analysis
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="pricing"
                                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(20,184,166,0.3)] text-white/60 hover:text-white hover:bg-white/5 py-2.5 transition-all font-medium"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <DollarSign className="size-4" />
                                            Price Comparison
                                        </div>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="analysis" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Allergy Warnings */}
                                    {results.allergyInteractions && results.allergyInteractions.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-light text-white flex items-center gap-3">
                                                <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                                                    <AlertTriangle className="size-5" />
                                                </div>
                                                Critical Allergy Warnings
                                            </h3>
                                            <div className="space-y-3">
                                                {results.allergyInteractions.map((interaction, idx) => (
                                                    <Card key={idx} className="p-6 premium-glass-panel border-red-500/30 bg-red-500/10 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-shadow">
                                                        <div className="flex items-start gap-5">
                                                            <div className="p-3 bg-red-500/20 rounded-xl shrink-0 border border-red-500/20">
                                                                <AlertTriangle className="size-6 text-red-500" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-red-200 text-lg flex flex-wrap items-center gap-3">
                                                                    {interaction.drug1} + {interaction.drug2}
                                                                    <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded border border-red-500/30 font-mono uppercase tracking-wider">
                                                                        {interaction.severity}
                                                                    </span>
                                                                </h4>
                                                                <p className="text-red-200/80 mt-2 mb-3 font-light leading-relaxed">{interaction.description}</p>
                                                                <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/20 flex items-start gap-3">
                                                                    <div className="p-1 bg-red-500/20 rounded text-red-400 mt-0.5">
                                                                        <Zap className="size-3" />
                                                                    </div>
                                                                    <p className="text-red-300 text-sm font-medium">
                                                                        Recommendation: {interaction.recommendation}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Network Graph Visualization */}
                                    {results.interactions.length > 0 ? (
                                        <div className="premium-glass-panel border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/5 rounded-full blur-[120px] -z-10" />
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                                <Share2 className="size-5 text-teal-400" />
                                                Interaction Network
                                            </h3>
                                            <InteractionGraph
                                                medications={medications.map(m => ({ id: m.name, name: m.name }))}
                                                interactions={results.interactions}
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-12 premium-glass-panel border border-white/10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
                                            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                                <CheckCircle2 className="size-10 text-emerald-400" />
                                            </div>
                                            <h3 className="text-2xl font-light text-white">No Drug Interactions Found</h3>
                                            <p className="text-white/50 mt-2 max-w-lg mx-auto font-light leading-relaxed">
                                                Good news! No known interactions were found between your medications based on our database.
                                            </p>
                                        </div>
                                    )}

                                    {/* Interaction Summaries */}
                                    <div className="space-y-6">
                                        {results.interactions.length > 0 && (
                                            <h3 className="text-xl font-light text-white flex items-center gap-3">
                                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                                                    <AlertTriangle className="size-5" />
                                                </div>
                                                Detailed Interaction Reports
                                            </h3>
                                        )}

                                        <AnimatePresence>
                                            {results.interactions.map((interaction, index) => {
                                                const summary = aiSummaries.get(`${interaction.drug1}-${interaction.drug2}`);

                                                // Fallback if AI summary isn't ready
                                                const displaySummary: AIInteractionSummary = summary || {
                                                    plainLanguageSummary: interaction.recommendation,
                                                    actionItems: ['Consult your doctor'],
                                                    riskLevel: interaction.severity === 'severe' ? 8 : 4,
                                                    timeline: 'routine',
                                                    patientFriendlyExplanation: interaction.description,
                                                    severity: interaction.severity
                                                };

                                                return (
                                                    <div key={`${interaction.drug1}-${interaction.drug2}-${index}`} className="premium-glass-panel border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl mb-6">
                                                        <InteractionSummary
                                                            summary={displaySummary}
                                                            foodInteractions={displaySummary.foodInteractions}
                                                            supplementInteractions={displaySummary.supplementInteractions}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </TabsContent>

                                <TabsContent value="pricing" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 gap-6">
                                        {medications.map(med => {
                                            const prices = results.pricing.get(med.name);
                                            if (!prices) return null;

                                            return (
                                                <div key={med.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                                    <h3 className="text-lg font-medium text-white mb-4">{med.name} Pricing</h3>
                                                    <PricingComparison
                                                        medicationName={med.name}
                                                        prices={prices}
                                                        genericPrice={
                                                            // Simple heuristic for generic price (mock)
                                                            Math.min(...prices.map(p => p.price)) * 0.7
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-white/10 rounded-[2.5rem] bg-black/20 text-center p-12 premium-glass-panel hover:border-teal-500/40 hover:bg-teal-500/5 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all group"
                            >
                                <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mb-8 border border-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.1)] animate-pulse">
                                    <Activity className="size-12 text-teal-400" />
                                </div>
                                <h3 className="text-3xl font-light text-white mb-3">Ready for Analysis</h3>
                                <p className="text-white/40 max-w-md text-lg font-light leading-relaxed">
                                    Add your medications on the left to check for interactions, side effects, and find the best prices.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Drug Info Dialog */}
                {selectedMedication && results && results.drugInfo.get(selectedMedication.name) && (
                    <DrugInfoPanel
                        medicationName={selectedMedication.name}
                        drugInfo={results.drugInfo.get(selectedMedication.name)!}
                        isOpen={showDrugInfo}
                        onClose={() => setShowDrugInfo(false)}
                    />
                )}
            </div>
        </div>
    );
}
