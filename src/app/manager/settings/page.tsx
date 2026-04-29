
"use client";

import { useState, useEffect } from "react";
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
  X,
  Plus,
  Hash
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
  { id: 'INV-2024-005', date: 'May 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja', code: 'QRT72X91K' },
  { id: 'INV-2024-004', date: 'Apr 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja', code: 'PWS11M02Z' },
  { id: 'INV-2024-003', date: 'Mar 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja', code: 'LKM90P11Q' },
  { id: 'INV-2024-002', date: 'Feb 01, 2024', amount: 14999, status: 'Paid', method: 'M-Pesa Daraja', code: 'XCV44B99R' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>("https://picsum.photos/seed/sparkflow-logo/200/200");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [billTo, setBillTo] = useState("Emma Johnson\nSparkFlow Westlands\nRing Road, Westlands\nNairobi, Kenya");
  const [statementNotes, setStatementNotes] = useState("Thank you for your continued partnership with SparkFlow ERP.");
<<<<<<< HEAD

  // Controlled settings fields
  const [businessName,    setBusinessName]    = useState("SparkFlow Westlands");
  const [invoicePrefix,   setInvoicePrefix]   = useState("SPK");
  const [businessPhone,   setBusinessPhone]   = useState("+254 700 000000");
  const [businessEmail,   setBusinessEmail]   = useState("westlands@sparkflow.co.ke");
  const [mpesaTill,       setMpesaTill]       = useState("");
  const [smsNotif,        setSmsNotif]        = useState(true);
  const [emailNotif,      setEmailNotif]      = useState(true);
  const [saving,          setSaving]          = useState(false);

  // Editable statement items
  const [editableInvoices, setEditableInvoices] = useState<any[]>([]);

  // Load settings from API on mount
  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        if (data.business_email)      setBusinessEmail(data.business_email);
        if (data.business_phone)      setBusinessPhone(data.business_phone);
        if (data.invoice_prefix)      setInvoicePrefix(data.invoice_prefix);
        if (data.mpesa_till_number)   setMpesaTill(data.mpesa_till_number);
        if (data.sms_notifications  !== undefined) setSmsNotif(data.sms_notifications);
        if (data.email_notifications !== undefined) setEmailNotif(data.email_notifications);
        if (data.logo_url)            setLogoPreview(data.logo_url);
      })
      .catch(() => {});
  }, []);

=======
  
  // Editable statement items
  const [editableInvoices, setEditableInvoices] = useState<any[]>([]);

>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
  useEffect(() => {
    if (isPreviewOpen) {
      setEditableInvoices([...SAAS_BILLING_HISTORY]);
    }
  }, [isPreviewOpen]);

<<<<<<< HEAD
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_prefix:      invoicePrefix,
          business_phone:      businessPhone,
          business_email:      businessEmail,
          mpesa_till_number:   mpesaTill,
          sms_notifications:   smsNotif,
          email_notifications: emailNotif,
          logo_url:            logoPreview,
        }),
      });
      toast({
        title: "Configuration Synchronized",
        description: "Business settings saved successfully across all nodes.",
      });
    } catch {
      toast({
        title: "Save Failed",
        description: "Could not reach the server. Try again.",
      });
    } finally {
      setSaving(false);
    }
=======
  const handleSave = () => {
    toast({
      title: "Configuration Synchronized",
      description: "Business identity and logo updated successfully across all nodes.",
    });
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
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

  const addInvoiceLine = () => {
    const newItem = {
      id: `INV-${new Date().getFullYear()}-NEW`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: 0,
      status: 'Paid',
      method: 'Manual Entry',
      code: 'NEW-REF'
    };
    setEditableInvoices([...editableInvoices, newItem]);
  };

  const removeInvoiceLine = (index: number) => {
    setEditableInvoices(editableInvoices.filter((_, i) => i !== index));
  };

  const updateInvoiceLine = (index: number, field: string, value: any) => {
    const updated = [...editableInvoices];
    updated[index] = { ...updated[index], [field]: value };
    setEditableInvoices(updated);
  };

  const totalSettled = editableInvoices.reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen font-body">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Tenant Configuration</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">SaaS Controls & Organizational Branding</p>
        </div>
<<<<<<< HEAD
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none" onClick={handleSave} disabled={saving}>
          <Save className="size-4" /> {saving ? 'Saving...' : 'Save Configuration'}
=======
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none" onClick={handleSave}>
          <Save className="size-4" /> Save Configuration
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
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
<<<<<<< HEAD
                  <Input value={businessName} onChange={e => setBusinessName(e.target.value)} className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
=======
                  <Input defaultValue="SparkFlow Westlands" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Currency</Label>
<<<<<<< HEAD
                    <Input value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</Label>
                    <Input value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
=======
                    <Input defaultValue="KES" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</Label>
                    <Input defaultValue="+254 700 000000" className="h-12 rounded-xl font-bold border-2 focus:border-primary transition-all" />
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
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
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white font-body">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Official Record Architect</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Live-edit line items & transaction codes before printing</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)} className="rounded-full text-slate-400 hover:text-white">
              <X className="size-5" />
            </Button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto bg-slate-50">
            <Card className="border-none shadow-2xl rounded-2xl bg-white p-12 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/5 rounded-full blur-[100px]" />
              
              <header className="flex justify-between items-start border-b pb-10 border-dashed relative z-10">
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
                  <p className="text-[10px] font-black text-slate-400 uppercase">Generated: {new Date().toLocaleDateString()}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ref: SF-2024-STMT</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-12 relative z-10">
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

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <History className="size-4" /> Subscription Payout History
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[9px] uppercase bg-primary/5 text-primary border-none" onClick={addInvoiceLine}>
                    <Plus className="size-3 mr-2" /> Add Service Item
                  </Button>
                </div>
                
                <div className="border rounded-2xl overflow-hidden border-slate-100 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="pl-6 text-[9px] font-black uppercase tracking-widest">Invoice / ID</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest">Trans. Code (M-Pesa/Cash)</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest">Date</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-widest">Amount (KES)</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableInvoices.map((inv, idx) => (
                        <TableRow key={idx} className="border-slate-50 group">
                          <TableCell className="pl-6">
                            <Input 
                              value={inv.id} 
                              onChange={(e) => updateInvoiceLine(idx, 'id', e.target.value)}
                              className="h-8 text-xs font-black border-none bg-slate-50 focus:bg-white uppercase p-2 rounded-lg"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <Hash className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-slate-300" />
                              <Input 
                                value={inv.code} 
                                onChange={(e) => updateInvoiceLine(idx, 'code', e.target.value.toUpperCase())}
                                className="h-8 text-[10px] font-black border-none bg-slate-50 focus:bg-white uppercase pl-7 p-2 rounded-lg"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={inv.date} 
                              onChange={(e) => updateInvoiceLine(idx, 'date', e.target.value)}
                              className="h-8 text-[10px] font-bold border-none bg-slate-50 focus:bg-white p-2 rounded-lg"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input 
                              type="number"
                              value={inv.amount} 
                              onChange={(e) => updateInvoiceLine(idx, 'amount', e.target.value)}
                              className="h-8 text-xs font-black text-right border-none bg-slate-50 focus:bg-white p-2 rounded-lg italic text-primary"
                            />
                          </TableCell>
                          <TableCell className="pr-4">
                            <Button variant="ghost" size="icon" className="size-8 text-red-300 hover:text-red-500 rounded-lg" onClick={() => removeInvoiceLine(idx)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <footer className="pt-10 border-t border-dashed border-slate-100 flex justify-between items-end relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                    <p className="text-lg font-black text-emerald-600 uppercase italic leading-none">Verified Reconciled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Architected Total (KES)</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">
                    KES {totalSettled.toLocaleString()}
                  </p>
                </div>
              </footer>
            </Card>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-dashed flex justify-between items-center sm:justify-between">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Cloud Export Protocol v4.2</p>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 bg-white" onClick={() => setIsPreviewOpen(false)}>Discard Edits</Button>
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
