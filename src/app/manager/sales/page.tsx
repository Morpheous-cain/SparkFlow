
"use client";

import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandCoins, Download, Filter, Calendar, TrendingUp, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  const kpis = [
    { label: "Today's Revenue", value: "KES 18,400", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12%" },
    { label: "Avg. Ticket Size", value: "KES 1,250", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50", trend: "+5%" },
    { label: "Volume Forecast", value: "42 Jobs", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", trend: "On Track" },
    { label: "Payment Success", value: "98.2%", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+0.4%" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Revenue & Sales</h1>
          <p className="text-slate-500">Detailed transaction history and financial tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-11 bg-white">
            <Calendar className="size-4 text-slate-400" /> May 2024
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl h-11 bg-white">
            <Filter className="size-4 text-slate-400" /> Filter
          </Button>
          <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Download className="size-4" /> Export
          </Button>
        </div>
      </header>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="size-6" />
                </div>
                <Badge className="bg-slate-100 border-none font-bold rounded-full">
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

      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50 h-16">
            <TableRow className="border-none">
              <TableHead className="pl-8 font-bold text-slate-500 uppercase text-[10px]">Transaction ID</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px]">Vehicle Plate</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px]">Amount</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px]">Status</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px]">M-Pesa Receipt</TableHead>
              <TableHead className="pr-8 text-right font-bold text-slate-500 uppercase text-[10px]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id} className="h-20 border-slate-50 hover:bg-slate-50 transition-colors">
                <TableCell className="pl-8 font-bold text-slate-900">{tx.id}</TableCell>
                <TableCell className="font-mono font-bold text-primary">{tx.plate}</TableCell>
                <TableCell className="font-black text-slate-900">KES {tx.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={tx.status === 'Paid' ? 'default' : 'secondary'} className={tx.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-100 text-amber-700 border-none'}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-400">{tx.receipt || '—'}</TableCell>
                <TableCell className="pr-8 text-right text-slate-500 text-sm font-medium">{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
