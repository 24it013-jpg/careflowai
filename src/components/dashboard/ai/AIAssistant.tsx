"use client";

import { useRef, useEffect, useState } from "react";
// Remove useChat and use direct OpenAI call for Vite environment
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Send, Bot, Loader2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
}
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { callGemini } from "@/lib/ai/gemini";

interface AIAssistantProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialMessage?: string;
}

export function AIAssistant({ open, onOpenChange, initialMessage }: AIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
        if (e) e.preventDefault();
        const content = customInput || input;
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const systemPrompt = "You are CAREflow AI, a helpful medical health assistant. You help people understand their health data, reports, and medications. Be professional, empathetic, and clear. Always include a disclaimer that you are an AI and not a doctor.";

            const chatHistory = messages.map(m => ({
                role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
                parts: [{ text: m.content }]
            }));

            const response = await callGemini(content, systemPrompt, chatHistory);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error("AI Error:", err);
            setError("I'm having trouble connecting right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (initialMessage && open && messages.length === 0) {
            handleSubmit(undefined, initialMessage);
        }
    }, [initialMessage, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l border-slate-200 shadow-2xl">
                <SheetHeader className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Sparkles className="size-6" />
                        </div>
                        <div>
                            <SheetTitle className="text-slate-900 font-bold">CAREflow AI</SheetTitle>
                            <SheetDescription className="text-xs text-slate-500">Your health assistant is online</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4 pb-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                                <div className="p-4 bg-blue-50 rounded-full">
                                    <Bot className="size-8 text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900">How can I help you today?</p>
                                    <p className="text-sm text-slate-500 max-w-[250px]">I can analyze reports, explain medications, or answer health questions.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs justify-start hover:border-blue-500 hover:bg-blue-50"
                                        onClick={() => setInput("Explain my latest blood test results")}
                                    >
                                        "Explain my latest blood test results"
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs justify-start hover:border-blue-500 hover:bg-blue-50"
                                        onClick={() => setInput("What are the side effects of Lisinopril?")}
                                    >
                                        "What are the side effects of Lisinopril?"
                                    </Button>
                                </div>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-3 text-sm",
                                        message.role === "user" ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
                                    )}
                                >
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className={message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}>
                                            {message.role === "user" ? "YOU" : <Bot className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={cn(
                                        "rounded-2xl px-4 py-2 max-w-[80%] leading-relaxed",
                                        message.role === "user"
                                            ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100"
                                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                                    )}>
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                            <div className="flex gap-3 text-sm">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-2 border border-slate-200 shadow-sm">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-xs font-medium">Thinking...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center">
                                Something went wrong. Please try again or check your connection.
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                        <Input
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={handleInputChange}
                            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl pr-10"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg shrink-0 shadow-lg shadow-blue-200"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="size-4" />
                        </Button>
                    </form>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                        AI can make mistakes. Verify important medical information.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
