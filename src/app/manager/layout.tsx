import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Waves } from "lucide-react";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden pb-24 md:pb-0">
          <header className="flex h-16 items-center gap-4 border-b bg-white px-6 md:hidden sticky top-0 z-30">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                <Waves className="size-5" />
              </div>
              <span className="text-sm font-black tracking-tighter uppercase">SparkFlow</span>
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
