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
  DollarSign
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
    { label: "Processing", value: "5", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Daily Revenue", value: "KES 28.5K", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Delivery Workflow</h1>
          <p className="text-slate-500 font-medium">Integrated logistics and off-site service management</p>
        </div>
        <Button className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6">
          <Truck className="size-4" /> New Request
        </Button>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-bold rounded-full">LIVE</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Strategy Reference */}
      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-0 overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <CardTitle className="text-xl font-bold">Standard Operating Procedure (SOP)</CardTitle>
          <CardDescription>Automatic triggers and financial event mapping</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="pl-8 text-[10px] font-black uppercase text-slate-400 tracking-wider">Milestone Step</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Action</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer SMS Trigger</TableHead>
              <TableHead className="pr-8 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Accounting Impact</TableHead>
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
                    <span className="font-bold text-slate-900">{step.step}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-600">{step.action}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg px-3 py-1 font-bold text-slate-400 italic">
                    "{step.notification}"
                  </Badge>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold rounded-full">
                    {step.impact}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Active Deliveries Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Live Logistics Monitor</h3>
            <Badge className="bg-primary text-white border-none">{MOCK_LOGISTICS.length} Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_LOGISTICS.map((log) => {
              const staff = STAFF.find(s => s.id === log.assignedStaffId);
              return (
                <Card key={log.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="size-14 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-lg">
                        <Package className="size-7" />
                      </div>
                      <Badge className={cn(
                        "border-none font-bold rounded-full px-3",
                        log.status === 'Processing' ? "bg-indigo-100 text-indigo-600" : 
                        log.status === 'Pickup' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {log.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{log.itemType}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mt-1">
                        <UserCheck className="size-3" />
                        {log.customerName}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="size-4 text-slate-400 mt-0.5" />
                        <span className="font-medium">{log.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-4 text-slate-400" />
                        <span className="font-medium">Requested: {new Date(log.requestTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Assigned Agent</span>
                        <span className="font-bold text-slate-900">{staff?.name || "Unassigned"}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary hover:text-white transition-colors">
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Fleet Status */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-bold">Fleet Visibility</CardTitle>
            <CardDescription>Real-time driver & tech status</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            {STAFF.filter(s => s.role === 'Driver' || s.role === 'Technician').map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100/50">
                <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <UserCheck className="size-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-900">{s.name}</h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">{s.role}</Badge>
                    <span className="text-[10px] text-emerald-600 font-bold">Online</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">4.9</div>
                  <div className="flex gap-0.5">
                    {[1,2,3].map(i => <div key={i} className="size-1.5 rounded-full bg-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 rounded-2xl h-14 bg-slate-900 text-white font-bold">
            Optimize Routes
          </Button>
        </Card>
      </div>
    </div>
  );
}
