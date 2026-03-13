"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Globe, 
  Plus, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  MoreVertical,
  Zap,
  CheckCircle2,
  Waves,
  Hash,
  Coins,
  ArrowUpRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { cn } from "@/lib/utils";

const SAAS_TENANTS = [
  { id: 'T-001', name: 'SparkFlow Westlands', plan: 'Enterprise', status: 'Active', revenue: 145000, smsBalance: 2450, expiry: '2024-12-01' },
  { id: 'T-002', name: 'Elite Car Wash Karen', plan: 'Professional', status: 'Active', revenue: 82000, smsBalance: 120, expiry: '2024-08-15' },
  { id: 'T-003', name: 'Bubbles Kisumu', plan: 'Basic', status: 'Suspended', revenue: 12000, smsBalance: 0, expiry: '2024-04-01' },
  { id: 'T-004', name: 'Mombasa Port Wash', plan: 'Enterprise', status: 'Active', revenue: 210000, smsBalance: 5800, expiry: '2025-01-20' },
];

const PRICING_TIERS = [
  { name: 'Basic', price: '4,999', desc: 'Up to 2 Bays, Basic ERP', icon: Waves, color: 'text-blue-500' },
  { name: 'Professional', price: '14,999', desc: 'Unlimited Bays, Logistics Module', icon: Zap, color: 'text-primary' },
  { name: 'Enterprise', price: '39,999', desc: 'Multi-branch, AI Insights, White-label', icon: ShieldCheck, color: 'text-indigo-600' },
];

export default function SaaSAdminPage() {
  const totalRevenue = SAAS_TENANTS.reduce((acc, t) => acc + t.revenue, 0);
  const totalSMSRevenue = 142500; // Mock total from SMS recharges

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="size-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">SaaS Command Center</h1>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Global Tenant Management & Billing</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white border-2">
            SMS Gateway Logs
          </Button>
          <Button className="h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-primary/20">
             <Plus className="size-4" /> Provision New Tenant
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Subscription MRR", value: `KES ${(totalRevenue/1000).toFixed(1)}K`, icon: CreditCard, color: "text-blue-600" },
           { label: "SMS Bundle Revenue", value: `KES ${(totalSMSRevenue/1000).toFixed(1)}K`, icon: Hash, color: "text-amber-600" },
           { label: "Active Tenants", value: "24", icon: Globe, color: "text-primary" },
           { label: "Global Users", value: "142", icon: Users, color: "text-indigo-600" },
         ].map((kpi, i) => (
           <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
             <CardContent className="p-8">
               <div className="flex justify-between items-start mb-4">
                  <kpi.icon className={cn("size-6", kpi.color)} />
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase tracking-tighter">
                    <ArrowUpRight className="size-2 mr-1" /> +12%
                  </Badge>
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{kpi.label}</span>
               <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b bg-slate-50/50">
               <CardTitle className="text-xl font-black uppercase">Registered Tenants</CardTitle>
               <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global car wash database</CardDescription>
            </CardHeader>
            <Table>
               <TableHeader className="bg-slate-50/50 h-12">
                  <TableRow className="border-none">
                     <TableHead className="pl-8 uppercase text-[10px] font-black">Business Name</TableHead>
                     <TableHead className="uppercase text-[10px] font-black">Plan</TableHead>
                     <TableHead className="uppercase text-[10px] font-black">SMS Balance</TableHead>
                     <TableHead className="uppercase text-[10px] font-black">Status</TableHead>
                     <TableHead className="uppercase text-[10px] font-black text-right pr-8">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {SAAS_TENANTS.map((tenant) => (
                    <TableRow key={tenant.id} className="h-20 border-slate-50 hover:bg-slate-50 transition-colors">
                       <TableCell className="pl-8">
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 uppercase">{tenant.name}</span>
                             <span className="text-[9px] font-black text-slate-400">ID: {tenant.id}</span>
                          </div>
                       </TableCell>
                       <TableCell>
                          <Badge variant="outline" className="font-black text-[9px] uppercase border-primary/20 bg-primary/5 text-primary">
                             {tenant.plan}
                          </Badge>
                       </TableCell>
                       <TableCell>
                          <div className="flex items-center gap-2">
                             <Hash className="size-3 text-slate-400" />
                             <span className={cn(
                               "text-xs font-black",
                               tenant.smsBalance < 500 ? "text-red-500" : "text-slate-900"
                             )}>{tenant.smsBalance.toLocaleString()}</span>
                          </div>
                       </TableCell>
                       <TableCell>
                          <Badge className={cn(
                            "font-black text-[9px] uppercase",
                            tenant.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                          )}>
                             {tenant.status}
                          </Badge>
                       </TableCell>
                       <TableCell className="pr-8 text-right">
                          <Button variant="ghost" size="icon" className="rounded-xl">
                             <Settings className="size-4 text-slate-400" />
                          </Button>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>

         <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-16 -mr-20 -mt-20 bg-primary/20 rounded-full blur-3xl" />
            <header className="mb-8 relative z-10">
               <h3 className="text-xl font-black uppercase tracking-tight leading-none text-primary">SMS Revenue Engine</h3>
               <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Provider Markups & Bundle Pricing</p>
            </header>
            <div className="space-y-4 relative z-10">
               {[
                 { name: "Starter Bundle", units: "1,000", cost: "500", retail: "1,500", margin: "KES 1,000" },
                 { name: "Growth Bundle", units: "5,000", cost: "2,000", retail: "6,000", margin: "KES 4,000" },
                 { name: "Enterprise Bulk", units: "20,000", cost: "7,000", retail: "20,000", margin: "KES 13,000" }
               ].map((bundle) => (
                 <div key={bundle.name} className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="justify-between items-start mb-2">
                       <h4 className="font-black uppercase text-xs">{bundle.name}</h4>
                       <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black">{bundle.units} UNITS</Badge>
                    </div>
                    <div className="flex justify-between items-end">
                       <div>
                          <span className="text-[8px] font-black text-slate-500 uppercase block">Retail Price</span>
                          <span className="text-lg font-black text-white">KES {bundle.retail}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[8px] font-black text-slate-500 uppercase block">Provider Margin</span>
                          <span className="text-xs font-black text-emerald-400">{bundle.margin}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <Button className="w-full mt-8 h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">
               Manage Global SMS Markup
            </Button>
         </Card>
      </div>

      <RoleSwitcher />
    </div>
  );
}
