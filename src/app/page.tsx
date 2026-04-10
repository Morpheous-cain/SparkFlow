'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LayoutDashboard, Users, Smartphone, Car, Waves, Zap, ShieldCheck, Globe, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (res.ok) {
          // ✅ Logged in → go straight to manager
          router.replace('/manager')
        } else {
          // ❌ Not logged in → go to signin
          router.replace('/signin')
        }
      } catch {
        router.replace('/signin')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // ⏳ Prevent UI flash
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Initializing SparkFlow...
      </div>
    )
  }

  const views = [
    { 
      title: "Agent Desk", 
      desc: "High-speed intake and workflow routing control.", 
      href: "/agent", 
      icon: Smartphone,
      color: "from-blue-500 to-indigo-600",
    },
    { 
      title: "Attendant PWA", 
      desc: "Real-time job card execution and task sync.", 
      href: "/attendant", 
      icon: Car,
      color: "from-indigo-600 to-violet-600",
    },
    { 
      title: "Owner HQ", 
      desc: "Global analytics and AI-driven predictive logic.", 
      href: "/manager", 
      icon: LayoutDashboard,
      color: "from-slate-800 to-slate-900",
    },
    { 
      title: "Customer App", 
      desc: "On-demand booking and concierge tracking.", 
      href: "/customer", 
      icon: Users,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="relative min-h-screen mesh-bg overflow-hidden flex flex-col items-center justify-center p-6">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-16">
        
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-xl border px-6 py-2.5 rounded-full">
            <Zap className="size-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Intelligence Protocol v4.2
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="size-20 bg-primary rounded-[2rem] flex items-center justify-center">
              <Waves className="size-10 text-white" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase">
              Spark<span className="text-primary">Flow</span>
            </h1>
          </div>

          <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">
            The futuristic ERP core for autonomous car wash operations.
          </p>
        </header>

        {/* 👇 Keep your UI exactly as-is */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <Link key={view.href} href={view.href}>
                <Card className="p-8 hover:shadow-lg transition">
                  <Icon className="mb-4" />
                  <h3 className="font-bold">{view.title}</h3>
                  <p className="text-sm text-muted-foreground">{view.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        <footer className="pt-12 border-t flex justify-between text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-4" /> SSL
            </span>
            <span className="flex items-center gap-1">
              <Globe className="size-4" /> CDN
            </span>
          </div>

          <p>Powered by SparkFlow ERP</p>
        </footer>
      </div>
    </div>
  );
}