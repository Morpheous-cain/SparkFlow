
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
  LayoutDashboard,
  Droplets,
  Users,
  PackageCheck,
  ShieldAlert,
  MessageSquareWarning,
  Frown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

  const criticalRisks = BRANCHES.filter(b => b.waterLevel < 20 || b.staffing.current < b.staffing.required || b.essentialMaterialsLow > 0);

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

      {/* Critical Resource Alerts */}
      {criticalRisks.length > 0 && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-red-500/20 rounded-full blur-[100px]" />
            <CardContent className="p-6 md:p-10 space-y-8 relative z-10">
              <header className="flex items-center gap-4">
                <div className="size-14 bg-red-500 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-500/20 animate-pulse">
                  <ShieldAlert className="size-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Operational Integrity Alerts</h2>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Resource shortages detected across {criticalRisks.length} locations</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {criticalRisks.map(branch => (
                  <div key={branch.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black uppercase text-xs text-primary">{branch.name}</h4>
                      <Badge className="bg-red-500 text-white text-[8px] font-black uppercase">CRITICAL</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {branch.waterLevel < 20 && (
                        <div className="flex items-center gap-3 text-xs font-bold text-red-400">
                          <Droplets className="size-4" />
                          <span>Water Level: {branch.waterLevel}% (Low Sensor Alert)</span>
                        </div>
                      )}
                      {branch.staffing.current < branch.staffing.required && (
                        <div className="flex items-center gap-3 text-xs font-bold text-amber-400">
                          <Users className="size-4" />
                          <span>Staff Shortage: {branch.staffing.required - branch.staffing.current} more needed</span>
                        </div>
                      )}
                      {branch.essentialMaterialsLow > 0 && (
                        <div className="flex items-center gap-3 text-xs font-bold text-blue-400">
                          <PackageCheck className="size-4" />
                          <span>Materials Needed: {branch.essentialMaterialsLow} Essential SKUs low</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="outline" className="w-full h-10 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 font-black text-[9px] uppercase tracking-widest text-white">
                      Dispatch Logistics
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Vital Signs - High Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { title: "Network MRR", value: "KES 1.4M", change: "+14.2%", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10", shadow: "shadow-blue-500/20" },
          { title: "Daily Revenue", value: "23.8K", change: "+108%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", shadow: "shadow-emerald-500/20" },
          { title: "Avg Rating", value: "4.82", change: "+0.2", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", shadow: "shadow-amber-500/20" },
          { title: "System Health", value: "82%", change: "Audit Req", icon: Droplets, color: "text-indigo-500", bg: "bg-indigo-500/10", shadow: "shadow-indigo-500/20" },
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
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Status Monitor</span>
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

        {/* Branch Audit - Now with resource monitoring */}
        <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-primary/20 rounded-full blur-[80px]" />
          <header className="mb-10 relative z-10">
             <div className="flex items-center gap-4 mb-4">
                <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl">
                   <Building2 className="size-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Resource Audit</h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Station Continuity Metrics</p>
                </div>
             </div>
          </header>
          <div className="space-y-6 relative z-10">
             {BRANCHES.map((branch, i) => (
               <div key={branch.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-[10px] font-black text-primary uppercase block mb-1">{branch.name}</span>
                        <div className="flex items-center gap-3 mt-2">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-500 uppercase">Water Level</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <Progress value={branch.waterLevel} className={cn("h-1.5 w-12", branch.waterLevel < 20 ? "bg-red-500/20 [&>div]:bg-red-500" : "bg-blue-500/20 [&>div]:bg-blue-500")} />
                                 <span className={cn("text-[10px] font-black", branch.waterLevel < 20 ? "text-red-500" : "text-blue-400")}>{branch.waterLevel}%</span>
                              </div>
                           </div>
                           <div className="h-8 w-px bg-white/5 mx-2" />
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-slate-500 uppercase">Staff Load</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <Users className="size-3 text-slate-400" />
                                 <span className={cn("text-[10px] font-black", branch.staffing.current < branch.staffing.required ? "text-amber-500" : "text-white")}>
                                    {branch.staffing.current}/{branch.staffing.required}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <Badge className={cn("border-none text-[8px] font-black uppercase px-2 py-0.5", branch.waterLevel < 20 ? "bg-red-500 text-white" : "bg-emerald-500 text-white")}>
                        {branch.waterLevel < 20 ? "ALERT" : "STABLE"}
                     </Badge>
                  </div>
               </div>
             ))}
          </div>
          <Button className="w-full mt-10 h-16 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all">
             Full Resource Network <ChevronRight className="ml-2 size-4" />
          </Button>
        </Card>
      </div>

      {/* AI Strategy Layer - COMPACT VERSION */}
      {aiInsights && (
        <Card className="border-none shadow-2xl rounded-[3rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden p-6 md:p-10 relative group">
          <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 p-24 -ml-24 -mb-24 bg-emerald-500/10 rounded-full blur-[100px]" />
          
          <CardHeader className="p-0 mb-6 md:mb-8 flex flex-row items-center gap-4 md:gap-6 space-y-0 relative z-10">
            <div className="size-14 md:size-16 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-[1.2rem] md:rounded-[1.5rem] shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="size-7 md:size-8" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none mb-1">AI Predictive Core</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white border-none text-[8px] font-black uppercase px-2 py-0.5">ANALYSIS LIVE</Badge>
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">Quantum Strategy Engine v4.2</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-6 md:space-y-8 relative z-10">
            <div className="p-5 md:p-8 bg-white/5 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 shadow-inner">
               <p className="text-lg md:text-xl leading-snug text-white/95 font-black tracking-tight italic">"{aiInsights.overallSummary}"</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Network Anomalies */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-primary" />
                  NETWORK ANOMALIES
                </h4>
                <ul className="space-y-3">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs bg-white/5 p-4 rounded-[1.2rem] border border-white/5 hover:bg-white/10 transition-all duration-300 group/item cursor-default">
                      <Zap className="size-4 text-amber-400 shrink-0 group-hover/item:scale-125 transition-transform" />
                      <span className="font-bold text-slate-200 leading-normal">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Owner Strategy */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-emerald-400" />
                  OWNER STRATEGY
                </h4>
                <ul className="space-y-3">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs bg-emerald-400/5 p-4 rounded-[1.2rem] border border-emerald-400/10 hover:bg-emerald-400/10 transition-all duration-300 group/item cursor-default">
                      <div className="size-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_10px_#34d399] mt-1 group-hover/item:scale-150 transition-transform" />
                      <span className="font-bold text-slate-100 leading-normal">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flagged Low-Rating Reviews */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-red-400" />
                  CRITICAL FEEDBACK
                </h4>
                <div className="space-y-3">
                  {aiInsights.flaggedReviews?.map((review, i) => (
                    <div key={i} className="bg-red-500/5 p-4 rounded-[1.2rem] border border-red-500/10 hover:bg-red-500/10 transition-all space-y-2 group/rev">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-white uppercase">{review.customer}</span>
                        <div className="flex items-center gap-1">
                          <Star className="size-2 text-red-400 fill-current" />
                          <span className="text-[10px] font-black text-red-400">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight font-medium italic">"{review.comment}"</p>
                      <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                        <Frown className="size-3 text-red-400" />
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">{review.sentiment}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="p-8 text-center bg-white/5 rounded-[1.2rem] border border-white/5">
                       <ShieldAlert className="size-6 text-slate-600 mx-auto mb-2" />
                       <p className="text-[10px] font-black text-slate-500 uppercase">No Critical Reviews</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button className="w-full h-12 md:h-14 bg-white text-slate-900 hover:bg-blue-50 rounded-[1.2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_15px_40px_-10px_rgba(255,255,255,0.2)] transition-all">
               Approve Consolidated Strategy
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}
