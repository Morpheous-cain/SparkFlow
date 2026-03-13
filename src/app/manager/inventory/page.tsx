"use client";

import { INVENTORY } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ShoppingCart,
  Zap,
  ArrowUpRight,
  TrendingDown,
  Share2,
  Sparkles
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const { toast } = useToast();
  const lowStockCount = INVENTORY.filter(item => item.stock < 20).length;
  const totalValue = INVENTORY.reduce((acc, item) => acc + (item.stock * item.wholesale), 0);

  const kpis = [
    { label: "Inventory SKUs", value: INVENTORY.length.toString(), icon: Layers, color: "text-blue-600", bg: "bg-blue-50", trend: "Optimal", layer: 'bg-blue-500' },
    { label: "Low Stock Alerts", value: lowStockCount.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", trend: lowStockCount > 0 ? "Action Required" : "All Clear", layer: 'bg-red-500' },
    { label: "Wholesale Value", value: `KES ${(totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+2.4%", layer: 'bg-emerald-500' },
    { label: "Turnover Rate", value: "4.2x", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50", trend: "+0.8%", layer: 'bg-amber-500' },
  ];

  const handleLaunchCampaign = (itemName: string) => {
    toast({
      title: "Campaign Launched",
      description: `Discount offer for ${itemName} pushed to customer app.`,
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Merchandise Center</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Velocity Tracking & Automated Campaigns</p>
        </div>
        <Button className="rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest px-8 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all">
           New Audit Entry
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
            <div className={cn("absolute top-0 left-0 w-full h-2", kpi.layer)} />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className={cn(
                  "border-none font-black text-[9px] uppercase tracking-widest rounded-full px-3 py-1",
                  kpi.color === 'text-red-600' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 text-slate-400'
                )}>
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
        {INVENTORY.map((item) => (
          <Card key={item.id} className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                   <div className="size-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                    <Package className="size-8" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xl font-black text-slate-900 uppercase leading-none">{item.name}</h3>
                     <div className="flex items-center gap-2">
                        {item.velocity === 'Fast' ? (
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-tighter px-3 py-0.5 animate-pulse">
                            <ArrowUpRight className="size-3 mr-1" /> FAST MOVING
                          </Badge>
                        ) : item.velocity === 'Slow' ? (
                          <Badge className="bg-amber-500 text-white border-none font-black text-[9px] uppercase tracking-tighter px-3 py-0.5">
                            <TrendingDown className="size-3 mr-1" /> STAGNANT
                          </Badge>
                        ) : null}
                        <span className="text-[10px] font-black text-slate-300 uppercase">{item.margin}% MARGIN</span>
                     </div>
                  </div>
                </div>
                {item.stock < 20 && (
                  <Badge className="bg-red-500 text-white border-none font-black text-[9px] uppercase px-3 py-1 shadow-lg shadow-red-500/20">
                    REORDER
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-end bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Stock Units</span>
                   <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{item.stock}</span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Wholesale</span>
                   <span className="text-xl font-black text-slate-500">KES {item.wholesale.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Supply Capacity</span>
                  <span className="text-primary">{Math.min(100, (item.stock / 150) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(item.stock / 150) * 100} className="h-2 rounded-full bg-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-dashed border-slate-200">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Retail SRP</span>
                  <span className="font-black text-slate-900 text-2xl tracking-tighter">KES {item.retail}</span>
                </div>
                <div className="flex flex-col text-right gap-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Est. Profit</span>
                  <span className="font-black text-emerald-600 text-2xl tracking-tighter">+ KES {item.retail - item.wholesale}</span>
                </div>
              </div>

              <div className="pt-2">
                {item.velocity === 'Slow' ? (
                  <Button 
                    onClick={() => handleLaunchCampaign(item.name)}
                    className="w-full h-16 bg-primary text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    <Zap className="size-5" /> Liquidate Stock Promo
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full h-16 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] gap-3 transition-all"
                  >
                    <Share2 className="size-5" /> Push to Loyalty Rewards
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
