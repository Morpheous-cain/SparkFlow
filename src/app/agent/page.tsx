"use client";

// src/app/agent/page.tsx
//
// WIRED:
//   Boot:        GET /api/auth/me          → branch_id, tenant context
//   Bay list:    GET /api/bays             → real available bays
//   Staff list:  GET /api/staff            → real present attendants
//   Queue count: GET /api/vehicles         → real queue count
//   Check-in:    POST /api/vehicles        → creates real vehicle record
//   Payments:    POST /api/transactions    → creates real Pending transaction
//   M-Pesa:      POST /api/payments/mpesa  → STK push (Phase 3, graceful fallback)
//   Ready queue: GET /api/vehicles         → polled for Payments tab
//
// MOCK IMPORTS REMOVED:
//   MOCK_VEHICLES, BAYS, STAFF → all replaced with real fetch()
//   SERVICES → kept for check-in service picker (no /api/services route yet)
//   SERVICE_BUNDLES → kept for bundles display
//
// DO NOT touch: src/components/ui/**, src/lib/supabase/**, src/app/api/**, middleware.ts

import { useState, useEffect, useCallback } from "react";
import { SERVICES } from "@/lib/mock-data"; // service catalogue — no API route yet
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Plus, Smartphone, Wallet, CreditCard, Banknote, Car, Clock, User, Warehouse, LayoutGrid, Send, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type AuthCtx = {
  branch_id: string;
  tenant_id: string;
  userId: string;
  email: string;
  role: string;
};

type Bay = {
  id: string;
  name: string;
  status: "Available" | "Occupied" | "Maintenance";
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  attendance_status: string | null;
};

type Vehicle = {
  id: string;
  plate: string;
  status: "Queue" | "In-Bay" | "Ready" | "Completed";
  services: string[];
  arrival_time: string;
  progress: number;
  bay?: { id: string; name: string } | null;
  attendant?: { id: string; name: string } | null;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function AgentPortal() {
  const { toast } = useToast();

  // ── Auth context ─────────────────────────────────────────────────────────────
  const [ctx, setCtx] = useState<AuthCtx | null>(null);

  // ── Real data replacing mock ──────────────────────────────────────────────────
  const [bays, setBays] = useState<Bay[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Check-in form ─────────────────────────────────────────────────────────────
  const [plate, setPlate] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBay, setSelectedBay] = useState<string>("");
  const [selectedAttendant, setSelectedAttendant] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Payments ──────────────────────────────────────────────────────────────────
  const [paymentInFlight, setPaymentInFlight] = useState<string | null>(null); // vehicle id

  // ── Boot: fetch ctx → then bays, staff, vehicles ─────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((me: AuthCtx) => {
        setCtx(me);
        loadAll(me.branch_id);
      })
      .catch(() =>
        toast({ title: "Auth error", description: "Please sign in again", variant: "destructive" })
      );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAll = useCallback(async (branchId: string) => {
    setDataLoading(true);
    try {
      const [baysRes, staffRes, vehiclesRes] = await Promise.all([
        fetch(`/api/bays?branch_id=${branchId}`, { credentials: "include" }),
        fetch("/api/staff", { credentials: "include" }),
        fetch(`/api/vehicles?branch_id=${branchId}`, { credentials: "include" }),
      ]);

      if (baysRes.ok) setBays(await baysRes.json());
      if (staffRes.ok) setStaff(await staffRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
    } catch {
      toast({ title: "Failed to load branch data", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values replacing MOCK_VEHICLES/BAYS/STAFF references ──────────────
  const availableBays     = bays.filter((b) => b.status === "Available");
  const activeAttendants  = staff.filter((s) => s.role === "attendant" && s.attendance_status === "present");
  const queueCount        = vehicles.filter((v) => v.status === "Queue").length;
  // Vehicles ready for payment or currently In-Bay (agent payment tab)
  const pendingCheckouts  = vehicles.filter((v) => v.status === "Ready" || v.status === "In-Bay");

  // ── Service picker ────────────────────────────────────────────────────────────
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalAmount = SERVICES
    .filter((s) => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  const selectedServiceNames = SERVICES
    .filter((s) => selectedServices.includes(s.id))
    .map((s) => s.name);

  // ── Check-in: POST /api/vehicles ─────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!plate.trim()) {
      toast({ title: "Plate Required", description: "Enter plate number.", variant: "destructive" });
      return;
    }
    if (selectedServices.length === 0) {
      toast({ title: "Service Required", description: "Select at least one service.", variant: "destructive" });
      return;
    }
    if (!ctx) return;

    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        plate: plate.toUpperCase().trim(),
        services: selectedServiceNames,
        branch_id: ctx.branch_id,
      };
      // Only include optional fields if set
      if (selectedBay && selectedBay !== "queue") body.bay_id = selectedBay;
      if (selectedAttendant) body.attendant_id = selectedAttendant;

      const res = await fetch("/api/vehicles", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Check-in failed", description: err.error ?? `HTTP ${res.status}`, variant: "destructive" });
        return;
      }

      const vehicle = await res.json();
      toast({
        title: "Vehicle Logged",
        description: `Job created for ${vehicle.plate}. Status: ${vehicle.status}.`,
      });

      // Reset form
      setPlate("");
      setSelectedServices([]);
      setSelectedBay("");
      setSelectedAttendant("");

      // Refresh live data
      loadAll(ctx.branch_id);
    } catch {
      toast({ title: "Network error", description: "Check-in failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Payment: POST /api/transactions then optionally POST /api/payments/mpesa ──
  const handlePayment = async (vehicle: Vehicle, method: "MPESA" | "CASH") => {
    if (!ctx) return;
    setPaymentInFlight(vehicle.id);

    try {
      // Step 1: Create transaction record (status: Pending)
      const txRes = await fetch("/api/transactions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate: vehicle.plate,
          services: vehicle.services,
          amount: totalAmountForVehicle(vehicle),
          payment_method: method === "MPESA" ? "M-Pesa" : "Cash",
          branch_id: ctx.branch_id,
          inventory_usage: [], // no inventory tracking at POS yet
        }),
      });

      if (!txRes.ok) {
        const err = await txRes.json();
        toast({ title: "Transaction failed", description: err.error ?? "Could not create transaction", variant: "destructive" });
        return;
      }

      const tx = await txRes.json();

      if (method === "CASH") {
        toast({
          title: "Cash Payment Recorded",
          description: `${vehicle.plate} — KSh ${totalAmountForVehicle(vehicle).toLocaleString("en-KE")}. Transaction ID: ${tx.id?.slice(0, 8)}`,
        });
        loadAll(ctx.branch_id);
        return;
      }

      // Step 2: M-Pesa STK push (Phase 3 — graceful fallback if route not yet deployed)
      toast({ title: "M-Pesa Push Sent", description: `Initiating STK push for ${vehicle.plate}…` });

      try {
        const mpesaRes = await fetch("/api/payments/mpesa", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: "0700000000", // TODO: get from customer record when customer portal links up
            amount: totalAmountForVehicle(vehicle),
            transaction_id: tx.id,
          }),
        });

        if (mpesaRes.ok) {
          const mpesa = await mpesaRes.json();
          toast({
            title: "STK Push Sent",
            description: `Customer PIN prompt sent. Request ID: ${mpesa.CheckoutRequestID?.slice(-8) ?? "pending"}`,
          });
        } else {
          // Route exists but returned error — log and continue
          toast({
            title: "M-Pesa route error",
            description: "Transaction created as Pending. Check M-Pesa config.",
            variant: "destructive",
          });
        }
      } catch {
        // Phase 3 route not yet deployed — transaction remains Pending, that's fine
        toast({
          title: "M-Pesa not yet configured",
          description: "Transaction saved as Pending. Set up Phase 3 M-Pesa env vars to enable STK push.",
        });
      }

      loadAll(ctx.branch_id);
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setPaymentInFlight(null);
    }
  };

  // Helper: compute vehicle amount from its services using the local SERVICES catalogue
  function totalAmountForVehicle(vehicle: Vehicle): number {
    return vehicle.services.reduce((sum, svcName) => {
      const match = SERVICES.find((s) => s.name === svcName);
      return sum + (match?.price ?? 0);
    }, 0);
  }

  // ── Feedback link ─────────────────────────────────────────────────────────────
  const sendFeedbackLink = (vehiclePlate: string) => {
    const feedbackUrl = `${window.location.origin}/customer?plate=${vehiclePlate}`;
    toast({
      title: "Feedback Link Ready",
      description: `Share: ${feedbackUrl}`,
      action: <Send className="size-4 text-primary" />,
    });
  };

  const agentName = ctx?.email?.split("@")[0] ?? "Agent";

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-44 md:pb-52 p-4 max-w-3xl mx-auto flex flex-col gap-6 bg-slate-50 font-body">

      {/* Header */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">SparkFlow Desk</h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1 capitalize">
              {agentName} · Agent
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-4">
          {/* Available bays — real data */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Warehouse className="size-4" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Bays Free</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-1">
                {dataLoading ? "…" : `${availableBays.length} / ${bays.length}`}
              </p>
            </div>
          </div>
          {/* Queue count — real data */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Car className="size-4" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">In Queue</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-1">
                {dataLoading ? "…" : queueCount}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-10 bg-white"
            onClick={() => ctx && loadAll(ctx.branch_id)}
            disabled={dataLoading}
          >
            <RefreshCw className={cn("size-4", dataLoading && "animate-spin")} />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-slate-200/50 p-1 mb-6">
          <TabsTrigger value="checkin" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Plus className="size-3 mr-2" /> Check-In
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutGrid className="size-3 mr-2" /> Workflow
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Wallet className="size-3 mr-2" /> Payments
            {pendingCheckouts.filter((v) => v.status === "Ready").length > 0 && (
              <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[8px] text-white">
                {pendingCheckouts.filter((v) => v.status === "Ready").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════
            CHECK-IN TAB — POST /api/vehicles
            ══════════════════════════════════════════════ */}
        <TabsContent value="checkin" className="space-y-6 outline-none focus:ring-0">
          <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 md:p-8">
              <CardTitle className="text-lg md:text-xl font-black uppercase leading-none">New Entry</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
                Capture details to begin workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">

              {/* Plate */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">License Plate</label>
                <Input
                  placeholder="KDC 123A"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="text-2xl md:text-3xl h-14 md:h-16 font-mono font-black tracking-[0.2em] md:tracking-[0.3em] text-center border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 uppercase transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bay selector — REAL available bays */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Assign Bay (Optional)
                  </label>
                  <Select value={selectedBay} onValueChange={setSelectedBay} disabled={dataLoading}>
                    <SelectTrigger className="h-12 rounded-xl border-2 font-bold text-xs uppercase tracking-tight">
                      <SelectValue placeholder={dataLoading ? "Loading bays…" : "Send to Queue"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queue">Wait in Queue</SelectItem>
                      {availableBays.map((bay) => (
                        <SelectItem key={bay.id} value={bay.id}>
                          {bay.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Attendant selector — REAL present attendants */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Assign Attendant
                  </label>
                  <Select value={selectedAttendant} onValueChange={setSelectedAttendant} disabled={dataLoading}>
                    <SelectTrigger className="h-12 rounded-xl border-2 font-bold text-xs uppercase tracking-tight">
                      <SelectValue placeholder={dataLoading ? "Loading staff…" : "Auto-Assign Next"} />
                    </SelectTrigger>
                    <SelectContent>
                      {activeAttendants.length === 0 ? (
                        <SelectItem value="none" disabled>No attendants present</SelectItem>
                      ) : (
                        activeAttendants.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service picker — SERVICES from mock-data (no API route yet) */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Select Packages
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICES.filter((s) => s.category !== "Merchandise").map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedServices.includes(service.id)
                          ? "border-primary bg-primary/5"
                          : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-black text-[11px] md:text-xs uppercase text-slate-900 leading-tight">
                          {service.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                          KES {service.price.toLocaleString()} · {service.duration}m
                        </span>
                      </div>
                      <div className={`rounded-full p-1 transition-colors ${
                        selectedServices.includes(service.id)
                          ? "bg-primary text-white"
                          : "bg-slate-200 text-slate-200"
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky bottom bar */}
          <div className="fixed bottom-[92px] left-0 right-0 px-4 max-w-3xl mx-auto z-40">
            <Card className="shadow-2xl border-none bg-slate-900 text-white rounded-2xl md:rounded-[2rem] overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex flex-col ml-2 md:ml-4">
                  <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                    Estimate Total
                  </span>
                  <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="px-6 md:px-8 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-blue-600 transition-all active:scale-95 text-white"
                  disabled={isSubmitting || !ctx}
                  onClick={handleCheckIn}
                >
                  {isSubmitting ? (
                    <><Loader2 className="size-4 animate-spin mr-2" /> Logging…</>
                  ) : (
                    "Log Vehicle"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════
            WORKFLOW TAB — GET /api/vehicles (real)
            ══════════════════════════════════════════════ */}
        <TabsContent value="workflow" className="space-y-4 outline-none">
          {dataLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : vehicles.filter((v) => v.status !== "Completed").length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <Car className="size-16 mx-auto mb-4 text-slate-300" />
              <p className="font-black uppercase text-xs tracking-widest">No active vehicles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles
                .filter((v) => v.status !== "Completed")
                .map((v) => (
                  <Card key={v.id} className="border-none shadow-sm rounded-2xl p-5 bg-white relative overflow-hidden">
                    <div className={cn(
                      "absolute top-0 right-0 w-1 h-full",
                      v.status === "In-Bay" ? "bg-amber-500" :
                      v.status === "Ready"  ? "bg-emerald-500" :
                                              "bg-slate-200"
                    )} />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {/* Real vehicle.id as key; plate for display */}
                        <h4 className="text-xl font-mono font-black tracking-widest text-slate-900">
                          {v.plate}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">
                            {v.services[0] ?? "—"}
                          </Badge>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {v.status}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn(
                        "font-black text-[8px] uppercase",
                        v.status === "In-Bay" ? "bg-amber-500 text-white" :
                        v.status === "Ready"  ? "bg-emerald-500 text-white" :
                                                "bg-slate-100 text-slate-500 border-none"
                      )}>
                        {v.bay?.name ?? (v.status === "Queue" ? "QUEUE" : "—")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-100">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                        <User className="size-3" />
                        {/* Real attendant name from joined vehicle data */}
                        {v.attendant?.name ?? "Unassigned"}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                        <Clock className="size-3" />
                        {/* Real arrival_time (snake_case) */}
                        {new Date(v.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* ══════════════════════════════════════════════
            PAYMENTS TAB — POST /api/transactions
            ══════════════════════════════════════════════ */}
        <TabsContent value="payments" className="space-y-4 outline-none focus:ring-0">
          {dataLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-36 bg-white rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : pendingCheckouts.length === 0 ? (
            <div className="text-center py-20 opacity-30">
              <div className="size-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="size-10" />
              </div>
              <p className="font-black uppercase text-xs tracking-widest">No Pending Payments</p>
            </div>
          ) : (
            pendingCheckouts.map((v) => {
              const amount = totalAmountForVehicle(v);
              const isInFlight = paymentInFlight === v.id;

              return (
                <Card
                  key={v.id}
                  className={`border-none shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden ${
                    v.status === "Ready" ? "ring-2 ring-emerald-500/20" : "opacity-70"
                  }`}
                >
                  <CardHeader className="pb-4 p-5 md:p-6 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="size-10 md:size-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400">
                          <Car className="size-5 md:size-6" />
                        </div>
                        <div>
                          <h4 className="text-xl md:text-2xl font-mono font-black tracking-widest text-slate-900 leading-none">
                            {v.plate}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                            <div className="flex items-center gap-1">
                              <Banknote className="size-3 text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-600">
                                {amount > 0
                                  ? `KES ${amount.toLocaleString("en-KE")}`
                                  : "Amount pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "font-black text-[9px] text-white uppercase",
                          v.status === "Ready" ? "bg-emerald-500" : "bg-amber-500"
                        )}
                      >
                        {v.status === "Ready" ? "READY" : "IN-WASH"}
                      </Badge>
                    </div>
                  </CardHeader>

                  {v.status === "Ready" && (
                    <CardContent className="p-3 md:p-4 bg-slate-50 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* M-Pesa */}
                        <Button
                          onClick={() => handlePayment(v, "MPESA")}
                          disabled={isInFlight}
                          className="h-12 md:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[9px] tracking-widest gap-2 text-white"
                        >
                          {isInFlight ? <Loader2 className="size-3.5 animate-spin" /> : <CreditCard className="size-3.5" />}
                          M-Pesa
                        </Button>
                        {/* Cash */}
                        <Button
                          onClick={() => handlePayment(v, "CASH")}
                          disabled={isInFlight}
                          variant="outline"
                          className="h-12 md:h-14 rounded-xl border-slate-200 bg-white font-black uppercase text-[9px] tracking-widest gap-2 text-slate-600"
                        >
                          {isInFlight ? <Loader2 className="size-3.5 animate-spin" /> : <Banknote className="size-3.5" />}
                          Cash
                        </Button>
                      </div>
                      {/* Feedback link */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary"
                        onClick={() => sendFeedbackLink(v.plate)}
                      >
                        <Send className="size-3 mr-2" /> Send Rating Link
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
