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
  ReferenceLine
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Trophy, 
  Coins, 
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Users,
  Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";

const TARGET_DATA = [
  { category: 'Wash', actual: 42000, target: 45000 },
  { category: 'Detailing', actual: 28000, target: 25000 },
  { category: 'Tinting', actual: 12000, target: 15000 },
  { category: 'Logistics', actual: 8500, target: 12000 },
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

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">REAL-TIME</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
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
              <CardTitle className="text-2xl font-black italic uppercase tracking-tight">Revenue vs Target</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Categorical performance breakdown</CardDescription>
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
              <BarChart data={TARGET_DATA} barGap={12}>
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

        {/* Employee Reward Leaderboard */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 -mr-24 -mt-24 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-8">
            <header className="flex items-center gap-4">
               <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                  <Trophy className="size-8 text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight leading-none">Incentive Board</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">MTD Target Achievement</p>
               </div>
            </header>

            <div className="space-y-6">
               {STAFF.slice(0, 4).map((member, i) => {
                 const progress = Math.min(100, member.performance * 20);
                 const isEligible = progress >= 90;
                 return (
                   <div key={member.id} className="space-y-3 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-500">{i + 1}</span>
                            <span className="font-black italic uppercase text-[11px]">{member.name}</span>
                         </div>
                         {isEligible && <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black uppercase tracking-widest">BONUS QUALIFIED</Badge>}
                      </div>
                      <div className="space-y-1.5">
                         <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-widest">
                            <span>Contribution Score</span>
                            <span className={isEligible ? "text-emerald-400" : ""}>{progress}%</span>
                         </div>
                         <Progress value={progress} className="h-1.5 bg-white/10" />
                      </div>
                   </div>
                 );
               })}
            </div>

            <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">
               View Full Incentive Audit
            </Button>
          </div>
        </Card>
      </div>

      {/* Decision Support & Recovery Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
            <header className="flex items-center gap-4 mb-8">
               <div className="size-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="size-6" />
               </div>
               <h3 className="text-xl font-black italic uppercase tracking-tight">Growth Scenarios</h3>
            </header>
            <div className="space-y-4">
               {[
                 { plan: "Premium Detail Focus", impact: "+KES 12.5K", time: "5 Days", effort: "High" },
                 { plan: "Flash Sale Vouchers", impact: "+KES 8.2K", time: "2 Days", effort: "Low" },
                 { plan: "Fleet Loyalty Sync", impact: "+KES 15.0K", time: "14 Days", effort: "Medium" }
               ].map((plan, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="space-y-1">
                       <h4 className="font-black italic uppercase text-xs text-slate-900">{plan.plan}</h4>
                       <span className="text-[9px] font-black text-slate-400 uppercase">Effort: {plan.effort}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-emerald-600 font-black text-sm">{plan.impact}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase">{plan.time} TAT</div>
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
            <header className="flex items-center gap-4 mb-8">
               <div className="size-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="size-6" />
               </div>
               <h3 className="text-xl font-black italic uppercase tracking-tight">Manager Directives</h3>
            </header>
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
               <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Data-Driven Suggestion</span>
                     <p className="text-lg font-black italic leading-tight">"Redirect 2 Attendants to the Detailing Bay. Tinting queue is low, but Detailing profit margin is 3x higher."</p>
                  </div>
                  <div className="flex gap-2">
                     <Button className="flex-1 bg-primary hover:bg-blue-600 text-white rounded-xl h-12 font-black uppercase text-[9px] tracking-widest">
                        Apply Shift Change
                     </Button>
                     <Button variant="outline" className="flex-1 bg-white/10 border-white/20 text-white rounded-xl h-12 font-black uppercase text-[9px] tracking-widest">
                        Dismiss
                     </Button>
                  </div>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
