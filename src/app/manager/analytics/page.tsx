
"use client";

import { useState } from "react";
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
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap,
  ChevronDown
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

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Business Analytics</h1>
          <p className="text-slate-500 font-medium">Strategic intelligence and performance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white">
            <Calendar className="size-4 text-slate-400" />
            <span className="font-bold">{timeRange}</span>
            <ChevronDown className="size-4 text-slate-400" />
          </Button>
          <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white px-4">
            <Filter className="size-4 text-slate-400" />
          </Button>
          <Button className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20 px-6">
            <Download className="size-4" /> Export Data
          </Button>
        </div>
      </header>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Customer LTV", value: "KES 14.2K", trend: "+18%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg. Service Time", value: "32.5m", trend: "-4.2%", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Conversion Rate", value: "24.8%", trend: "+2.1%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Market Share", value: "12.4%", trend: "+0.8%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className={`${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none font-bold rounded-full`}>
                  {kpi.trend}
                </Badge>
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
        {/* Revenue vs Costs Growth */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <CardTitle className="text-xl font-bold">Revenue Performance</CardTitle>
              <CardDescription>Monthly growth vs operational costs</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary" />
                <span className="text-xs font-bold text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-slate-200" />
                <span className="text-xs font-bold text-slate-500">Costs</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
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
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `K${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="costs" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Staff Efficiency Radar/Bar */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-bold">Staff Performance</CardTitle>
            <CardDescription>Efficiency scores per attendant</CardDescription>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STAFF_EFFICIENCY} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="efficiency" radius={[0, 10, 10, 0]} barSize={24}>
                  {STAFF_EFFICIENCY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-dashed">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Top Performer</span>
              <Badge className="bg-primary text-white border-none">Grace M.</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Mix */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-bold">Customer Retention</CardTitle>
            <CardDescription>Daily new vs returning traffic</CardDescription>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CUSTOMER_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="returning" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                <Bar dataKey="new" stackId="a" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Insight Box */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
                <Zap className="size-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Predictive Insights</h3>
                <p className="text-slate-400 text-sm">AI analysis of current business trajectory</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-primary font-bold text-sm mb-2 uppercase tracking-widest">Revenue Forecast</h4>
                <p className="text-lg leading-relaxed text-slate-200">
                  Based on current velocity, June is projected to exceed revenue targets by <span className="text-white font-black">14.8%</span> due to high detailing demand.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Level</span>
                  <div className="text-xl font-bold text-emerald-400">Low</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Growth Opportunity</span>
                  <div className="text-xl font-bold text-blue-400">High</div>
                </div>
              </div>
            </div>

            <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl h-14">
              Generate Comprehensive Strategy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
