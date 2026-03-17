
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  BarChart, 
  FileText, 
  Download, 
  Calendar, 
  ArrowRight, 
  Settings2, 
  X, 
  Plus, 
  Printer, 
  History, 
  Trash2, 
  CheckCircle2, 
  Waves,
  Sparkles,
  Search,
  Timer,
  PieChart,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Image from "next/image";

export default function ReportsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  // State for Report Architect
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState("");
  const [reportSummary, setReportSummary] = useState("Operational intelligence audit for current cycle.");
  const [reportItems, setReportItems] = useState<any[]>([]);

  // State for Scheduler
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Branding (Mocked from central state)
  const customLogoUrl = "https://picsum.photos/seed/sparkflow-logo/200/200";
  const businessName = "SparkFlow Westlands";

  useEffect(() => {
    setMounted(true);
  }, []);

  const reportCategories = [
    { 
      title: "Financial Health Business Intelligence", 
      icon: PieChart, 
      color: "bg-emerald-600", 
      desc: "Full Strategic Audit: Profit Margin, Acquisition Costs, & Earnings before Interest and Taxes (EBITDA)",
      metrics: [
        { id: 'BI-001', metric: 'Gross Profit Margin', value: '32.4%', status: 'Audited' },
        { id: 'BI-002', metric: 'Customer Value vs Acquisition Cost Ratio', value: '4.8x', status: 'Optimal' },
        { id: 'BI-003', metric: 'Working Capital Ratio', value: '1.2', status: 'Verified' },
        { id: 'BI-004', metric: 'Revenue Runway (Days Remaining)', value: '180 Days', status: 'Healthy' }
      ]
    },
    { 
      title: "Staff Performance & Efficiency", 
      icon: BarChart, 
      color: "bg-indigo-600", 
      desc: "Jobs per hour and departmental efficiency benchmarks",
      metrics: [
        { id: 'S-101', metric: 'Average Attendant Rating', value: '4.82', status: 'Verified' },
        { id: 'S-102', metric: 'Jobs per Service Node (Daily)', value: '12', status: 'Benchmarked' }
      ]
    },
    { 
      title: "Customer Retention & Churn", 
      icon: LineChart, 
      color: "bg-blue-500", 
      desc: "Repeat visit rates and membership churn probability",
      metrics: [
        { id: 'C-201', metric: 'Customer Churn Probability', value: '12.1%', status: 'Low Risk' },
        { id: 'C-202', metric: 'Member Re-activation Rate', value: '22.4%', status: 'Rising' }
      ]
    },
  ];

  const handleGenerateReport = (cat: any) => {
    setActiveReport(cat);
    setReportTitle(`${cat.title.toUpperCase()} - ${format(new Date(), 'MMMM yyyy')}`);
    setReportSummary(cat.desc);
    setReportItems(cat.metrics || [
      { id: 'R-101', metric: 'Gross Revenue', value: 'KES 450,000', status: 'Verified' },
      { id: 'R-102', metric: 'Operational Margin', value: '68.4%', status: 'Verified' }
    ]);
    setIsPreviewOpen(true);
  };

  const addReportLine = () => {
    const newItem = {
      id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      metric: 'New Data Node',
      value: '0.00',
      status: 'Manual'
    };
    setReportItems([...reportItems, newItem]);
  };

  const removeReportLine = (idx: number) => {
    setReportItems(reportItems.filter((_, i) => i !== idx));
  };

  const updateReportLine = (idx: number, field: string, value: any) => {
    const updated = [...reportItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setReportItems(updated);
  };

  const handleExport = () => {
    toast({
      title: "Cloud Export Initialized",
      description: `Compressing ${reportTitle} for encrypted distribution...`,
    });
    setTimeout(() => {
      setIsPreviewOpen(false);
      toast({
        title: "Audit Pack Exported",
        description: "Your official Business Intelligence document has been saved to the secure document vault.",
      });
    }, 2000);
  };

  const handleAddSchedule = () => {
    setIsScheduleOpen(true);
  };

  const handleSaveSchedule = () => {
    toast({
      title: "Reporting Roster Synced",
      description: "Automated distribution list updated. Next report triggers Monday 08:00 AM.",
    });
    setIsScheduleOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen font-body">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Advanced Report Architect</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Generate, Audit, and Export Deep-Dive Business Intelligence Packs</p>
        </div>
        <Button variant="outline" className="gap-2 h-14 rounded-2xl bg-white border-2 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all" onClick={() => toast({ title: "Audit Parameters", description: "Select custom date parameters for deep-dive historical analysis."})}>
          <Calendar className="size-4" /> Define Audit Range
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((cat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all cursor-pointer bg-white relative">
            {cat.title.includes('Financial') && (
              <Badge className="absolute top-6 right-6 bg-emerald-500 text-white border-none font-black text-[8px] uppercase px-2 py-0.5 shadow-lg z-10 animate-pulse">PRIORITY</Badge>
            )}
            <CardContent className="p-8 space-y-6">
              <div className={`size-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon className="size-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight italic leading-none">{cat.title}</h3>
                <p className="text-slate-500 text-sm font-medium uppercase text-[9px] tracking-widest leading-relaxed">{cat.desc}</p>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-between rounded-xl hover:bg-slate-50 p-0 text-primary font-black uppercase text-[10px] tracking-widest group-hover:pl-2 transition-all border-none"
                onClick={() => handleGenerateReport(cat)}
              >
                Generate Audit Pack <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Timer className="size-5" />
             </div>
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Automated Distribution</h3>
          </div>
          <Button className="rounded-xl h-12 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest px-6 bg-primary hover:bg-blue-600 text-white border-none transition-all active:scale-95" onClick={handleAddSchedule}>
            <Plus className="size-4 mr-2" /> Add Schedule
          </Button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Executive Financial Audit", freq: "Monthly", next: "Jun 1, 2024", icon: ShieldCheck },
            { name: "Weekly Operational Pulse", freq: "Weekly", next: "May 27, 2024", icon: Zap },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <item.icon className="size-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight italic">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.freq} • Next export on {item.next}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 border-2 font-black uppercase text-[9px] tracking-widest bg-white hover:border-primary transition-all" onClick={() => toast({ title: "Roster Management", description: `Updating recipients for ${item.name}...` })}>Configure</Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 transition-all" onClick={() => toast({ title: "Vault Access", description: "Fetching latest cached version of this audit..." })}>
                  <Download className="size-4 text-slate-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Architect Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white font-body">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
                <FileText className="size-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Report Architect</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Live-Edit Parameters & Executive Intelligence Nodes</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)} className="rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="size-5" />
            </Button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto bg-slate-50">
            <Card className="border-none shadow-2xl rounded-2xl bg-white p-12 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/5 rounded-full blur-[100px]" />
              
              <header className="flex justify-between items-start border-b pb-10 border-dashed relative z-10">
                <div className="space-y-4">
                  <div className="size-20 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden relative border-4 border-slate-50 shadow-xl">
                    <Image src={customLogoUrl} alt="Logo" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">{businessName}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Intelligence Protocol</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest px-4 py-1 mb-2 uppercase">Official Audit Pack</Badge>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Timestamp: {format(new Date(), 'PPP p')}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ref: {activeReport?.title.split(' ')[0]}-NODE-2024</p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-8 relative z-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Branded Report Title (Editable)</Label>
                  <Input 
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="h-14 rounded-xl border-2 border-slate-100 focus:border-primary text-xl font-black italic bg-slate-50/50 p-4 uppercase tracking-tighter"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Executive Summary (Editable)</Label>
                  <Textarea 
                    value={reportSummary}
                    onChange={(e) => setReportSummary(e.target.value)}
                    className="min-h-[100px] rounded-xl border-2 border-slate-100 focus:border-primary text-sm font-bold bg-slate-50/50 p-4 leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                    <History className="size-4" /> Intelligence Nodes
                  </h3>
                  <Button variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[9px] uppercase bg-primary/5 text-primary border-none hover:bg-primary/10 transition-colors" onClick={addReportLine}>
                    <Plus className="size-3 mr-2" /> Add Data Node
                  </Button>
                </div>
                
                <div className="border rounded-2xl overflow-hidden border-slate-100 bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="pl-6 text-[9px] font-black uppercase tracking-widest">Node ID</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest">Metric Parameter</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest">Value</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-widest pr-6">Status</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportItems.map((item, idx) => (
                        <TableRow key={idx} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6">
                            <Input 
                              value={item.id} 
                              onChange={(e) => updateReportLine(idx, 'id', e.target.value)}
                              className="h-8 text-[10px] font-black border-none bg-slate-50 focus:bg-white uppercase p-2 rounded-lg"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.metric} 
                              onChange={(e) => updateReportLine(idx, 'metric', e.target.value)}
                              className="h-8 text-[10px] font-black border-none bg-slate-50 focus:bg-white uppercase p-2 rounded-lg"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.value} 
                              onChange={(e) => updateReportLine(idx, 'value', e.target.value)}
                              className="h-8 text-xs font-black border-none bg-slate-50 focus:bg-white p-2 rounded-lg italic text-primary"
                            />
                          </TableCell>
                          <TableCell className="text-right pr-6">
                             <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase px-2">{item.status}</Badge>
                          </TableCell>
                          <TableCell className="pr-4">
                            <Button variant="ghost" size="icon" className="size-8 text-red-300 hover:text-red-500 rounded-lg transition-colors" onClick={() => removeReportLine(idx)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <footer className="pt-10 border-t border-dashed border-slate-100 flex justify-between items-end relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Compliance</p>
                    <p className="text-lg font-black text-emerald-600 uppercase italic leading-none">Verified Reconciled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Architected Node Count</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">
                    {reportItems.length} METRICS
                  </p>
                </div>
              </footer>
            </Card>
          </div>

          <DialogFooter className="p-8 bg-white border-t border-dashed flex justify-between items-center sm:justify-between">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Business Intelligence Protocol v4.2</p>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 bg-white transition-all hover:bg-slate-50" onClick={() => setIsPreviewOpen(false)}>Discard Architect</Button>
              <Button className="h-12 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] px-8 shadow-xl shadow-primary/20 bg-slate-900 text-white hover:bg-black border-none gap-2 transition-all active:scale-95" onClick={handleExport}>
                <Printer className="size-4" /> Export Strategy Pack
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scheduler Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white font-body">
          <div className="p-8 bg-slate-900 text-white flex items-center gap-4">
             <div className="size-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/30">
                <Timer className="size-6 text-white" />
             </div>
             <div>
                <DialogTitle className="text-xl font-black uppercase italic leading-none">Report Scheduler</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[8px] tracking-widest mt-1">Automated Intelligence Distribution</DialogDescription>
             </div>
          </div>
          <div className="p-8 space-y-6">
             <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Export Frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                   {['Daily', 'Weekly', 'Monthly'].map(f => (
                     <Button key={f} variant="outline" className="h-10 rounded-xl font-black uppercase text-[8px] tracking-widest border-2 hover:bg-primary/5 hover:border-primary transition-all">{f}</Button>
                   ))}
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Management Distribution List</Label>
                <Input defaultValue="emma@sparkflow.io, stakeholders@sparkflow.com" className="h-12 rounded-xl font-bold border-2 focus:border-primary" />
             </div>
             <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                <Sparkles className="size-5 text-primary" />
                <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">Decision Core AI will automatically append a "Risk Forecast" summary to every scheduled report.</p>
             </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50">
             <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20 transition-all hover:bg-black active:scale-95" onClick={handleSaveSchedule}>
                Enable Automated Pulse
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
