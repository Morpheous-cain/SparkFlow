
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Save, 
  CreditCard, 
  ShieldCheck, 
  Upload, 
  Image as ImageIcon, 
  Waves, 
  Trash2, 
  History, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  Printer,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const SAAS_BILLING_HISTORY = [
  { id: 'INV-2024-005', date: 'May 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja' },
  { id: 'INV-2024-004', date: 'Apr 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja' },
  { id: 'INV-2024-003', date: 'Mar 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja' },
  { id: 'INV-2024-002', date: 'Feb 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>("https://picsum.photos/seed/sparkflow-logo/200/200");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [billTo, setBillTo] = useState("Emma Johnson\nSparkFlow Westlands\nRing Road, Westlands\nNairobi, Kenya");
  const [statementNotes, setStatementNotes] = useState("Thank you for your continued partnership with SparkFlow ERP.");

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

  const handlePrintStatement = () => {
    toast({
      title: "Exporting Document",
      description: "Generating high-resolution PDF. Please wait...",
    });
    setTimeout(() => {
      setIsPreviewOpen(false);
      toast({
        title: "Statement Ready",
        description: "Your document has been sent to the system printer.",
      });
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen font-body">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Tenant Configuration</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">SaaS Controls & Organizational Branding</p>
        </div>
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none" onClick={handleSave}>
          <Save className="size-4" /> Save Configuration
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
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
        </div>

        <div className="space-y-8">
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
                  <Badge className="bg-emerald-50 text-white border-none font-black text-[10px] uppercase">Active</Badge>
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

          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <History className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black italic uppercase">SaaS Billing History</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase text-slate-400">Audit past subscription payments</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-slate-100 text-slate-400"
                onClick={() => setIsPreviewOpen(true)}
              >
                <FileText className="size-4" />
              </Button>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="border-none">
                  <TableHead className="pl-8 text-[9px] font-black uppercase tracking-widest text-slate-400">Invoice ID</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="pr-8 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SAAS_BILLING_HISTORY.map((invoice) => (
                  <TableRow key={invoice.id} className="h-16 border-slate-50 hover:bg-slate-50 transition-colors group">
                    <TableCell className="pl-8">
                      <span className="font-black text-slate-900 text-xs tracking-tight">{invoice.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-500 text-[10px] uppercase">{invoice.date}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-900 text-xs italic">KES {invoice.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase px-2 py-0.5 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="size-2" /> {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-slate-50/50 border-t border-dashed text-center">
              <Button 
                variant="link" 
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary"
                onClick={() => setIsPreviewOpen(true)}
              >
                Download Full Statement (PDF)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Statement Preview & Editor Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Statement Preview</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Review and edit before printing</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)} className="rounded-full text-slate-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto bg-slate-50">
            {/* The Document Layout */}
            <Card className="border-none shadow-2xl rounded-2xl bg-white p-12 space-y-10">
              <header className="flex justify-between items-start border-b pb-10 border-dashed">
                <div className="space-y-4">
                  <div className="size-20 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden relative border-4 border-slate-50 shadow-xl">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                    ) : (
                      <Waves className="size-10 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic">SparkFlow Westlands</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Car Wash ERP Node</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest px-4 py-1 mb-2 uppercase">Official Statement</Badge>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ref: SF-2024-STMT</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Bill To (Editable)</Label>
                  <Textarea 
                    value={billTo}
                    onChange={(e) => setBillTo(e.target.value)}
                    className="min-h-[100px] rounded-xl border-2 border-slate-100 focus:border-primary text-sm font-bold bg-slate-50/50 p-4"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Statement Notes (Editable)</Label>
                  <Textarea 
                    value={statementNotes}
                    onChange={(e) => setStatementNotes(e.target.value)}
                    className="min-h-[100px] rounded-xl border-2 border-slate-100 focus:border-primary text-sm font-bold bg-slate-50/50 p-4"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <History className="size-4" /> Subscription Payout History
                </h3>
                <div className="border rounded-2xl overflow-hidden border-slate-100">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="font-black text-[9px] uppercase tracking-widest pl-6">Invoice</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest">Date</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-widest text-right pr-6">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SAAS_BILLING_HISTORY.map((inv) => (
                        <TableRow key={inv.id} className="border-slate-50">
                          <TableCell className="pl-6 font-black text-xs text-slate-900">{inv.id}</TableCell>
                          <TableCell className="font-bold text-slate-500 text-[10px] uppercase">{inv.date}</TableCell>
                          <TableCell className="text-right pr-6 font-black text-xs italic text-primary">KES {inv.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <footer className="pt-10 border-t border-dashed border-slate-100 flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                    <p className="text-lg font-black text-emerald-600 uppercase italic leading-none">Fully Reconciled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Total Settled (MTD)</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">KES 59,996</p>
                </div>
              </footer>
            </Card>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-dashed flex justify-between items-center sm:justify-between">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Digitally via Daraja API Protocol</p>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2" onClick={() => setIsPreviewOpen(false)}>Discard</Button>
              <Button className="h-12 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] px-8 shadow-xl shadow-primary/20 bg-slate-900 text-white hover:bg-black border-none gap-2" onClick={handlePrintStatement}>
                <Printer className="size-4" /> Print / Save as PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
