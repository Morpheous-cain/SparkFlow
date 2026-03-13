
"use client";

import { BRANCHES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Plus, Building2, TrendingUp, Warehouse, Globe, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchManagementPage() {
  const totalRevenue = BRANCHES.reduce((acc, b) => acc + b.revenueMTD, 0);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Branch Network</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Global Station Monitoring & Multi-Unit Ops</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            <Globe className="size-4" /> Consolidated View
          </Button>
          <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest">
            <Plus className="size-4" /> Add Branch
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Branches", value: BRANCHES.length.toString(), icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Consolidated MRR", value: `KES ${(totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Bays", value: BRANCHES.reduce((acc, b) => acc + b.activeBays, 0).toString(), icon: Warehouse, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Network Health", value: "98.2%", icon: Settings2, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">HQ</Badge>
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
        {BRANCHES.map((branch) => (
          <Card key={branch.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500">
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/10">
                  <Building2 className="size-7" />
                </div>
                <Badge className={cn(
                  "font-black text-[9px] uppercase px-3 py-1",
                  branch.status === 'Open' ? 'bg-emerald-500' : 'bg-red-500'
                )}>
                  {branch.status}
                </Badge>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{branch.name}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{branch.id}</p>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                  <MapPin className="size-4 text-primary" />
                  {branch.location}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                  <User className="size-4 text-primary" />
                  Mgr: {branch.managerName}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                  <Phone className="size-4 text-primary" />
                  {branch.phone}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Revenue MTD</span>
                  <span className="text-lg font-black text-emerald-600">KES {branch.revenueMTD.toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Active Bays</span>
                  <span className="text-lg font-black text-slate-900">{branch.activeBays} / 5</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed flex gap-2">
                <Button className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest">
                  Branch Dashboard
                </Button>
                <Button variant="outline" className="size-12 rounded-xl border-2 p-0 flex items-center justify-center">
                  <Settings2 className="size-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
