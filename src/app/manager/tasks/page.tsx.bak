
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Clock, User, Plus, Filter, AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const tasks = [
    { id: 1, title: "Refill detergent in Bay 1", assignee: "Peter O.", priority: "High", time: "10:30 AM" },
    { id: 2, title: "Quarterly equipment maintenance", assignee: "John K.", priority: "Medium", time: "11:00 AM" },
    { id: 3, title: "Update weekend promotional prices", assignee: "Manager", priority: "Low", time: "1:00 PM" },
  ];

  const kpis = [
    { label: "Pending Tasks", value: tasks.length.toString(), icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50", trend: "On Schedule" },
    { label: "High Priority", value: "1", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", trend: "Action Required" },
    { label: "Completed Today", value: "12", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+15%" },
    { label: "Completion Rate", value: "92%", icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+2.4%" },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Operations Tasks</h1>
          <p className="text-slate-500">Track and assign daily operational duties</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-11 bg-white">
            <Filter className="size-4 text-slate-400" /> Filter
          </Button>
          <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Plus className="size-4" /> Create Task
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

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-all bg-white">
            <CardContent className="p-6 flex items-center gap-6">
              <Checkbox id={`task-${task.id}`} className="size-6 rounded-lg" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 group-data-[state=checked]:line-through group-data-[state=checked]:text-slate-400">{task.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <User className="size-3" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="size-3" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`border-none font-bold text-[10px] uppercase ${
                  task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                  task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                }`}
              >
                {task.priority} Priority
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
