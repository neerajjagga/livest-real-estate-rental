'use client';

import { usePathname } from "next/navigation";
import { Building, FileText, Home, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "../UserProvider";

export default function AppSidebar() {
    const pathname = usePathname();
    const { user }= useUser();
    const userType = user?.role;

    if(!user || !userType) return null;

    const navLinks = userType === "Manager" ? [
        {
            icon: Building,
            label: "Properties",
            href: '/managers/properties'
        },
        {
            icon: FileText,
            label: "Applications",
            href: '/managers/applications'
        },
        {
            icon: Settings,
            label: "Settings",
            href: '/settings'
        }
    ] : [
        {
            icon: FileText,
            label: "Applications",
            href: '/tenants/applications'
        },
        {
            icon: Home,
            label: "Residences",
            href: '/tenants/residences'
        },
        {
            icon: Settings,
            label: "Settings",
            href: '/settings'
        }
    ];

    return (
        <Sidebar className="">
            <SidebarContent className="pt-20">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {navLinks.map((item) => {
                                const isActive = pathname === item.href; 
                                return <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton className={`py-5 ${isActive ? "text-primary bg-secondary" : ""}`} asChild>
                                        <a href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}