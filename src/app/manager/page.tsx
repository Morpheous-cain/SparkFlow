"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES, BAYS, BRANCHES } from "@/lib/mock-data";
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
  Ticket,
  Building2,
  DollarSign,
  ArrowUpRight,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
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

const REVENUE_TREND = [
  { day: 'Mon', revenue: 18500, growth: 12 },
  { day: 'Tue', revenue: 22000, growth: 15 },
  { day: 'Wed', revenue: 19800, growth: 8 },
  { day: 'Thu', revenue: 25400, growth: 22 },
  { day: 'Fri', revenue: 31000, growth: 28 },
  { day: 'Sat', revenue: 42000, growth: 45 },
  { day: 'Sun', revenue: 38000, growth: 38 },
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
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Owner Command Center</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Emma Johnson • Operational Lead • SparkFlow HQ</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Global search..." className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm font-bold focus-visible:ring-primary/20" />
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
              <Sparkles className="size-4 text-primary" /> {loadingAi ? "Analyzing..." : "Sync AI"}
            </Button>
          </div>
        </div>
      </header>

      {/* Network Alert - Immediate Action Required */}
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
                <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tighter">Low Rating Alert: KDC 123A</h2>
                <p className="text-red-50/80 font-bold text-sm md:text-lg">Westlands Branch • Brian Wilson • Rating: 2/5 stars</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Button className="w-full sm:w-auto h-14 md:h-16 rounded-2xl px-10 bg-white text-red-600 hover:bg-red-50 font-black uppercase text-xs tracking-widest gap-2 shadow-2xl transition-all active:scale-95">
                <PhoneCall className="size-5" /> Call Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vital Signs - High Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { title: "Network MRR", value: "KES 1.4M", change: "+14.2%", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10", shadow: "shadow-blue-500/20" },
          { title: "Daily Revenue", value: "23.8K", change: "+108%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", shadow: "shadow-emerald-500/20" },
          { title: "Avg Rating", value: "4.82", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", shadow: "shadow-amber-500/20" },
          { title: "Bay Uptime", value: "94.2%", change: "Optimal", icon: Warehouse, color: "text-indigo-500", bg: "bg-indigo-500/10", shadow: "shadow-indigo-500/20" },
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
                  <span className="text-[10px] font-bold text-slate-300 uppercase">vs Last Period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Velocity Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-white p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 md:mb-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">Financial Velocity</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time revenue accumulation across network</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="size-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-slate-500 uppercase">This Week</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="size-3 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-black text-slate-500 uppercase">Projected</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '1.5rem' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Branch Leaderboard */}
        <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary/20 rounded-full blur-[80px]" />
          <header className="mb-10 relative z-10">
             <div className="flex items-center gap-4 mb-4">
                <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl">
                   <Building2 className="size-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Branch Audit</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Station Productivity Rankings</p>
                </div>
             </div>
          </header>
          <div className="space-y-6 relative z-10">
             {BRANCHES.map((branch, i) => (
               <div key={branch.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-[10px] font-black text-primary uppercase block mb-1">Rank #{i+1}</span>
                        <h4 className="font-black uppercase text-sm">{branch.name}</h4>
                     </div>
                     <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black">TOP PERFORMER</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Revenue MTD</span>
                        <span className="text-lg font-black">KES {branch.revenueMTD.toLocaleString()}</span>
                     </div>
                     <div className="text-right">
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Occupancy</span>
                        <span className="text-sm font-black text-primary">{Math.floor(Math.random() * 20) + 75}%</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>
          <Button className="w-full mt-10 h-16 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all">
             View Branch Network <ChevronRight className="ml-2 size-4" />
          </Button>
        </Card>
      </div>

      {/* AI Strategy Layer - Fixed at bottom for decision support */}
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
                  NETWORK ANOMALIES
                </h4>
                <ul className="space-y-4 md:space-y-6">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm md:text-base bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all duration-300 group/item cursor-default">
                      <Zap className="size-6 text-amber-400 shrink-0 group-hover/item:scale-125 transition-transform" />
                      <span className="font-bold text-slate-200 leading-relaxed">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6 md:space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-3">
                  <div className="h-0.5 w-10 bg-emerald-400" />
                  OWNER STRATEGY
                </h4>
                <ul className="space-y-4 md:space-y-6">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm md:text-base bg-emerald-400/5 p-6 rounded-[2rem] border border-emerald-400/10 hover:bg-emerald-400/10 transition-all duration-300 group/item cursor-default">
                      <div className="size-3 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_20px_#34d399] mt-1.5 group-hover/item:scale-150 transition-transform" />
                      <span className="font-bold text-slate-100 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Button className="w-full h-16 md:h-20 bg-white text-slate-900 hover:bg-blue-50 rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.3em] shadow-[0_25px_60px_-15px_rgba(255,255,255,0.2)] transition-all">
               Approve Consolidated Strategy
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}
