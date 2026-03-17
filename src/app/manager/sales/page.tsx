
"use client";

import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandCoins, Download, Filter, Calendar, TrendingUp, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  const kpis = [
    { label: "Today's Total Revenue", value: "KES 18,400.00", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
    { label: "Average Transaction Value", value: "KES 1,250.00", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50", trend: "+5%" },
    { label: "Service Volume Forecast", value: "42 Jobs Remaining", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "On Track" },
    { label: "Service Turnaround Time", value: "32 Minutes", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50", trend: "-4m Efficiency" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Revenue & Sales Engine</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Detailed Transaction History and Financial Velocity Tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-14 bg-white border-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200/50">
            <Calendar className="size-4 text-slate-400" /> May 2024 Cycle
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl h-14 bg-white border-2 font-black uppercase text-[10px] tracking-widest">
            <Filter className="size-4 text-slate-400" /> Filter Criteria
          </Button>
          <Button className="gap-2 rounded-xl h-14 px-8 shadow-2xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest bg-primary text-white border-none">
            <Download className="size-4" /> Export Sales Data
          </Button>
        </div>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden group bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-black text-[8px] uppercase px-2 py-0.5 rounded-full">
                  {kpi.trend} PERFORMANCE
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

      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50 h-16">
            <TableRow className="border-none">
              <TableHead className="pl-8 font-black text-slate-500 uppercase text-[10px] tracking-widest">Transaction Identification</TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest">Vehicle Plate Identification</TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest">Total Amount (KES)</TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest">Payment Status</TableHead>
              <TableHead className="font-black text-slate-500 uppercase text-[10px] tracking-widest">Turnaround Time</TableHead>
              <TableHead className="pr-8 text-right font-black text-slate-500 uppercase text-[10px] tracking-widest">Transaction Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id} className="h-20 border-slate-50 hover:bg-slate-50 transition-colors group">
                <TableCell className="pl-8 font-black text-slate-900 uppercase text-xs tracking-tight">{tx.id}</TableCell>
                <TableCell className="font-mono font-black text-primary text-sm tracking-[0.2em]">{tx.plate}</TableCell>
                <TableCell className="font-black text-slate-900 text-lg italic tracking-tighter">KES {tx.amount.toLocaleString()}.00</TableCell>
                <TableCell>
                  <Badge variant={tx.status === 'Paid' ? 'default' : 'secondary'} className={cn(
                    "font-black text-[9px] uppercase px-3 py-1",
                    tx.status === 'Paid' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'
                  )}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-black text-slate-600 text-[10px] uppercase">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-slate-400" />
                    {tx.duration} Minutes
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right text-slate-500 text-[10px] font-black uppercase tracking-widest">{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
