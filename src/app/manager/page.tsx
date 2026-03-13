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
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 md:gap-8 bg-[#f8fafc]">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Emma Johnson</h1>
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

      {/* 360 Loop: Service Recovery Module */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <Card className="border-none shadow-lg bg-red-50 border-l-4 md:border-l-8 border-red-500 rounded-3xl overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 md:gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="size-14 md:size-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20 animate-pulse">
                <AlertTriangle className="size-6 md:size-8" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <Badge className="bg-red-500 text-white border-none font-black text-[9px] uppercase">Urgent Alert</Badge>
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Service Recovery</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Low Rating: KDC 123A</h2>
                <p className="text-slate-600 font-bold text-xs md:text-sm">Brian Wilson • Detailing • Rating: 2/5</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-12 md:h-14 rounded-2xl px-6 border-red-200 bg-white text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50">
                Feedback
              </Button>
              <Button className="w-full sm:w-auto h-12 md:h-14 rounded-2xl px-8 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-red-500/20">
                <PhoneCall className="size-4" /> Call Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Avg Rating", value: "4.82", change: "+0.2", icon: Star, color: "text-amber-500" },
          { title: "Recurring Revenue", value: "840K", change: "+14%", icon: Ticket, color: "text-primary" },
          { title: "Revenue", value: "23.8K", change: "+108%", icon: TrendingUp, color: "text-emerald-500" },
          { title: "Occupancy", value: "66.7%", change: "Optimal", icon: Warehouse, color: "text-indigo-500" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className={cn("size-10 rounded-xl flex items-center justify-center bg-slate-50", metric.color)}>
                  <metric.icon className="size-5" />
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-full"><MoreVertical className="size-4 text-slate-400" /></Button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{metric.title}</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter italic">{metric.value}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-50 text-slate-900 border-none px-2 py-0.5 rounded-full text-[9px] font-black italic">
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Link href="/manager/subscriptions" className="lg:col-span-1 group">
          <Card className="border-none shadow-sm rounded-[2rem] bg-indigo-600 text-white p-8 md:p-10 h-full relative overflow-hidden group-hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-16 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="size-14 md:size-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 backdrop-blur-md border border-white/20">
                  <Ticket className="size-7 md:size-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 italic tracking-tight uppercase">Subscriptions</h3>
                <p className="text-indigo-100 text-sm font-bold leading-relaxed">Manage tiered loyalty & regular revenue.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map((_, i) => (
                    <div key={i} className="size-10 md:size-12 rounded-full border-4 border-indigo-600 bg-white/20 flex items-center justify-center font-black text-xs md:text-sm text-white">
                      {i === 0 ? "S" : i === 1 ? "G" : "P"}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  Plan Details <ChevronRight className="size-3" />
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] bg-white p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="size-2 md:size-3 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight italic">Job Mix Analysis</h3>
            </div>
            <Badge variant="outline" className="rounded-xl px-3 md:py-2 border-slate-100 text-slate-500 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Global</Badge>
          </div>
          <div className="h-[250px] md:h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter">1.4K</span>
              <span className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 md:mt-2">Active</span>
            </div>
          </div>
        </Card>
      </div>

      {aiInsights && (
        <Card className="border-none shadow-xl rounded-[2rem] md:rounded-[3rem] bg-slate-900 text-white overflow-hidden p-6 md:p-10 relative group">
          <div className="absolute top-0 right-0 p-24 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[100px]" />
          <CardHeader className="p-0 mb-8 md:mb-10 flex flex-row items-center gap-4 md:gap-6 space-y-0 relative z-10">
            <div className="p-3 md:p-4 bg-primary text-white rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/40 rotate-3">
              <Sparkles className="size-6 md:size-8" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-3xl font-black text-white italic tracking-tight uppercase">AI Strategy Core</CardTitle>
              <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Real-time predictive logic</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-8 md:space-y-12 relative z-10">
            <p className="text-lg md:text-xl leading-relaxed text-white/90 font-black italic">"{aiInsights.overallSummary}"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Live Anomalies</h4>
                <ul className="space-y-3 md:space-y-4">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs md:text-sm bg-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                      <Zap className="size-4 text-amber-400 shrink-0" />
                      <span className="font-bold">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Strategic Pivot</h4>
                <ul className="space-y-3 md:space-y-4">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs md:text-sm bg-primary/10 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-primary/10 hover:bg-primary/20 transition-all cursor-default">
                      <div className="size-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_10px_#34d399]" />
                      <span className="font-bold">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}
