
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
  Waves
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const SAAS_TENANTS = [
  { id: 'T-001', name: 'SparkFlow Westlands', plan: 'Enterprise', status: 'Active', revenue: 145000, expiry: '2024-12-01' },
  { id: 'T-002', name: 'Elite Car Wash Karen', plan: 'Professional', status: 'Active', revenue: 82000, expiry: '2024-08-15' },
  { id: 'T-003', name: 'Bubbles Kisumu', plan: 'Basic', status: 'Suspended', revenue: 12000, expiry: '2024-04-01' },
  { id: 'T-004', name: 'Mombasa Port Wash', plan: 'Enterprise', status: 'Active', revenue: 210000, expiry: '2025-01-20' },
];

const PRICING_TIERS = [
  { name: 'Basic', price: '4,999', desc: 'Up to 2 Bays, Basic ERP', icon: Waves, color: 'text-blue-500' },
  { name: 'Professional', price: '14,999', desc: 'Unlimited Bays, Logistics Module', icon: Zap, color: 'text-primary' },
  { name: 'Enterprise', price: '39,999', desc: 'Multi-branch, AI Insights, White-label', icon: ShieldCheck, color: 'text-indigo-600' },
];

export default function SaaSAdminPage() {
  const totalRevenue = SAAS_TENANTS.reduce((acc, t) => acc + t.revenue, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="size-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">SaaS Command Center</h1>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Global Tenant Management & Billing</p>
           </div>
        </div>
        <Button className="h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-primary/20">
           <Plus className="size-4" /> Provision New Tenant
        </Button>
      </header>

      {/* Global SaaS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total MRR", value: `KES ${(totalRevenue/1000).toFixed(1)}K`, icon: CreditCard, color: "text-blue-600" },
           { label: "Active Tenants", value: "24", icon: Globe, color: "text-primary" },
           { label: "Global Users", value: "142", icon: Users, color: "text-indigo-600" },
           { label: "System Uptime", value: "99.98%", icon: Zap, color: "text-emerald-600" },
         ].map((kpi, i) => (
           <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden">
             <CardContent className="p-8">
               <kpi.icon className={cn("size-6 mb-4", kpi.color)} />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{kpi.label}</span>
               <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Tenant Roster */}
         <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b bg-slate-50/50">
               <CardTitle className="text-xl font-black uppercase italic">Registered Tenants</CardTitle>
               <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global car wash database</CardDescription>
            </CardHeader>
            <Table>
               <TableHeader>
                  <TableRow className="border-none">
                     <TableHead className="pl-8 uppercase text-[10px] font-black">Business Name</TableHead>
                     <TableHead className="uppercase text-[10px] font-black">Plan</TableHead>
                     <TableHead className="uppercase text-[10px] font-black">Status</TableHead>
                     <TableHead className="uppercase text-[10px] font-black text-right pr-8">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {SAAS_TENANTS.map((tenant) => (
                    <TableRow key={tenant.id} className="h-20 border-slate-50 hover:bg-slate-50 transition-colors">
                       <TableCell className="pl-8">
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 uppercase italic">{tenant.name}</span>
                             <span className="text-[9px] font-black text-slate-400">ID: {tenant.id}</span>
                          </div>
                       </TableCell>
                       <TableCell>
                          <Badge variant="outline" className="font-black text-[9px] uppercase border-primary/20 bg-primary/5 text-primary">
                             {tenant.plan}
                          </Badge>
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

         {/* Local Pricing Tiers */}
         <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8">
            <header className="mb-8">
               <h3 className="text-xl font-black italic uppercase tracking-tight">Standardized Tiers</h3>
               <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Local Market Pricing (KES/Mo)</p>
            </header>
            <div className="space-y-4">
               {PRICING_TIERS.map((tier) => (
                 <div key={tier.name} className="p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div className={cn("size-10 rounded-xl flex items-center justify-center bg-white/10", tier.color)}>
                          <tier.icon className="size-6" />
                       </div>
                       <div className="text-right">
                          <span className="text-[8px] font-black text-slate-500 uppercase">Monthly Fee</span>
                          <div className="text-lg font-black italic leading-none text-primary">KES {tier.price}</div>
                       </div>
                    </div>
                    <h4 className="font-black uppercase text-xs mb-1">{tier.name} Plan</h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight">{tier.desc}</p>
                 </div>
               ))}
            </div>
            <Button className="w-full mt-8 h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">
               Edit Global Pricing Logic
            </Button>
         </Card>
      </div>

      <RoleSwitcher />
    </div>
  );
}
