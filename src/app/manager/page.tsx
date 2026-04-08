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
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 md:gap-8 bg-[#f1f5f9]">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
            Manager Dashboard
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            SparkFlow Carwash · Westlands Branch ·{" "}
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm font-bold"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl bg-white shadow-sm size-12 border-none"
          >
            <Bell className="size-5 text-slate-600" />
          </Button>
          <Button
            onClick={fetchDashboard}
            disabled={loading}
            className="gap-2 bg-slate-900 hover:bg-black text-white shadow-xl h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest border-none"
          >
            <Activity className="size-4" />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-6 flex items-center gap-4">
          <AlertTriangle className="size-8 text-red-500 shrink-0" />
          <div>
            <p className="font-black text-red-900 uppercase">Dashboard failed to load</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <Button
            onClick={fetchDashboard}
            className="ml-auto bg-red-600 text-white rounded-xl border-none"
          >
            Retry
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpis.map((metric, i) => (
            <Card
              key={i}
              className="border-none shadow-xl rounded-[2.2rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative"
            >
              <div
                className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  metric.color.replace("text", "bg")
                )}
              />
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <div
                    className={cn(
                      "size-12 rounded-2xl flex items-center justify-center",
                      metric.bg,
                      metric.color
                    )}
                  >
                    <metric.icon className="size-6" />
                  </div>
                  <ArrowUpRight className={cn("size-4", metric.color)} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {metric.title}
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">
                    {metric.value}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">
                    {metric.sub}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Revenue This Week
              </h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Today's figure is live · Historical bars will populate in Phase 4
              </p>
            </div>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
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
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 900 }}
                    tickFormatter={(val) => `KSh ${val.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "1.5rem",
                      border: "none",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      padding: "1rem",
                    }}
                    formatter={(val: number) => [fmt(val), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top Services + Payment breakdown */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-6 md:p-8 overflow-hidden">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
              Top Services Today
            </CardTitle>
            <CardDescription className="text-[9px] font-black uppercase tracking-widest">
              Ranked by transaction count
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-slate-100 rounded-xl animate-pulse" />
              ))
            ) : data?.top_services.length ? (
              data.top_services.map((svc, i) => (
                <div key={svc.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>
                      {i + 1}. {svc.name}
                    </span>
                    <span>{svc.count}x</span>
                  </div>
                  <Progress
                    value={(svc.count / (data.top_services[0]?.count || 1)) * 100}
                    className="h-2 rounded-full bg-slate-100"
                  />
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm font-medium text-center py-8">
                No paid transactions yet today
              </p>
            )}

            {data && (
              <div className="pt-4 border-t border-dashed space-y-2 mt-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Payment Methods
                </p>
                {Object.entries(data.revenue.by_method).map(([method, amount]) => (
                  <div key={method} className="flex justify-between text-sm font-bold text-slate-700">
                    <span>{method}</span>
                    <span>{fmt(amount as number)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}