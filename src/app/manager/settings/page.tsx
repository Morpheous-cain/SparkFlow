
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Smartphone, Globe, Save, CreditCard, ShieldCheck, Upload, Image as ImageIcon, Waves, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function SettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>("https://picsum.photos/seed/sparkflow-logo/200/200");

  const handleSave = () => {
    toast({
      title: "Configuration Synchronized",
      description: "Business identity and logo updated successfully across all nodes.",
    });
  };

  const handleLogoUpload = () => {
    toast({
      title: "Logo Pipeline Active",
      description: "Selecting new brand asset. Encrypting and optimizing for CDN distribution...",
    });
    // Simulate upload delay
    setTimeout(() => {
      setLogoPreview("https://picsum.photos/seed/new-brand/200/200");
      toast({
        title: "Brand Asset Updated",
        description: "Your new logo is now live on Agent, Attendant, and Customer portals.",
      });
    }, 2000);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    toast({
      title: "Logo Removed",
      description: "Reverting to default SparkFlow system icons.",
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Tenant Configuration</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">SaaS Controls & Organizational Branding</p>
        </div>
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none" onClick={handleSave}>
          <Save className="size-4" /> Save Configuration
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organization Info & Logo */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
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
          <CardContent className="p-8 space-y-8">
            {/* Logo Customization Area */}
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Logo</Label>
              <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="relative group">
                  <div className="size-32 rounded-[2rem] bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white transition-all group-hover:scale-105">
                    {logoPreview ? (
                      <Image 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        width={128} 
                        height={128} 
                        className="object-cover size-full"
                        data-ai-hint="company logo"
                      />
                    ) : (
                      <Waves className="size-12 text-primary opacity-20" />
                    )}
                  </div>
                  {logoPreview && (
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 size-8 rounded-full shadow-lg border-2 border-white scale-0 group-hover:scale-100 transition-transform"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 uppercase text-xs">Custom Brand Asset</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">Recommended: 512x512px. Transparent PNG or High-Res JPG.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Button 
                      onClick={handleLogoUpload}
                      className="h-10 rounded-xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest gap-2 px-6 border-none hover:bg-black transition-all"
                    >
                      <Upload className="size-3" /> Upload Logo
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-10 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest gap-2 px-6 bg-white"
                    >
                      <ImageIcon className="size-3" /> Browse Library
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Name</Label>
                <Input defaultValue="SparkFlow Westlands" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Currency</Label>
                  <Input defaultValue="KES" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</Label>
                  <Input defaultValue="+254 700 000000" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
                </div>
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
             <Button className="w-full h-14 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl border-none">
                <CreditCard className="size-4 mr-2" /> Manage Billing with M-Pesa
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
