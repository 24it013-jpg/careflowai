import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-400 hover:text-blue-400 hover:bg-white/5 rounded-full">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white shadow-xl rounded-xl">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer focus:bg-white/10 focus:text-blue-400">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer focus:bg-white/10 focus:text-blue-400">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer focus:bg-white/10 focus:text-blue-400">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
