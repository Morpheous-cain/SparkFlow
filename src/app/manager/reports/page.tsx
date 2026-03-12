
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, FileText, Download, Calendar, ArrowRight } from "lucide-react";

export default function ReportsPage() {
  const reportCategories = [
    { title: "Financial Performance", icon: FileText, color: "bg-blue-500", desc: "Revenue, P&L, and expense tracking" },
    { title: "Staff Efficiency", icon: BarChart, color: "bg-indigo-600", desc: "Jobs per hour and performance scores" },
    { title: "Customer Retention", icon: LineChart, color: "bg-emerald-500", desc: "Repeat visit rates and churn analysis" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Advanced Reports</h1>
          <p className="text-slate-500">Generate and export deep-dive analytics</p>
        </div>
        <Button variant="outline" className="gap-2 h-11 rounded-xl">
          <Calendar className="size-4" /> Custom Range
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCategories.map((cat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
            <CardContent className="p-8 space-y-6">
              <div className={`size-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon className="size-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{cat.title}</h3>
                <p className="text-slate-500 text-sm">{cat.desc}</p>
              </div>
              <Button variant="ghost" className="w-full justify-between rounded-xl hover:bg-slate-50 p-0 text-primary font-bold">
                Generate Report <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">Scheduled Exports</h3>
          <Button className="rounded-xl">Add Schedule</Button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Monthly Financial Audit", freq: "Monthly", next: "Jun 1, 2024" },
            { name: "Weekly Staff Performance", freq: "Weekly", next: "May 27, 2024" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                  <Download className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.freq} • Next export on {item.next}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
