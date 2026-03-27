import { motion } from "framer-motion";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateStrip } from "@/components/dashboard/medical-magic/date-strip";

export function WelcomeHeader() {
    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between mb-8">
            <div className="flex-1 w-full xl:w-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}, <span className="text-blue-400">Alex</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Here's your daily health overview
                    </p>
                </motion.div>

                <div className="mt-6">
                    <DateStrip />
                </div>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto justify-end">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for tools, doctors..."
                        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white w-64 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-400"
                    />
                </div>
                <Button variant="outline" size="icon" className="rounded-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5 relative bg-transparent">
                    <Bell className="size-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
                </Button>
            </div>
        </div>
    );
}
