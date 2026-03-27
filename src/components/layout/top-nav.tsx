import { Settings, User, MessageSquare, Sparkles } from "lucide-react";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "motion/react";
import { useAIChat } from "@/hooks/use-ai-chat";

import { ModeToggle } from "@/components/ui/mode-toggle";

export function TopNav() {
    const navigate = useNavigate();
    const { openChat } = useAIChat();

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 h-20 flex items-center bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm"
        >
            <div className="max-w-[1800px] w-full mx-auto flex items-center justify-between">

                {/* 1. Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="relative size-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <Sparkles className="size-8 text-blue-400 relative z-10" />
                        </motion.div>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">CAREflow AI</span>
                </div>

                {/* 2. Right Actions */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex gap-2 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-full"
                        onClick={() => openChat()}
                    >
                        <MessageSquare className="size-4" />
                        <span>AI Assistant</span>
                    </Button>

                    <div className="h-6 w-px bg-white/10 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <NotificationBell />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-white/10 p-0 overflow-hidden ring-offset-black transition-all hover:ring-2 hover:ring-blue-500 hover:ring-offset-2">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium">DR</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-950 border-white/10 text-white shadow-xl rounded-xl p-2" align="end">
                                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">My Account</DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-lg focus:bg-white/10 focus:text-blue-400 cursor-pointer p-2">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg focus:bg-white/10 focus:text-blue-400 cursor-pointer p-2" onClick={() => navigate('/dashboard/settings/integrations')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10 my-2" />
                                <DropdownMenuItem className="rounded-lg focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer p-2 text-rose-500">
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </div>
        </motion.header>
    );
}
