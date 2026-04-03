
import {
    Calendar,
    Settings,
    Activity,
    Box,
    BrainCircuit,
    CreditCard,
    FileText,
    LifeBuoy,
    Sparkles,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar"

// CareFlow Menu Items
const items = [
    {
        title: "Clinical Control",
        url: "#clinical-control",
        icon: Box, // Placeholder for 3D/Anatomy
    },
    {
        title: "Medical Intelligence",
        url: "#medical-intelligence",
        icon: BrainCircuit,
    },
    {
        title: "Care Command",
        url: "#care-command",
        icon: Calendar,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Sparkles className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-foreground tracking-wide">MedicalMagic</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">Health OS</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Cockpit Controls</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url} className="group-data-[collapsible=icon]:!px-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                                            <item.icon className="size-4 group-hover:drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Emergency Protocol"
                            className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 border border-destructive/20 hover:border-destructive hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        >
                            <a href="#">
                                <LifeBuoy className="size-4 animate-pulse" />
                                <span className="font-bold tracking-wide">EMERGENCY</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="sm" className="text-muted-foreground hover:text-foreground">
                            <Settings className="size-4" />
                            <span>System Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
