
"use client";

import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Waves,
  HandCoins,
  LineChart,
  ClipboardList,
  Wrench,
  ChevronRight,
  BarChart3,
  Warehouse,
  Truck,
  Ticket,
  Building2,
  Banknote,
  Send,
  CreditCard
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
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/manager" },
  { title: "Branches", icon: Building2, url: "/manager/branches" },
  { title: "Logistics", icon: Truck, url: "/manager/logistics" },
  { title: "Marketing", icon: Send, url: "/manager/marketing" },
  { title: "Accounts", icon: Banknote, url: "/manager/accounts" },
  { title: "Payroll", icon: CreditCard, url: "/manager/payroll" },
  { title: "Subscriptions", icon: Ticket, url: "/manager/subscriptions" },
  { title: "Analytics", icon: BarChart3, url: "/manager/analytics" },
  { title: "Bays", icon: Warehouse, url: "/manager/bays" },
  { title: "Staff", icon: Users, url: "/manager/staff" },
  { title: "Services", icon: Wrench, url: "/manager/services" },
  { title: "Sales", icon: HandCoins, url: "/manager/sales" },
  { title: "Inventory", icon: Package, url: "/manager/inventory" },
  { title: "Reports", icon: LineChart, url: "/manager/reports" },
  { title: "Tasks", icon: ClipboardList, url: "/manager/tasks" },
];

const otherItems = [
  { title: "Settings", icon: Settings, url: "/manager/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100">
      <SidebarHeader className="p-8">
        <Link href="/manager" className="flex items-center gap-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <Waves className="size-7" />
          </div>
          <div className="flex flex-col gap-0 group-data-[collapsible=icon]:hidden">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">SPARKFLOW</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.1em]">ERP SOLUTION</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-6 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-4 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300">MAIN</SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === item.url}
                  className="h-14 rounded-2xl px-5 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-xl data-[active=true]:shadow-primary/30 transition-all duration-300 hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-5" />
                    <span className="font-bold text-sm group-data-[collapsible=icon]:hidden ml-2">{item.title}</span>
                    {item.title !== "Dashboard" && <ChevronRight className="ml-auto size-4 opacity-20 group-data-[collapsible=icon]:hidden" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="px-4 mb-4 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300">OTHERS</SidebarGroupLabel>
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-14 rounded-2xl px-5 transition-all hover:bg-slate-50" isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon className="size-5 text-slate-400" />
                    <span className="font-bold text-sm text-slate-500 group-data-[collapsible=icon]:hidden ml-2">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group/profile">
          <Avatar className="size-11 border-2 border-white shadow-md">
            <AvatarImage src="https://picsum.photos/seed/manager/100" />
            <AvatarFallback>EJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold truncate text-slate-900">Emma Johnson</span>
            <span className="text-[10px] text-slate-400 truncate font-semibold uppercase tracking-tight">manager@sparkflow.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden opacity-0 group-hover/profile:opacity-100 transition-opacity">
            <LogOut className="size-4 text-slate-400" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
