
"use client";

import { useState, useEffect } from "react";
import type { Service } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, Wrench, Plus, Star, Zap, Gauge, Check, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Branding (Mocked from central state)
  const customLogoUrl = "https://picsum.photos/seed/sparkflow-logo/200/200";
  const businessName = "SparkFlow Westlands";

  useEffect(() => {
    setMounted(true);
    fetch('/api/services', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setServices(data))
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Active Services", value: services.length.toString(), icon: Wrench, color: "text-blue-600", bg: "bg-blue-50", trend: "Stable" },
    { label: "Most Popular", value: "Executive Wash", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "High Demand" },
    { label: "Avg. Duration", value: "45m", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", trend: "-2m" },
    { label: "Service Margin", value: "68%", icon: Gauge, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+1.2%" },
  ];

  const handleSaveService = () => {
    setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    toast({
      title: "Catalog Updated",
      description: `${editingService.name} parameters have been synchronized across all booking nodes.`,
    });
    setEditingService(null);
  };

  const handleCreateNew = () => {
    toast({
      title: "Provisioning Sequence",
      description: "Opening 'New Service Protocol' wizard. Select a category to begin.",
    });
  };

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen font-body">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-2 border-primary/10 relative">
             <Image src={customLogoUrl} alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Service Repository</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{businessName} • Operational Catalog</p>
          </div>
        </div>
        <Button 
          className="gap-2 rounded-[1.5rem] h-14 px-8 shadow-2xl shadow-primary/20 bg-primary hover:bg-blue-600 transition-all text-white border-none font-black uppercase text-[10px] tracking-widest"
          onClick={handleCreateNew}
        >
          <Plus className="size-4" /> Provision New Service
        </Button>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full px-3 py-1">
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
        {services.map((service) => (
          <Card key={service.id} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group bg-white hover:shadow-2xl transition-all duration-500">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="size-16 bg-primary/10 rounded-[1.5rem] text-primary flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner">
                  <Wrench className="size-8" />
                </div>
                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">{service.category}</Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{service.name}</h3>
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5" />
                    <span>{service.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="size-3.5" />
                    <span>Active Unit</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-6 border-t border-dashed border-slate-100">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">Base Listing Price</span>
                  <span className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">KES {service.price.toLocaleString()}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all gap-2"
                  onClick={() => setEditingService(service)}
                >
                  <Settings2 className="size-3.5" /> Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Branded Service Editor */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white font-body">
          <div className="p-10 bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-16 -mr-16 -mt-16 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-5">
               <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
                  <Wrench className="size-8 text-white" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Edit Service Node</DialogTitle>
                  <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                    System Configuration Hub • {businessName}
                  </DialogDescription>
               </div>
            </div>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Protocol Name</Label>
              <Input 
                value={editingService?.name} 
                onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                className="h-14 rounded-2xl font-black text-lg border-2 bg-slate-50 focus:bg-white transition-all uppercase" 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Listing Price (KES)</Label>
                <Input 
                  type="number"
                  value={editingService?.price} 
                  onChange={(e) => setEditingService({...editingService, price: Number(e.target.value)})}
                  className="h-14 rounded-2xl font-black text-lg border-2 bg-slate-50 text-center" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Est. Duration (Mins)</Label>
                <Input 
                  type="number"
                  value={editingService?.duration} 
                  onChange={(e) => setEditingService({...editingService, duration: Number(e.target.value)})}
                  className="h-14 rounded-2xl font-black text-lg border-2 bg-slate-50 text-center" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unique Selling Proposition (USP)</Label>
              <Input 
                value={editingService?.usp} 
                onChange={(e) => setEditingService({...editingService, usp: e.target.value})}
                className="h-14 rounded-2xl font-bold text-sm border-2 bg-slate-50" 
              />
            </div>
          </div>

          <DialogFooter className="p-10 bg-slate-50 gap-4">
            <Button variant="outline" className="h-16 rounded-2xl flex-1 font-black uppercase text-[10px] tracking-widest border-2" onClick={() => setEditingService(null)}>Discard</Button>
            <Button className="h-16 rounded-2xl flex-[2] font-black uppercase text-[10px] tracking-widest bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20" onClick={handleSaveService}>
              <Check className="size-4 mr-2" /> Commit Node Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
