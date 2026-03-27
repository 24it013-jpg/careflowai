import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Shield, Sparkles, Activity, Heart, Zap } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'agent-id': string };
    }
  }
}

export default function VoiceAgent() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        return () => {
            // Cleanup script if needed, though usually fine to keep
            // document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#030014] text-white p-6 md:p-12 font-sans relative overflow-hidden selection:bg-blue-500/30">
            {/* Premium Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-lg shadow-blue-500/10">
                            <Mic className="size-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                AI Voice Agent
                            </h1>
                            <p className="text-slate-400 font-medium tracking-wide flex items-center gap-2 mt-1">
                                <Sparkles className="size-4 text-amber-400" />
                                Powered by ElevenLabs Conversational AI
                            </p>
                        </div>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Main Agent Area */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-8 premium-glass-panel rounded-[2rem] p-12 border border-white/10 relative overflow-hidden group min-h-[500px] flex flex-col items-center justify-center text-center"
                    >
                        {/* Animated background rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full border border-blue-500/10"
                                    animate={{ 
                                        width: [200, 600],
                                        height: [200, 600],
                                        opacity: [0.5, 0] 
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "linear" }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 space-y-8 max-w-md mx-auto">
                            <div className="size-40 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-white/10 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-3xl group-hover:border-blue-500/30 transition-all duration-500">
                                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse" />
                                <Mic className="size-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Your Health Companion is Online</h2>
                                <p className="text-slate-400 leading-relaxed">
                                    Experience a natural, fluid conversation with your personalized medical assistant. 
                                    Ask about symptoms, monitor vitals, or request health summaries via voice.
                                </p>
                            </div>

                            {/* ElevenLabs Widget Integration */}
                            <div className="pt-8">
                                <elevenlabs-convai agent-id="agent_9001kmr5tx86eexay24p7ew8mvp8"></elevenlabs-convai>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Capabilities */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="premium-glass-panel rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Shield className="size-5 text-emerald-400" />
                                Secure & Private
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                All voice interactions are processed through HIPAA-compliant AI models, ensuring your most sensitive health data remains private and protected.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="premium-glass-panel rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Zap className="size-5 text-blue-400" />
                                Real-Time Processing
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { icon: Activity, label: "Live Symptom Analysis", color: "text-blue-400" },
                                    { icon: Heart, label: "Heart Rate Insights", color: "text-rose-400" },
                                    { icon: Sparkles, label: "Personalized Wellness Plans", color: "text-amber-400" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                                        <item.icon className={`size-4 ${item.color}`} />
                                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl border border-blue-500/20 animate-pulse"
                        >
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">System Status</p>
                            <p className="text-xl font-black text-white">Neural Uplink Active</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
