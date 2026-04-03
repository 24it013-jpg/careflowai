import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Camera, Image as ImageIcon, Loader2, Bot, User, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { callOpenRouter, callOpenRouterVision } from "@/lib/ai/openrouter";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    image?: string;
    analysis?: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}

const FOOD_ANALYSIS_SYSTEM_PROMPT = `
You are an expert AI Nutritionist. Your task is to analyze food descriptions or images provided by the user.
You MUST provide a structured response in JSON format (wrapped in code blocks if necessary, but I will parse it) containing:
1. "content": A friendly natural language response explaining the breakdown of the meal.
2. "analysis": An object with "calories", "protein", "carbs", and "fats" (numeric values only).

Example Response Format:
{
  "content": "I've analyzed your meal: 1 Roti (70 kcal) and 100g Rice (130 kcal).",
  "analysis": { "calories": 200, "protein": 5, "carbs": 43, "fats": 1 }
}

If you are unsure about a specific food, use your best clinical estimate. If the user is vague, ask clarifying questions while providing an initial estimate.
Always be encouraging and professional.
`;

export function FoodAnalysisChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your AI Nutritionist. You can tell me what you ate, or upload a photo of your meal, and I'll analyze the calories and macros for you using real-time AI models." }
    ]);
    const [input, setInput] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const analyzeFood = async (text: string, image?: string) => {
        setIsAnalyzing(true);
        
        try {
            let aiResponse: string;
            
            if (image) {
                // Extract base64 without prefix if present
                const base64 = image.includes(',') ? image.split(',')[1] : image;
                aiResponse = await callOpenRouterVision(
                    "Analyze this food image and provide nutritional data in the requested JSON format.",
                    base64,
                    'image/jpeg',
                    { systemPrompt: FOOD_ANALYSIS_SYSTEM_PROMPT }
                );
            } else {
                aiResponse = await callOpenRouter(
                    text,
                    FOOD_ANALYSIS_SYSTEM_PROMPT,
                    messages.slice(-5) // Send last 5 messages for context
                );
            }

            // Parse the AI response (it might be wrapped in markdown code blocks)
            let parsed;
            try {
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
                parsed = JSON.parse(jsonStr);
            } catch (e) {
                // Fallback if parsing fails
                parsed = {
                    content: aiResponse,
                    analysis: null
                };
            }

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: parsed.content || aiResponse,
                analysis: parsed.analysis
            }]);
        } catch (error) {
            console.error("AI Analysis Error:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm sorry, I encountered an error while analyzing your food. Please try again or specify the quantities more clearly." 
            }]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        analyzeFood(userMsg);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target?.result as string;
                setMessages(prev => [...prev, { role: 'user', content: "Analyzed this meal photo", image: imgData }]);
                analyzeFood("Photo analysis", imgData);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                        <Bot className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Food Analytics AI</h4>
                        <div className="flex items-center gap-1">
                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Stream Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
                    >
                        <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'assistant' ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400")}>
                            {msg.role === 'assistant' ? <Bot className="size-4" /> : <User className="size-4" />}
                        </div>
                        <div className="space-y-2">
                            <div className={cn("p-4 rounded-2xl text-sm leading-relaxed", msg.role === 'assistant' ? "bg-white/5 border border-white/5 text-slate-200" : "bg-blue-500 text-white")}>
                                {msg.image && (
                                    <img src={msg.image} alt="Food" className="w-full h-32 object-cover rounded-xl mb-3 border border-white/10" />
                                )}
                                {msg.content}
                            </div>
                            {msg.analysis && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid grid-cols-4 gap-2 text-center"
                                >
                                    <div>
                                        <p className="text-[8px] text-emerald-400/60 uppercase font-black">Cals</p>
                                        <p className="text-xs font-bold text-emerald-400">{msg.analysis.calories}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-emerald-400/60 uppercase font-black">Prot</p>
                                        <p className="text-xs font-bold text-emerald-400">{msg.analysis.protein}g</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-emerald-400/60 uppercase font-black">Carb</p>
                                        <p className="text-xs font-bold text-emerald-400">{msg.analysis.carbs}g</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-emerald-400/60 uppercase font-black">Fat</p>
                                        <p className="text-xs font-bold text-emerald-400">{msg.analysis.fats}g</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isAnalyzing && (
                    <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                            <Loader2 className="size-4 animate-spin" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 flex items-center gap-2">
                            <Sparkles className="size-3 text-orange-400" /> AI is calculating nutritional density...
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                    >
                        <Camera className="size-5" />
                    </Button>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="What did you eat?"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 px-2"
                    />
                    <Button 
                        size="icon" 
                        onClick={handleSend}
                        className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
