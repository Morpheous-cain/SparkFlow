
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
  Sparkles,
  ShieldCheck,
  PackageCheck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const { toast } = useToast();
  const lowEssentialCount = INVENTORY.filter(item => item.isEssential && item.stock < 15).length;
  const totalValue = INVENTORY.reduce((acc, item) => acc + (item.stock * item.wholesale), 0);

  const kpis = [
    { label: "Essential SKU Count", value: INVENTORY.filter(i => i.isEssential).length.toString(), icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", trend: "Critical", layer: 'bg-blue-500' },
    { label: "Active Material Shortages", value: lowEssentialCount.toString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", trend: lowEssentialCount > 0 ? "Reorder Alert" : "Stable Stock", layer: 'bg-red-500' },
    { label: "Wholesale Inventory Value", value: `KES ${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+2.4% Value", layer: 'bg-emerald-500' },
    { label: "Stock Turnover Velocity", value: "4.2x", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50", trend: "Optimal", layer: 'bg-amber-500' },
  ];

  const handleManualCount = () => {
    toast({
      title: "Stock Audit",
      description: "Entering manual reconciliation mode. Scanner interface activated.",
    });
  };

  const handleUrgentOrder = (itemName: string) => {
    toast({
      title: "Reorder Triggered",
      description: `Purchase Order for ${itemName} has been generated and sent to suppliers via ERP mail.`,
    });
  };

  const handleLaunchCampaign = (itemName: string) => {
    toast({
      title: "Campaign Launched",
      description: `Discount offer for ${itemName} pushed to customer app and SMS gateway.`,
    });
  };

  const handlePushLoyalty = (itemName: string) => {
    toast({
      title: "Loyalty Update",
      description: `${itemName} is now a featured reward in the SparkFlow membership portal.`,
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Merchandise & Materials</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Operational Essentials & Velocity Audit</p>
        </div>
        <Button 
          className="rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest px-8 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all"
          onClick={handleManualCount}
        >
           Manual Stock Count
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
                  kpi.label.includes('Shortages') && lowEssentialCount > 0 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse' : 'bg-slate-50 text-slate-400'
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
                    {item.isEssential ? <ShieldCheck className="size-8 text-primary" /> : <Package className="size-8" />}
                  </div>
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tight">{item.name}</h3>
                     <div className="flex items-center gap-2">
                        {item.isEssential && (
                          <Badge className="bg-primary/10 text-primary border-none font-black text-[8px] uppercase tracking-tighter px-2">OPERATIONAL ESSENTIAL</Badge>
                        )}
                        {item.velocity === 'Fast' && (
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase px-2">FAST MOVING</Badge>
                        )}
                     </div>
                  </div>
                </div>
                {item.stock < 20 && (
                  <Badge className="bg-red-500 text-white border-none font-black text-[9px] uppercase px-3 py-1 shadow-lg shadow-red-500/20 animate-pulse">
                    REORDER NOW
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-end bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Available Stock Units</span>
                   <span className={cn("text-5xl font-black tracking-tighter leading-none", item.stock < 10 ? "text-red-600" : "text-slate-900")}>{item.stock}</span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Asset Category</span>
                   <span className="text-xl font-black text-slate-500 uppercase">{item.isEssential ? 'Material' : 'Merchandise'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Operational Safety Buffer</span>
                  <span className={item.stock < 15 ? 'text-red-500' : 'text-primary'}>{Math.min(100, (item.stock / 150) * 100).toFixed(0)}% Capacity</span>
                </div>
                <Progress value={(item.stock / 150) * 100} className="h-2 rounded-full bg-slate-100" />
              </div>

              <div className="pt-2">
                {item.isEssential && item.stock < 15 ? (
                  <Button 
                    className="w-full h-16 bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] gap-3 shadow-2xl shadow-red-600/30 hover:bg-red-700 transition-all"
                    onClick={() => handleUrgentOrder(item.name)}
                  >
                    <PackageCheck className="size-5" /> Urgent Resupply Order
                  </Button>
                ) : item.velocity === 'Slow' ? (
                  <Button 
                    onClick={() => handleLaunchCampaign(item.name)}
                    className="w-full h-16 bg-primary text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
                  >
                    <Zap className="size-5" /> Liquidate Slow Stock Promo
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full h-16 border-slate-200 bg-white text-slate-500 hover:bg-slate-50 font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] gap-3 transition-all"
                    onClick={() => handlePushLoyalty(item.name)}
                  >
                    <Share2 className="size-5" /> Feature in Loyalty Rewards
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
