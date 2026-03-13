
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Car, Smartphone, Globe } from "lucide-react";

const roles = [
  { name: "Agent Portal", href: "/agent", icon: Smartphone },
  { name: "Attendant PWA", href: "/attendant", icon: Car },
  { name: "Manager Dashboard", href: "/manager", icon: LayoutDashboard },
  { name: "Customer Portal", href: "/customer", icon: Users },
  { name: "SaaS Admin", href: "/saas-admin", icon: Globe },
];

export function RoleSwitcher() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full px-2 py-2 flex gap-1 items-center z-50">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = pathname.startsWith(role.href);
        return (
          <Link
            key={role.href}
            href={role.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{role.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
