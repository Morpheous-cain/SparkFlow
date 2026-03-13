
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Smartphone, Globe, Save, CreditCard, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Tenant Configuration</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">SaaS Controls & Organizational Branding</p>
        </div>
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest">
          <Save className="size-4" /> Save Configuration
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organization Info */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Globe className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black italic uppercase">Business Identity</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase text-slate-400">Publicly visible branding</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Name</Label>
              <Input defaultValue="SparkFlow Westlands" className="h-12 rounded-xl font-bold border-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Currency</Label>
                <Input defaultValue="KES" className="h-12 rounded-xl font-bold border-2" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</Label>
                <Input defaultValue="+254 700 000000" className="h-12 rounded-xl font-bold border-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SaaS Subscription Info */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/20 rounded-full blur-3xl" />
          <CardHeader className="p-8 pb-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-black italic uppercase">SaaS Plan</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase text-slate-400">Subscription & Billing Status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6 relative z-10">
             <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/10">
                <div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Active Plan</span>
                   <h3 className="text-2xl font-black italic uppercase">Professional</h3>
                </div>
                <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase">Active</Badge>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                   <span>Renewal Date</span>
                   <span className="text-white">Dec 01, 2024</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                   <span>Monthly Fee</span>
                   <span className="text-white text-lg italic font-black">KES 14,999</span>
                </div>
             </div>
             <Button className="w-full h-14 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">
                <CreditCard className="size-4 mr-2" /> Manage Billing with M-Pesa
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
