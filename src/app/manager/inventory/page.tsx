
"use client";

import { INVENTORY } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle, TrendingDown, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function InventoryPage() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Inventory & Stock</h1>
        <p className="text-slate-500">Track supplies and product logistics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVENTORY.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="size-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Package className="size-6" />
                </div>
                {item.stock < 20 && (
                  <Badge className="bg-red-50 text-red-600 border-none animate-pulse">
                    <AlertCircle className="size-3 mr-1" /> Low Stock
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-4xl font-black text-slate-900">{item.stock}</span>
                  <span className="text-slate-400 font-bold uppercase text-[10px] mb-2">Units Available</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Capacity Used</span>
                  <span>{Math.min(100, (item.stock / 150) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(item.stock / 150) * 100} className="h-2 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Wholesale</span>
                  <span className="font-bold text-slate-900">KES {item.wholesale}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Retail</span>
                  <span className="font-bold text-slate-900">KES {item.retail}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
