"use client";

import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LifeBuoy, 
  LogOut, 
  Waves,
  HandCoins,
  LineChart,
  ClipboardList,
  Wrench,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Staff", icon: Users },
  { title: "Services", icon: Wrench },
  { title: "Sales", icon: HandCoins },
  { title: "Inventory", icon: Package },
  { title: "Reports", icon: LineChart },
  { title: "Tasks", icon: ClipboardList },
];

const otherItems = [
  { title: "Settings", icon: Settings },
  { title: "Support", icon: LifeBuoy },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Waves className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold tracking-tight">VANTUS</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest">ERP Solution</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Main</SidebarGroupLabel>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  isActive={item.isActive}
                  className="h-11 rounded-xl px-3 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md transition-all hover:bg-accent"
                >
                  <item.icon className="size-5" />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                  {item.title !== "Dashboard" && <ChevronRight className="ml-auto size-4 opacity-40 group-data-[collapsible=icon]:hidden" />}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Others</SidebarGroupLabel>
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton className="h-11 rounded-xl px-3 transition-all hover:bg-accent">
                  <item.icon className="size-5" />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-all cursor-pointer">
          <Avatar className="size-10 border-2 border-primary/20 shadow-sm">
            <AvatarImage src="https://picsum.photos/seed/manager/100" />
            <AvatarFallback>EJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold truncate">Emma Johnson</span>
            <span className="text-xs text-muted-foreground truncate">manager@sparkflow.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden">
            <LogOut className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}