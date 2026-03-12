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
  Zap
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
    <div className="min-h-screen p-8 flex flex-col gap-8 bg-[#f8fafc]">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Emma Johnson</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Operational Lead • SparkFlow HQ</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search reports..." className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm font-bold focus-visible:ring-primary/20" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white shadow-sm size-12 hover:bg-slate-50 relative">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <Button 
            onClick={fetchAiInsights} 
            className="gap-2 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/10 h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest transition-all"
            disabled={loadingAi}
          >
            <Sparkles className="size-4 text-primary" /> {loadingAi ? "Analyzing..." : "AI Intelligence"}
          </Button>
        </div>
      </header>

      {/* 360 Loop: Service Recovery Module */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <Card className="border-none shadow-[0_20px_50px_rgba(239,68,68,0.15)] bg-red-50 border-l-8 border-red-500 rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-16 bg-red-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-500/20 animate-pulse">
                <AlertTriangle className="size-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-500 text-white border-none font-black text-[10px] uppercase">Urgent Alert</Badge>
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Service Recovery Needed</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">Low Rating Recorded: KDC 123A</h2>
                <p className="text-slate-600 font-bold text-sm">Customer: Brian Wilson • Detailing Service • Rating: 2/5 Stars</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-14 rounded-2xl px-6 border-red-200 bg-white text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50">
                View Feedback
              </Button>
              <Button className="h-14 rounded-2xl px-8 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-red-500/20">
                <PhoneCall className="size-4" /> Call Customer Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Avg. Customer Rating", value: "4.82", change: "+0.2", base: "Last 30 days", icon: Star, color: "text-amber-500" },
          { title: "Service Recovery TAT", value: "8.5m", change: "-2.1m", base: "Manager Response", icon: PhoneCall, color: "text-blue-500" },
          { title: "Net Revenue", value: "KES 23.8K", change: "+108%", base: "vs last month", icon: TrendingUp, color: "text-emerald-500" },
          { title: "Bay Occupancy", value: "66.7%", change: "Optimal", base: "Live Load", icon: Warehouse, color: "text-indigo-500" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className={cn("size-10 rounded-xl flex items-center justify-center bg-slate-50", metric.color)}>
                  <metric.icon className="size-5" />
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-full"><MoreVertical className="size-4 text-slate-400" /></Button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-sm font-black text-slate-400 uppercase tracking-[0.1em]">{metric.title}</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{metric.value}</span>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-50 text-slate-900 border-none px-3 py-1 rounded-full text-[10px] font-black italic">
                    {metric.change}
                  </Badge>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{metric.base}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Link href="/manager/bays" className="lg:col-span-1 group">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-indigo-600 text-white p-10 h-full relative overflow-hidden group-hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-16 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="size-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                  <Warehouse className="size-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-3 italic tracking-tight uppercase">Bays Monitor</h3>
                <p className="text-indigo-100 text-sm font-bold leading-relaxed">Live occupancy across all 3 service stations.</p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-3">
                  {BAYS.map((bay, i) => (
                    <div key={i} className={cn(
                      "size-12 rounded-full border-4 border-indigo-600 flex items-center justify-center font-black text-sm",
                      bay.status === 'Occupied' ? "bg-emerald-400 text-white" : "bg-white/20 text-indigo-100"
                    )}>
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  Live View <ChevronRight className="size-4" />
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="size-3 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Job Mix Analysis</h3>
            </div>
            <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest">Global Insights</Badge>
          </div>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={12}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900 italic tracking-tighter">1.4K</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Active Jobs</span>
            </div>
          </div>
        </Card>
      </div>

      {aiInsights && (
        <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden p-10 relative group">
          <div className="absolute top-0 right-0 p-24 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[100px]" />
          <CardHeader className="p-0 mb-10 flex-row items-center gap-6 space-y-0 relative z-10">
            <div className="p-4 bg-primary text-white rounded-3xl shadow-2xl shadow-primary/40 rotate-3">
              <Sparkles className="size-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-white italic tracking-tight uppercase">AI Strategy Core</CardTitle>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time predictive logic</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-12 relative z-10">
            <p className="text-xl leading-relaxed text-white/90 font-black italic">"{aiInsights.overallSummary}"</p>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Anomalies</h4>
                <ul className="space-y-4">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                      <Zap className="size-5 text-amber-400 shrink-0" />
                      <span className="font-bold">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Strategic Pivot</h4>
                <ul className="space-y-4">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm bg-primary/10 p-5 rounded-3xl border border-primary/10 hover:bg-primary/20 transition-all cursor-default">
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
