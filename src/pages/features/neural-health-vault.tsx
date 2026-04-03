import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, FileText, Search, Upload, Plus, 
    Zap, Clock, Info, CheckCircle2, AlertCircle, 
    Sparkles, Trash2, Download, Filter, Eye,
    Stethoscope, Pill, Receipt, Share2
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

interface HealthDocument {
    id: string;
    name: string;
    type: 'prescription' | 'report' | 'insurance' | 'other';
    date: string;
    summary?: string;
    tags: string[];
    isAnalyzing?: boolean;
}

const INITIAL_DOCS: HealthDocument[] = [
    {
        id: '1',
        name: 'Annual Blood Work - 2025',
        type: 'report',
        date: '2025-05-12',
        summary: 'All vital markers within normal range. Vitamin D slightly low (22 ng/mL). LDL Cholesterol at 110 mg/dL.',
        tags: ['Blood Test', 'Routine', 'Cholesterol']
    },
    {
        id: '2',
        name: 'Apollo Hospital Prescription',
        type: 'prescription',
        date: '2025-08-20',
        summary: 'Prescription for seasonal allergies. Includes Levocetirizine 5mg and Montelukast 10mg.',
        tags: ['Allergy', 'Apollo', 'Medication']
    }
];

export default function NeuralHealthVault() {
    const [documents, setDocuments] = useState<HealthDocument[]>(INITIAL_DOCS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const filteredDocs = useMemo(() => {
        return documents.filter(doc => 
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [documents, searchQuery]);

    const handleSmartSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const context = documents.map(doc => `Document: ${doc.name}, Date: ${doc.date}, Summary: ${doc.summary}`).join('\n');
            const prompt = `Based on the following medical documents:\n${context}\n\nAnswer the user's question: "${searchQuery}"\nIf the answer is not in the documents, say so. Keep it concise and professional.`;
            
            const result = await callOpenRouter(prompt, "You are a specialized Medical Record Assistant. You help users find information within their own medical history accurately.");
            setSearchResult(result);
        } catch (error) {
            console.error("Smart Search Error:", error);
            toast.error("Failed to perform AI Smart Search.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload and AI analysis
        setTimeout(() => {
            const newDoc: HealthDocument = {
                id: Date.now().toString(),
                name: "New Medical Document",
                type: 'other',
                date: new Date().toISOString().split('T')[0],
                summary: "AI analysis in progress...",
                tags: ['New'],
                isAnalyzing: true
            };
            setDocuments([newDoc, ...documents]);
            setIsUploading(false);
            toast.success("Document uploaded! AI is now indexing and summarizing.");
            
            // Simulate AI analysis completion
            setTimeout(() => {
                setDocuments(prev => prev.map(d => d.id === newDoc.id ? {
                    ...d,
                    summary: "This document contains recent vaccination records and a general check-up summary. No abnormalities detected.",
                    tags: ['Checkup', 'Vaccination'],
                    isAnalyzing: false
                } : d));
            }, 3000);
        }, 1500);
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
                                <Shield className="size-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Health Vault</h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Secure AI-Indexed Medical Records</p>
                            </div>
                        </motion.div>
                        <p className="text-white/50 text-lg font-light max-w-2xl leading-relaxed mt-4">
                            Store and manage your medical records securely. Our AI indexes and summarizes your documents, making it easy to find and share important health information.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                        >
                            {isUploading ? "Uploading..." : <><Plus className="size-4 mr-2" /> Upload Document</>}
                        </Button>
                    </div>
                </div>

                {/* Smart Search Section */}
                <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Sparkles className="size-4 text-cyan-400" /> AI Semantic Search
                        </CardTitle>
                        <CardDescription>Ask questions like "When was my last tetanus shot?" or "What were my cholesterol levels in 2024?"</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                <Input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                                    placeholder="Search your medical history with AI..." 
                                    className="pl-12 bg-white/5 border-white/10 focus:ring-blue-500/20 py-6 text-base"
                                />
                            </div>
                            <Button 
                                onClick={handleSmartSearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 h-auto"
                            >
                                {isSearching ? "Analyzing..." : "Ask AI"}
                            </Button>
                        </div>

                        <AnimatePresence>
                            {searchResult && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-200 relative group"
                                >
                                    <button 
                                        onClick={() => setSearchResult(null)}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                    <div className="flex gap-4">
                                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 h-fit">
                                            <Bot className="size-5" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-bold text-blue-400 text-xs uppercase tracking-widest">Aura Intelligence</p>
                                            <p className="leading-relaxed">{searchResult}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Filters Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Filter className="size-4" /> Quick Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { label: 'All Documents', count: documents.length, icon: FileText, color: 'text-slate-400' },
                                    { label: 'Prescriptions', count: documents.filter(d => d.type === 'prescription').length, icon: Pill, color: 'text-emerald-400' },
                                    { label: 'Lab Reports', count: documents.filter(d => d.type === 'report').length, icon: Stethoscope, color: 'text-blue-400' },
                                    { label: 'Insurance', count: documents.filter(d => d.type === 'insurance').length, icon: Shield, color: 'text-purple-400' },
                                ].map((filter) => (
                                    <button 
                                        key={filter.label}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <filter.icon className={cn("size-4", filter.color)} />
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{filter.label}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] bg-white/5 border-white/5">{filter.count}</Badge>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/20 backdrop-blur-xl">
                            <CardContent className="p-6 space-y-4">
                                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 w-fit">
                                    <Zap className="size-6" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight">Neural Sync Active</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">Your documents are encrypted and indexed by AI. They are only accessible by you.</p>
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-blue-400">Vault Capacity</span>
                                        <span className="text-slate-500">2.4 GB / 10 GB</span>
                                    </div>
                                    <Progress value={24} className="h-1.5 bg-white/5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content: Documents List */}
                    <div className="lg:col-span-2 space-y-4">
                        {filteredDocs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed">
                                <FileText className="size-16 mb-4 opacity-10" />
                                <p className="font-bold">No documents found matching your search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredDocs.map((doc) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={doc.id}
                                        className="group p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "p-3 rounded-2xl",
                                                doc.type === 'prescription' ? 'bg-emerald-500/10 text-emerald-400' :
                                                doc.type === 'report' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-purple-500/10 text-purple-400'
                                            )}>
                                                {doc.type === 'prescription' ? <Pill className="size-6" /> : 
                                                 doc.type === 'report' ? <Stethoscope className="size-6" /> : 
                                                 <FileText className="size-6" />}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Eye className="size-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Download className="size-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><Trash2 className="size-4" /></button>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-lg mb-1 truncate">{doc.name}</h3>
                                        <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <Clock className="size-3" /> {doc.date}
                                        </div>

                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6">
                                            <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                                <Sparkles className="size-3" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">AI Summary</span>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                                {doc.isAnalyzing ? "Processing neural nodes..." : doc.summary}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {doc.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-[9px] py-0 bg-white/5 border-white/10 text-slate-400">{tag}</Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

import { Bot } from "lucide-react";
