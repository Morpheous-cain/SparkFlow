import Link from "next/link";
import { LayoutDashboard, Users, Smartphone, Car, Waves, Zap, ShieldCheck, Globe, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const views = [
    { 
      title: "Agent Desk", 
      desc: "High-speed intake and workflow routing control.", 
      href: "/agent", 
      icon: Smartphone,
      color: "from-blue-500 to-indigo-600",
      accent: "blue"
    },
    { 
      title: "Attendant PWA", 
      desc: "Real-time job card execution and task sync.", 
      href: "/attendant", 
      icon: Car,
      color: "from-indigo-600 to-violet-600",
      accent: "indigo"
    },
    { 
      title: "Owner HQ", 
      desc: "Global analytics and AI-driven predictive logic.", 
      href: "/manager", 
      icon: LayoutDashboard,
      color: "from-slate-800 to-slate-900",
      accent: "slate"
    },
    { 
      title: "Customer App", 
      desc: "On-demand booking and concierge tracking.", 
      href: "/customer", 
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      accent: "emerald"
    },
  ];

  return (
    <div className="relative min-h-screen mesh-bg overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Decorative Floating Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-16">
        <header className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/50 backdrop-blur-xl border border-white/50 px-6 py-2.5 rounded-full shadow-soft mb-4">
            <Zap className="size-4 text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 leading-none">Intelligence Protocol v4.2</span>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="size-20 bg-primary rounded-[2rem] shadow-2xl shadow-primary/40 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer group">
              <Waves className="size-10 text-white group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase">
              Spark<span className="text-primary text-glow">Flow</span><span className="text-slate-300">.</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-500 font-bold max-w-2xl mx-auto leading-tight">
            The futuristic ERP core for autonomous <br className="hidden md:block"/> car wash operations & multi-branch scale.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {views.map((view, i) => {
            const Icon = view.icon;
            return (
              <Link key={view.href} href={view.href} className="group transition-all duration-500">
                <Card className="h-full border-none glass hover:shadow-vibrant hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col rounded-[2.5rem]">
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${view.color}`} />
                  
                  <div className="p-10 space-y-8 flex-1">
                    <div className={`size-16 rounded-2xl bg-gradient-to-br ${view.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="size-8" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                        {view.title}
                      </h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tight leading-snug">
                        {view.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 pt-0">
                    <div className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-inner">
                      Initialize Link <ChevronRight className="size-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <footer className="pt-12 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Security Layer</span>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                <ShieldCheck className="size-4" /> SSL Encrypted
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Node Sync</span>
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <Globe className="size-4" /> Global CDN
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Kenya's Leading Autonomous ERP <br/>
              Powered by <span className="text-slate-900 italic">Safaricom Daraja & Twilio Mesh</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}