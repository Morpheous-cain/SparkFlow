
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
  Share2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const { toast } = useToast();
  const lowStockCount = INVENTORY.filter(item => item.stock < 20).length;
  const totalValue = INVENTORY.reduce((acc, item) => acc + (item.stock * item.wholesale), 0);

  const kpis = [
    { label: "Total Stock Items", value: INVENTORY.length.toString(), icon: Layers, color: "text-blue-600", bg: "bg-blue-50", trend: "Optimal" },
    { label: "Low Stock Alerts", value: lowStockCount.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", trend: lowStockCount > 0 ? "Action Required" : "All Clear" },
    { label: "Wholesale Value", value: `KES ${(totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+2.4%" },
    { label: "Stock Turn Rate", value: "4.2x", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50", trend: "+0.8%" },
  ];

  const handleLaunchCampaign = (itemName: string) => {
    toast({
      title: "Campaign Launched",
      description: `Discount offer for ${itemName} pushed to customer app.`,
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Merchandise & Supplies</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Velocity Tracking & Automated Campaigns</p>
        </div>
        <Button className="rounded-2xl h-12 bg-slate-900 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl shadow-slate-900/10">
           Manual Audit Log
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
                <Badge className={cn(
                  "border-none font-black text-[8px] uppercase tracking-widest rounded-full",
                  kpi.color === 'text-red-600' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                )}>
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
        {INVENTORY.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <div className="size-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Package className="size-6" />
                  </div>
                  <div className="flex flex-col">
                     <h3 className="text-lg font-black text-slate-900 italic uppercase leading-none">{item.name}</h3>
                     <div className="flex items-center gap-2 mt-2">
                        {item.velocity === 'Fast' ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-tighter animate-pulse">
                            <ArrowUpRight className="size-2 mr-1" /> FAST MOVING
                          </Badge>
                        ) : item.velocity === 'Slow' ? (
                          <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[8px] uppercase tracking-tighter">
                            <TrendingDown className="size-2 mr-1" /> STAGNANT
                          </Badge>
                        ) : null}
                        <span className="text-[9px] font-black text-slate-400 uppercase">{item.margin}% Margin</span>
                     </div>
                  </div>
                </div>
                {item.stock < 20 && (
                  <Badge className="bg-red-50 text-red-600 border-none font-black text-[8px] uppercase">
                    LOW STOCK
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-end bg-slate-50 p-4 rounded-2xl">
                <div>
                   <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Available Inventory</span>
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">{item.stock}</span>
                </div>
                <div className="text-right">
                   <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Wholesale Est.</span>
                   <span className="text-lg font-black text-slate-600 italic">KES {item.wholesale.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Usage Cycle Capacity</span>
                  <span>{Math.min(100, (item.stock / 150) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(item.stock / 150) * 100} className="h-1.5 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Retail Price</span>
                  <span className="font-black text-slate-900 text-lg">KES {item.retail}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Profit/Unit</span>
                  <span className="font-black text-emerald-600 text-lg">KES {item.retail - item.wholesale}</span>
                </div>
              </div>

              {item.velocity === 'Slow' && (
                <Button 
                  onClick={() => handleLaunchCampaign(item.name)}
                  className="w-full h-12 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl gap-2 shadow-lg shadow-primary/20"
                >
                  <Zap className="size-3" /> Liquidate Stock Promo
                </Button>
              )}
              
              {item.velocity === 'Fast' && (
                <Button 
                  variant="outline"
                  className="w-full h-12 border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest rounded-xl gap-2"
                >
                  <Share2 className="size-3" /> Push to Loyalty Rewards
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
