"use client";

import { useState, useEffect } from "react";
import { STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Coins, 
  ShieldAlert,
  Zap,
  Banknote,
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const REVENUE_STREAMS = [
  { category: 'Wash', actual: 42000, target: 45000, rating: 4.2, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
  { category: 'Detailing', actual: 28000, target: 25000, rating: 4.8, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { category: 'Tinting', actual: 12000, target: 15000, rating: 3.9, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { category: 'Logistics', actual: 8500, target: 12000, rating: 4.5, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
];

export default function AccountsManagementPage() {
  const [mounted, setMounted] = useState(false);
  const currentProfit = 90500;
  const targetProfit = 100000;
  const achievementRate = (currentProfit / targetProfit) * 100;
  const isTargetMet = achievementRate >= 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpis = [
    { label: "Net Profit (MTD)", value: `KES ${currentProfit.toLocaleString()}`, icon: Banknote, color: "text-blue-600", bg: "bg-blue-50", layer: 'bg-blue-500' },
    { label: "Monthly Target", value: `KES ${targetProfit.toLocaleString()}`, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50", layer: 'bg-indigo-500' },
    { label: "Achievement", value: `${achievementRate.toFixed(1)}%`, icon: TrendingUp, color: isTargetMet ? "text-emerald-600" : "text-amber-600", bg: isTargetMet ? "bg-emerald-50" : "bg-amber-50", layer: isTargetMet ? 'bg-emerald-500' : 'bg-amber-500' },
    { label: "Bonus Pool", value: "KES 14.5K", icon: Coins, color: "text-primary", bg: "bg-primary/5", layer: 'bg-primary' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Financial Engine</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Target Monitoring & Incentive Tracking</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl h-14 gap-3 bg-white border-none shadow-xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 transition-all">
            Adjust Targets
          </Button>
          <Button className="rounded-2xl h-14 gap-3 shadow-2xl shadow-primary/30 px-8 font-black uppercase text-[11px] tracking-widest bg-primary hover:bg-blue-600 transition-all">
            Disburse Bonuses
          </Button>
        </div>
      </header>

      {!isTargetMet && (
        <Card className="border-none shadow-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700 relative group">
          <div className="absolute top-0 right-0 p-24 -mr-24 -mt-24 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="size-20 bg-white/20 backdrop-blur-xl text-white rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/20">
                <ShieldAlert className="size-10" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Badge className="bg-white text-amber-600 border-none font-black text-[10px] uppercase">GAP DETECTED</Badge>
                  <span className="text-[10px] font-black text-amber-100 uppercase tracking-[0.2em]">Immediate Strategic Shift Required</span>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Shortfall: KES {(targetProfit - currentProfit).toLocaleString()}</h2>
                <p className="text-amber-50 font-bold text-lg">Sales velocity is 9.5% below target. Push high-margin Detailing bundles to recover.</p>
              </div>
            </div>
            <Button className="h-16 px-10 bg-white text-slate-900 hover:bg-amber-50 font-black uppercase text-xs tracking-[0.2em] gap-3 rounded-[1.5rem] shadow-2xl transition-all active:scale-95 shrink-0">
              <Zap className="size-5 text-primary" /> Deploy Recovery Plan
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
            <div className={cn("absolute top-0 left-0 w-full h-2", kpi.layer)} />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest rounded-full">LIVE</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] bg-white p-12 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex justify-between items-center mb-12">
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Revenue Stream Breakdown</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Comparative performance analysis</CardDescription>
            </div>
            <div className="flex gap-8">
               <div className="flex items-center gap-3">
                 <div className="size-4 rounded-full bg-primary shadow-lg shadow-primary/20" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actual</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="size-4 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target</span>
               </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_STREAMS} barGap={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={12}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '1.5rem' }}
                  />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={48} />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 -mr-28 -mt-28 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            <header className="flex items-center gap-5">
               <div className="size-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-6 group-hover:rotate-12 transition-transform">
                  <Sparkles className="size-9 text-white" />
               </div>
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-primary">Profit Booster</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Margin Optimization Engine</p>
               </div>
            </header>

            <div className="space-y-6">
               {[
                 { name: "Executive Plus", price: "2,500", saving: "500", usp: "Highest Wash Margin", incentive: "+20% Staff Comm", color: 'border-blue-500/30 bg-blue-500/5' },
                 { name: "Detailer's Choice", price: "6,000", saving: "1,200", usp: "Equipment Efficiency", incentive: "Free Microfiber Kit", color: 'border-emerald-500/30 bg-emerald-500/5' }
               ].map((bundle, i) => (
                 <div key={i} className={cn("space-y-4 p-6 rounded-[2rem] border transition-all cursor-pointer group/card", bundle.color, "hover:bg-white/10")}>
                    <div className="flex justify-between items-start">
                       <h4 className="font-black uppercase text-sm text-white group-hover/card:text-primary transition-colors">{bundle.name}</h4>
                       <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black px-3 py-0.5">HIGH MARGIN</Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{bundle.usp}</p>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-2xl font-black text-primary tracking-tighter leading-none">KES {bundle.price}</span>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter line-through">KES {(parseInt(bundle.price.replace(',', '')) + parseInt(bundle.saving.replace(',', ''))).toLocaleString()}</span>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{bundle.incentive}</span>
                       <Button variant="link" className="p-0 h-auto text-[9px] font-black text-primary uppercase flex items-center gap-2 group/btn">
                          PUSH TO CLIENTS <ArrowRight className="size-3 group-hover/btn:translate-x-1 transition-transform" />
                       </Button>
                    </div>
                 </div>
               ))}
            </div>

            <Button className="w-full h-16 bg-white text-slate-900 hover:bg-slate-50 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95">
               Configure Bundles Logic
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
