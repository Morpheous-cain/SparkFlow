
"use client";

import { useState, useEffect } from "react";
import type { LogisticsRequest, Staff } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Truck, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  ScanLine,
  UserCheck,
  Zap,
  DollarSign,
  QrCode,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WORKFLOW_STEPS = [
  {
    step: "1. Booking",
    action: "App/Web Order",
    notification: "Order Confirmed",
    impact: "Payment Authorized",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    step: "2. Pickup",
    action: "Driver Scans Item",
    notification: "Item Collected",
    impact: "Driver Trip Fee Logged",
    icon: ScanLine,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    step: "3. Processing",
    action: "Tech Starts Wash",
    notification: "Cleaning in Progress",
    impact: "Labor/Chemical Cost Deducted",
    icon: Zap,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    step: "4. Delivery",
    action: "Driver Drops Off",
    notification: "Service Complete! Rate Us",
    impact: "Payment Finalized / Commission Paid",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
];

export default function LogisticsManagementPage() {
  const [logistics, setLogistics] = useState<LogisticsRequest[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    fetch('/api/logistics', { credentials: 'include' })
      .then(r => r.json())
      .then(setLogistics)
      .catch(() => {});
    fetch('/api/staff', { credentials: 'include' })
      .then(r => r.json())
      .then(setStaff)
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Active Requests Count", value: logistics.length.toString(), icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Pickups", value: "8 Requests", icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Laundry Tags Issued", value: "24 Unique Nodes", icon: QrCode, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Fleet Shift Earnings", value: "KES 42,100", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Concierge Logistics Hub</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-2">Smart Routing & "Laundry Style" Tagging System protocol</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200/50">
            <ScanLine className="size-4" /> Scan Physical Laundry Tag
          </Button>
          <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 text-white border-none transition-all">
            <Truck className="size-4" /> Provision Logistics Request
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[8px] uppercase tracking-widest rounded-full px-2 py-0.5">LIVE NODES</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-0 overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <CardTitle className="text-xl font-black uppercase tracking-tight italic">Standard Operating Procedure (SOP)</CardTitle>
          <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Automatic triggers and financial event mapping</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent h-14">
              <TableHead className="pl-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Milestone Step</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">System Action Protocol</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Customer SMS Trigger</TableHead>
              <TableHead className="pr-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Ledger Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WORKFLOW_STEPS.map((step, i) => (
              <TableRow key={i} className="border-slate-50 h-20 hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center shadow-inner", step.bg, step.color)}>
                      <step.icon className="size-5" />
                    </div>
                    <span className="font-black text-slate-900 uppercase text-xs italic">{step.step}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-600 text-[11px] uppercase tracking-tight">{step.action}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg px-3 py-1 font-black text-slate-400 text-[9px] uppercase border-2">
                    "{step.notification}"
                  </Badge>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase rounded-full px-4 py-1.5 shadow-sm">
                    {step.impact}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">Live Logistics Monitor</h3>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-xl h-10 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-slate-900 text-white hover:bg-black border-none">
                Optimize Fleet Routes
              </Button>
              <Badge className="bg-primary text-white border-none px-4 py-1.5 font-black text-[9px] uppercase shadow-sm">{logistics.length} Active Nodes</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {logistics.map((log) => {
              const staffMember = staff.find(s => s.id === log.assignedStaffId);
              return (
                <Card key={log.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="size-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl relative group-hover:rotate-6 transition-transform">
                        <Package className="size-7" />
                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                           <QrCode className="size-3 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={cn(
                          "border-none font-black text-[9px] uppercase tracking-widest rounded-full px-4 py-1.5 shadow-sm",
                          log.status === 'Processing' ? "bg-indigo-100 text-indigo-600" : 
                          log.status === 'Pickup' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {log.status}
                        </Badge>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit Tag: {log.qrTag}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">{log.itemType}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">
                        <UserCheck className="size-3 text-primary" />
                        {log.customerName}
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3 shadow-inner">
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                        <span className="font-bold text-[11px] uppercase leading-tight">{log.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock className="size-4 text-primary shrink-0" />
                        <span className="font-black text-[10px] uppercase tracking-tighter">Window: {log.pickupWindow}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Assigned Fleet Agent</span>
                        <span className="font-black text-slate-900 text-[11px] uppercase italic">{staffMember?.name || "Unassigned"}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black uppercase tracking-tight italic">Fleet Transparency</CardTitle>
            <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Real-time driver & tech telemetry</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            {staff.filter(s => s.role === 'Driver' || s.role === 'Technician').map((s) => (
              <div key={s.id} className="flex flex-col gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="size-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-slate-900 text-xs uppercase italic">{s.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0 border-none bg-primary/10 text-primary">{s.role}</Badge>
                      <span className="text-[8px] text-emerald-600 font-black uppercase animate-pulse">Online Node</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-900">4.9 ⭐</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-dashed grid grid-cols-2 gap-2">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Shift Earnings</span>
                      <span className="text-xs font-black text-slate-900 italic">KES {s.earnings.total.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Comm. Rate</span>
                      <Badge variant="outline" className="ml-auto w-fit text-[8px] font-black border-emerald-100 bg-emerald-50 text-emerald-600 uppercase">10% + Tips</Badge>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl border-none hover:bg-black transition-all active:scale-95">
            Optimize Smart Fleet Routing
          </Button>
        </Card>
      </div>
    </div>
  );
}
