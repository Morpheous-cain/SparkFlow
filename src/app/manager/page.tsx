"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_TRANSACTIONS, STAFF, SERVICES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Waves, 
  AlertCircle,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getManagerOperationalInsights, ManagerOperationalInsightsOutput } from "@/ai/flows/manager-operational-insights-flow";
import { Skeleton } from "@/components/ui/skeleton";

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

  const totalRevenue = MOCK_TRANSACTIONS.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = (STAFF.reduce((acc, curr) => acc + curr.earnings, 0) / 30) + (totalRevenue * 0.1); // Simulated daily costs
  const profit = totalRevenue - totalExpenses;

  const bays = [
    { id: 1, name: "Bay A", status: "Occupied", vehicle: "KDC 123A", time: "25m" },
    { id: 2, name: "Bay B", status: "Vacant", vehicle: null, time: null },
    { id: 3, name: "Bay C", status: "Occupied", vehicle: "KDH 456B", time: "10m" },
    { id: 4, name: "Detailing 1", status: "Maintenance", vehicle: null, time: null },
  ];

  return (
    <div className="min-h-screen pb-24 p-4 lg:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" /> 
            Real-time update: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Report
          </Button>
          <Button onClick={fetchAiInsights} className="gap-2 bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
            <Sparkles className="w-4 h-4" /> Generate AI Insights
          </Button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <DollarSign className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">+12.5%</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Daily Revenue</p>
            <h3 className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-secondary shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Healthy</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Est. Net Profit</p>
            <h3 className="text-2xl font-bold">KES {Math.floor(profit).toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-cyan-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                <Waves className="w-5 h-5" />
              </div>
              <Badge variant="secondary">75% Occ.</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
            <h3 className="text-2xl font-bold">12 Vehicles</h3>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">3 Pending</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Staff Performance</p>
            <h3 className="text-2xl font-bold">4.7 avg</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Bay Occupancy Heatmap
            </CardTitle>
            <CardDescription>Live tracking of washing bays and detailing areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bays.map(bay => (
                <div 
                  key={bay.id} 
                  className={`p-4 rounded-xl border-2 flex flex-col gap-2 transition-all ${
                    bay.status === 'Occupied' ? 'bg-primary/5 border-primary ring-4 ring-primary/5' : 
                    bay.status === 'Vacant' ? 'bg-green-50 border-green-200' : 
                    'bg-slate-100 border-slate-200 grayscale opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{bay.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      bay.status === 'Occupied' ? 'bg-primary animate-pulse' : 
                      bay.status === 'Vacant' ? 'bg-green-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="py-2">
                    {bay.vehicle ? (
                      <div className="font-mono font-bold text-lg">{bay.vehicle}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic font-medium">{bay.status}</div>
                    )}
                  </div>
                  {bay.time && (
                    <div className="text-[10px] font-semibold text-primary uppercase">T-Minus: {bay.time}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Sidebar */}
        <Card className="bg-primary/5 border-primary/20 flex flex-col overflow-hidden">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> SparkFlow AI
            </CardTitle>
            <CardDescription className="text-primary-foreground/70">Operational optimization tips</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto">
              {loadingAi ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : aiInsights ? (
                <>
                  <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Performance Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{aiInsights.overallSummary}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Key Trends</h4>
                    {aiInsights.identifiedTrends.map((trend, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-white rounded-lg border text-sm items-start">
                        <AlertCircle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span>{trend}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Action Items</h4>
                    {aiInsights.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-secondary text-white rounded-lg text-sm items-start shadow-md">
                        <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Button onClick={fetchAiInsights} variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4" /> Load Insights
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <RoleSwitcher />
    </div>
  );
}