import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, 
    Share2, 
    Copy, 
    Check, 
    FileText, 
    Sparkles,
    Printer,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AIResponseCardProps {
    content: string;
    title?: string;
    source?: string;
    onDownload?: () => void;
    className?: string;
    isAnalyzing?: boolean;
    compact?: boolean;
}

export function AIResponseCard({ 
    content, 
    title = "AI Analysis Report", 
    source, 
    onDownload,
    className,
    isAnalyzing = false,
    compact = false
}: AIResponseCardProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: content,
                    url: window.location.href,
                });
                toast.success("Shared successfully");
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    toast.error("Failed to share");
                }
            }
        } else {
            handleCopy();
            toast.info("Share not supported. Content copied to clipboard instead.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadTxt = () => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Report downloaded as TXT");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:relative print:p-0",
                compact && "rounded-2xl border-none shadow-none bg-transparent",
                className
            )}
        >
            {/* Header */}
            {!compact && (
                <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/20">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                            {source && <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{source}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
                        >
                            {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleShare}
                            className="rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
                        >
                            <Share2 className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrint}
                            className="rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all"
                        >
                            <Printer className="size-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onDownload || handleDownloadTxt}
                            className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 gap-2 ml-2 shadow-lg shadow-purple-600/20"
                        >
                            <Download className="size-4" />
                            Download
                        </Button>
                    </div>
                </div>
            )}

            {/* Print-only Header */}
            <div className="hidden print:block mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold mb-2">CAREflow AI Report</h1>
                <h2 className="text-xl text-gray-600">{title}</h2>
                <p className="text-sm text-gray-400 mt-2">Generated on {new Date().toLocaleString()}</p>
            </div>

            {/* Content Area */}
            <div className={cn(
                "p-8 md:p-10",
                compact && "p-4"
            )}>
                {isAnalyzing ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="h-4 bg-white/5 rounded-full w-3/4" />
                        <div className="h-4 bg-white/5 rounded-full w-1/2" />
                        <div className="h-20 bg-white/5 rounded-2xl w-full" />
                        <div className="h-4 bg-white/5 rounded-full w-2/3" />
                    </div>
                ) : (
                    <article className={cn(
                        "prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-strong:text-purple-400 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-th:p-3 prose-td:p-3 print:prose-invert-0",
                        compact && "prose-sm"
                    )}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl mt-8 mb-4 flex items-center gap-2 border-l-4 border-purple-500 pl-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl mt-6 mb-3 font-semibold text-white/90" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg mt-4 mb-2 font-medium text-white/80" {...props} />,
                                p: ({node, ...props}) => <p className="text-slate-300 mb-4 text-base md:text-lg leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-2 mb-6" {...props} />,
                                li: ({node, ...props}) => (
                                    <li className="flex gap-3 text-slate-300">
                                        <span className="mt-2.5 size-1.5 rounded-full bg-purple-500 shrink-0" />
                                        <span>{props.children}</span>
                                    </li>
                                ),
                                table: ({node, ...props}) => (
                                    <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 bg-white/[0.02]">
                                        <table className="w-full text-left border-collapse" {...props} />
                                    </div>
                                ),
                                th: ({node, ...props}) => <th className="p-4 bg-white/5 text-white font-bold text-sm uppercase tracking-wider" {...props} />,
                                td: ({node, ...props}) => <td className="p-4 border-t border-white/5 text-slate-300 text-sm" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-white font-bold bg-white/5 px-1.5 py-0.5 rounded" {...props} />,
                                blockquote: ({node, ...props}) => (
                                    <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 p-6 rounded-r-2xl my-6 italic text-blue-200" {...props} />
                                )
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                )}
                
                {compact && (
                    <div className="mt-4 flex items-center gap-2 print:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-2 text-slate-500 hover:text-slate-900"
                        >
                            {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                            Copy
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownloadTxt}
                            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-2 text-slate-500 hover:text-slate-900"
                        >
                            <Download className="size-3" />
                            Save
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider gap-2 text-slate-500 hover:text-slate-900"
                        >
                            <Share2 className="size-3" />
                            Share
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer / Disclaimer */}
            {!compact && (
                <div className="px-8 py-6 bg-white/[0.02] border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 print:mt-12">
                    <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                        <Info className="size-3" />
                        AI-Generated Clinical Synthesis
                    </div>
                    <p className="text-[10px] text-white/20 italic max-w-md leading-tight text-right print:text-gray-400">
                        Disclaimer: This report is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
                    </p>
                </div>
            )}

            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-[10px] text-gray-400 border-t pt-4">
                Generated by CAREflow AI - Secure Health Analytics Platform
            </div>
        </motion.div>
    );
}
