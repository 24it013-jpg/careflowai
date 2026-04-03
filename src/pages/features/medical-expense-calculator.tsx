import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Wallet, Plus, Trash2, Receipt, TrendingDown, 
    Info, IndianRupee, PieChart, ShoppingCart, 
    ArrowRight, CheckCircle2, AlertCircle, Sparkles,
    FileText, Activity, Hospital, Pill, HeartPulse, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { callOpenRouter } from "@/lib/ai/openrouter";
import { AIResponseCard } from "@/components/ui/ai-response-card";

interface Expense {
    id: string;
    type: 'hospital' | 'insurance' | 'medicine' | 'lab' | 'other';
    amount: number;
    description: string;
    date: string;
    category: string;
}

const CATEGORIES = [
    { id: 'hospital', label: 'Hospital Bills', icon: Hospital, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'insurance', label: 'Insurance Premium', icon: ShieldAlert, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'medicine', label: 'Medicines', icon: Pill, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'lab', label: 'Lab Tests', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'other', label: 'Other', icon: Activity, color: 'text-slate-400', bg: 'bg-slate-400/10' },
];

export default function MedicalExpenseCalculator() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<Expense['type']>('hospital');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("calculator");

    // Calculate totals
    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    
    const totalsByCategory = useMemo(() => {
        return CATEGORIES.reduce((acc, cat) => {
            acc[cat.id] = expenses.filter(e => e.type === cat.id).reduce((sum, e) => sum + e.amount, 0);
            return acc;
        }, {} as Record<string, number>);
    }, [expenses]);

    const addExpense = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!description) {
            toast.error("Please enter a description");
            return;
        }

        const newExpense: Expense = {
            id: Math.random().toString(36).substr(2, 9),
            type: category,
            amount: Number(amount),
            description,
            date: new Date().toLocaleDateString(),
            category: CATEGORIES.find(c => c.id === category)?.label || 'Other'
        };

        setExpenses([newExpense, ...expenses]);
        setAmount("");
        setDescription("");
        toast.success("Expense added successfully!");
    };

    const deleteExpense = (id: string) => {
        setExpenses(expenses.filter(e => e.id !== id));
        toast.info("Expense removed");
    };

    const runAiAnalysis = async () => {
        if (expenses.length === 0) {
            toast.error("Add some expenses first for analysis");
            return;
        }

        setIsAnalyzing(true);
        try {
            const prompt = `
                Analyze the following medical expenses for a patient in India:
                ${expenses.map(e => `- ${e.category}: ₹${e.amount} (${e.description})`).join('\n')}
                
                Total Expense: ₹${totalExpenses}
                
                Please provide:
                1. A brief analysis of the spending.
                2. Potential alternatives or cost-saving measures (Generic vs Branded medicines).
                3. Information on average treatment costs in India for the mentioned conditions (if any).
                4. Average price of common operations in India related to these categories.
                5. How costly the implied disease/condition might be to cure long-term.
                
                Keep the tone professional and helpful. Use Indian Rupee (₹) for all currency mentions.
            `;

            const analysis = await callOpenRouter(prompt, "You are a helpful Medical Financial Advisor specialized in the Indian healthcare system.");
            setAiAnalysis(analysis);
            setActiveTab("analysis");
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Failed to generate AI analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-200 p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
                                <Wallet className="size-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Expense Nexus</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">AI-Driven Medical Financials</p>
                            </div>
                        </motion.div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Manage your healthcare spending with ease. Track hospital bills, insurance premiums, and medication costs while AI analyzes your spending patterns to find savings.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            className="border-white/10 bg-white/5 hover:bg-white/10"
                            onClick={() => setActiveTab("shop")}
                        >
                            <ShoppingCart className="size-4 mr-2 text-emerald-400" />
                            Buy Medicines
                        </Button>
                        <Badge variant="outline" className="px-4 py-2 bg-blue-500/10 border-blue-500/20 text-blue-400">
                            Total: ₹{totalExpenses.toLocaleString()}
                        </Badge>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-black/40 border border-white/5 p-1">
                        <TabsTrigger value="calculator" className="data-[state=active]:bg-white/10">
                            <Wallet className="size-4 mr-2" /> Calculator
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="data-[state=active]:bg-white/10">
                            <Sparkles className="size-4 mr-2 text-purple-400" /> AI Insights
                        </TabsTrigger>
                        <TabsTrigger value="shop" className="data-[state=active]:bg-white/10">
                            <ShoppingCart className="size-4 mr-2 text-emerald-400" /> Pharmacy
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calculator" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Input Form */}
                            <Card className="lg:col-span-1 bg-black/40 border-white/5 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Add New Bill</CardTitle>
                                    <CardDescription>Enter your medical expenses here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Amount (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                            <Input 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00" 
                                                className="pl-10 bg-white/5 border-white/10 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id as any)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                                                        category === cat.id 
                                                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                                                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                                    )}
                                                >
                                                    <cat.icon className="size-5 mb-1" />
                                                    <span className="text-[10px] font-medium">{cat.label.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                                        <Input 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="e.g. Fever medication, MRI Scan..." 
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <Button 
                                        onClick={addExpense}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-6"
                                    >
                                        <Plus className="size-4 mr-2" /> Add Expense
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Expense List */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {CATEGORIES.filter(c => c.id !== 'other').map(cat => (
                                        <Card key={cat.id} className="bg-black/40 border-white/5 overflow-hidden">
                                            <div className={cn("h-1 w-full", cat.bg.replace('bg-', 'bg-opacity-100 ').replace('/10', ''))} />
                                            <CardContent className="p-4">
                                                <p className="text-xs text-slate-500 font-bold uppercase">{cat.label}</p>
                                                <p className="text-xl font-black mt-1">₹{totalsByCategory[cat.id].toLocaleString()}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                                            <CardDescription>Your medical spending history.</CardDescription>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                                            onClick={runAiAnalysis}
                                            disabled={isAnalyzing || expenses.length === 0}
                                        >
                                            {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                                            <Sparkles className="size-4 ml-2" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[400px] pr-4">
                                            {expenses.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                                    <Receipt className="size-12 mb-4 opacity-20" />
                                                    <p>No expenses added yet.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {expenses.map((expense) => {
                                                        const catInfo = CATEGORIES.find(c => c.id === expense.type)!;
                                                        return (
                                                            <motion.div 
                                                                layout
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                key={expense.id}
                                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn("p-3 rounded-xl", catInfo.bg)}>
                                                                        <catInfo.icon className={cn("size-5", catInfo.color)} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold">{expense.description}</p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <Badge variant="outline" className="text-[10px] py-0 border-white/10">{expense.category}</Badge>
                                                                            <span className="text-xs text-slate-500">{expense.date}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <p className="font-black text-lg">₹{expense.amount.toLocaleString()}</p>
                                                                    <button 
                                                                        onClick={() => deleteExpense(expense.id)}
                                                                        className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-6">
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500" />
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black">AI Financial Health Analysis</CardTitle>
                                        <CardDescription>Personalized insights based on your medical spending in India.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="prose prose-invert max-w-none">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <div className="size-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                        <p className="text-purple-400 font-bold animate-pulse">Consulting AI Healthcare Experts...</p>
                                    </div>
                                ) : aiAnalysis ? (
                                    <div className="space-y-6">
                                        <AIResponseCard 
                                            content={aiAnalysis}
                                            title="Medical Financial Health Report"
                                            source="CAREflow Finance AI"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                                <div className="flex items-center gap-2 mb-2 text-blue-400">
                                                    <Info className="size-4" />
                                                    <span className="text-xs font-bold uppercase">Generic vs Branded</span>
                                                </div>
                                                <p className="text-sm text-slate-400">Switching to generic alternatives can save up to 70% on medicine bills in India.</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                                                    <CheckCircle2 className="size-4" />
                                                    <span className="text-xs font-bold uppercase">Tax Benefits</span>
                                                </div>
                                                <p className="text-sm text-slate-400">Section 80D offers deductions up to ₹25,000 for medical insurance premiums.</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                                <div className="flex items-center gap-2 mb-2 text-amber-400">
                                                    <AlertCircle className="size-4" />
                                                    <span className="text-xs font-bold uppercase">Treatment Cap</span>
                                                </div>
                                                <p className="text-sm text-slate-400">Always check for hospital-wise pricing transparency as per IRDAI guidelines.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                        <Sparkles className="size-12 mb-4 opacity-20" />
                                        <p>Run analysis to see AI insights about your medical expenses.</p>
                                        <Button 
                                            variant="link" 
                                            className="text-purple-400 mt-2"
                                            onClick={runAiAnalysis}
                                        >
                                            Run Analysis Now
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="shop" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: "Paracetamol 500mg", price: 45, type: "Generic", savings: "60%" },
                                { name: "Amoxicillin 250mg", price: 120, type: "Branded", savings: "15%" },
                                { name: "Metformin 500mg", price: 35, type: "Generic", savings: "80%" },
                                { name: "Atorvastatin 10mg", price: 180, type: "Branded", savings: "20%" },
                                { name: "Omeprazole 20mg", price: 55, type: "Generic", savings: "75%" },
                                { name: "Vitamin D3 60K", price: 90, type: "Generic", savings: "50%" },
                            ].map((med, i) => (
                                <Card key={i} className="bg-black/40 border-white/5 hover:border-white/20 transition-all group overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                                <Pill className="size-6" />
                                            </div>
                                            <Badge className={cn(
                                                med.type === "Generic" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                                            )}>
                                                {med.type}
                                            </Badge>
                                        </div>
                                        <h3 className="text-lg font-bold mb-1">{med.name}</h3>
                                        <p className="text-xs text-slate-500 mb-4">Save {med.savings} with generic alternative</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-2xl font-black">₹{med.price}</span>
                                                <span className="text-xs text-slate-500 ml-2 line-through">₹{Math.floor(med.price * 1.5)}</span>
                                            </div>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
