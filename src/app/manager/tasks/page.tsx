
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ClipboardList, Clock, User, Plus, AlertTriangle,
  CheckCircle2, ListTodo, Trash2, X, Flame, Minus, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "High" | "Medium" | "Low";
type FilterState = "All" | "Pending" | "Completed";

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: Priority;
  time: string;
  completed: boolean;
}

const SEED_TASKS: Task[] = [
  { id: 1, title: "Refill detergent in Bay 1",             assignee: "Peter O.",  priority: "High",   time: "10:30 AM", completed: false },
  { id: 2, title: "Quarterly equipment maintenance check", assignee: "John K.",   priority: "Medium", time: "11:00 AM", completed: false },
  { id: 3, title: "Update weekend promotional prices",     assignee: "Manager",   priority: "Low",    time: "01:00 PM", completed: true  },
  { id: 4, title: "Restock microfibre cloths — Bay 3",    assignee: "Sarah W.",  priority: "High",   time: "09:00 AM", completed: false },
  { id: 5, title: "Send daily revenue summary to owner",   assignee: "Manager",   priority: "Medium", time: "05:00 PM", completed: true  },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  High:   { label: "High",   color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20",   icon: Flame },
  Medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Minus },
  Low:    { label: "Low",    color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: ChevronDown },
};

let nextId = SEED_TASKS.length + 1;

export default function TasksPage() {
  const [tasks, setTasks]         = useState<Task[]>(SEED_TASKS);
  const [filter, setFilter]       = useState<FilterState>("All");
  const [showModal, setShowModal] = useState(false);
  const [newTitle,    setNewTitle]    = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newTime,     setNewTime]     = useState("");

  const completed = tasks.filter(t => t.completed).length;
  const pending   = tasks.filter(t => !t.completed).length;
  const highCount = tasks.filter(t => t.priority === "High" && !t.completed).length;
  const rate      = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const visible = useMemo(() => {
    if (filter === "Pending")   return tasks.filter(t => !t.completed);
    if (filter === "Completed") return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  function toggle(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }
  function remove(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }
  function addTask() {
    if (!newTitle.trim() || !newAssignee.trim()) return;
    setTasks(prev => [{ id: nextId++, title: newTitle.trim(), assignee: newAssignee.trim(), priority: newPriority, time: newTime || "—", completed: false }, ...prev]);
    setNewTitle(""); setNewAssignee(""); setNewPriority("Medium"); setNewTime("");
    setShowModal(false);
  }

  const kpis = [
    { label: "Pending",         value: pending.toString(),   icon: ListTodo,      accent: "#00A8CC" },
    { label: "High Priority",   value: highCount.toString(), icon: AlertTriangle, accent: "#EF4444" },
    { label: "Completed Today", value: completed.toString(), icon: CheckCircle2,  accent: "#10B981" },
    { label: "Completion Rate", value: `${rate}%`,           icon: ClipboardList, accent: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen bg-[#060E1E] text-white p-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#00A8CC] text-[9px] font-black uppercase tracking-[0.3em] mb-2">Operations Centre</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">Task Board</h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-2">
            {tasks.length} total · {pending} pending · {completed} done
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-12 px-6 rounded-2xl bg-[#00A8CC] hover:bg-[#0090B0] text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-500/20 gap-2"
        >
          <Plus className="size-4" /> New Task
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-[#0F1F3D] border border-white/5 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="size-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: kpi.accent + "18" }}>
                <kpi.icon className="size-5" style={{ color: kpi.accent }} />
              </div>
              <div className="text-3xl font-black tracking-tight" style={{ color: kpi.accent }}>{kpi.value}</div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-[#0F1F3D] border border-white/5 rounded-2xl p-5 flex items-center gap-6">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 shrink-0">Overall Progress</span>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00A8CC] rounded-full transition-all duration-700" style={{ width: `${rate}%` }} />
        </div>
        <span className="text-sm font-black text-[#00A8CC] shrink-0 tabular-nums">{rate}%</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["All", "Pending", "Completed"] as FilterState[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              filter === f
                ? "bg-[#00A8CC] text-white shadow-lg shadow-cyan-500/20"
                : "bg-[#0F1F3D] text-white/30 hover:text-white border border-white/5"
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-white/20 self-center">{visible.length} tasks</span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-16 text-white/20">
            <CheckCircle2 className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-black uppercase tracking-widest">No tasks here</p>
          </div>
        )}
        {visible.map((task) => {
          const p = PRIORITY_CONFIG[task.priority];
          const PIcon = p.icon;
          return (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200",
                task.completed
                  ? "bg-[#0A1628] border-white/5 opacity-50"
                  : "bg-[#0F1F3D] border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/30"
              )}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(task.id)}
                className={cn(
                  "size-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                  task.completed ? "bg-[#00A8CC] border-[#00A8CC]" : "border-white/20 hover:border-[#00A8CC]"
                )}
              >
                {task.completed && <CheckCircle2 className="size-3.5 text-white" />}
              </button>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className={cn("font-bold text-sm leading-snug", task.completed ? "line-through text-white/30" : "text-white")}>
                  {task.title}
                </p>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-white/30 font-bold">
                    <User className="size-3" /><span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/30 font-bold">
                    <Clock className="size-3" /><span>{task.time}</span>
                  </div>
                </div>
              </div>

              {/* Priority badge */}
              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest shrink-0", p.color, p.bg, p.border)}>
                <PIcon className="size-3" />{p.label}
              </div>

              {/* Delete */}
              <button
                onClick={() => remove(task.id)}
                className="opacity-0 group-hover:opacity-100 size-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0F1F3D] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#00A8CC] text-[9px] font-black uppercase tracking-[0.3em]">New</p>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Create Task</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="size-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Task Title</label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Refill shampoo in Bay 2"
                  className="bg-[#060E1E] border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 font-semibold focus-visible:ring-[#00A8CC]" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Assignee</label>
                <Input value={newAssignee} onChange={e => setNewAssignee(e.target.value)} placeholder="e.g. John K."
                  className="bg-[#060E1E] border-white/10 text-white placeholder:text-white/20 rounded-xl h-12 font-semibold focus-visible:ring-[#00A8CC]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Priority</label>
                  <div className="flex flex-col gap-1.5">
                    {(["High", "Medium", "Low"] as Priority[]).map(p => (
                      <button key={p} onClick={() => setNewPriority(p)}
                        className={cn("px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-left",
                          newPriority === p
                            ? `${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].color} ${PRIORITY_CONFIG[p].border}`
                            : "bg-transparent border-white/10 text-white/30 hover:border-white/20"
                        )}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Due Time</label>
                  <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                    className="bg-[#060E1E] border-white/10 text-white rounded-xl h-12 font-semibold focus-visible:ring-[#00A8CC] [color-scheme:dark]" />
                </div>
              </div>
              <Button onClick={addTask} disabled={!newTitle.trim() || !newAssignee.trim()}
                className="w-full h-12 rounded-2xl bg-[#00A8CC] hover:bg-[#0090B0] text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-500/20 disabled:opacity-40 mt-2 gap-2">
                <Plus className="size-4" /> Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
