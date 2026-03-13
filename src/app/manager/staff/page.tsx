"use client";

import { STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, UserCheck, Users, Briefcase, Award, Wallet, Coins, HandCoins, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StaffPage() {
  const kpis = [
    { label: "Active Team", value: STAFF.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Full Capacity", layer: 'bg-blue-500' },
    { label: "Avg. Efficiency", value: "4.73", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "+2.1%", layer: 'bg-amber-500' },
    { label: "Commission Paid", value: "KES 24.2K", icon: Coins, color: "text-indigo-600", bg: "bg-indigo-50", trend: "On Target", layer: 'bg-indigo-500' },
    { label: "Top Performer", value: "96%", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Grace M.", layer: 'bg-emerald-500' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Human Capital Core</h1>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Earnings Transparency & Performance Audits</p>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
            <div className={cn("absolute top-0 left-0 w-full h-2", kpi.layer)} />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest rounded-full px-3 py-1">
                  {kpi.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STAFF.map((member) => (
          <Card key={member.id} className="border-none shadow-xl rounded-[3rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
            <CardHeader className="flex flex-row items-center gap-6 p-10 pb-6">
              <div className="relative">
                <Avatar className="size-20 border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <AvatarImage src={`https://picsum.photos/seed/${member.id}/200`} />
                  <AvatarFallback className="bg-primary text-white font-black text-lg">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" title="Online" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{member.name}</h3>
                  <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 shadow-lg shadow-primary/20">{member.role}</Badge>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <Star className="size-4 fill-current" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{member.performance} Productivity Score</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 shadow-inner border border-slate-100">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Wallet className="size-5 text-primary" />
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Earnings Audit</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-white px-3 py-1">REAL-TIME PAYOUT</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-slate-500 uppercase opacity-60 tracking-widest">Base Salary</span>
                       <span className="text-xl font-black text-slate-900 tracking-tighter">KES {member.earnings.base.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col text-right gap-1">
                       <span className="text-[10px] font-black text-slate-500 uppercase opacity-60 tracking-widest">Commission</span>
                       <span className="text-xl font-black text-emerald-600 tracking-tighter">+ {member.earnings.commission.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct Tips</span>
                    <span className="text-lg font-black text-amber-600 tracking-tighter">KES {member.earnings.tips.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-br from-slate-900 to-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/payout">
                <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/30 rounded-full blur-3xl group-hover/payout:scale-125 transition-transform" />
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-2 leading-none">Total Net Payout</span>
                  <div className="text-4xl font-black tracking-tighter leading-none italic">KES {member.earnings.total.toLocaleString()}</div>
                </div>
                <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5 relative z-10">
                  <HandCoins className="size-8 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-[11px] font-black text-emerald-600 uppercase tracking-widest justify-center bg-emerald-50 py-4 rounded-2xl border border-emerald-100/50">
                <Sparkles className="size-4 animate-bounce" />
                <span>Performance Incentives Active</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
