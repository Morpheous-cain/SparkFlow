"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, UserCog, Car, Smartphone } from "lucide-react";

const roles = [
  { name: "Agent Portal", href: "/agent", icon: Smartphone },
  { name: "Attendant PWA", href: "/attendant", icon: Car },
  { name: "Manager Dashboard", href: "/manager", icon: LayoutDashboard },
  { name: "Customer Portal", href: "/customer", icon: Users },
];

export function RoleSwitcher() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-border shadow-2xl rounded-full px-4 py-2 flex gap-2 items-center z-50">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = pathname.startsWith(role.href);
        return (
          <Link
            key={role.href}
            href={role.href}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{role.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}