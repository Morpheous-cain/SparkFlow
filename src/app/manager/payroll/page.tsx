
"use client";

import { useState, useEffect } from "react";
import { PAYROLL, STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CreditCard, 
  Wallet, 
  Users, 
  Banknote, 
  ShieldCheck, 
  Zap, 
  Download, 
  Send, 
  AlertCircle,
  PlusCircle,
  MinusCircle,
  Calculator,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PayrollPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState(PAYROLL);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [advanceAmount, setAdvanceAmount] = useState<string>("0");

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPayroll = records.reduce((acc, r) => acc + r.netPay, 0);

  const handleDisburse = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Disbursed' as const } : r));
    toast({
      title: "Funds Disbursed",
      description: "Payroll has been sent to the staff's M-Pesa account.",
    });
  };

  const handleBulkDisburse = () => {
    toast({
      title: "Batch Processing Initiated",
      description: `Disbursing salaries for ${records.length} employees via Daraja API.`,
    });
  };

  const handleUpdateDeductions = () => {
    if (!editingRecord) return;
    
    const newAdvance = parseFloat(advanceAmount) || 0;
    const updatedRecords = records.map(r => {
      if (r.id === editingRecord.id) {
        const totalDeductions = r.deductions + newAdvance;
        const newNetPay = (r.baseAmount + r.commission) - totalDeductions;
        return {
          ...r,
          deductions: totalDeductions,
          netPay: newNetPay
        };
      }
      return r;
    });

    setRecords(updatedRecords);
    toast({
      title: "Deductions Updated",
      description: `KES ${newAdvance.toLocaleString()} advance recorded for ${editingRecord.staffName}.`,
    });
    setEditingRecord(null);
    setAdvanceAmount("0");
  };

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Payroll Command</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Salary Disbursement & M-Pesa Payouts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-14 gap-3 bg-white border-none shadow-xl font-black uppercase text-[11px] tracking-widest">
            <Download className="size-4" /> Export Payslips
          </Button>
          <Button className="rounded-2xl h-14 gap-3 shadow-2xl shadow-primary/30 px-8 font-black uppercase text-[11px] tracking-widest bg-primary hover:bg-blue-600 transition-all" onClick={handleBulkDisburse}>
            <Send className="size-4" /> Batch Disburse
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Payroll (MTD)", value: `KES ${totalPayroll.toLocaleString()}`, icon: Banknote, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Employees Paid", value: `${records.filter(r => r.status === 'Disbursed').length}/${records.length}`, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Tax/NHIF", value: "KES 14.5K", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Payout Limit", value: "92%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest rounded-full">MAY 24</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-black uppercase">Salary Disbursement Registry</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase text-slate-400">May 2024 Cycle • Real-time status</CardDescription>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                <CreditCard className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-emerald-600 uppercase">Gateway Balance</span>
                <span className="text-sm font-black text-emerald-700">KES 420,500</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-50/50 h-16">
            <TableRow className="border-none">
              <TableHead className="pl-8 uppercase text-[10px] font-black">Employee</TableHead>
              <TableHead className="uppercase text-[10px] font-black">Base Salary</TableHead>
              <TableHead className="uppercase text-[10px] font-black">Comm. & Bonus</TableHead>
              <TableHead className="uppercase text-[10px] font-black text-red-500">Deductions</TableHead>
              <TableHead className="uppercase text-[10px] font-black">Net Pay</TableHead>
              <TableHead className="uppercase text-[10px] font-black">Status</TableHead>
              <TableHead className="pr-8 text-right uppercase text-[10px] font-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id} className="h-20 border-slate-50 hover:bg-slate-50 transition-colors">
                <TableCell className="pl-8">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 uppercase">{r.staffName}</span>
                    <span className="text-[9px] font-black text-slate-400">ID: {r.staffId}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-600">KES {r.baseAmount.toLocaleString()}</TableCell>
                <TableCell className="font-bold text-emerald-600">+ {r.commission.toLocaleString()}</TableCell>
                <TableCell className="font-bold text-red-400">
                  <div className="flex items-center gap-2">
                    - {r.deductions.toLocaleString()}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-6 text-slate-300 hover:text-red-500"
                          onClick={() => setEditingRecord(r)}
                        >
                          <PlusCircle className="size-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                        <div className="p-8 bg-slate-900 text-white">
                          <DialogTitle className="text-2xl font-black uppercase">Record Advance / Deduction</DialogTitle>
                          <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] mt-1">
                            Applying adjustment for {editingRecord?.staffName}
                          </DialogDescription>
                        </div>
                        <div className="p-8 space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Adjustment Type</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="h-10 rounded-xl font-black text-[9px] uppercase border-2 border-primary text-primary bg-primary/5">Salary Advance</Button>
                              <Button variant="outline" className="h-10 rounded-xl font-black text-[9px] uppercase border-2">Damage/Loss</Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Amount to Deduct (KES)</Label>
                            <Input 
                              type="number" 
                              value={advanceAmount}
                              onChange={(e) => setAdvanceAmount(e.target.value)}
                              placeholder="0.00" 
                              className="h-14 rounded-2xl border-2 text-2xl font-black focus:ring-primary" 
                            />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <Calculator className="size-5 text-slate-400" />
                            <div className="flex-1">
                              <span className="text-[8px] font-black text-slate-400 uppercase block">Projected Net Pay</span>
                              <span className="text-lg font-black text-slate-900">
                                KES {( (editingRecord?.baseAmount || 0) + (editingRecord?.commission || 0) - (editingRecord?.deductions || 0) - (parseFloat(advanceAmount) || 0) ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="p-8 bg-slate-50 gap-3">
                          <Button className="h-14 rounded-2xl flex-1 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20" onClick={handleUpdateDeductions}>
                            <Check className="size-4 mr-2" /> Commit Adjustment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
                <TableCell className="font-black text-slate-900">KES {r.netPay.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "font-black text-[9px] uppercase border-none px-3 py-1",
                    r.status === 'Disbursed' ? "bg-emerald-500 text-white" : 
                    r.status === 'Approved' ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"
                  )}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  {r.status === 'Disbursed' ? (
                    <Button variant="ghost" size="sm" className="rounded-xl text-[9px] font-black text-emerald-600 bg-emerald-50 pointer-events-none">
                      PAID VIA M-PESA
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="rounded-xl h-10 font-black text-[9px] uppercase tracking-widest gap-2"
                      onClick={() => handleDisburse(r.id)}
                    >
                      <Send className="size-3" /> Disburse
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-center gap-6">
        <div className="size-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
          <AlertCircle className="size-8" />
        </div>
        <div>
          <h4 className="text-xl font-black text-amber-900 uppercase tracking-tight">Compliance Reminder</h4>
          <p className="text-amber-700 text-sm font-bold">KRA P9 forms for May 2024 are ready for signing. Ensure all statutory deductions are filed by the 9th.</p>
        </div>
        <Button className="ml-auto rounded-2xl h-12 bg-amber-900 text-white font-black uppercase text-[10px] tracking-widest px-8">
          File Returns
        </Button>
      </div>
    </div>
  );
}
