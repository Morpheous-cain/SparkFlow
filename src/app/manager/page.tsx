"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  MoreVertical,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { getManagerOperationalInsights, ManagerOperationalInsightsOutput } from "@/ai/flows/manager-operational-insights-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const PIE_DATA = [
  { name: 'Wash', value: 400, color: 'hsl(var(--chart-1))' },
  { name: 'Detailing', value: 300, color: 'hsl(var(--chart-2))' },
  { name: 'Tinting', value: 200, color: 'hsl(var(--chart-3))' },
  { name: 'Ceramic', value: 100, color: 'hsl(var(--chart-4))' },
];

const FUNNEL_DATA = [
  { name: 'Inquiries', value: 32000, label: '32K', percentage: '100%' },
  { name: 'Quotations', value: 21000, label: '21K', percentage: '60%' },
  { name: 'Confirmed', value: 12000, label: '12K', percentage: '40%' },
  { name: 'Invoicing', value: 7500, label: '7.5K', percentage: '35%' },
  { name: 'Delivered', value: 6500, label: '6.5K', percentage: '30%' },
];

export default function ManagerDashboard() {
  const [aiInsights, setAiInsights] = useState<ManagerOperationalInsightsOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const data = await getManagerOperationalInsights({
        staffPerformanceData: JSON.stringify(STAFF),
        serviceDurationData: JSON.stringify(SERVICES.map(s => ({ serviceName: s.name, avgDurationMinutes: s.duration, totalServices: Math.floor(Math.random() * 50) + 10 }))),
        transactionPatternData: JSON.stringify(MOCK_TRANSACTIONS)
      });
      setAiInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, []);

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      {/* Top Navigation / Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emma Johnson</h1>
          <p className="text-muted-foreground text-sm">Welcome back to Vantus 👋</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-10 h-10 rounded-xl bg-card border-none shadow-sm" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl bg-card shadow-sm">
            <Bell className="size-5" />
          </Button>
          <Button onClick={fetchAiInsights} className="gap-2 bg-primary text-white shadow-lg shadow-primary/20 h-10 rounded-xl px-4">
            <Sparkles className="size-4" /> AI Insights
          </Button>
        </div>
      </header>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Profit and Loss", value: "KES 21,090", change: "+43.5%", up: true, base: "vs last month 14K" },
          { title: "Total Gross Profit", value: "KES 14,775", change: "+76.1%", up: true, base: "vs last month 10K" },
          { title: "Total Sales", value: "KES 23,800", change: "+108.1%", up: true, base: "vs last month 11K" },
          { title: "Gross Profit Margin", value: "62.08%", change: "+15%", up: true, base: "vs last month 54%" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-muted-foreground">{metric.title}</span>
                <Button variant="ghost" size="icon" className="size-6"><MoreVertical className="size-4" /></Button>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{metric.base}</span>
                  <Badge variant="secondary" className={metric.up ? "bg-green-100 text-green-700 border-none" : "bg-red-100 text-red-700 border-none"}>
                    {metric.up ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ResponsiveContainer width={20} height={20}>
                <PieChart><Pie data={[{value: 100}]} dataKey="value" fill="hsl(var(--primary))" /></PieChart>
              </ResponsiveContainer>
              <CardTitle className="text-lg">Service Ranking</CardTitle>
            </div>
            <Badge variant="outline" className="rounded-lg">Last Week</Badge>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">1.4K</span>
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Jobs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ResponsiveContainer width={20} height={20}>
                <BarChart data={[{v:1}]}><Bar dataKey="v" fill="hsl(var(--primary))" /></BarChart>
              </ResponsiveContainer>
              <CardTitle className="text-lg">Customer Pipeline</CardTitle>
            </div>
            <Badge variant="outline" className="rounded-lg">Last Week</Badge>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <div className="flex justify-between items-end h-full gap-4 px-4">
              {FUNNEL_DATA.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">{step.name}</span>
                    <span className="text-lg font-bold">{step.label}</span>
                  </div>
                  <div 
                    className="w-full bg-primary/20 rounded-xl relative overflow-hidden flex items-center justify-center"
                    style={{ height: `${parseInt(step.percentage) * 2}px`, opacity: 1 - (i * 0.15) }}
                  >
                    <div className="absolute inset-0 bg-primary/40" />
                    <span className="relative text-[10px] font-bold text-primary">{step.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Performers</CardTitle>
            <Badge variant="outline" className="rounded-lg">Last Year</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {STAFF.slice(0, 5).sort((a,b) => b.performance - a.performance).map((staff, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm font-medium flex-1">{staff.name}</span>
                <div className="flex-[2] h-6 bg-slate-100 rounded-lg relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary flex items-center px-3"
                    style={{ width: `${(staff.performance / 5) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">KES {staff.earnings.toLocaleString()}</span>
                  </div>
                </div>
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowUpRight className="size-4 text-primary" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Popular Services</CardTitle>
            <Badge variant="outline" className="rounded-lg">Last Month</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {SERVICES.slice(0, 5).map((service, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm font-medium flex-1">{service.name}</span>
                <div className="flex-[2] h-6 bg-slate-100 rounded-lg relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-chart-2 to-chart-1 flex items-center px-3"
                    style={{ width: `${80 - (i * 10)}%` }}
                  >
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">KES {service.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="size-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <ArrowUpRight className="size-4 text-secondary-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <RoleSwitcher />
    </div>
  );
}