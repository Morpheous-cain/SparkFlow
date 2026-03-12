"use client";

import { BAYS, MOCK_VEHICLES, STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Warehouse, 
  Car, 
  Clock, 
  User, 
  Settings2, 
  AlertCircle, 
  CheckCircle2,
  ArrowRightCircle,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BayMonitorPage() {
  const queueVehicles = MOCK_VEHICLES.filter(v => v.status === 'Queue');
  
  const kpis = [
    { label: "Active Bays", value: BAYS.filter(b => b.status === 'Occupied').length + "/3", icon: Warehouse, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Queued Vehicles", value: queueVehicles.length.toString(), icon: Car, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Avg. Turnover", value: "32m", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "System Load", value: "85%", icon: Settings2, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Bay Monitor</h1>
          <p className="text-slate-500">Live physical workflow and occupancy tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white">
            <Settings2 className="size-4" /> Bay Settings
          </Button>
          <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20 px-6">
            <Warehouse className="size-4" /> Add Bay
          </Button>
        </div>
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
                <Badge className="bg-slate-100 border-none font-bold rounded-full">Live</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Physical Bays Visualization */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {BAYS.map((bay) => {
            const vehicle = MOCK_VEHICLES.find(v => v.plate === bay.currentVehiclePlate);
            const attendant = STAFF.find(s => s.id === vehicle?.attendantId);

            return (
              <Card key={bay.id} className={cn(
                "border-none shadow-sm rounded-[2.5rem] overflow-hidden transition-all duration-500",
                bay.status === 'Occupied' ? "bg-white" : "bg-slate-100 border-2 border-dashed border-slate-200"
              )}>
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-white">
                      {bay.name}
                    </Badge>
                    <Badge className={cn(
                      "border-none font-bold rounded-full px-3",
                      bay.status === 'Occupied' ? "bg-blue-100 text-blue-600" : 
                      bay.status === 'Available' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    )}>
                      {bay.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  {bay.status === 'Occupied' && vehicle ? (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="size-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                          <Car className="size-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-mono font-black tracking-widest text-slate-900">{vehicle.plate}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mt-1">
                            <User className="size-3" />
                            {attendant?.name || "Assigning..."}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                          <span>Wash Progress</span>
                          <span>{vehicle.progress}%</span>
                        </div>
                        <Progress value={vehicle.progress} className="h-3 rounded-full bg-slate-100" />
                      </div>

                      <div className="pt-4 border-t border-dashed flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Completion</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <Clock className="size-3 text-primary" /> 12 mins
                          </span>
                        </div>
                        <Button size="sm" variant="ghost" className="rounded-xl text-primary font-bold">
                          View Details <ArrowRightCircle className="ml-2 size-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="size-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-inner">
                        <Warehouse className="size-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-400">Bay is Empty</p>
                        <Button variant="link" className="text-primary font-bold p-0">Assign next from queue</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Real-time Queue Monitor */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-0 overflow-hidden">
          <CardHeader className="p-8 border-b bg-slate-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Incoming Queue</CardTitle>
                <CardDescription>Vehicles awaiting assignment</CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-none">{queueVehicles.length} Waiting</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {queueVehicles.length > 0 ? (
              queueVehicles.map((v, i) => (
                <div key={v.plate} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-lg text-slate-900">{v.plate}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {v.services.slice(0, 1).map((s, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0">{s}</Badge>
                      ))}
                      <span className="text-[10px] text-slate-400 font-medium">Wait: 15m</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <PlayCircle className="size-5" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-2 opacity-30">
                <CheckCircle2 className="size-12 mx-auto text-emerald-500" />
                <p className="font-bold">Queue is empty</p>
              </div>
            )}
          </CardContent>
          <div className="p-8 border-t bg-slate-50/30">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-500">Predicted Load</span>
              <span className="font-black text-slate-900">Moderate</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
