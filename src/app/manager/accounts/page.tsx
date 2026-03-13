
"use client";

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
  ResponsiveContainer,
  Cell,
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Coins, 
  ShieldAlert,
  Zap,
  Users,
  Banknote,
  Star,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const REVENUE_STREAMS = [
  { category: 'Wash', actual: 42000, target: 45000, rating: 4.2 },
  { category: 'Detailing', actual: 28000, target: 25000, rating: 4.8 },
  { category: 'Tinting', actual: 12000, target: 15000, rating: 3.9 },
  { category: 'Logistics', actual: 8500, target: 12000, rating: 4.5 },
];

export default function AccountsManagementPage() {
  const currentProfit = 90500;
  const targetProfit = 100000;
  const achievementRate = (currentProfit / targetProfit) * 100;
  const isTargetMet = achievementRate >= 100;

  const kpis = [
    { label: "Net Profit (MTD)", value: `KES ${currentProfit.toLocaleString()}`, icon: Banknote, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Monthly Target", value: `KES ${targetProfit.toLocaleString()}`, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Target Achievement", value: `${achievementRate.toFixed(1)}%`, icon: TrendingUp, color: isTargetMet ? "text-emerald-600" : "text-amber-600", bg: isTargetMet ? "bg-emerald-50" : "bg-amber-50" },
    { label: "Est. Bonus Pool", value: "KES 14.5K", icon: Coins, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Financial Performance</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Target Monitoring & Incentive Tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            Adjust Targets
          </Button>
          <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest">
            Disburse Bonuses
          </Button>
        </div>
      </header>

      {/* Warning Module if Target is Below Threshold */}
      {!isTargetMet && (
        <Card className="border-none shadow-lg bg-amber-50 border-l-8 border-amber-500 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                <ShieldAlert className="size-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white border-none font-black text-[9px] uppercase">Underperforming</Badge>
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">Action Required</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Profit Gap: KES {(targetProfit - currentProfit).toLocaleString()}</h2>
                <p className="text-slate-600 font-bold text-sm">Current sales velocity is 9.5% below monthly target. Push Detailing upsells to recover.</p>
              </div>
            </div>
            <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-[0.2em] gap-2 rounded-2xl shrink-0">
              <Zap className="size-4 text-primary" /> Deploy Sales Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Revenue Stream Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {REVENUE_STREAMS.map((stream) => (
          <Card key={stream.category} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="font-black text-[9px] uppercase border-slate-200 text-slate-400">{stream.category}</Badge>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="size-3 fill-current" />
                  <span className="text-[10px] font-black">{stream.rating}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue vs Target</span>
                <div className="flex justify-between items-baseline">
                   <h3 className="text-xl font-black text-slate-900 italic">KES {stream.actual.toLocaleString()}</h3>
                   <span className="text-[10px] font-bold text-slate-400">Target: {stream.target/1000}k</span>
                </div>
                <Progress value={(stream.actual/stream.target)*100} className="h-1.5 bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actual vs Target Visualization */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <CardTitle className="text-2xl font-black italic uppercase tracking-tight">Revenue Stream Breakdown</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Monitoring performance by department</CardDescription>
            </div>
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                 <div className="size-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black text-slate-500 uppercase">Actual</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="size-3 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-black text-slate-500 uppercase">Target</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_STREAMS} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="actual" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Strategic Directives / Bundling Board */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 -mr-24 -mt-24 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-8">
            <header className="flex items-center gap-4">
               <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                  <Zap className="size-8 text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight leading-none text-primary">Profit Booster</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">High-Margin Service Bundles</p>
               </div>
            </header>

            <div className="space-y-4">
               {[
                 { name: "Executive Plus", price: "2,500", saving: "500", usp: "Highest Wash Margin", incentive: "+20% Staff Comm" },
                 { name: "Detailer's Choice", price: "6,000", saving: "1,200", usp: "Equipment Optimization", incentive: "Free Wax Kit" }
               ].map((bundle, i) => (
                 <div key={i} className="space-y-3 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                       <h4 className="font-black italic uppercase text-xs text-white">{bundle.name}</h4>
                       <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black">PROFITABLE</Badge>
                    </div>
                    <div className="flex flex-col gap-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{bundle.usp}</p>
                       <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-black italic text-primary">KES {bundle.price}</span>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Save KES {bundle.saving}</span>
                       </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">{bundle.incentive}</span>
                       <Button variant="link" className="p-0 h-auto text-[8px] font-black text-primary uppercase flex items-center gap-1">
                          PUSH TO APP <ArrowRight className="size-2" />
                       </Button>
                    </div>
                 </div>
               ))}
            </div>

            <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">
               Configure Bundles Engine
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
