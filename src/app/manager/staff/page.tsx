
"use client";

import { STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, UserCheck, Users, Briefcase, Award } from "lucide-react";

export default function StaffPage() {
  const kpis = [
    { label: "Active Staff", value: STAFF.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "All Active" },
    { label: "Avg. Team Rating", value: "4.73", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "+2.1%" },
    { label: "Jobs Completed", value: "842", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Target Met" },
    { label: "Top Efficiency", value: "96%", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Grace M." },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
        <p className="text-slate-500">Monitor and manage your service team</p>
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
                <Badge className="bg-slate-100 border-none font-bold rounded-full">
                  {kpi.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAFF.map((member) => (
          <Card key={member.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all bg-white">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <Avatar className="size-14 border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                <AvatarImage src={`https://picsum.photos/seed/${member.id}/100`} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase">{member.role}</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <Star className="size-3 fill-current" />
                  <span className="text-xs font-bold">{member.performance} Rating</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Earned</span>
                  <span className="font-bold text-slate-900">KES {member.earnings.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Jobs Done</span>
                  <span className="font-bold text-slate-900">124</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 p-2 rounded-xl">
                <TrendingUp className="size-3" />
                <span>Active Performance Streak</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
