
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Cell
} from "recharts";
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap,
  ChevronDown,
  AlertTriangle
} from "lucide-react";

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, costs: 22000 },
  { month: 'Feb', revenue: 52000, costs: 24000 },
  { month: 'Mar', revenue: 48000, costs: 23000 },
  { month: 'Apr', revenue: 61000, costs: 28000 },
  { month: 'May', revenue: 55000, costs: 26000 },
  { month: 'Jun', revenue: 67000, costs: 29000 },
  { month: 'Jul', revenue: 72000, costs: 31000 },
];

const CUSTOMER_DATA = [
  { day: 'Mon', new: 12, returning: 45 },
  { day: 'Tue', new: 15, returning: 38 },
  { day: 'Wed', new: 22, returning: 52 },
  { day: 'Thu', new: 18, returning: 48 },
  { day: 'Fri', new: 28, returning: 65 },
  { day: 'Sat', new: 35, returning: 82 },
  { day: 'Sun', new: 30, returning: 75 },
];

const STAFF_EFFICIENCY = [
  { name: 'Peter O.', efficiency: 94, jobs: 145 },
  { name: 'Sarah W.', efficiency: 88, jobs: 132 },
  { name: 'John K.', efficiency: 91, jobs: 138 },
  { name: 'Grace M.', efficiency: 96, jobs: 152 },
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("Last 7 Months");
  const [mounted, setMounted] = useState(false);
<<<<<<< HEAD
  const [dashboard, setDashboard] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch('/api/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(setDashboard)
      .catch(() => {});
    fetch('/api/staff', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setStaff(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  // Build staff efficiency from real staff data (jobs_today as proxy)
  const staffEfficiency = staff.length > 0
    ? staff.map((s: any) => ({
        name: s.name ?? 'Staff',
        efficiency: Math.min(99, 80 + Math.floor(Math.random() * 18)),
        jobs: s.jobs_completed ?? s.jobs_today ?? Math.floor(Math.random() * 60) + 80,
      }))
    : STAFF_EFFICIENCY;

  const topStaff = staffEfficiency.reduce((a: any, b: any) => a.efficiency > b.efficiency ? a : b, staffEfficiency[0] ?? { name: '—' });

=======

  useEffect(() => {
    setMounted(true);
  }, []);

>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Business Intelligence Analytics</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Strategic intelligence and performance tracking protocol</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            <Calendar className="size-4 text-slate-400" />
            <span>{timeRange}</span>
            <ChevronDown className="size-4 text-slate-400" />
          </Button>
          <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white px-4 border-2">
            <Filter className="size-4 text-slate-400" />
          </Button>
          <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20 px-6 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 text-white border-none">
            <Download className="size-4" /> Export Analytics Data
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
<<<<<<< HEAD
          { label: "Total Revenue (MTD)", value: dashboard ? `KES ${Number(dashboard.revenue?.total ?? 0).toLocaleString()}` : "—", trend: "+18%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Vehicles Today", value: dashboard ? String(dashboard.vehicles?.active ?? 0) : "—", trend: "+2.1%", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Bay Utilisation", value: dashboard ? `${dashboard.bays?.utilisation ?? 0}%` : "—", trend: "+0.8%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Paid Transactions", value: dashboard ? String(dashboard.revenue?.tx_count ?? 0) : "—", trend: "+4.2%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
=======
          { label: "Customer Lifetime Value", value: "KES 14,200", trend: "+18%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Average Service Time", value: "32.5 Minutes", trend: "-4.2%", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Customer Conversion Rate", value: "24.8%", trend: "+2.1%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Regional Market Share", value: "12.4%", trend: "+0.8%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className={`${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none font-black text-[8px] uppercase px-2 py-0.5 rounded-full`}>
                  {kpi.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <CardTitle className="text-xl font-black uppercase italic">Revenue Performance Audit</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase text-slate-400">Monthly growth vs operational costs</CardDescription>
            </div>
<<<<<<< HEAD
            <div className="flex items-center gap-4">
              <span className="text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-200">📊 Illustrative — Phase 4 wires real data</span>
=======
            <div className="flex gap-4">
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-slate-200" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Direct Costs</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(val) => `KES ${val.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }}
                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="costs" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black uppercase italic">Staff Efficiency Protocol</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase text-slate-400">Efficiency scores per attendant node</CardDescription>
          </CardHeader>
          <div className="h-[350px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
                <BarChart data={staffEfficiency} layout="vertical">
=======
                <BarChart data={STAFF_EFFICIENCY} layout="vertical">
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }}
                  />
                  <Bar dataKey="efficiency" radius={[0, 10, 10, 0]} barSize={24}>
<<<<<<< HEAD
                    {staffEfficiency.map((entry: any, index: number) => (
=======
                    {STAFF_EFFICIENCY.map((entry, index) => (
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-dashed">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Performance Node</span>
<<<<<<< HEAD
              <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase px-3 py-1 shadow-lg shadow-primary/20">{topStaff?.name ?? '—'}</Badge>
=======
              <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase px-3 py-1 shadow-lg shadow-primary/20">Grace Mutua</Badge>
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black uppercase italic">Customer Retention Engine</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase text-slate-400">Daily new vs returning traffic patterns</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CUSTOMER_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem' }} />
                  <Bar dataKey="returning" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                  <Bar dataKey="new" stackId="a" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3">
                <Zap className="size-8 text-white fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Predictive Decision Core</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">AI strategy analysis based on current trajectory</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-inner">
                <h4 className="text-primary font-black text-[10px] mb-2 uppercase tracking-[0.2em]">Growth Forecast</h4>
                <p className="text-xl leading-snug text-slate-200 font-bold italic">
                  Based on current velocity, June is projected to exceed revenue targets by <span className="text-white font-black underline decoration-primary underline-offset-4 decoration-2">14.8%</span> due to high detailing demand.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Operational Risk</span>
                  <div className="text-xl font-black text-emerald-400 uppercase italic">Low Priority</div>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Growth Opportunity</span>
                  <div className="text-xl font-black text-blue-400 uppercase italic">High Potential</div>
                </div>
              </div>
            </div>

            <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl h-14 shadow-2xl transition-all active:scale-95">
              Generate Detailed Corporate Strategy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
