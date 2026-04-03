import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FEATURES } from "@/components/dashboard/medical-magic/medical-apps-data";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Filter to just the "App" style tools
const TOOLS = FEATURES.filter(f =>
    ["vision-decoder", "med-check", "open-health", "scribe", "care-locator", "telemedicine", "refill-predictor"].includes(f.id)
);

export function ToolsWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[300px]"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Quick Tools</h3>
                    <p className="text-sm text-slate-400">Access your AI medical suite</p>
                </div>
                <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm">
                    View All <ChevronRight className="ml-1 size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.id}
                        to={tool.link}
                        className="group flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all"
                    >
                        <div className={cn("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm", tool.color)}>
                            <tool.icon className="size-6 text-white" />
                        </div>
                        <div className="text-center">
                            <span className="block text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                {tool.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
