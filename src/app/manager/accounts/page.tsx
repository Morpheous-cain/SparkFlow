
"use client";

import { useState, useEffect } from "react";
import { STAFF, EXPENSES, CHART_OF_ACCOUNTS, BRANCHES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Coins, 
  ShieldAlert,
  Zap,
  Banknote,
  Star,
  ArrowRight,
  Sparkles,
  CreditCard,
  FileText,
  History,
  LayoutGrid,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Lock,
  Wallet,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const REVENUE_STREAMS = [
  { category: 'Wash Services', actual: 42000, target: 45000, rating: 4.2, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
  { category: 'Detailing Hub', actual: 28000, target: 25000, rating: 4.8, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { category: 'Tinting & Coating', actual: 12000, target: 15000, rating: 3.9, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { category: 'Concierge Logistics', actual: 8500, target: 12000, rating: 4.5, color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
];

export default function AccountsManagementPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const currentProfit = 90500;
  const targetProfit = 100000;
  const achievementRate = (currentProfit / targetProfit) * 100;
  const isTargetMet = achievementRate >= 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReconciliation = () => {
    toast({
      title: "Audit Initiated",
      description: "Comparing physical cash records against Daraja API transaction logs.",
    });
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Exporting Statement",
      description: "Generating comprehensive PDF statement for May 2024.",
    });
  };

  const handleManageAPI = () => {
    toast({
      title: "Daraja Gateway Security",
      description: "Accessing M-Pesa API Consumer Key and Secret management vault. Session encrypted.",
    });
  };

  const handleCreateAccount = () => {
    toast({
      title: "Ledger Update",
      description: "Opening 'New General Ledger Account' configuration wizard.",
    });
  };

  const handleLogExpense = () => {
    toast({
      title: "Expense Entry",
      description: "Capture spend details for multi-branch cost tracking.",
    });
  };

  const handleReplenishFloat = () => {
    toast({
      title: "Float Management",
      description: "Initiating petty cash replenishment via M-Pesa B2C withdrawal.",
    });
  };

  const handleGenerateReport = (title: string) => {
    toast({
      title: "Report Engine",
      description: `Compiling ${title} analysis. Estimated time: 15s.`,
    });
  };

  const kpis = [
    { label: "Net Profit (Month to Date)", value: `KES ${currentProfit.toLocaleString()}`, icon: Banknote, color: "text-blue-600", bg: "bg-blue-50", layer: 'bg-blue-500' },
    { label: "Physical Cash on Hand", value: "KES 24,500", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50", layer: 'bg-emerald-500' },
    { label: "M-Pesa Business Balance", value: "KES 142,000", icon: CreditCard, color: "text-indigo-600", bg: "bg-indigo-50", layer: 'bg-indigo-500' },
    { label: "Pending Vendor Obligations", value: "KES 12,200", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", layer: 'bg-red-500' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Financial Engine</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Audit, Chart of Accounts & Official Statements</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl h-14 gap-3 bg-white border-none shadow-xl font-black uppercase text-[11px] tracking-widest" onClick={handleReconciliation}>
            <History className="size-4" /> Ledger Reconciliation
          </Button>
          <Button className="rounded-2xl h-14 gap-3 shadow-2xl shadow-primary/30 px-8 font-black uppercase text-[11px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white" onClick={handleDownloadStatement}>
            <Download className="size-4" /> Download Full Statement
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
            <div className={cn("absolute top-0 left-0 w-full h-2", kpi.layer)} />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest rounded-full px-3 py-1">REAL-TIME</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-200/50 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="overview" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Profit & Revenue Breakdown
          </TabsTrigger>
          <TabsTrigger value="chart" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Full Chart of Accounts
          </TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Petty Cash & Operating Expenses
          </TabsTrigger>
          <TabsTrigger value="statements" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Financial Statements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-xl rounded-[3rem] bg-white p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <div className="flex justify-between items-center mb-12">
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight italic">Revenue Stream Performance</CardTitle>
                  <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mt-1">Comparative Analysis by Department</CardDescription>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-3">
                    <div className="size-4 rounded-full bg-primary shadow-lg shadow-primary/20" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actual Revenue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-4 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue Target</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_STREAMS} barGap={16}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                        dy={12}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '1.5rem' }}
                      />
                      <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={48} />
                      <Bar dataKey="target" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-24 -mr-28 -mt-28 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                <header className="flex items-center gap-5">
                  <div className="size-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-6">
                    <Zap className="size-9 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-primary italic">Daraja Core</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">M-Pesa Integration Status</p>
                  </div>
                </header>

                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Health</span>
                      <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5">STABLE</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Protocol</span>
                      <span className="text-[10px] font-black uppercase text-white">Real-time (T+0)</span>
                    </div>
                    <Progress value={98} className="h-1 bg-white/10 [&>div]:bg-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Latest Transactions</span>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>MPESA_9821X</span>
                        <span className="text-emerald-400">+1,200.00</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>MPESA_9822Y</span>
                        <span className="text-emerald-400">+500.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-16 bg-white text-slate-900 hover:bg-slate-50 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl transition-all border-none"
                  onClick={handleManageAPI}
                >
                  Manage API Credentials
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chart" className="outline-none">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b bg-slate-50/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black uppercase italic">General Ledger Registry</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Complete List of Business Accounts</CardDescription>
                </div>
                <Button className="rounded-xl h-12 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest gap-2 border-none" onClick={handleCreateAccount}>
                  <Plus className="size-4" /> Create New Account
                </Button>
              </div>
            </CardHeader>
            <Table>
              <TableHeader className="bg-slate-50/50 h-12">
                <TableRow className="border-none">
                  <TableHead className="pl-8 uppercase text-[10px] font-black tracking-[0.2em]">Account Code</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-[0.2em]">Account Name</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-[0.2em]">Classification</TableHead>
                  <TableHead className="uppercase text-[10px] font-black text-right pr-8 tracking-[0.2em]">Balance (KES)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CHART_OF_ACCOUNTS.map((acc) => (
                  <TableRow key={acc.code} className="h-16 border-slate-50 hover:bg-slate-50">
                    <TableCell className="pl-8 font-black text-slate-400 text-xs tracking-widest">{acc.code}</TableCell>
                    <TableCell className="font-black text-slate-900 uppercase text-xs italic">{acc.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "font-black text-[9px] uppercase border-none px-3 py-1",
                        acc.type === 'Asset' ? "bg-blue-50 text-blue-600" :
                        acc.type === 'Revenue' ? "bg-emerald-50 text-emerald-600" :
                        acc.type === 'Expense' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                      )}>
                        {acc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right font-black text-slate-900 text-sm italic">
                      {acc.balance.toLocaleString()}.00
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="outline-none space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black uppercase italic">Expense Audit Trail</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Operational spend & vendor payments Registry</CardDescription>
                </div>
                <Button className="rounded-xl h-12 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest gap-2 bg-primary text-white border-none" onClick={handleLogExpense}>
                  <Plus className="size-4" /> Log Operating Expense
                </Button>
              </CardHeader>
              <Table>
                <TableHeader className="bg-slate-50/50 h-12">
                  <TableRow className="border-none">
                    <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest">Date</TableHead>
                    <TableHead className="uppercase text-[10px] font-black tracking-widest">Category</TableHead>
                    <TableHead className="uppercase text-[10px] font-black tracking-widest">Description</TableHead>
                    <TableHead className="uppercase text-[10px] font-black tracking-widest">Method</TableHead>
                    <TableHead className="uppercase text-[10px] font-black text-right pr-8 tracking-widest">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EXPENSES.map((exp) => (
                    <TableRow key={exp.id} className="h-16 border-slate-50 hover:bg-slate-50">
                      <TableCell className="pl-8 font-bold text-slate-400 text-xs uppercase">{exp.date}</TableCell>
                      <TableCell className="font-black text-slate-900 uppercase text-xs italic">{exp.category}</TableCell>
                      <TableCell className="font-bold text-slate-500 text-xs uppercase">{exp.description}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[8px] uppercase border-none px-2",
                          exp.type === 'Petty Cash' ? "bg-amber-500 text-white" : "bg-slate-900 text-white"
                        )}>
                          {exp.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right font-black text-slate-900 text-sm italic">
                        KES {exp.amount.toLocaleString()}.00
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="space-y-8">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-amber-500 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                      <Wallet className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic">Petty Cash Pool</h3>
                      <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest">Manual Float Audit</p>
                    </div>
                  </div>
                  <div className="text-4xl font-black italic tracking-tighter">KES 8,400.00</div>
                  <Progress value={42} className="h-2 bg-white/20 [&>div]:bg-white" />
                  <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Threshold Alert: Float is below KES 10,000.00</p>
                  <Button className="w-full h-14 bg-white text-amber-600 hover:bg-amber-50 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl border-none" onClick={handleReplenishFloat}>
                    Replenish Float
                  </Button>
                </div>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                <h3 className="text-lg font-black uppercase tracking-tight mb-6 italic">Spend Distribution</h3>
                <div className="space-y-6">
                  {[
                    { label: "Staff Payroll", val: 65, color: "bg-blue-500" },
                    { label: "Consumables & Materials", val: 20, color: "bg-emerald-500" },
                    { label: "Water & Utilities", val: 10, color: "bg-amber-500" },
                    { label: "Marketing Campaigns", val: 5, color: "bg-indigo-500" },
                  ].map(stat => (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>{stat.label}</span>
                        <span>{stat.val}%</span>
                      </div>
                      <Progress value={stat.val} className={`h-1.5 ${stat.color} opacity-20`} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statements" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Profit & Loss (P&L)", icon: FileText, desc: "Revenue vs Operational Costs Audit", trend: "+12.4% Margin Growth" },
              { title: "Cash Flow Statement", icon: TrendingUp, desc: "Cash Inflow vs Outflow Analysis", trend: "Stable Liquidity" },
              { title: "Balance Sheet", icon: LayoutGrid, desc: "Assets, Liabilities & Equity Audit", trend: "Fully Balanced" },
            ].map((st, i) => (
              <Card key={i} className="border-none shadow-xl rounded-[2.5rem] bg-white p-10 space-y-6 group hover:shadow-2xl transition-all duration-500">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                  <st.icon className="size-8" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">{st.title}</h3>
                    <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5">{st.trend}</Badge>
                  </div>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed">{st.desc}</p>
                </div>
                <div className="pt-6 border-t border-dashed flex items-center justify-between">
                  <Button variant="ghost" className="p-0 h-auto font-black text-[10px] text-primary uppercase gap-2 hover:bg-transparent tracking-widest" onClick={() => handleGenerateReport(st.title)}>
                    Generate Official Report <ChevronRight className="size-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="size-10 rounded-xl border-2" onClick={() => handleGenerateReport(st.title)}>
                    <Download className="size-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
