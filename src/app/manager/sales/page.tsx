"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  plate: string;
  amount: number;
  status: string;
  payment_method: string;
  services: string[];
  date: string;
  mpesa_receipt?: string;
  customer?: { name: string; phone: string };
};

const STATUS_OPTIONS = ["", "Paid", "Pending", "Failed"];
const LIMIT = 20;

function fmt(n: number) {
  return `KSh ${Number(n).toLocaleString("en-KE")}`;
}

export default function SalesPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [offset, setOffset]   = useState(0);

  // Filters
  const [plate, setPlate]   = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom]     = useState("");
  const [to, setTo]         = useState("");

  // ── Fetch ───────────────────────────────────────────────────────────────
  async function fetchTransactions(newOffset = 0) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (plate)  params.set("plate",  plate);
      if (status) params.set("status", status);
      if (from)   params.set("from",   from);
      if (to)     params.set("to",     to);
      params.set("limit",  String(LIMIT));
      params.set("offset", String(newOffset));

      const res = await fetch(`/api/transactions?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const data = await res.json();
      setTransactions(data.data ?? []);
      setTotal(data.total ?? 0);
      setOffset(newOffset);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTransactions(0); }, [status]);

  // ── Revenue summary ─────────────────────────────────────────────────────
  const paidTxns    = transactions.filter((t) => t.status === "Paid");
  const totalRevenue = paidTxns.reduce((sum, t) => sum + Number(t.amount), 0);
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  const byMethod = paidTxns.reduce((acc, t) => {
    acc[t.payment_method] = (acc[t.payment_method] ?? 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales & Transactions</h1>
          <p className="text-slate-500">Transaction history and revenue breakdown</p>
        </div>
        <Button onClick={() => fetchTransactions(0)} variant="outline" className="rounded-xl h-12 gap-2 bg-white">
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </header>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-6 flex items-center gap-4">
          <AlertTriangle className="size-6 text-red-500" />
          <p className="text-red-700 font-bold">{error}</p>
          <Button onClick={() => fetchTransactions(0)} className="ml-auto rounded-xl bg-red-600 text-white border-none">Retry</Button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue (shown)", value: loading ? "—" : fmt(totalRevenue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Paid Transactions", value: loading ? "—" : paidTxns.length.toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending", value: loading ? "—" : pendingCount.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Records", value: loading ? "—" : total.toString(), icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-8">
              <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-6`}>
                <kpi.icon className="size-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
              <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment method breakdown */}
      {!loading && Object.keys(byMethod).length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {Object.entries(byMethod).map(([method, amount]) => (
            <div key={method} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary" />
              <span className="font-bold text-slate-600 text-sm">{method}</span>
              <span className="font-black text-slate-900">{fmt(amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search plate..."
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && fetchTransactions(0)}
            className="pl-12 h-12 rounded-2xl border-2 bg-white font-bold uppercase"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-36 h-12 rounded-2xl border-2 bg-white font-bold">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-12 rounded-2xl border-2 bg-white font-bold w-44"
          placeholder="From date"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-12 rounded-2xl border-2 bg-white font-bold w-44"
          placeholder="To date"
        />
        <Button onClick={() => fetchTransactions(0)} className="h-12 rounded-2xl px-6 font-black uppercase text-xs tracking-widest">
          <Search className="size-4 mr-2" /> Search
        </Button>
        <Button
          variant="outline"
          onClick={() => { setPlate(""); setStatus(""); setFrom(""); setTo(""); fetchTransactions(0); }}
          className="h-12 rounded-2xl px-6 font-black uppercase text-xs tracking-widest bg-white"
        >
          Clear
        </Button>
      </div>

      {/* Table */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">Transactions</CardTitle>
              <CardDescription>{total} total records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-16 text-center text-slate-400 font-bold">No transactions found</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  {["Date", "Plate", "Customer", "Services", "Method", "Amount", "Status"].map((h) => (
                    <TableHead key={h} className="font-black text-[9px] uppercase text-slate-400 tracking-widest px-6">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-slate-50 hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">
                          {format(new Date(tx.date ?? tx.id), "dd MMM")}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {tx.mpesa_receipt ?? tx.id.slice(0, 8)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <span className="font-mono font-black text-slate-900">{tx.plate}</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <span className="text-sm text-slate-600">{tx.customer?.name ?? "—"}</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex gap-1 flex-wrap">
                        {(tx.services ?? []).slice(0, 2).map((s) => (
                          <Badge key={s} variant="secondary" className="text-[9px] px-2 py-0 rounded-full">
                            {s}
                          </Badge>
                        ))}
                        {(tx.services ?? []).length > 2 && (
                          <Badge variant="secondary" className="text-[9px] px-2 py-0 rounded-full">
                            +{tx.services.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <span className="text-xs font-bold text-slate-600">{tx.payment_method}</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <span className="text-sm font-black text-primary">{fmt(tx.amount)}</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge className={cn(
                        "border-none font-bold rounded-full text-[9px]",
                        tx.status === "Paid"    ? "bg-emerald-100 text-emerald-700" :
                        tx.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                                  "bg-red-100 text-red-700"
                      )}>
                        {tx.status === "Paid" && <CheckCircle2 className="size-2 mr-1 inline" />}
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {/* Pagination */}
        {total > LIMIT && (
          <div className="p-6 border-t bg-slate-50/30 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">
              Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => fetchTransactions(Math.max(0, offset - LIMIT))}
                className="rounded-xl"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={offset + LIMIT >= total}
                onClick={() => fetchTransactions(offset + LIMIT)}
                className="rounded-xl"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
