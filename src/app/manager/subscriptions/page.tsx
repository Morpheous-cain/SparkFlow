
"use client";

import { useState, useEffect } from "react";
import { SUBSCRIPTION_PLANS, VOUCHERS, PROMOTIONS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Ticket, 
  Zap, 
  Crown, 
  Plus, 
  Gift, 
  Calendar, 
  Users, 
  TrendingUp,
  Tag,
  Settings2,
  Trash2,
  Check,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function SubscriptionsManagementPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState(SUBSCRIPTION_PLANS);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Branding (Mocked from central state)
  const customLogoUrl = "https://picsum.photos/seed/sparkflow-logo/200/200";
  const businessName = "SparkFlow Westlands";

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpis = [
    { label: "Active Subscription Base", value: "420 Members", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Monthly Recurring Revenue", value: "KES 840,000", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Vouchers Redeemed", value: "1,240 Codes", icon: Gift, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Promotional Campaigns", value: "2 Live", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const handleSavePlan = () => {
    setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
    toast({
      title: "Plan Configuration Synchronized",
      description: `${editingPlan.name} membership details have been updated globally.`,
    });
    setEditingPlan(null);
  };

  const handleSaveVoucher = () => {
    toast({
      title: "Voucher Updated",
      description: `Discount code ${editingVoucher.code} configuration has been saved.`,
    });
    setEditingVoucher(null);
  };

  const handleAddBenefit = () => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: [...editingPlan.benefits, "New Membership Perk"]
    });
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    if (!editingPlan) return;
    const newBenefits = [...editingPlan.benefits];
    newBenefits[index] = value;
    setEditingPlan({ ...editingPlan, benefits: newBenefits });
  };

  const handleRemoveBenefit = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: editingPlan.benefits.filter((_: any, i: number) => i !== index)
    });
  };

  const handleIssueVoucher = () => {
    toast({ title: "Voucher Engine", description: "Generating unique single-use discount codes for loyalty campaign..." });
  };

  const handleCreatePromo = () => {
    toast({ title: "Promotion Engine", description: "Configuring new seasonal 'Rainy Season' triggers..." });
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
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Membership & Rewards</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{businessName} • Loyalty Protocol</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200/50"
            onClick={handleIssueVoucher}
          >
            <Ticket className="size-4" /> Issue Voucher
          </Button>
          <Button 
            className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none"
            onClick={handleCreatePromo}
          >
            <Plus className="size-4" /> Create Promotion
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[8px] uppercase tracking-widest rounded-full px-3 py-1">CORE PROTOCOL</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 uppercase italic">Tiered Membership Architect</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white flex flex-col relative">
                <div className={cn(
                  "p-8 text-white text-center relative",
                  plan.name === 'Silver' ? "bg-slate-400" : 
                  plan.name === 'Gold' ? "bg-amber-500" : "bg-slate-900"
                )}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => setEditingPlan({ ...plan })}
                  >
                    <Settings2 className="size-4" />
                  </Button>
                  <Crown className="size-10 mx-auto mb-3 drop-shadow-lg" />
                  <h4 className="text-2xl font-black uppercase tracking-widest italic leading-none">{plan.name}</h4>
                  <p className="text-[10px] font-black opacity-70 uppercase mt-2 tracking-widest">KES {plan.price.toLocaleString()} PER MONTH</p>
                </div>
                <CardContent className="p-8 space-y-4 flex-1">
                  <div className="space-y-3">
                    {plan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 text-[10px] font-bold text-slate-600 uppercase leading-tight">
                        <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-8 pt-0 mt-auto border-t border-dashed border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Tier Discount</span>
                  <Badge className="bg-emerald-50 text-emerald-600 font-black border-none text-xs px-3 py-1">{plan.discount}% OFF</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6 pt-4">
             <h3 className="text-xl font-black text-slate-900 uppercase italic">Live Promotional Campaigns</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {PROMOTIONS.map((promo) => (
                 <Card key={promo.id} className="border-none shadow-sm rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-16 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                   <CardContent className="p-10 space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="size-14 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                          <Zap className="size-7 text-white fill-current" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                            <Settings2 className="size-4" />
                          </Button>
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">ACTIVE</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black uppercase tracking-tight italic">{promo.title}</h4>
                        <p className="text-xs font-bold text-indigo-100 mt-2 leading-relaxed uppercase opacity-80">{promo.description}</p>
                      </div>
                      <div className="pt-6 border-t border-white/10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-200">
                        <Calendar className="size-4" />
                        Ends {new Date(promo.endDate).toLocaleDateString()}
                      </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black uppercase tracking-tight italic">Digital Vouchers</CardTitle>
            <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Manual coupon & seasonal code audits</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {VOUCHERS.map((voucher) => (
              <div key={voucher.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Tag className="size-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-slate-900 uppercase text-sm tracking-widest italic">{voucher.code}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0 border-none bg-primary/10 text-primary">
                        {voucher.type === 'Percentage' ? `${voucher.discount}% OFF` : `KES ${voucher.discount} OFF`}
                      </Badge>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest",
                        voucher.status === 'Active' ? "text-emerald-600" : "text-slate-400"
                      )}>{voucher.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Expires on {new Date(voucher.expiry).toLocaleDateString()}</span>
                  <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl text-[9px] font-black hover:bg-slate-100 text-slate-900 uppercase" onClick={() => setEditingVoucher(voucher)}>
                    Configure Code
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-900/20 border-none hover:bg-black">
            Generate Bulk Discount Codes
          </Button>
        </Card>
      </div>

      {/* Branded Plan Editor Modal */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white font-body">
          <div className="p-10 bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-16 -mr-16 -mt-16 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-5">
               <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <Crown className="size-8 text-primary" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Edit {editingPlan?.name} Tier</DialogTitle>
                  <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                    Branded Configuration Hub • {businessName}
                  </DialogDescription>
               </div>
            </div>
          </div>
          
          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly Price (KES)</Label>
                <Input 
                  type="number"
                  value={editingPlan?.price} 
                  onChange={(e) => setEditingPlan({...editingPlan, price: Number(e.target.value)})}
                  className="h-14 rounded-2xl font-black text-lg border-2 bg-slate-50 focus:border-primary transition-all text-center" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Discount Rate (%)</Label>
                <Input 
                  type="number"
                  value={editingPlan?.discount} 
                  onChange={(e) => setEditingPlan({...editingPlan, discount: Number(e.target.value)})}
                  className="h-14 rounded-2xl font-black text-lg border-2 bg-slate-50 focus:border-primary transition-all text-center" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Membership Perks</Label>
                <Button variant="ghost" size="sm" className="h-8 rounded-xl text-[9px] font-black uppercase bg-primary/5 text-primary border-none" onClick={handleAddBenefit}>
                  <Plus className="size-3 mr-2" /> Add perk
                </Button>
              </div>
              <div className="space-y-3">
                {editingPlan?.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex gap-3 group">
                    <div className="flex-1 relative">
                      <Input 
                        value={benefit} 
                        onChange={(e) => handleUpdateBenefit(idx, e.target.value)}
                        className="h-12 rounded-xl text-xs font-bold border-2 bg-slate-50 group-hover:bg-white transition-colors pl-4"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="size-12 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all border-none" onClick={() => handleRemoveBenefit(idx)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-10 bg-slate-50 gap-4">
            <Button variant="outline" className="h-16 rounded-2xl flex-1 font-black uppercase text-[10px] tracking-widest border-2 bg-white" onClick={() => setEditingPlan(null)}>Abort</Button>
            <Button className="h-16 rounded-2xl flex-[2] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 bg-primary hover:bg-blue-600 text-white border-none" onClick={handleSavePlan}>
              <Check className="size-4 mr-2" /> Save & Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voucher Editor Modal */}
      <Dialog open={!!editingVoucher} onOpenChange={(open) => !open && setEditingVoucher(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white font-body">
          <div className="p-8 bg-slate-900 text-white flex items-center gap-4">
             <div className="size-12 bg-primary rounded-xl flex items-center justify-center">
                <Tag className="size-6" />
             </div>
             <div>
                <DialogTitle className="text-xl font-black uppercase italic">Voucher Control</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">Update code parameters</DialogDescription>
             </div>
          </div>
          <div className="p-8 space-y-6">
             <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Coupon Code</Label>
                <Input 
                  value={editingVoucher?.code} 
                  onChange={(e) => setEditingVoucher({...editingVoucher, code: e.target.value.toUpperCase()})}
                  className="h-14 text-2xl font-black font-mono tracking-widest text-center rounded-2xl border-4 border-slate-50 bg-slate-50 focus:bg-white transition-all uppercase"
                />
             </div>
             <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Discount Value</Label>
                <Input 
                  type="number"
                  value={editingVoucher?.discount} 
                  onChange={(e) => setEditingVoucher({...editingVoucher, discount: Number(e.target.value)})}
                  className="h-12 rounded-xl font-bold border-2"
                />
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50">
             <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-slate-900 text-white border-none" onClick={handleSaveVoucher}>
                Commit Changes
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
