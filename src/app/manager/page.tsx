"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Search,
  Bell,
  Sparkles,
  DollarSign,
  Users,
  Activity,
  Gauge,
  ArrowUpRight,
  Target,
  PieChart,
  AlertTriangle,
  Warehouse,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// ── Types ──────────────────────────────────────────────────────────────────
type DashboardData = {
  date: string;
  revenue: {
    total: number;
    by_method: Record<string, number>;
    tx_count: number;
  };
  bays: {
    total: number;
    occupied: number;
    utilisation: number;
  };
  vehicles: {
    active: number;
    by_status: Record<string, number>;
  };
  top_services: { name: string; count: number }[];
};

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

export default function ManagerDashboard() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Last 7 days revenue — built from today's data (single point) padded with zeros
  // In Phase 4 this will be a proper time-series from the reports route
  const [revTrend, setRevTrend] = useState<{ day: string; revenue: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard", { credentials: "include" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const json: DashboardData = await res.json();
      setData(json);

      // Build a simple 7-day sparkline — today is the real number, previous days are 0
      // Replace this with a real time-series call in Phase 4
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const todayIdx = new Date().getDay(); // 0=Sun … 6=Sat
      const reIndexed = [...days.slice(todayIdx), ...days.slice(0, todayIdx)];
      setRevTrend(
        reIndexed.map((day, i) => ({
          day,
          revenue: i === reIndexed.length - 1 ? json.revenue.total : 0,
        }))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
      toast({ title: "Dashboard error", description: String(e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // ── Derived KPIs ──────────────────────────────────────────────────────────
  const mpesa  = data?.revenue.by_method?.["M-Pesa"] ?? 0;
  const cash   = data?.revenue.by_method?.["Cash"]   ?? 0;
  const card   = data?.revenue.by_method?.["Card"]   ?? 0;

  const kpis = data
    ? [
        {
          title: "Today's Revenue",
          value: fmt(data.revenue.total),
          sub: `${data.revenue.tx_count} paid transactions`,
          icon: DollarSign,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          title: "Bay Utilisation",
          value: `${data.bays.utilisation}%`,
          sub: `${data.bays.occupied} of ${data.bays.total} bays occupied`,
          icon: Warehouse,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "Active Vehicles",
          value: data.vehicles.active.toString(),
          sub: Object.entries(data.vehicles.by_status)
            .map(([s, n]) => `${n} ${s}`)
            .join(" · "),
          icon: Car,
          color: "text-indigo-500",
          bg: "bg-indigo-500/10",
        },
        {
          title: "M-Pesa / Cash / Card",
          value: fmt(mpesa),
          sub: `Cash ${fmt(cash)}  ·  Card ${fmt(card)}`,
          icon: Target,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
      ]
    : [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen p-4 md:p-6 flex flex-col gap-4 bg-[#f1f5f9] dark:bg-[#060E1E] overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            Manager Dashboard
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-1">
            SparkFlow · {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-48 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input placeholder="Search..." className="pl-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm text-sm font-bold" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl bg-white dark:bg-slate-800 shadow-sm size-10 border-none">
            <Bell className="size-4 text-slate-600 dark:text-slate-300" />
          </Button>
          <Button onClick={fetchDashboard} disabled={loading}
            className="gap-2 bg-slate-900 dark:bg-cyan-600 hover:bg-black text-white shadow-xl h-10 rounded-xl px-4 font-black uppercase text-[9px] tracking-widest border-none">
            <Activity className="size-3.5" />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-2xl p-4 flex items-center gap-3 shrink-0">
          <AlertTriangle className="size-6 text-red-500 shrink-0" />
          <p className="text-red-700 text-sm font-bold">{error}</p>
          <Button onClick={fetchDashboard} className="ml-auto bg-red-600 text-white rounded-xl border-none h-9 text-xs">Retry</Button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />)
          : kpis.map((metric, i) => (
            <Card key={i} className="border-none shadow-md rounded-2xl overflow-hidden group bg-white dark:bg-[#0F1F3D] relative">
              <div className={cn("absolute top-0 left-0 w-1 h-full", metric.color.replace("text", "bg"))} />
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className={cn("size-8 rounded-xl flex items-center justify-center", metric.bg, metric.color)}>
                    <metric.icon className="size-4" />
                  </div>
                  <ArrowUpRight className={cn("size-3.5", metric.color)} />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{metric.title}</span>
                <div className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">{metric.value}</div>
                <span className="text-[9px] text-slate-400 font-medium">{metric.sub}</span>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* 2x2 Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">

        {/* Revenue Chart */}
        <Card className="border-none shadow-xl rounded-2xl bg-white dark:bg-[#0F1F3D] p-5 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Revenue This Week</h3>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Today live · History in Phase 4</p>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 8, fontWeight: 900 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 8, fontWeight: 900 }} tickFormatter={(val) => `KSh ${val.toLocaleString()}`} />
                  <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: "0.75rem" }} formatter={(val: number) => [fmt(val), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top Services + Payment Methods */}
        <Card className="border-none shadow-xl rounded-2xl bg-white dark:bg-[#0F1F3D] p-5 flex flex-col overflow-hidden">
          <CardHeader className="p-0 mb-4 shrink-0">
            <CardTitle className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Top Services Today</CardTitle>
            <CardDescription className="text-[8px] font-black uppercase tracking-widest">Ranked by transaction count</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => <div key={i} className="h-7 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)
              : data?.top_services.length
                ? data.top_services.map((svc, i) => (
                  <div key={svc.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>{i + 1}. {svc.name}</span>
                      <span>{svc.count}x</span>
                    </div>
                    <Progress value={(svc.count / (data.top_services[0]?.count || 1)) * 100} className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700" />
                  </div>
                ))
                : <p className="text-slate-400 text-sm text-center py-6">No paid transactions yet today</p>
            }
            {data && (
              <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payment Methods</p>
                {Object.entries(data.revenue.by_method).map(([method, amount]) => (
                  <div key={method} className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{method}</span><span>{fmt(amount as number)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bay Status */}
        <Card className="border-none shadow-xl rounded-2xl bg-white dark:bg-[#0F1F3D] p-5 flex flex-col">
          <CardHeader className="p-0 mb-4 shrink-0">
            <CardTitle className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Bay Status</CardTitle>
            <CardDescription className="text-[8px] font-black uppercase tracking-widest">Live via Supabase Realtime</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-center gap-3">
            {data ? (
              <>
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="size-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-black text-sm text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Available</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-600">{data.bays.total - data.bays.occupied}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="size-3 bg-blue-500 rounded-full" />
                    <span className="font-black text-sm text-blue-700 dark:text-blue-400 uppercase tracking-wide">Occupied</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">{data.bays.occupied}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Gauge className="size-4 text-slate-400" />
                    <span className="font-black text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">Utilisation</span>
                  </div>
                  <span className="text-2xl font-black text-slate-700 dark:text-white">{data.bays.utilisation}%</span>
                </div>
              </>
            ) : (
              [...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-xl rounded-2xl bg-white dark:bg-[#0F1F3D] p-5 flex flex-col">
          <CardHeader className="p-0 mb-4 shrink-0">
            <CardTitle className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Quick Actions</CardTitle>
            <CardDescription className="text-[8px] font-black uppercase tracking-widest">Common manager tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 grid grid-cols-2 gap-3 content-start">
            {[
              { label: "View Bays",      href: "/manager/bays",      icon: Warehouse, color: "bg-blue-500" },
              { label: "Manage Staff",   href: "/manager/staff",     icon: Users,     color: "bg-indigo-500" },
              { label: "Sales Report",   href: "/manager/sales",     icon: PieChart,  color: "bg-emerald-500" },
              { label: "Analytics",      href: "/manager/analytics", icon: TrendingUp,color: "bg-amber-500" },
              { label: "Inventory",      href: "/manager/inventory", icon: Sparkles,  color: "bg-red-500" },
              { label: "Settings",       href: "/manager/settings",  icon: Target,    color: "bg-slate-700" },
            ].map((action) => (
              <a key={action.href} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", action.color)}>
                  <action.icon className="size-4 text-white" />
                </div>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide leading-tight">{action.label}</span>
              </a>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
