"use client";

// src/app/manager/inventory/page.tsx
// Was missing — caused 404. Full wired inventory page below.

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Package, AlertTriangle, CheckCircle2, Plus, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  low_stock_threshold: number;
  unit: string;
  is_low_stock: boolean;
  updated_at: string;
};

export default function InventoryPage() {
  const { toast } = useToast();
  const [items, setItems]             = useState<InventoryItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty]   = useState("10");
  const [restocking, setRestocking]   = useState(false);

  async function fetchInventory() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/inventory", { credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      setItems(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInventory(); }, []);

  async function handleRestock() {
    if (!restockItem) return;
    const qty = parseInt(restockQty);
    if (!qty || qty < 1) { toast({ title: "Enter a valid quantity", variant: "destructive" }); return; }
    setRestocking(true);
    try {
      const res = await fetch(`/api/inventory/${restockItem.id}/restock`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Restock failed");
      const updated = await res.json();
      toast({ title: "Restocked ✓", description: `${restockItem.name}: ${updated.previous_stock} → ${updated.stock} units` });
      setRestockItem(null);
      setRestockQty("10");
      fetchInventory();
    } catch (e: unknown) {
      toast({ title: "Restock failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setRestocking(false);
    }
  }

  const lowCount = items.filter((i) => i.is_low_stock).length;
  const okCount  = items.filter((i) => !i.is_low_stock).length;

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500">Stock levels and restock management</p>
        </div>
        <Button onClick={fetchInventory} variant="outline" className="rounded-xl h-12 gap-2 bg-white">
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </header>

      {error && (
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-6 flex items-center gap-4">
          <AlertTriangle className="size-6 text-red-500" />
          <p className="text-red-700 font-bold">{error}</p>
          <Button onClick={fetchInventory} className="ml-auto rounded-xl bg-red-600 text-white border-none">Retry</Button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Items",      value: loading ? "—" : items.length.toString(),  icon: Package,      color: "text-blue-600",    bg: "bg-blue-50"    },
          { label: "Low Stock",        value: loading ? "—" : lowCount.toString(),      icon: AlertTriangle,color: "text-red-600",     bg: "bg-red-50"     },
          { label: "Sufficient Stock", value: loading ? "—" : okCount.toString(),       icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem]">
            <CardContent className="p-8">
              <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-6`}>
                <kpi.icon className="size-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{kpi.label}</span>
              <div className="text-3xl font-black text-slate-900">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && lowCount > 0 && (
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-[2rem] p-6 flex items-center gap-4">
          <AlertTriangle className="size-8 text-red-500 shrink-0" />
          <div>
            <p className="font-black text-red-900 uppercase">{lowCount} item{lowCount > 1 ? "s" : ""} running low</p>
            <p className="text-red-700 text-sm">Click the restock button on any item below to top up stock.</p>
          </div>
        </div>
      )}

      {/* Items grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const pct = Math.min(100, Math.round((item.stock / Math.max(item.low_stock_threshold * 3, 1)) * 100));
            return (
              <Card key={item.id} className={cn("border-none shadow-sm rounded-[2.5rem] overflow-hidden", item.is_low_stock ? "ring-2 ring-red-200" : "")}>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Package className="size-6" />
                    </div>
                    <Badge className={cn("border-none font-bold rounded-full px-3", item.is_low_stock ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")}>
                      {item.is_low_stock ? "Low Stock" : "OK"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase">{item.name}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-1">Threshold: {item.low_stock_threshold} {item.unit ?? "units"}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Stock Level</span>
                      <span className={item.is_low_stock ? "text-red-600" : "text-emerald-600"}>{item.stock} {item.unit ?? "units"}</span>
                    </div>
                    <Progress value={pct} className={cn("h-3 rounded-full bg-slate-100", item.is_low_stock ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500")} />
                  </div>
                  <Button
                    onClick={() => { setRestockItem(item); setRestockQty("10"); }}
                    variant={item.is_low_stock ? "default" : "outline"}
                    className={cn("w-full rounded-2xl h-12 font-black uppercase text-xs tracking-widest gap-2", item.is_low_stock ? "shadow-lg shadow-primary/20" : "border-2")}
                  >
                    <Plus className="size-4" /> Restock
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Restock dialog */}
      <Dialog open={!!restockItem} onOpenChange={(o) => !o && setRestockItem(null)}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase">Restock — {restockItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-slate-500 text-sm">Current stock: <strong>{restockItem?.stock} {restockItem?.unit ?? "units"}</strong></p>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Quantity to add</label>
              <Input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(e.target.value)} className="rounded-xl h-12 border-2 text-lg font-black" />
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm font-bold text-slate-600">New stock will be: <span className="text-emerald-600 font-black text-lg">{(restockItem?.stock ?? 0) + (parseInt(restockQty) || 0)} {restockItem?.unit ?? "units"}</span></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestockItem(null)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleRestock} disabled={restocking} className="rounded-xl gap-2">
              {restocking && <Loader2 className="size-4 animate-spin" />}
              {restocking ? "Restocking..." : "Confirm Restock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
