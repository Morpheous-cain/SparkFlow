
"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES, BAYS, BRANCHES, INVENTORY } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Search,
  Bell,
  Sparkles,
  MoreVertical,
  ChevronRight,
  Star,
  Zap,
  Building2,
  DollarSign,
  Droplets,
  Users,
  PackageCheck,
  ShieldAlert,
  Frown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { getManagerOperationalInsights, ManagerOperationalInsightsOutput } from "@/ai/flows/manager-operational-insights-flow";
import { cn } from "@/lib/utils";

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
        transactionPatternData: JSON.stringify(MOCK_TRANSACTIONS),
        lowRatingReviews: JSON.stringify([
          { customer: "Alex K.", rating: 2, comment: "Wait time was too long, over 60 mins.", date: "2024-05-20" },
          { customer: "Mercy W.", rating: 1, comment: "Interior was still dusty after executive wash.", date: "2024-05-19" }
        ])
      });
      setAiInsights(data);
    } catch (err) {
      // Error handled centrally
    } finally {
      setLoadingAi(false);
    }
  };

  // Safe calculation with fallback to empty array if BRANCHES is undefined
  const safeBranches = BRANCHES || [];
  const criticalRisks = safeBranches.filter(b => 
    (b.waterLevel !== undefined && b.waterLevel < 20) || 
    (b.staffing && b.staffing.current < b.staffing.required) || 
    (b.essentialMaterialsLow > 0)
  );

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

      {/* Critical Resource Alerts - COMPACT */}
      {criticalRisks.length > 0 && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-red-500/10 rounded-full blur-[80px]" />
            <CardContent className="p-6 md:p-8 space-y-6 relative z-10">
              <header className="flex items-center gap-3">
                <div className="size-10 bg-red-500 rounded-xl flex items-center justify-center shadow-xl shadow-red-500/20 animate-pulse">
                  <ShieldAlert className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter leading-none">Operational Integrity</h2>
                  <p className="text-slate-400 font-bold uppercase text-[8px] tracking-widest mt-1">Shortages detected across {criticalRisks.length} locations</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {criticalRisks.map(branch => (
                  <div key={branch.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black uppercase text-[10px] text-primary">{branch.name}</h4>
                      <Badge className="bg-red-500 text-white text-[7px] font-black uppercase px-1.5 py-0">CRITICAL</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {branch.waterLevel < 20 && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-red-400">
                          <Droplets className="size-3" />
                          <span>Water: {branch.waterLevel}%</span>
                        </div>
                      )}
                      {branch.staffing.current < branch.staffing.required && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400">
                          <Users className="size-3" />
                          <span>Staff Gap: {branch.staffing.required - branch.staffing.current}</span>
                        </div>
                      )}
                      {branch.essentialMaterialsLow > 0 && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
                          <PackageCheck className="size-3" />
                          <span>Stock: {branch.essentialMaterialsLow} SKUs Low</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Vital Signs - High Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Network MRR", value: "KES 1.4M", change: "+14.2%", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Daily Revenue", value: "23.8K", change: "+108%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Avg Rating", value: "4.82", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
          { title: "System Health", value: "82%", change: "Audit Req", icon: Droplets, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white">
             <div className={cn("h-1.5 w-full", metric.color.replace('text', 'bg'))} />
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className={cn("size-12 rounded-xl flex items-center justify-center", metric.bg, metric.color)}>
                  <metric.icon className="size-6" />
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-full"><MoreVertical className="size-4 text-slate-300" /></Button>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.title}</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{metric.value}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("border-none px-2 py-0 rounded-full text-[8px] font-black", metric.color.replace('text', 'bg'), "text-white")}>
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Velocity Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white p-6 md:p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Velocity</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time revenue accumulation</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-primary" />
                 <span className="text-[9px] font-black text-slate-500 uppercase">Actual</span>
               </div>
            </div>
          </div>
          <div className="h-[250px] md:h-[350px] w-full">
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
                    tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Branch Audit - COMPACT */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary/20 rounded-full blur-[80px]" />
          <header className="mb-6 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl">
                   <Building2 className="size-5" />
                </div>
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tighter leading-none">Resource Audit</h3>
                   <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1">Station Continuity</p>
                </div>
             </div>
          </header>
          <div className="space-y-4 relative z-10">
             {safeBranches.map((branch) => (
               <div key={branch.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                     <div className="flex-1">
                        <span className="text-[10px] font-black text-primary uppercase block mb-1">{branch.name}</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <div className="flex flex-col">
                              <span className="text-[7px] font-black text-slate-500 uppercase">Water</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                 <Progress value={branch.waterLevel} className={cn("h-1 w-8", branch.waterLevel < 20 ? "bg-red-500/20 [&>div]:bg-red-500" : "bg-blue-500/20 [&>div]:bg-blue-500")} />
                                 <span className={cn("text-[8px] font-black", branch.waterLevel < 20 ? "text-red-500" : "text-blue-400")}>{branch.waterLevel}%</span>
                              </div>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[7px] font-black text-slate-500 uppercase">Staff</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                 <Users className="size-2.5 text-slate-400" />
                                 <span className={cn("text-[8px] font-black", branch.staffing.current < branch.staffing.required ? "text-amber-500" : "text-white")}>
                                    {branch.staffing.current}/{branch.staffing.required}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Badge className={cn("border-none text-[7px] font-black uppercase px-1.5 py-0", branch.waterLevel < 20 ? "bg-red-500 text-white" : "bg-emerald-500 text-white")}>
                        {branch.waterLevel < 20 ? "ALERT" : "OK"}
                     </Badge>
                  </div>
               </div>
             ))}
          </div>
          <Button className="w-full mt-6 h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-2xl transition-all">
             Full Network <ChevronRight className="ml-1 size-3" />
          </Button>
        </Card>
      </div>

      {/* AI Strategy Layer - SUPER COMPACT */}
      {aiInsights && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden p-6 md:p-8 relative group">
          <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[120px]" />
          
          <CardHeader className="p-0 mb-6 flex flex-row items-center gap-4 space-y-0 relative z-10">
            <div className="size-12 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-xl shadow-2xl flex items-center justify-center rotate-6">
              <Sparkles className="size-6" />
            </div>
            <div>
              <CardTitle className="text-lg md:text-xl font-black text-white tracking-tighter uppercase leading-none">AI Strategy Core</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary text-white border-none text-[7px] font-black uppercase px-1.5 py-0">LIVE</Badge>
                <p className="text-slate-400 text-[7px] font-black uppercase tracking-[0.2em]">Predictive Engine v4.2</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-6 relative z-10">
            <div className="p-4 md:p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-inner">
               <p className="text-sm md:text-base leading-snug text-white/95 font-bold tracking-tight">"{aiInsights.overallSummary}"</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Network Anomalies */}
              <div className="space-y-3">
                <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-primary" /> ANOMALIES
                </h4>
                <ul className="space-y-2">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-start gap-2 text-[10px] bg-white/5 p-3 rounded-xl border border-white/5">
                      <Zap className="size-3 text-amber-400 shrink-0" />
                      <span className="font-medium text-slate-200">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Owner Strategy */}
              <div className="space-y-3">
                <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-emerald-400" /> STRATEGY
                </h4>
                <ul className="space-y-2">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-[10px] bg-emerald-400/5 p-3 rounded-xl border border-emerald-400/10">
                      <div className="size-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                      <span className="font-medium text-slate-100">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flagged Low-Rating Reviews */}
              <div className="space-y-3">
                <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-red-400" /> CRITICAL FEEDBACK
                </h4>
                <div className="space-y-2">
                  {aiInsights.flaggedReviews?.map((review, i) => (
                    <div key={i} className="bg-red-500/5 p-3 rounded-xl border border-red-500/10 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-white uppercase">{review.customer}</span>
                        <div className="flex items-center gap-1">
                          <Star className="size-2 text-red-400 fill-current" />
                          <span className="text-[9px] font-black text-red-400">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight font-medium">"{review.comment}"</p>
                      <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5">
                        <Frown className="size-2.5 text-red-400" />
                        <span className="text-[7px] font-black text-red-400 uppercase tracking-widest">{review.sentiment}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="p-6 text-center bg-white/5 rounded-xl border border-white/5">
                       <p className="text-[8px] font-black text-slate-500 uppercase">Clear</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button className="w-full h-12 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-2xl">
               Approve Strategy
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}
