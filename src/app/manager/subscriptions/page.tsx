"use client";

import { SUBSCRIPTION_PLANS, VOUCHERS, PROMOTIONS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Ticket, 
  Zap, 
  Star, 
  Crown, 
  Plus, 
  Gift, 
  Calendar, 
  Users, 
  TrendingUp,
  Tag,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubscriptionsManagementPage() {
  const kpis = [
    { label: "Active Subscribers", value: "420", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Monthly Recurring", value: "KES 840K", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Vouchers Used", value: "1.2K", icon: Gift, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Promos", value: "2", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic text-primary">Loyalty & Subscriptions</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Tiered Memberships & Promotional Engine</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            <Ticket className="size-4" /> Issue Voucher
          </Button>
          <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest">
            <Plus className="size-4" /> Create Promotion
          </Button>
        </div>
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
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">CORE</Badge>
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
        {/* Subscription Tiers */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 italic uppercase">Membership Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card key={plan.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
                <div className={cn(
                  "p-6 text-white text-center",
                  plan.name === 'Silver' ? "bg-slate-400" : 
                  plan.name === 'Gold' ? "bg-amber-500" : "bg-slate-900"
                )}>
                  <Crown className="size-8 mx-auto mb-2" />
                  <h4 className="text-xl font-black uppercase tracking-widest italic">{plan.name}</h4>
                  <p className="text-[10px] font-bold opacity-70 uppercase">KES {plan.price.toLocaleString()} / MO</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    {plan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
                        <Zap className="size-3 text-primary shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-dashed flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Discount Rate</span>
                    <Badge className="bg-emerald-50 text-emerald-600 font-black border-none text-[10px]">{plan.discount}% OFF</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6 pt-4">
             <h3 className="text-xl font-black text-slate-900 italic uppercase">Active Promotions</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {PROMOTIONS.map((promo) => (
                 <Card key={promo.id} className="border-none shadow-sm rounded-[2rem] bg-indigo-600 text-white overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                   <CardContent className="p-8 space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                          <Zap className="size-6 text-white" />
                        </div>
                        <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase">LIVE</Badge>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tight">{promo.title}</h4>
                        <p className="text-xs font-bold text-indigo-100 mt-2 leading-relaxed">{promo.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-indigo-200">
                        <Calendar className="size-3" />
                        Ends {new Date(promo.endDate).toLocaleDateString()}
                      </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>
        </div>

        {/* Voucher Management */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black italic uppercase tracking-tight">Active Vouchers</CardTitle>
            <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Manual coupon & seasonal code audits</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {VOUCHERS.map((voucher) => (
              <div key={voucher.id} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="size-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-slate-900 italic uppercase text-xs">{voucher.code}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0 border-none bg-primary/10 text-primary">
                        {voucher.type === 'Percentage' ? `${voucher.discount}% OFF` : `KES ${voucher.discount} OFF`}
                      </Badge>
                      <span className={cn(
                        "text-[8px] font-black uppercase",
                        voucher.status === 'Active' ? "text-emerald-600" : "text-slate-400"
                      )}>{voucher.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Expires {new Date(voucher.expiry).toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 rounded-lg text-[8px] font-black">EDIT</Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-900/20">
            Generate Bulk Codes
          </Button>
        </Card>
      </div>
    </div>
  );
}
