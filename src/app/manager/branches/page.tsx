"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Building2, TrendingUp, Warehouse, Globe, Settings2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BranchRow {
  id: string;
  name: string;
  location: string;
  status: string;
  water_level: number;
  created_at: string;
  tenant_id: string;
}

export default function BranchManagementPage() {
  const { toast } = useToast();
  const [branches,   setBranches]   = useState<BranchRow[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [saving,     setSaving]     = useState(false);

  // New branch form
  const [name,     setName]     = useState('');
  const [location, setLocation] = useState('');
  const [status,   setStatus]   = useState<'Open' | 'Closed'>('Open');

  function fetchBranches() {
    setLoading(true);
    fetch('/api/branches', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setBranches(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchBranches(); }, []);

  async function handleAddBranch() {
    if (!name.trim()) { toast({ title: 'Branch name required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), location: location.trim(), status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create branch');
      toast({ title: 'Branch created', description: `${name} is now live.` });
      setShowModal(false);
      setName(''); setLocation(''); setStatus('Open');
      fetchBranches();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] dark:bg-[#060E1E] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Branch Network</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">
            Global Station Monitoring & Multi-Unit Ops
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl h-12 gap-2 bg-white dark:bg-slate-800 border-2 font-black uppercase text-[10px] tracking-widest">
            <Globe className="size-4" /> Consolidated View
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest bg-[#00A8CC] hover:bg-[#0090B0] text-white border-none"
          >
            <Plus className="size-4" /> Add Branch
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Branches",  value: loading ? "—" : branches.length.toString(),                                                     icon: Building2,  color: "text-blue-600",    bg: "bg-blue-50"    },
          { label: "Open Branches",   value: loading ? "—" : branches.filter(b => b.status === 'Open').length.toString(),                    icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Water Level Avg", value: loading || !branches.length ? "—" : `${Math.round(branches.reduce((a,b) => a + (b.water_level ?? 0), 0) / branches.length)}%`, icon: Warehouse, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Network Health",  value: "98.2%",                                                                                         icon: Settings2,  color: "text-amber-600",   bg: "bg-amber-50"   },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group dark:bg-[#0F1F3D]">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase tracking-widest rounded-full">HQ</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white dark:bg-[#0F1F3D] rounded-[2.5rem] animate-pulse" />)
        ) : branches.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-slate-400">
            <Building2 className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-black uppercase tracking-widest text-sm">No branches yet</p>
            <Button onClick={() => setShowModal(true)} className="mt-6 rounded-2xl gap-2 bg-[#00A8CC] text-white border-none">
              <Plus className="size-4" /> Add Your First Branch
            </Button>
          </div>
        ) : (
          branches.map((branch) => (
            <Card key={branch.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#0F1F3D] group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Building2 className="size-7" />
                  </div>
                  <Badge className={cn("font-black text-[9px] uppercase px-3 py-1",
                    branch.status === 'Open' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}>
                    {branch.status ?? 'Unknown'}
                  </Badge>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{branch.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {branch.id.slice(0, 8)}...</p>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                {branch.location && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase">
                    <MapPin className="size-4 text-[#00A8CC]" />{branch.location}
                  </div>
                )}
                {branch.water_level !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                      <span>Water Level</span><span>{branch.water_level ?? 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all",
                          (branch.water_level ?? 0) > 50 ? "bg-emerald-500" :
                          (branch.water_level ?? 0) > 25 ? "bg-amber-500" : "bg-red-500")}
                        style={{ width: `${branch.water_level ?? 0}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-dashed dark:border-slate-700 flex gap-2">
                  <Button className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-[#00A8CC] text-white font-black uppercase text-[10px] tracking-widest border-none">
                    View Branch Hub
                  </Button>
                  <Button variant="outline" className="size-12 rounded-xl border-2 p-0 flex items-center justify-center dark:border-slate-600">
                    <Settings2 className="size-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ── Add Branch Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white dark:bg-[#0F1F3D] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#00A8CC] text-[9px] font-black uppercase tracking-[0.3em]">New Location</p>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Add Branch</h2>
              </div>
              <button
                onClick={() => !saving && setShowModal(false)}
                className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Branch Name */}
              <div>
                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  Branch Name *
                </Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Westlands Branch"
                  className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-[#00A8CC]"
                />
              </div>

              {/* Location */}
              <div>
                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  Location / Address
                </Label>
                <Input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Ring Road, Westlands"
                  className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-[#00A8CC]"
                />
              </div>

              {/* Status */}
              <div>
                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                  Initial Status
                </Label>
                <div className="flex gap-2">
                  {(['Open', 'Closed'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                        status === s
                          ? s === 'Open'
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-red-500 border-red-500 text-white"
                          : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleAddBranch}
                disabled={saving || !name.trim()}
                className="w-full h-12 rounded-2xl bg-[#00A8CC] hover:bg-[#0090B0] text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-500/20 disabled:opacity-40 mt-2 border-none gap-2"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                {saving ? 'Creating Branch...' : 'Create Branch'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
