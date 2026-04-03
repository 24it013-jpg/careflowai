import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    HeartPulse,
    Loader2,
    Sparkles,
    Stethoscope,
    Pill,
    ScanEye,
    Utensils,
    AlertTriangle,
    Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useHealthData, type HealthDataStore } from '@/hooks/use-health-data';
import {
    OPEN_HEALTH_CONDITIONS,
    generateConditionGuide,
    summarizeHeartCheckIn,
    summarizeDiabetesCheckIn,
} from '@/lib/ai/open-health';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function vitalsLineFromStore(vitals: HealthDataStore['vitals']): string {
    return `HR ${vitals.heartRate} bpm, SpO₂ ${vitals.spo2}%, Temp ${vitals.temperature}°F, BP ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg, Weight ${vitals.weight} lb`;
}

const HEART_DEFAULTS: Record<string, string> = {
    age: '45',
    sex: '1',
    cp: '0',
    trestbps: '120',
    chol: '200',
    fbs: '0',
    restecg: '0',
    thalach: '150',
    exang: '0',
    oldpeak: '1.0',
    slope: '1',
    ca: '0',
    thal: '2',
};

const DIABETES_DEFAULTS: Record<string, string> = {
    pregnancies: '0',
    Glucose: '100',
    BloodPressure: '72',
    skin_thickness: '20',
    insulin: '80',
    BMI: '28',
    DiabetesPedigreeFunction: '0.5',
    Age: '45',
};

export default function OpenHealthHub() {
    const { vitals } = useHealthData();
    const [conditionId, setConditionId] = useState(OPEN_HEALTH_CONDITIONS[0].id);
    const [focus, setFocus] = useState('');
    const [notes, setNotes] = useState('');
    const [guideOut, setGuideOut] = useState<string | null>(null);
    const [guideBusy, setGuideBusy] = useState(false);

    const [heartFields, setHeartFields] = useState(HEART_DEFAULTS);
    const [diabetesFields, setDiabetesFields] = useState(DIABETES_DEFAULTS);
    const [checkOut, setCheckOut] = useState<string | null>(null);
    const [checkBusy, setCheckBusy] = useState(false);
    const [checkKind, setCheckKind] = useState<'heart' | 'diabetes' | null>(null);

    const condition = OPEN_HEALTH_CONDITIONS.find((c) => c.id === conditionId) ?? OPEN_HEALTH_CONDITIONS[0];
    const vline = vitalsLineFromStore(vitals);

    const runGuide = async () => {
        setGuideBusy(true);
        setGuideOut(null);
        try {
            const text = await generateConditionGuide(condition.label, focus, notes);
            setGuideOut(text);
        } catch (e) {
            setGuideOut(`**Could not reach AI services.** ${e instanceof Error ? e.message : 'Try again later.'}`);
        } finally {
            setGuideBusy(false);
        }
    };

    const runHeart = async () => {
        setCheckBusy(true);
        setCheckKind('heart');
        setCheckOut(null);
        try {
            const text = await summarizeHeartCheckIn(heartFields, vline);
            setCheckOut(text);
        } catch (e) {
            setCheckOut(`**Error:** ${e instanceof Error ? e.message : 'Request failed'}`);
        } finally {
            setCheckBusy(false);
        }
    };

    const runDiabetes = async () => {
        setCheckBusy(true);
        setCheckKind('diabetes');
        setCheckOut(null);
        try {
            const text = await summarizeDiabetesCheckIn(diabetesFields, vline);
            setCheckOut(text);
        } catch (e) {
            setCheckOut(`**Error:** ${e instanceof Error ? e.message : 'Request failed'}`);
        } finally {
            setCheckBusy(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white/90 p-6 md:p-10 font-sans selection:bg-sky-500/30">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-8">
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight flex items-center gap-4 text-white mb-4"
                    >
                        <span className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-500/10">
                            <HeartPulse className="size-8" />
                        </span>
                        Open Health Hub
                    </motion.h1>
                    <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed">
                        Access a wealth of health knowledge and personalized guides. From managing chronic conditions to heart health check-ins, our AI provides clear, actionable information.
                    </p>
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-100/90 text-sm">
                        <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                        <span>
                            Not a diagnosis or prediction tool. Use for learning and visit prep; emergencies belong
                            with emergency services.
                        </span>
                    </div>
                </header>

                <Tabs defaultValue="guide" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl flex flex-wrap h-auto gap-1">
                        <TabsTrigger value="guide" className="rounded-xl data-[state=active]:bg-sky-600/40 gap-2">
                            <Sparkles className="size-4" />
                            Condition &amp; diet guide
                        </TabsTrigger>
                        <TabsTrigger value="heart" className="rounded-xl data-[state=active]:bg-rose-600/40 gap-2">
                            <Activity className="size-4" />
                            Heart check-in
                        </TabsTrigger>
                        <TabsTrigger value="diabetes" className="rounded-xl data-[state=active]:bg-emerald-600/40 gap-2">
                            <Stethoscope className="size-4" />
                            Diabetes check-in
                        </TabsTrigger>
                        <TabsTrigger value="more" className="rounded-xl data-[state=active]:bg-violet-600/40 gap-2">
                            Related tools
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="guide" className="mt-6 space-y-4">
                        <div className="premium-glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-white/70">Condition topic</Label>
                                    <Select value={conditionId} onValueChange={setConditionId}>
                                        <SelectTrigger className="bg-white/5 border-white/15 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OPEN_HEALTH_CONDITIONS.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/70">Focus / subtype</Label>
                                    <Input
                                        value={focus}
                                        onChange={(e) => setFocus(e.target.value)}
                                        placeholder={condition.focusPlaceholder}
                                        className="bg-white/5 border-white/15 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/70">Your notes (optional)</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Symptoms, medications, or goals you want the guide to consider in general terms…"
                                    className="bg-white/5 border-white/15 rounded-xl min-h-[100px]"
                                />
                            </div>
                            <Button
                                onClick={runGuide}
                                disabled={guideBusy}
                                className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 gap-2"
                            >
                                {guideBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                                Generate guide
                            </Button>
                            {guideOut && (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 max-h-[480px] overflow-y-auto markdown-content text-sm leading-relaxed text-slate-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideOut}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="heart" className="mt-6 space-y-4">
                        <div className="premium-glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
                            <p className="text-white/50 text-sm">
                                Fields mirror common heart-risk questionnaires (e.g. Cleveland-style attributes).
                                Values you enter are sent to AI with your dashboard vitals:{' '}
                                <span className="text-white/70">{vline}</span>
                            </p>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(
                                    [
                                        ['age', 'Age'],
                                        ['sex', 'Sex (1=male, 0=female)'],
                                        ['cp', 'Chest pain type (0–3)'],
                                        ['trestbps', 'Resting BP (mmHg)'],
                                        ['chol', 'Serum cholesterol (mg/dl)'],
                                        ['fbs', 'Fasting BS >120 (1=yes)'],
                                        ['restecg', 'Resting ECG (0–2)'],
                                        ['thalach', 'Max heart rate achieved'],
                                        ['exang', 'Exercise angina (1=yes)'],
                                        ['oldpeak', 'ST depression'],
                                        ['slope', 'ST slope (0–2)'],
                                        ['ca', '# major vessels (0–3)'],
                                        ['thal', 'Thal (1–3)'],
                                    ] as const
                                ).map(([key, label]) => (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-xs text-white/55">{label}</Label>
                                        <Input
                                            value={heartFields[key]}
                                            onChange={(e) =>
                                                setHeartFields((s) => ({ ...s, [key]: e.target.value }))
                                            }
                                            className="bg-white/5 border-white/15 rounded-lg h-10"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={runHeart}
                                disabled={checkBusy}
                                className="rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 gap-2"
                            >
                                {checkBusy && checkKind === 'heart' ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Activity className="size-4" />
                                )}
                                Summarize with AI
                            </Button>
                            {checkOut && checkKind === 'heart' && (
                                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 max-h-[420px] overflow-y-auto markdown-content text-sm text-slate-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{checkOut}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="diabetes" className="mt-6 space-y-4">
                        <div className="premium-glass-panel border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
                            <p className="text-white/50 text-sm">
                                Pima-style fields for awareness only. Vitals included: {vline}
                            </p>
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {(
                                    [
                                        ['pregnancies', 'Pregnancies'],
                                        ['Glucose', 'Glucose (mg/dl)'],
                                        ['BloodPressure', 'Blood pressure (mmHg)'],
                                        ['skin_thickness', 'Skin fold (mm)'],
                                        ['insulin', 'Insulin (μU/ml)'],
                                        ['BMI', 'BMI'],
                                        ['DiabetesPedigreeFunction', 'Diabetes pedigree fn'],
                                        ['Age', 'Age'],
                                    ] as const
                                ).map(([key, label]) => (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-xs text-white/55">{label}</Label>
                                        <Input
                                            value={diabetesFields[key]}
                                            onChange={(e) =>
                                                setDiabetesFields((s) => ({ ...s, [key]: e.target.value }))
                                            }
                                            className="bg-white/5 border-white/15 rounded-lg h-10"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={runDiabetes}
                                disabled={checkBusy}
                                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 gap-2"
                            >
                                {checkBusy && checkKind === 'diabetes' ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Stethoscope className="size-4" />
                                )}
                                Summarize with AI
                            </Button>
                            {checkOut && checkKind === 'diabetes' && (
                                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 max-h-[420px] overflow-y-auto markdown-content text-sm text-slate-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{checkOut}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="more" className="mt-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                to="/dashboard/vision"
                                className="premium-glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-3 hover:border-purple-500/40 transition-colors"
                            >
                                <ScanEye className="size-8 text-purple-400" />
                                <div>
                                    <div className="font-semibold">AI Vision Decoder</div>
                                    <div className="text-sm text-white/45">Imaging-style photo analysis</div>
                                </div>
                            </Link>
                            <Link
                                to="/dashboard/med-check"
                                className="premium-glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
                            >
                                <Pill className="size-8 text-emerald-400" />
                                <div>
                                    <div className="font-semibold">Medicine photo AI</div>
                                    <div className="text-sm text-white/45">Labels &amp; packaging</div>
                                </div>
                            </Link>
                            <Link
                                to="/dashboard/diet"
                                className="premium-glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-3 hover:border-orange-500/40 transition-colors"
                            >
                                <Utensils className="size-8 text-orange-400" />
                                <div>
                                    <div className="font-semibold">Diet &amp; nutrition</div>
                                    <div className="text-sm text-white/45">Meal planning &amp; tracking</div>
                                </div>
                            </Link>
                            <Link
                                to="/dashboard/symptom-checker"
                                className="premium-glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-3 hover:border-rose-500/40 transition-colors"
                            >
                                <Stethoscope className="size-8 text-rose-400" />
                                <div>
                                    <div className="font-semibold">Symptom checker</div>
                                    <div className="text-sm text-white/45">Guided symptom triage</div>
                                </div>
                            </Link>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
