import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Folder, FileText, FileImage, FileBarChart,
    Lock, Upload, Search, MoreVertical,
    Download, Eye, ArrowRight, ShieldCheck,
    FileJson, CheckCircle2, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";
import { processDocument } from "@/lib/ai/document-processor";
import { mapToFHIRDocumentReference, exportToJSON } from "@/lib/fhir/fhir-mapper";
import { toast } from "sonner";

interface FileItem {
    id: string;
    name: string;
    type: "pdf" | "image" | "doc" | "dicom";
    date: string;
    size: string;
    summary?: string;
    extractedText?: string;
    fhirResource?: any;
    provider?: string;
    previewUrl?: string;
}

interface FolderItem {
    id: string;
    name: string;
    icon: React.ReactElement<{ className?: string }>;
    color: string;
    locked: boolean;
    files: FileItem[];
}

const MOCK_FOLDERS: FolderItem[] = [
    {
        id: "labs",
        name: "Lab Results",
        icon: <FileBarChart className="h-6 w-6" />,
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        locked: false,
        files: [
            { id: "l1", name: "Comprehensive Metabolic Panel.pdf", type: "pdf", date: "2024-02-10", size: "2.4 MB" },
            { id: "l2", name: "Lipid Profile.pdf", type: "pdf", date: "2023-11-05", size: "1.8 MB" },
        ]
    },
    {
        id: "imaging",
        name: "Imaging (DICOM)",
        icon: <FileImage className="h-6 w-6" />,
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        locked: false,
        files: [
            { id: "i1", name: "MRI_Cervical_Spine.dcm", type: "dicom", date: "2024-01-15", size: "450 MB" },
            { id: "i2", name: "Chest_XRay_PA.jpg", type: "image", date: "2023-08-22", size: "12 MB" },
        ]
    },
    {
        id: "scripts",
        name: "Prescriptions",
        icon: <FileText className="h-6 w-6" />,
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        locked: false,
        files: [
            { id: "p1", name: "Amoxicillin_Rx.pdf", type: "pdf", date: "2024-02-01", size: "0.5 MB" },
        ]
    },
    {
        id: "genetic",
        name: "Genetic Data",
        icon: <Lock className="h-6 w-6" />,
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        locked: true,
        files: [
            { id: "g1", name: "Genome_Sequencing_Raw.zip", type: "doc", date: "2023-12-01", size: "2.1 GB" },
        ]
    }
];

export default function UnifiedHealthVault() {
    const [folders, setFolders] = useState<FolderItem[]>(MOCK_FOLDERS);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [unlockedFolders, setUnlockedFolders] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeFolder = folders.find(f => f.id === activeFolderId);
    const allFiles = folders.flatMap(f => f.files);

    const globalSearchResults = allFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.extractedText?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFiles = activeFolder?.files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.extractedText?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleFolderClick = (folder: FolderItem) => {
        if (folder.locked && !unlockedFolders.includes(folder.id)) {
            const isConfirmed = window.confirm("Security Check: Provide Biometric/Pin to unlock generic data.");
            if (isConfirmed) {
                setUnlockedFolders([...unlockedFolders, folder.id]);
                setActiveFolderId(folder.id);
                confetti({
                    particleCount: 50,
                    spread: 50,
                    origin: { y: 0.5 },
                    colors: ['#ef4444', '#f59e0b']
                });
            }
        } else {
            setActiveFolderId(folder.id);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) await processFile(file);
    };

    const processFile = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(10);

        try {
            const interval = setInterval(() => {
                setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
            }, 300);

            const processedDoc = await processDocument(file);
            const fhirRecord = mapToFHIRDocumentReference(processedDoc);

            clearInterval(interval);
            setUploadProgress(100);

            const newFile: FileItem = {
                id: processedDoc.id,
                name: processedDoc.name,
                type: file.type.includes('pdf') ? 'pdf' : 'image',
                date: processedDoc.date || new Date().toISOString().split('T')[0],
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                summary: processedDoc.summary,
                extractedText: processedDoc.extractedText,
                fhirResource: fhirRecord,
                provider: processedDoc.provider,
                previewUrl: URL.createObjectURL(file)
            };

            setFolders(prev => prev.map(folder => {
                if (folder.id === processedDoc.type) {
                    return { ...folder, files: [newFile, ...folder.files] };
                }
                if (processedDoc.type === 'other' && folder.id === 'scripts') {
                    return { ...folder, files: [newFile, ...folder.files] };
                }
                return folder;
            }));

            toast.success(`Successfully processed ${file.name}`, {
                description: `Auto-categorized as ${processedDoc.type}`,
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            });

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (error) {
            console.error(error);
            toast.error("Processing Failed", { description: "AI was unable to analyze this document." });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleExportFHIR = (file: FileItem) => {
        if (!file.fhirResource) return;
        const blob = new Blob([exportToJSON(file.fhirResource)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.split('.')[0]}_fhir.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.info("FHIR Export Complete");
    };

    const handleBulkExportFHIR = () => {
        if (!activeFolder) return;
        const resources = activeFolder.files
            .filter(f => f.fhirResource)
            .map(f => f.fhirResource);

        if (resources.length === 0) {
            toast.error("No FHIR-ready documents in this folder");
            return;
        }

        const bundle = {
            resourceType: "Bundle",
            type: "collection",
            entry: resources.map(r => ({ resource: r }))
        };

        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeFolder.name}_fhir_bundle.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${resources.length} FHIR resources`);
    };

    return (
        <div
            className="min-h-screen bg-[#050810] text-white/90 p-6 md:p-12 font-sans relative overflow-hidden selection:bg-cyan-500/30"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-purple-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-black/80 border-2 border-dashed border-purple-500 rounded-3xl p-12 text-center">
                            <Upload className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-2xl font-bold text-white">Drop Medical Records Here</h2>
                            <p className="text-white/60">AI will auto-categorize and analyze your files</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px]" style={{background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute bottom-[5%] left-[5%] w-[550px] h-[550px] rounded-full blur-[120px]" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
                <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', mixBlendMode: 'screen'}} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
                            <span className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-sm">
                                <ShieldCheck className="size-6" />
                            </span>
                            Unified Health Vault
                        </h1>
                        <p className="text-white/50 text-lg font-light max-w-2xl">Secure, decentralized storage for your complete medical history.</p>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                        />
                        <Button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:via-violet-500 hover:to-purple-600 text-white gap-2 rounded-2xl px-8 h-14 text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all hover:scale-105 active:scale-95 border-0"
                        >
                            <Upload className="h-5 w-5" />
                            {isUploading ? "AI Analyzing..." : "Upload Record"}
                        </Button>
                    </div>
                </motion.div>

                {/* Upload Progress */}
                <AnimatePresence>
                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden mb-8 backdrop-blur-sm relative"
                        >
                            <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
                            <div className="flex justify-between text-sm mb-3 text-white/70 relative z-10">
                                <span className="flex items-center gap-2">
                                    <Lock className="h-3 w-3 text-purple-400" />
                                    Encrypting file with AES-256...
                                </span>
                                <span className="font-mono text-purple-400">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-1.5 bg-white/10 [&>div]:bg-purple-500 relative z-10" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Folders List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="relative mb-6 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:border-purple-500/50 h-12 transition-all hover:bg-white/10"
                            />
                        </div>

                        <div className="space-y-3">
                            {folders.map((folder, idx) => (
                                <motion.div
                                    key={folder.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleFolderClick(folder)}
                                    className={cn(
                                        "group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border relative overflow-hidden",
                                        activeFolderId === folder.id
                                            ? "premium-glass-panel border-purple-500/50 shadow-[0_0_25px_-5px_rgba(168,85,247,0.4)]"
                                            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/20"
                                    )}
                                >
                                    {activeFolderId === folder.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                                    )}
                                    <div className={cn("p-3 rounded-xl border backdrop-blur-sm transition-transform group-hover:scale-110", folder.color)}>
                                        {folder.locked && !unlockedFolders.includes(folder.id) ? (
                                            <Lock className="h-5 w-5" />
                                        ) : folder.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn("font-medium transition-colors", activeFolderId === folder.id ? "text-white" : "text-white/70 group-hover:text-white")}>
                                            {folder.name}
                                        </h3>
                                        <p className="text-xs text-white/30 font-light">
                                            {folder.files.length} files • {folder.files.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(1)} MB
                                        </p>
                                    </div>
                                    {folder.locked && !unlockedFolders.includes(folder.id) && (
                                        <Badge variant="outline" className="border-red-500/30 text-red-400 text-[10px] bg-red-500/10 px-1.5 py-0.5">
                                            LOCKED
                                        </Badge>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Files View */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeFolder ? (
                                <motion.div
                                    key={activeFolder.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="premium-glass-panel rounded-[2.5rem] p-8 min-h-[600px] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[80px]" />

                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("p-4 rounded-2xl border backdrop-blur-md", activeFolder.color)}>
                                                {React.cloneElement(activeFolder.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-light text-white">{activeFolder.name}</h2>
                                                <p className="text-white/40 text-sm mt-1">Secured Document Container</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleBulkExportFHIR}
                                                className="rounded-xl border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 bg-transparent h-10 px-4"
                                            >
                                                <FileJson className="h-4 w-4 mr-2" />
                                                Bulk FHIR Export
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 text-white/60">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {activeFolder.files.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-80 text-white/20">
                                            <Folder className="h-20 w-20 mb-4 opacity-20" />
                                            <p>No files in this folder.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4 relative z-10">
                                            {filteredFiles.map((file, i) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="group p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all flex items-start gap-5 cursor-pointer relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-500" />

                                                    <div className="p-3 bg-black/40 rounded-xl shrink-0 border border-white/5 relative z-10">
                                                        {file.type === 'image' || file.type === 'dicom' ? (
                                                            <FileImage className="h-6 w-6 text-purple-400" />
                                                        ) : (
                                                            <FileText className="h-6 w-6 text-blue-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 relative z-10">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="font-medium text-white truncate text-lg" title={file.name}>
                                                                {file.name}
                                                            </h4>
                                                            {file.fhirResource && (
                                                                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold tracking-wider">
                                                                    AI ENRICHED
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {file.summary && (
                                                            <p className="text-sm text-white/50 mt-1 line-clamp-2 italic font-light">
                                                                "{file.summary}"
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center text-xs text-white/30 mt-3 gap-x-4 gap-y-1 font-mono">
                                                            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">{file.type}</span>
                                                            <span>{file.date}</span>
                                                            <span>{file.size}</span>
                                                            {file.provider && (
                                                                <span className="flex items-center gap-1 text-white/40">
                                                                    <ShieldCheck className="size-3" />
                                                                    {file.provider}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedFile(file)}
                                                            className="h-10 w-10 rounded-xl hover:bg-purple-500/20 hover:text-purple-400 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </Button>
                                                        {file.fhirResource && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleExportFHIR(file)}
                                                                className="h-10 w-10 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                                                                title="Export as FHIR JSON"
                                                            >
                                                                <FileJson className="h-5 w-5" />
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                                                            <Download className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full min-h-[600px] border border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm"
                                >
                                    {searchQuery ? (
                                        <div className="w-full h-full p-8">
                                            <div className="flex items-center gap-3 mb-8">
                                                <Search className="h-6 w-6 text-purple-400" />
                                                <h2 className="text-2xl font-light text-white">Search Results for "{searchQuery}"</h2>
                                                <Badge variant="secondary" className="rounded-full bg-white/10 text-white/70">
                                                    {globalSearchResults.length} matches
                                                </Badge>
                                            </div>
                                            {globalSearchResults.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                                                    <Search className="h-16 w-16 mb-4 text-white/20" />
                                                    <p className="text-white/40">No matches found across all folders.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {globalSearchResults.map((file, i) => (
                                                        <motion.div
                                                            key={file.id}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            onClick={() => {
                                                                const folder = folders.find(f => f.files.some(fi => fi.id === file.id));
                                                                if (folder) setActiveFolderId(folder.id);
                                                            }}
                                                            className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 cursor-pointer transition-all flex items-center justify-between group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                                    <FileText className="h-5 w-5 text-blue-400" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-white">{file.name}</h4>
                                                                    <p className="text-xs text-white/30">found in {folders.find(f => f.files.some(fi => fi.id === file.id))?.name}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-purple-400 transition-colors" />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-32 w-32 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                                                <Folder className="h-16 w-16 text-white/20" />
                                            </div>
                                            <h3 className="text-2xl font-light text-white mb-2">Select a Secure Folder</h3>
                                            <p className="max-w-md text-center text-white/40 font-light">
                                                Select a category from the left to view encrypted medical records.
                                                Generic data may require biometric verification.
                                            </p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* File Detail Modal */}
                <AnimatePresence>
                    {selectedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-2xl text-purple-400">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-light text-white">{selectedFile.name}</h2>
                                            <div className="flex items-center gap-3 text-sm text-white/40 mt-1 font-mono">
                                                <span>{selectedFile.date}</span>
                                                <span>•</span>
                                                <span>{selectedFile.size}</span>
                                                {selectedFile.fhirResource && (
                                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        FHIR Ready
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedFile(null)}
                                        className="rounded-full hover:bg-white/10 text-white/60"
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10">
                                    {selectedFile.previewUrl && (
                                        <section className="mb-6">
                                            <div className="bg-black/50 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[300px]">
                                                {selectedFile.type === 'pdf' ? (
                                                    <iframe src={selectedFile.previewUrl} className="w-full h-[500px]" title="PDF Preview" />
                                                ) : (
                                                    <img src={selectedFile.previewUrl} alt="Preview" className="max-w-full max-h-[500px] object-contain" />
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {selectedFile.summary && (
                                        <section>
                                            <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-purple-400">
                                                <CheckCircle2 className="h-5 w-5" />
                                                AI Summary
                                            </h3>
                                            <div className="bg-purple-500/5 rounded-2xl p-6 text-white/80 leading-relaxed border border-purple-500/10 shadow-inner">
                                                {selectedFile.summary}
                                            </div>
                                        </section>
                                    )}

                                    {selectedFile.extractedText && (
                                        <section>
                                            <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-blue-400">
                                                <FileText className="h-5 w-5" />
                                                Extracted Text (OCR)
                                            </h3>
                                            <div className="bg-white/5 rounded-2xl p-6 text-sm font-mono text-white/70 leading-relaxed border border-white/10 whitespace-pre-wrap shadow-inner max-h-60 overflow-y-auto">
                                                {selectedFile.extractedText}
                                            </div>
                                        </section>
                                    )}

                                    {selectedFile.fhirResource && (
                                        <section>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-medium flex items-center gap-2 text-emerald-400">
                                                    <FileJson className="h-5 w-5" />
                                                    FHIR DocumentReference
                                                </h3>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleExportFHIR(selectedFile)}
                                                    className="rounded-xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
                                                >
                                                    Download FHIR JSON
                                                </Button>
                                            </div>
                                            <div className="bg-black/40 rounded-2xl p-6 text-[12px] font-mono text-emerald-400/90 overflow-x-auto border border-white/5 shadow-inner">
                                                <pre>{JSON.stringify(selectedFile.fhirResource, null, 2)}</pre>
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="p-6 border-t border-white/5 flex justify-end bg-white/5 relative z-10">
                                    <Button
                                        onClick={() => setSelectedFile(null)}
                                        className="bg-white text-black hover:bg-white/90 rounded-xl px-8 h-12 font-medium"
                                    >
                                        Close Viewer
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
