"use client";

import { STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, UserCheck, Users, Briefcase, Award, Wallet, Coins, HandCoins } from "lucide-react";

export default function StaffPage() {
  const kpis = [
    { label: "Active Team", value: STAFF.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Full Capacity" },
    { label: "Avg. Efficiency", value: "4.73", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "+2.1%" },
    { label: "Commission Paid", value: "KES 24.2K", icon: Coins, color: "text-indigo-600", bg: "bg-indigo-50", trend: "On Target" },
    { label: "Top Performer", value: "96%", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Grace M." },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header>
        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Human Capital Core</h1>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Earnings Transparency & Performance Audits</p>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">
                  {kpi.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAFF.map((member) => (
          <Card key={member.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
            <CardHeader className="flex flex-row items-center gap-4 p-8 pb-4">
              <div className="relative">
                <Avatar className="size-16 border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                  <AvatarImage src={`https://picsum.photos/seed/${member.id}/100`} />
                  <AvatarFallback className="bg-primary text-white font-black">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-white" title="Online" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 italic">{member.name}</h3>
                  <Badge variant="secondary" className="bg-primary text-white border-none text-[8px] font-black uppercase tracking-widest px-3">{member.role}</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <Star className="size-3 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{member.performance} Efficiency score</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="p-6 bg-slate-50 rounded-[1.5rem] space-y-4 shadow-inner border border-slate-100">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Wallet className="size-3.5 text-primary" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Breakdown</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black border-primary/20 bg-white">LIVE EARNINGS</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase opacity-60">Base Salary</span>
                       <span className="text-sm font-black text-slate-900">KES {member.earnings.base.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col text-right">
                       <span className="text-[9px] font-black text-slate-500 uppercase opacity-60">Commission</span>
                       <span className="text-sm font-black text-emerald-600">+ KES {member.earnings.commission.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Staff Tips (Direct)</span>
                    <span className="text-sm font-black text-amber-600">KES {member.earnings.tips.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 -mr-10 -mt-10 bg-primary/20 rounded-full blur-xl" />
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">Total Payout</span>
                  <div className="text-2xl font-black italic tracking-tighter">KES {member.earnings.total.toLocaleString()}</div>
                </div>
                <HandCoins className="size-8 text-white/20 relative z-10" />
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest justify-center">
                <TrendingUp className="size-3" />
                <span>Performance Bonus Active</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
