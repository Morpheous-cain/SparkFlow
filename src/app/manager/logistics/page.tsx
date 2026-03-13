"use client";

import { MOCK_LOGISTICS, STAFF } from "@/lib/mock-data";
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
  const kpis = [
    { label: "Active Requests", value: MOCK_LOGISTICS.length.toString(), icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Pickup", value: "8", icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Laundry Tags Issued", value: "24", icon: QrCode, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Fleet Earnings", value: "KES 42.1K", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Concierge Workflow</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Smart Routing & "Laundry Style" Tagging System</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            <ScanLine className="size-4" /> Scan Laundry Tag
          </Button>
          <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest">
            <Truck className="size-4" /> New Logistics Request
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">LIVE</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-0 overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <CardTitle className="text-xl font-black uppercase tracking-tight">Standard Operating Procedure (SOP)</CardTitle>
          <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Automatic triggers and financial event mapping</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="pl-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Milestone Step</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">System Action</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Customer SMS Trigger</TableHead>
              <TableHead className="pr-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Accounting Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WORKFLOW_STEPS.map((step, i) => (
              <TableRow key={i} className="border-slate-50 h-20 hover:bg-slate-50/50">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center", step.bg, step.color)}>
                      <step.icon className="size-5" />
                    </div>
                    <span className="font-black text-slate-900 uppercase text-xs">{step.step}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-600 text-xs">{step.action}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg px-3 py-1 font-black text-slate-400 text-[10px] uppercase">
                    "{step.notification}"
                  </Badge>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase rounded-full px-4 py-1.5">
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase">Live Logistics Monitor</h3>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-xl h-10 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                Optimize Fleet Routes
              </Button>
              <Badge className="bg-primary text-white border-none px-4 py-1.5 font-black text-[10px] uppercase">{MOCK_LOGISTICS.length} Active</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_LOGISTICS.map((log) => {
              const staff = STAFF.find(s => s.id === log.assignedStaffId);
              return (
                <Card key={log.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="size-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl relative">
                        <Package className="size-7" />
                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-lg flex items-center justify-center border-2 border-white">
                           <QrCode className="size-3 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={cn(
                          "border-none font-black text-[10px] uppercase tracking-widest rounded-full px-4 py-1.5",
                          log.status === 'Processing' ? "bg-indigo-100 text-indigo-600" : 
                          log.status === 'Pickup' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {log.status}
                        </Badge>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Tag: {log.qrTag}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{log.itemType}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase mt-1">
                        <UserCheck className="size-3" />
                        {log.customerName}
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-3 shadow-inner">
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin className="size-4 text-primary mt-0.5" />
                        <span className="font-bold text-xs">{log.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock className="size-4 text-primary" />
                        <span className="font-bold text-xs uppercase">Window: {log.pickupWindow}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Assigned Agent</span>
                        <span className="font-black text-slate-900 text-sm">{staff?.name || "Unassigned"}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-primary hover:text-white transition-all transform hover:rotate-90">
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
            <CardTitle className="text-xl font-black uppercase tracking-tight">Fleet Intelligence</CardTitle>
            <CardDescription className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Real-time driver & tech transparency</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            {STAFF.filter(s => s.role === 'Driver' || s.role === 'Technician').map((s) => (
              <div key={s.id} className="flex flex-col gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50 group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="size-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-slate-900">{s.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[9px] font-black uppercase px-2 py-0 border-none bg-primary/10 text-primary">{s.role}</Badge>
                      <span className="text-[9px] text-emerald-600 font-black uppercase">Online</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-900">4.9 ⭐</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-dashed grid grid-cols-2 gap-2">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Shift Earnings</span>
                      <span className="text-xs font-black text-slate-900">KES {s.earnings.total.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Comm. Rate</span>
                      <Badge variant="outline" className="ml-auto w-fit text-[8px] font-black border-emerald-100 bg-emerald-50 text-emerald-600">10% + Tips</Badge>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 rounded-2xl h-14 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-slate-900/20">
            Optimize Smart Routing
          </Button>
        </Card>
      </div>
    </div>
  );
}
