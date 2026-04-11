"use client";

// attendance_status values from DB: "Present", "Late", "Absent", "On-Leave" (capital first letter)
// The previous version filtered on "present" (lowercase) which never matched — fixed here.

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play, CheckCircle2, Clock, MapPin, Car, Check,
  Waves, BellRing, ClipboardCheck, Loader2, RefreshCw, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Vehicle = {
  id: string;
  plate: string;
  status: "Queue" | "In-Bay" | "Ready" | "Completed";
  progress: number;
  services: string[];
  total_amount: number;
  arrival_time: string;
  bay?: { id: string; name: string } | null;
  attendant?: { id: string; name: string } | null;
  customer?: { name: string; phone: string } | null;
};

type Ctx = { branch_id: string; email: string; id: string };

export default function AttendantPWA() {
  const { toast } = useToast();
  const [ctx, setCtx]           = useState<Ctx | null>(null);
  const [jobs, setJobs]         = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((me) => {
        setCtx({ branch_id: me.branch_id, email: me.email, id: me.id });
        fetchJobs(me.branch_id);
      })
      .catch(() => setError("Not authenticated — please sign in"));
  }, []);

  async function fetchJobs(branchId: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vehicles?branch_id=${branchId}`, { credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const data: Vehicle[] = await res.json();
      setJobs(data.filter((v) => v.status !== "Completed"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function advanceStatus(vehicle: Vehicle, newStatus: "In-Bay" | "Ready") {
    setActionId(vehicle.id);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Update failed");
      }
      const messages = {
        "In-Bay": `Job Card ${vehicle.plate} is now LIVE. Status synced to Agent desk.`,
        "Ready":  `Vehicle ${vehicle.plate} marked READY. Customer notified.`,
      };
      toast({ title: newStatus === "In-Bay" ? "Wash Initiated ✓" : "Job Card Closed ✓", description: messages[newStatus] });
      if (ctx) fetchJobs(ctx.branch_id);
    } catch (e: unknown) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed", variant: "destructive" });
    } finally {
      setActionId(null);
    }
  }

  const activeJobs      = jobs.filter((j) => j.status !== "Completed");
  const attendantName   = ctx?.email?.split("@")[0] ?? "Attendant";

  return (
    <div className="min-h-screen pb-32 bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 text-white p-6 shadow-2xl rounded-b-[2.5rem] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-primary/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
              <Waves className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Job Console</h1>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 capitalize">
                {attendantName} · SparkFlow Westlands
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => ctx && fetchJobs(ctx.branch_id)}
              className="rounded-xl bg-white/5 border border-white/10 size-10"
            >
              <RefreshCw className="size-4 text-slate-300" />
            </Button>
            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
              <BellRing className="size-5 text-primary" />
              {activeJobs.length > 0 && (
                <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6 max-w-xl mx-auto">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-5 flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">My Active Job Cards</h2>
          <Badge className="bg-emerald-500 text-white font-black text-[9px] px-3 py-1">
            {loading ? "…" : `${activeJobs.length} ACTIVE`}
          </Badge>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && activeJobs.length === 0 && !error && (
          <div className="text-center py-24 flex flex-col items-center gap-6 opacity-30">
            <div className="w-24 h-24 bg-slate-200 rounded-[3rem] flex items-center justify-center shadow-inner">
              <ClipboardCheck className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest leading-relaxed">
              No pending jobs.<br />Awaiting assignment from Agent...
            </p>
          </div>
        )}

        {/* Job cards */}
        {!loading && activeJobs.map((job) => {
          const isActioning = actionId === job.id;
          return (
            <Card
              key={job.id}
              className={cn(
                "overflow-hidden transition-all border-none shadow-xl rounded-[2.5rem] bg-white",
                job.status === "In-Bay" ? "ring-4 ring-primary/20 scale-[1.01]" : ""
              )}
            >
              <CardHeader className="pb-4 p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <Badge className={
                    job.status === "In-Bay" ? "bg-amber-500 text-white" :
                    job.status === "Ready"  ? "bg-emerald-500 text-white" :
                                              "bg-slate-100 text-slate-500"
                  }>
                    {job.status === "Ready" ? "READY FOR EXIT" : job.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="size-3" />
                    <span>
                      {mounted && job.arrival_time
                        ? new Date(job.arrival_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "--:--"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-4xl font-mono font-black tracking-[0.1em] text-slate-900 leading-none">
                    {job.plate}
                  </CardTitle>
                  <p className="flex items-center gap-2 font-black uppercase text-[10px] text-primary tracking-widest">
                    <MapPin className="size-3" />
                    {job.bay?.name ?? "Pending Bay Assignment"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-6 md:px-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {job.services.map((s) => (
                    <Badge key={s} variant="outline" className="font-black text-[9px] uppercase tracking-tighter border-slate-100 bg-slate-50 text-slate-500 px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                </div>

                {job.total_amount > 0 && (
                  <p className="text-sm font-black text-emerald-600">
                    KSh {job.total_amount.toLocaleString("en-KE")}
                  </p>
                )}

                {job.status === "In-Bay" && (
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <span>Live Progress</span>
                      <span className="text-primary">{job.progress}%</span>
                    </div>
                    <Progress
                      value={job.progress}
                      className="h-2 rounded-full bg-white shadow-sm [&>div]:bg-primary"
                    />
                  </div>
                )}

                {job.customer?.name && (
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Customer: {job.customer.name}
                  </p>
                )}
              </CardContent>

              <CardFooter className="bg-slate-50/50 p-6 md:p-8">
                {job.status === "Queue" ? (
                  <Button
                    className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 bg-primary hover:bg-blue-600 text-white active:scale-95"
                    onClick={() => advanceStatus(job, "In-Bay")}
                    disabled={isActioning}
                  >
                    {isActioning ? <Loader2 className="size-5 animate-spin mr-2" /> : <Play className="mr-3 size-5 fill-current" />}
                    {isActioning ? "Starting…" : "Initialize Job Card"}
                  </Button>
                ) : job.status === "Ready" ? (
                  <div className="w-full p-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center gap-2 text-emerald-700 font-black uppercase text-[10px] tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5" />
                      Vehicle Ready for Collection
                    </div>
                    <span className="text-[8px] opacity-60">Cleared for payment at agent desk</span>
                  </div>
                ) : job.status === "In-Bay" ? (
                  <Button
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95"
                    onClick={() => advanceStatus(job, "Ready")}
                    disabled={isActioning}
                  >
                    {isActioning ? <Loader2 className="size-5 animate-spin mr-2" /> : <Check className="mr-3 size-5" />}
                    {isActioning ? "Syncing…" : "Finish & Sync Data"}
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
