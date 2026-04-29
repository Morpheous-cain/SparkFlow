// src/app/manager/bays/page.tsx
// This file was missing — that's why /manager/bays returned 404.
// The full wired component is below. It uses useRealtime for live bay data.

"use client";

import { useBays, useVehiclesLive } from "@/hooks/useRealtime";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Warehouse, Car, Clock, User, Settings2, CheckCircle2,
  ArrowRightCircle, PlayCircle, Loader2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type StaffMember = { id: string; name: string };

export default function BayMonitorPage() {
  const [branchId, setBranchId] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then(async (d) => {
        if (d.branch_id) {
          setBranchId(d.branch_id);
        } else {
          // branch_id is null on the manager account — fetch first branch for this tenant
          const res = await fetch("/api/branches", { credentials: "include" });
          if (res.ok) {
            const branches = await res.json();
            if (branches?.length > 0) {
              setBranchId(branches[0].id);
            } else {
              setAuthError("No branches found for this tenant");
            }
          } else {
            setAuthError("Could not resolve branch");
          }
        }
      })
      .catch(() => setAuthError("Not authenticated"));
  }, []);

  const { bays, loading: baysLoading, error: baysError } = useBays(branchId);
  const { vehicles, loading: vehiclesLoading } = useVehiclesLive(branchId);
  const loading = !branchId || baysLoading || vehiclesLoading;

  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!branchId) return;
    fetch("/api/staff", { credentials: "include" })
      .then((r) => r.json())
      .then((data: StaffMember[]) => {
        const map: Record<string, string> = {};
        data.forEach((s) => (map[s.id] = s.name));
        setStaffMap(map);
      })
      .catch(() => {});
  }, [branchId]);

  const queueVehicles = vehicles.filter((v) => v.status === "Queue");
  const occupiedCount = bays.filter((b) => b.status === "Occupied").length;

  const kpis = [
    { label: "Active Bays",     value: loading ? "—" : `${occupiedCount}/${bays.length}`,                           icon: Warehouse,    color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Queued Vehicles", value: loading ? "—" : queueVehicles.length.toString(),                             icon: Car,          color: "text-amber-600",   bg: "bg-amber-50"   },
    { label: "In-Bay Now",      value: loading ? "—" : vehicles.filter((v) => v.status === "In-Bay").length.toString(), icon: Settings2, color: "text-indigo-600",  bg: "bg-indigo-50"  },
    { label: "Ready for Pickup",value: loading ? "—" : vehicles.filter((v) => v.status === "Ready").length.toString(),  icon: CheckCircle2,color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  if (authError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-6 flex items-center gap-4">
          <AlertTriangle className="size-8 text-red-500" />
          <p className="font-bold text-red-900">{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Bay Monitor</h1>
          <p className="text-slate-500">
            Live physical workflow and occupancy tracking
            {!loading && <span className="ml-2 text-emerald-500 font-bold text-xs uppercase">● Realtime</span>}
          </p>
        </div>
      </header>

      {baysError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="size-5 text-red-500" />
          <p className="text-red-700 font-medium text-sm">{baysError}</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-bold rounded-full">
                  {loading ? <Loader2 className="size-3 animate-spin" /> : "Live"}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bay cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse" />)
            : bays.map((bay) => {
                const vehicle = vehicles.find((v) => v.bay_id === bay.id && v.status !== "Completed");
                const attendantName = vehicle?.attendant_id ? staffMap[vehicle.attendant_id] ?? "Assigned" : null;
                return (
                  <Card key={bay.id} className={cn(
                    "border-none shadow-sm rounded-[2.5rem] overflow-hidden transition-all duration-500",
                    bay.status === "Occupied" ? "bg-white" : "bg-slate-100 border-2 border-dashed border-slate-200"
                  )}>
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-white">
                          {bay.name}
                        </Badge>
                        <Badge className={cn(
                          "border-none font-bold rounded-full px-3",
                          bay.status === "Occupied"         ? "bg-blue-100 text-blue-600"    :
                          bay.status === "Available"        ? "bg-emerald-100 text-emerald-600" :
                                                              "bg-red-100 text-red-600"
                        )}>
                          {bay.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                      {bay.status === "Occupied" && vehicle ? (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="size-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                              <Car className="size-8" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-mono font-black tracking-widest text-slate-900">{vehicle.plate}</h3>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mt-1">
                                <User className="size-3" />{attendantName ?? "Assigning..."}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                              <span>Wash Progress</span><span>{vehicle.progress}%</span>
                            </div>
                            <Progress value={vehicle.progress} className="h-3 rounded-full bg-slate-100" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.services.map((s) => (
                              <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0 rounded-full">{s}</Badge>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                          <div className="size-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-inner">
                            <Warehouse className="size-8" />
                          </div>
                          <p className="font-bold text-slate-400">
                            {bay.status === "Under Maintenance" ? "Under Maintenance" : "Bay is Empty"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Queue */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-0 overflow-hidden">
          <CardHeader className="p-8 border-b bg-slate-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Incoming Queue</CardTitle>
                <CardDescription>Vehicles awaiting assignment</CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-none">
                {loading ? "..." : `${queueVehicles.length} Waiting`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-3xl animate-pulse" />)
            ) : queueVehicles.length > 0 ? (
              queueVehicles.map((v, i) => (
                <div key={v.id} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all">
                  <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 font-bold">{i + 1}</div>
                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-lg text-slate-900">{v.plate}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {v.services.slice(0, 2).map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <PlayCircle className="size-5 text-slate-300" />
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
              <span className="font-bold text-slate-500">Total active vehicles</span>
              <span className="font-black text-slate-900">{loading ? "..." : vehicles.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
