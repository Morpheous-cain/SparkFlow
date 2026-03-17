
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
  Frown,
  Activity,
  Gauge,
  Waves,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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

  const safeBranches = BRANCHES || [];
  
  const handleRefillOrder = (branchName: string) => {
    toast({
      title: "Water Logistics Initiated",
      description: `Water tanker dispatch scheduled for ${branchName}. Expected in 45 mins.`,
    });
  };

  const handleApproveStrategy = () => {
    toast({
      title: "Executive Strategy Approved",
      description: "Propagating performance targets and operational shifts to all branch nodes.",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 md:gap-8 bg-[#f1f5f9]">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Owner Intelligence Hub</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2">Emma Johnson • Global Operations Commander</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Audit Infrastructure..." className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm font-bold focus-visible:ring-primary/20 uppercase tracking-widest" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white shadow-sm size-12 hover:bg-slate-50 relative border-none">
              <Bell className="size-5 text-slate-600" />
              <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Button 
              onClick={fetchAiInsights} 
              className="flex-1 sm:flex-none gap-2 bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/10 h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest transition-all border-none"
              disabled={loadingAi}
            >
              <Sparkles className="size-4 text-primary" /> {loadingAi ? "Analyzing..." : "Sync AI Strategy"}
            </Button>
          </div>
        </div>
      </header>

      {/* Executive Financial Health Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Net Profit Margin", value: "32.4%", change: "+4.2%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Customer Value vs Acquisition Cost", value: "4.8x", change: "Optimal", icon: PieChart, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Monthly Burn Rate", value: "KES 142,000", change: "-8.1%", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { title: "Current Working Capital", value: "KES 2,400,000", change: "Stable", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.2rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
             <div className={cn("absolute top-0 left-0 w-1 h-full", metric.color.replace('text', 'bg'))} />
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", metric.bg, metric.color)}>
                  <metric.icon className="size-6" />
                </div>
                <Badge className={cn("border-none px-2 py-0.5 rounded-full text-[8px] font-black uppercase", metric.color.replace('text', 'bg'), "text-white")}>
                  {metric.change}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.title}</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{metric.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* IoT Resource Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 italic">
             <Activity className="size-3" /> Site Infrastructure & Resource Command
           </h2>
           <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase tracking-widest px-3 py-1">SENSORS VERIFIED</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeBranches.map((branch) => (
            <Card key={branch.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:scale-[1.01] transition-all">
              <CardContent className="p-8 space-y-8">
                <header className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                         <Building2 className="size-6" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">{branch.name}</h3>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Station Node: {branch.id}</p>
                      </div>
                   </div>
                   {branch.waterLevel < 20 && (
                     <Badge className="bg-red-500 text-white border-none animate-pulse font-black text-[8px] uppercase px-3 py-1 shadow-lg shadow-red-500/20">LOW RESOURCE</Badge>
                   )}
                </header>

                <div className="grid grid-cols-2 gap-6">
                   {/* Water Tank Visualization */}
                   <div className="relative space-y-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Main Reservoir</span>
                      <div className="h-32 w-full bg-slate-100 rounded-[1.5rem] overflow-hidden relative border-2 border-slate-50 shadow-inner">
                         <div 
                           className={cn(
                             "absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out",
                             branch.waterLevel < 20 ? "bg-gradient-to-t from-red-500 to-red-400" : "bg-gradient-to-t from-primary to-blue-400"
                           )}
                           style={{ height: `${branch.waterLevel}%` }}
                         >
                            <div className="absolute top-0 left-0 w-full h-2 bg-white/20 animate-pulse" />
                         </div>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className={cn("text-2xl font-black tracking-tighter", branch.waterLevel < 20 ? "text-red-600" : "text-slate-900")}>{branch.waterLevel}%</span>
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{branch.waterCapacity.toLocaleString()} Liters</span>
                         </div>
                      </div>
                   </div>

                   {/* Secondary Sensor Telemetry */}
                   <div className="flex flex-col justify-between">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                         <div className="flex items-center gap-2">
                            <Gauge className="size-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Pump Pressure</span>
                         </div>
                         <div className="text-lg font-black text-slate-900">{branch.pumpPressure} PSI</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                         <div className="flex items-center gap-2">
                            <Waves className="size-3 text-indigo-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Detergent Flow</span>
                         </div>
                         <div className="text-lg font-black text-slate-900">{branch.detergentLevel}%</div>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   {branch.waterLevel < 20 ? (
                     <Button 
                       className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-red-600/20 border-none gap-2"
                       onClick={() => handleRefillOrder(branch.name)}
                     >
                        <Droplets className="size-4" /> Dispatch Tanker
                     </Button>
                   ) : (
                     <Button 
                       variant="outline" 
                       className="w-full h-14 border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all"
                     >
                        Infrastructure Diagnostics
                     </Button>
                   )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Financial Velocity Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white p-6 md:p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Financial Velocity Audit</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time revenue accumulation vs Projections</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-primary" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Actual (Month to Date)</span>
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

        {/* AI Strategy Layer */}
        {aiInsights && (
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden p-6 md:p-8 relative group">
            <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[120px]" />
            
            <CardHeader className="p-0 mb-6 flex flex-row items-center gap-4 space-y-0 relative z-10">
              <div className="size-12 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-xl shadow-2xl flex items-center justify-center rotate-6">
                <Sparkles className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl font-black text-white tracking-tighter uppercase leading-none italic">AI Strategy Core</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-primary text-white border-none text-[7px] font-black uppercase px-1.5 py-0">REAL-TIME</Badge>
                  <p className="text-slate-400 text-[7px] font-black uppercase tracking-[0.2em]">Decision Engine v4.2</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 space-y-6 relative z-10">
              <div className="p-4 md:p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-inner">
                 <p className="text-sm md:text-base leading-snug text-white/95 font-bold tracking-tight italic">"{aiInsights.overallSummary}"</p>
              </div>
              
              <div className="space-y-6">
                {/* Executive Anomalies */}
                <div className="space-y-3">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary" /> FINANCIAL ANOMALIES
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.identifiedTrends.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] bg-white/5 p-3 rounded-xl border border-white/5 group/item hover:bg-white/10 transition-colors">
                        <Zap className="size-3 text-amber-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-200">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Management Strategy */}
                <div className="space-y-3">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-emerald-400" /> GROWTH STRATEGY
                  </h4>
                  <ul className="space-y-2">
                    {aiInsights.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] bg-emerald-400/5 p-3 rounded-xl border border-emerald-400/10 hover:bg-emerald-400/10 transition-colors">
                        <div className="size-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span className="font-medium text-slate-100">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Button 
                className="w-full h-14 bg-white text-slate-900 hover:bg-blue-50 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-2xl border-none transition-all active:scale-95"
                onClick={handleApproveStrategy}
              >
                 Authorize Strategic Pivot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <RoleSwitcher />
    </div>
  );
}
