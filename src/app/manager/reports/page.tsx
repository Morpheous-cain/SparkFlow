
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, FileText, Download, Calendar, ArrowRight, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const { toast } = useToast();
  
  const reportCategories = [
    { title: "Financial Performance", icon: FileText, color: "bg-blue-500", desc: "Revenue, P&L, and expense tracking" },
    { title: "Staff Efficiency", icon: BarChart, color: "bg-indigo-600", desc: "Jobs per hour and performance scores" },
    { title: "Customer Retention", icon: LineChart, color: "bg-emerald-500", desc: "Repeat visit rates and churn analysis" },
  ];

  const handleGenerateReport = (title: string) => {
    toast({
      title: "Generating Report",
      description: `The ${title} report is being compiled. You will be notified when it's ready for download.`,
    });
  };

  const handleAddSchedule = () => {
    toast({
      title: "Report Scheduler",
      description: "Opening configuration for automated recurring exports.",
    });
  };

  const handleManageSchedule = (name: string) => {
    toast({
      title: "Schedule Settings",
      description: `Modifying distribution list and frequency for ${name}.`,
    });
  };

  const handleCustomRange = () => {
    toast({
      title: "Date Selector",
      description: "Select a custom time window for deep-dive auditing.",
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Advanced Reports</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Generate and export deep-dive analytics</p>
        </div>
        <Button variant="outline" className="gap-2 h-14 rounded-2xl bg-white border-2 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-slate-200/50" onClick={handleCustomRange}>
          <Calendar className="size-4" /> Custom Range
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((cat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all cursor-pointer bg-white">
            <CardContent className="p-8 space-y-6">
              <div className={`size-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon className="size-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight">{cat.title}</h3>
                <p className="text-slate-500 text-sm font-medium">{cat.desc}</p>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-between rounded-xl hover:bg-slate-50 p-0 text-primary font-black uppercase text-[10px] tracking-widest group-hover:pl-2 transition-all"
                onClick={() => handleGenerateReport(cat.title)}
              >
                Generate Report <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
        <div className="flex justify-between items-center mb-8 px-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Scheduled Exports</h3>
          <Button className="rounded-xl h-12 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest px-6" onClick={handleAddSchedule}>Add Schedule</Button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Monthly Financial Audit", freq: "Monthly", next: "Jun 1, 2024" },
            { name: "Weekly Staff Performance", freq: "Weekly", next: "May 27, 2024" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <Download className="size-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.freq} • Next export on {item.next}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl h-10 px-6 border-2 font-black uppercase text-[9px] tracking-widest" onClick={() => handleManageSchedule(item.name)}>Manage</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
