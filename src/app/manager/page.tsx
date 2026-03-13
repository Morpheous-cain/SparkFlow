"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES, BAYS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Search,
  Bell,
  Sparkles,
  MoreVertical,
  Warehouse,
  ChevronRight,
  AlertTriangle,
  PhoneCall,
  Star,
  Zap,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getManagerOperationalInsights, ManagerOperationalInsightsOutput } from "@/ai/flows/manager-operational-insights-flow";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PIE_DATA = [
  { name: 'Wash', value: 400, color: '#3b82f6' },
  { name: 'Detailing', value: 300, color: '#0ea5e9' },
  { name: 'Tinting', value: 200, color: '#06b6d4' },
  { name: 'Ceramic', value: 100, color: '#14b8a6' },
];

export default function ManagerDashboard() {
  const [aiInsights, setAiInsights] = useState<ManagerOperationalInsightsOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAiInsights();
  }, []);

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const data = await getManagerOperationalInsights({
        staffPerformanceData: JSON.stringify(STAFF),
        serviceDurationData: JSON.stringify(SERVICES.map(s => ({ serviceName: s.name, avgDurationMinutes: s.duration, totalServices: Math.floor(Math.random() * 50) + 10 }))),
        transactionPatternData: JSON.stringify(MOCK_TRANSACTIONS)
      });
      setAiInsights(data);
    } catch (err) {
      // Error handled centrally
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 md:gap-8 bg-[#f1f5f9]">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Emma Johnson</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Operational Lead • SparkFlow HQ</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search reports..." className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm font-bold focus-visible:ring-primary/20" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white shadow-sm size-12 hover:bg-slate-50 relative">
              <Bell className="size-5 text-slate-600" />
              <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Button 
              onClick={fetchAiInsights} 
              className="flex-1 sm:flex-none gap-2 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/10 h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest transition-all"
              disabled={loadingAi}
            >
              <Sparkles className="size-4 text-primary" /> {loadingAi ? "Analyzing..." : "AI"}
            </Button>
          </div>
        </div>
      </header>

      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <Card className="border-none shadow-2xl bg-gradient-to-br from-red-500 to-red-600 text-white rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 md:gap-8 text-center md:text-left flex-col md:flex-row">
              <div className="size-20 bg-white/20 backdrop-blur-xl text-white rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/20 animate-pulse">
                <AlertTriangle className="size-10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Badge className="bg-white text-red-600 border-none font-black text-[10px] uppercase px-4 py-1">URGENT ACTION</Badge>
                  <span className="text-[10px] font-black text-red-100 uppercase tracking-widest">Service Recovery Protocol</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tighter">Low Rating: KDC 123A</h2>
                <p className="text-red-50/80 font-bold text-sm md:text-lg">Brian Wilson • Detailing • Rating: 2/5 stars</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-14 md:h-16 rounded-2xl px-8 border-white/30 bg-white/10 text-white hover:bg-white hover:text-red-600 font-black uppercase text-xs tracking-widest backdrop-blur-md transition-all">
                Read Feedback
              </Button>
              <Button className="w-full sm:w-auto h-14 md:h-16 rounded-2xl px-10 bg-white text-red-600 hover:bg-red-50 font-black uppercase text-xs tracking-widest gap-2 shadow-2xl transition-all active:scale-95">
                <PhoneCall className="size-5" /> Call Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { title: "Avg Rating", value: "4.82", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", shadow: "shadow-amber-500/20" },
          { title: "Subscriptions", value: "840K", change: "+14%", icon: Ticket, color: "text-primary", bg: "bg-primary/10", shadow: "shadow-primary/20" },
          { title: "Daily Revenue", value: "23.8K", change: "+108%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", shadow: "shadow-emerald-500/20" },
          { title: "Bay Occupancy", value: "66.7%", change: "Optimal", icon: Warehouse, color: "text-indigo-500", bg: "bg-indigo-500/10", shadow: "shadow-indigo-500/20" },
        ].map((metric, i) => (
          <Card key={i} className={cn("border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white")}>
             <div className={cn("h-2 w-full", metric.color.replace('text', 'bg'))} />
            <CardContent className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div className={cn("size-14 rounded-2xl flex items-center justify-center", metric.bg, metric.color, "shadow-inner")}>
                  <metric.icon className="size-7" />
                </div>
                <Button variant="ghost" size="icon" className="size-10 rounded-full hover:bg-slate-50"><MoreVertical className="size-5 text-slate-300" /></Button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.title}</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn("border-none px-3 py-1 rounded-full text-[10px] font-black", metric.color.replace('text', 'bg'), "text-white")}>
                    {metric.change}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Growth vs PW</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Link href="/manager/subscriptions" className="lg:col-span-1 group">
          <Card className="border-none shadow-2xl rounded-[3rem] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 md:p-12 h-full relative overflow-hidden group-hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-white/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-10">
              <div>
                <div className="size-16 md:size-20 bg-white/20 rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <Ticket className="size-8 md:size-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Loyalty Engine</h3>
                <p className="text-indigo-100/80 text-lg font-bold leading-relaxed max-w-[280px]">Automate recurring revenue with tiered memberships.</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3].map((_, i) => (
                    <div key={i} className="size-12 md:size-14 rounded-full border-4 border-indigo-700 bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm md:text-lg text-white shadow-xl">
                      {i === 0 ? "S" : i === 1 ? "G" : "P"}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-indigo-600 px-6 py-3 rounded-full shadow-2xl group-hover:px-8 transition-all">
                  Manage Tiers <ChevronRight className="size-4" />
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
          <div className="flex justify-between items-center mb-10 md:mb-12">
            <div className="flex items-center gap-4">
              <div className="size-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                 <Zap className="size-7" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Operational Job Mix</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time service distribution</p>
              </div>
            </div>
            <Badge className="bg-slate-100 text-slate-500 border-none px-4 py-2 font-black uppercase text-[10px] tracking-widest rounded-xl">Network-Wide Analysis</Badge>
          </div>
          <div className="h-[280px] md:h-[350px] flex items-center justify-center relative">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', fontWeight: 'bold', padding: '1rem' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center justify-center bg-white size-32 rounded-full shadow-2xl border-4 border-slate-50">
              <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">1.4K</span>
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Jobs</span>
            </div>
          </div>
        </Card>
      </div>

      {aiInsights && (
        <Card className="border-none shadow-2xl rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden p-8 md:p-14 relative group">
          <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 p-24 -ml-24 -mb-24 bg-emerald-500/10 rounded-full blur-[100px]" />
          
          <CardHeader className="p-0 mb-10 md:mb-14 flex flex-row items-center gap-6 md:gap-8 space-y-0 relative z-10">
            <div className="size-20 md:size-24 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="size-10 md:size-12" />
            </div>
            <div>
              <CardTitle className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-2">AI Predictive Core</CardTitle>
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase px-4 py-1">ANALYSIS LIVE</Badge>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Quantum Strategy Engine v4.2</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-10 md:space-y-16 relative z-10">
            <div className="p-8 md:p-12 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-inner">
               <p className="text-2xl md:text-3xl leading-snug text-white/95 font-black tracking-tight italic">"{aiInsights.overallSummary}"</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
              <div className="space-y-6 md:space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                  <div className="h-0.5 w-10 bg-primary" />
                  DETECTED ANOMALIES
                </h4>
                <ul className="space-y-4 md:space-y-6">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm md:text-base bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group/item cursor-default">
                      <Zap className="size-6 text-amber-400 shrink-0 group-hover/item:scale-125 transition-transform" />
                      <span className="font-bold text-slate-200 leading-relaxed">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6 md:space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-3">
                  <div className="h-0.5 w-10 bg-emerald-400" />
                  STRATEGIC PIVOTS
                </h4>
                <ul className="space-y-4 md:space-y-6">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm md:text-base bg-emerald-400/5 p-6 rounded-[2rem] border border-emerald-400/10 hover:bg-emerald-400/10 hover:border-emerald-400/20 transition-all duration-300 group/item cursor-default">
                      <div className="size-3 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_20px_#34d399] mt-1.5 group-hover/item:scale-150 transition-transform" />
                      <span className="font-bold text-slate-100 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Button className="w-full h-16 md:h-20 bg-white text-slate-900 hover:bg-blue-50 rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.3em] shadow-[0_25px_60px_-15px_rgba(255,255,255,0.2)] group-hover:translate-y-[-4px] transition-all">
               Deploy Consolidated Strategy
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}
