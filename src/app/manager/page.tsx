"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Search,
  Bell,
  Sparkles,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getManagerOperationalInsights, ManagerOperationalInsightsOutput } from "@/ai/flows/manager-operational-insights-flow";
import { Skeleton } from "@/components/ui/skeleton";

const PIE_DATA = [
  { name: 'Wash', value: 400, color: '#3b82f6' },
  { name: 'Detailing', value: 300, color: '#0ea5e9' },
  { name: 'Tinting', value: 200, color: '#06b6d4' },
  { name: 'Ceramic', value: 100, color: '#14b8a6' },
];

const PIPELINE_DATA = [
  { name: 'INQUIRIES', value: '32K', percentage: '100%', height: '180px' },
  { name: 'QUOTATIONS', value: '21K', percentage: '60%', height: '130px' },
  { name: 'CONFIRMED', value: '12K', percentage: '40%', height: '90px' },
  { name: 'INVOICING', value: '7.5K', percentage: '35%', height: '70px' },
  { name: 'DELIVERED', value: '6.5K', percentage: '30%', height: '60px' },
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
    <div className="min-h-screen p-8 flex flex-col gap-8 bg-[#f8fafc]">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Emma Johnson</h1>
          <p className="text-slate-500 font-medium">Welcome back to Vantus 👋</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input placeholder="Search reports..." className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm text-sm focus-visible:ring-primary/20" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white shadow-sm size-12 hover:bg-slate-50">
            <Bell className="size-5 text-slate-600" />
          </Button>
          <Button 
            onClick={fetchAiInsights} 
            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-12 rounded-2xl px-6 font-semibold"
            disabled={loadingAi}
          >
            <Sparkles className="size-4" /> {loadingAi ? "Analyzing..." : "AI Insights"}
          </Button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Profit and Loss", value: "KES 21,090", change: "+43.5%", base: "vs last month 14K" },
          { title: "Total Gross Profit", value: "KES 14,775", change: "+76.1%", base: "vs last month 10K" },
          { title: "Total Sales", value: "KES 23,800", change: "+108.1%", base: "vs last month 11K" },
          { title: "Gross Profit Margin", value: "62.08%", change: "+15%", base: "vs last month 54%" },
        ].map((metric, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{metric.title}</span>
                <Button variant="ghost" size="icon" className="size-8 rounded-full"><MoreVertical className="size-4 text-slate-400" /></Button>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-3xl font-bold text-slate-900">{metric.value}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400">{metric.base}</span>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-full text-[10px] font-bold">
                    <TrendingUp className="size-3 mr-1" />
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Ranking */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-blue-500" />
              <h3 className="text-xl font-bold text-slate-900">Service Ranking</h3>
            </div>
            <Badge variant="outline" className="rounded-xl px-4 py-1.5 border-slate-100 text-slate-500 font-semibold">Last Week</Badge>
          </div>
          <div className="h-[400px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={110}
                  outerRadius={150}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900">1.4K</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Total Jobs</span>
            </div>
          </div>
        </Card>

        {/* Customer Pipeline */}
        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-indigo-500" />
              <h3 className="text-xl font-bold text-slate-900">Customer Pipeline</h3>
            </div>
            <Badge variant="outline" className="rounded-xl px-4 py-1.5 border-slate-100 text-slate-500 font-semibold">Last Week</Badge>
          </div>
          <div className="flex items-end justify-between h-[300px] gap-4 px-2">
            {PIPELINE_DATA.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-6">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-tighter">{step.name}</span>
                  <span className="text-xl font-bold text-slate-900">{step.value}</span>
                </div>
                <div 
                  className="w-full bg-blue-50 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center group"
                  style={{ height: step.height }}
                >
                  <div className="absolute inset-0 bg-primary/20 opacity-40 group-hover:opacity-60 transition-opacity" />
                  <span className="relative text-xs font-bold text-primary">{step.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {aiInsights && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-700 text-white overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-8">
          <CardHeader className="p-0 mb-6 flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">AI Operational Insights</CardTitle>
              <p className="text-white/70 text-sm">Real-time analysis based on today's performance</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <p className="text-lg leading-relaxed text-white/90 font-medium">{aiInsights.overallSummary}</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Identified Trends</h4>
                <ul className="space-y-3">
                  {aiInsights.identifiedTrends.map((trend, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                      <div className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Strategic Recommendations</h4>
                <ul className="space-y-3">
                  {aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm bg-indigo-900/40 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                      <div className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <RoleSwitcher />
    </div>
  );
}