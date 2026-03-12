
"use client";

import { SERVICES } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, Wrench, Plus, Star, Zap, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const kpis = [
    { label: "Active Services", value: SERVICES.length.toString(), icon: Wrench, color: "text-blue-600", bg: "bg-blue-50", trend: "Stable" },
    { label: "Most Popular", value: "Executive Wash", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "High Demand" },
    { label: "Avg. Duration", value: "45m", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", trend: "-2m" },
    { label: "Service Margin", value: "68%", icon: Gauge, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+1.2%" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Catalog</h1>
          <p className="text-slate-500">Manage your car wash offerings and pricing</p>
        </div>
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="size-4" /> Add Service
        </Button>
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
        {SERVICES.map((service) => (
          <Card key={service.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group bg-white">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                  <Wrench className="size-6" />
                </div>
                <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[10px] uppercase">{service.category}</Badge>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{service.name}</h3>
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{service.duration} mins</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Tag className="size-3" />
                    <span>Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-dashed">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Base Price</span>
                  <span className="text-2xl font-black text-slate-900">KES {service.price.toLocaleString()}</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold bg-white">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
