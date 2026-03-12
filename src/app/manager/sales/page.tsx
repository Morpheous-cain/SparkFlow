
"use client";

import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HandCoins, Download, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Revenue & Sales</h1>
          <p className="text-slate-500">Detailed transaction history and financial tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-11">
            <Calendar className="size-4" /> May 2024
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl h-11">
            <Filter className="size-4" /> Filter
          </Button>
          <Button className="gap-2 rounded-xl h-11 px-6">
            <Download className="size-4" /> Export
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Today's Revenue", value: "KES 18,400", trend: "+12%" },
          { label: "Avg. Transaction", value: "KES 1,250", trend: "+5%" },
          { label: "Pending Payments", value: "KES 4,500", trend: "3 jobs" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl">
            <CardContent className="p-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold">{stat.trend}</Badge>
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
