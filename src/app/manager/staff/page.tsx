
"use client";

import { useState, useEffect } from "react";
import { STAFF } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  TrendingUp, 
  UserCheck, 
  Users, 
  Briefcase, 
  Award, 
  Wallet, 
  Coins, 
  HandCoins, 
  Sparkles,
  Clock,
  CalendarCheck,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Timer,
  Trophy,
  Medal,
  ChevronRight,
  Zap,
  Target,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function StaffPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeStaff, setActiveStaff] = useState(STAFF);

  useEffect(() => {
    setMounted(true);
  }, []);

  const employeeOfMonth = activeStaff.find(s => s.isEmployeeOfMonth);

  const kpis = [
    { label: "Active Team", value: activeStaff.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Full Capacity", layer: 'bg-blue-500' },
    { label: "Reward Points Issued", value: activeStaff.reduce((acc, s) => acc + s.points, 0).toLocaleString(), icon: Zap, color: "text-amber-600", bg: "bg-amber-50", trend: "+12.1%", layer: 'bg-amber-500' },
    { label: "Attendance Rate", value: "85%", icon: CalendarCheck, color: "text-indigo-600", bg: "bg-indigo-50", trend: "Normal", layer: 'bg-indigo-500' },
    { label: "Bonus Accrued", value: "KES 24.2K", icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50", trend: "On Target", layer: 'bg-emerald-500' },
  ];

  const handleAwardPoints = (id: string, name: string) => {
    toast({
      title: "Reward Points Awarded",
      description: `+100 SparkPoints issued to ${name} for operational excellence.`,
      action: <Zap className="size-4 text-amber-500 fill-amber-500" />
    });
    setActiveStaff(prev => prev.map(s => s.id === id ? { ...s, points: s.points + 100 } : s));
  };

  const handleProcessReward = (name: string) => {
    toast({
      title: "Performance Bonus Disbursed",
      description: `M-Pesa STK Push initiated for ${name}'s reward payout. Final authorization required.`,
    });
  };

  const handleShiftRoster = () => {
    toast({
      title: "Roster Management",
      description: "Opening dynamic shift editor. Syncing with branch occupancy...",
    });
  };

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-8 bg-[#f1f5f9] min-h-screen font-body">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic italic">Human Capital Core</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] mt-1">Performance, Attendance & Gamified Rewards</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-2xl h-14 gap-2 border-2 bg-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200/50" onClick={handleShiftRoster}>
              <CalendarCheck className="size-4" /> Shift Roster
           </Button>
           <Button className="rounded-2xl h-14 gap-2 shadow-xl shadow-primary/20 px-8 font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-blue-600 transition-all text-white border-none">
              <Plus className="size-4" /> Onboard Staff
           </Button>
        </div>
      </header>

      {/* Reward Spotlight / Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {employeeOfMonth && (
          <Card className="lg:col-span-2 border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-32 -mr-32 -mt-32 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="size-36 bg-primary/10 rounded-[2.5rem] p-1 border-2 border-primary/20 shadow-2xl">
                  <Avatar className="size-full rounded-[2.2rem]">
                    <AvatarImage src={`https://picsum.photos/seed/${employeeOfMonth.id}/300`} />
                    <AvatarFallback className="text-3xl font-black">{employeeOfMonth.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-4 -right-4 size-16 bg-primary rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl rotate-12">
                  <Trophy className="size-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase px-3 py-1">MAY 2024 ELITE CHAMPION</Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Reward Tier 5</span>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none italic">{employeeOfMonth.name}</h2>
                  <p className="text-slate-400 font-bold text-lg leading-snug">Elite performance with a <span className="text-white italic">98% efficiency score</span> and 5.0 customer ratings.</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] backdrop-blur-md flex flex-col">
                    <span className="text-[8px] font-black text-primary uppercase block mb-1 tracking-widest">Accrued Points</span>
                    <span className="text-2xl font-black italic">{employeeOfMonth.points.toLocaleString()} <Zap className="inline size-4 text-amber-400 ml-1" /></span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] backdrop-blur-md flex flex-col">
                    <span className="text-[8px] font-black text-emerald-400 uppercase block mb-1 tracking-widest">Cash Multiplier</span>
                    <span className="text-2xl font-black italic">+ KES 5,000</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-emerald-500/5 rounded-full blur-3xl" />
           <header className="mb-8 relative z-10">
              <div className="flex items-center gap-3">
                 <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Target className="size-5" />
                 </div>
                 <h3 className="text-xl font-black uppercase italic">Elite Leaderboard</h3>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest">Top point earners across nodes</p>
           </header>
           <div className="space-y-4 relative z-10">
              {activeStaff.sort((a, b) => b.points - a.points).slice(0, 4).map((s, i) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group/item hover:bg-white hover:shadow-lg transition-all">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400 group-hover/item:text-primary">
                         {i + 1}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-black text-slate-900 uppercase text-[11px]">{s.name}</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase">{s.role}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-black text-slate-900">{s.points.toLocaleString()} <Zap className="inline size-3 text-amber-400 fill-amber-400" /></div>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full mt-6 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5">
              View All Rankings <ChevronRight className="size-3 ml-2" />
           </Button>
        </Card>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all bg-white relative">
            <div className={cn("absolute top-0 left-0 w-full h-2", kpi.layer)} />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(`size-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`)}>
                  <kpi.icon className="size-7" />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest rounded-full px-3 py-1">LIVE AUDIT</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="bg-slate-200/50 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="performance" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Performance & Points Hub
          </TabsTrigger>
          <TabsTrigger value="roster" className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Attendance Protocol
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeStaff.map((member) => (
              <Card key={member.id} className="border-none shadow-xl rounded-[3rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white relative">
                {member.isEmployeeOfMonth && (
                  <div className="absolute top-6 right-6 z-20">
                    <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase px-2 py-0.5 shadow-lg">TEAM STAR</Badge>
                  </div>
                )}
                <CardHeader className="flex flex-row items-center gap-6 p-10 pb-6">
                  <div className="relative">
                    <Avatar className="size-20 border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={`https://picsum.photos/seed/${member.id}/200`} />
                      <AvatarFallback className="bg-primary text-white font-black text-lg">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 size-8 rounded-full border-4 border-white shadow-lg animate-pulse",
                      member.attendanceStatus === 'Present' ? "bg-emerald-500" : "bg-red-500"
                    )} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{member.name}</h3>
                      <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 shadow-lg shadow-primary/20">{member.role}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="size-3 fill-current" />
                        <span className="text-[10px] font-black uppercase">{member.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Medal className="size-3" />
                        <span className="text-[10px] font-black uppercase">{member.performance} Score</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-6 shadow-inner border border-slate-100 relative">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Zap className="size-5 text-amber-500 fill-amber-500" />
                          </div>
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SparkPoints Audit</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black border-amber-200 bg-white px-3 py-1 text-amber-600">LIVE BALANCE</Badge>
                     </div>
                     <div className="flex items-end justify-between">
                        <div>
                           <span className="text-[10px] font-black text-slate-500 uppercase opacity-60 tracking-widest block mb-1">Available Rewards</span>
                           <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{member.points.toLocaleString()}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-10 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-black uppercase text-[10px] tracking-widest border-none px-4"
                          onClick={() => handleAwardPoints(member.id, member.name)}
                        >
                          Award +100
                        </Button>
                     </div>
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-br from-slate-900 to-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/payout">
                    <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/30 rounded-full blur-3xl group-hover/payout:scale-125 transition-transform" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-2 leading-none">Net Accrued (MTD)</span>
                      <div className="text-4xl font-black tracking-tighter leading-none italic">KES {member.earnings.total.toLocaleString()}</div>
                    </div>
                    <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5 relative z-10">
                      <HandCoins className="size-8 text-primary" />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl border-none transition-all"
                    onClick={() => handleProcessReward(member.name)}
                  >
                    Disburse Performance Reward
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roster" className="space-y-6 outline-none">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 bg-slate-900 text-white flex flex-row justify-between items-center space-y-0">
               <div>
                  <CardTitle className="text-xl font-black uppercase italic italic">Live Shift Roster</CardTitle>
                  <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Real-time attendance & node status</CardDescription>
               </div>
               <Badge className="bg-primary text-white border-none px-4 py-1 font-black text-[10px] uppercase">{mounted ? new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'short' }) : "..."}</Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0">
                  {activeStaff.map((member) => (
                    <div key={member.id} className="p-10 hover:bg-slate-50 transition-colors group">
                       <div className="flex flex-col items-center text-center gap-6">
                          <div className="relative">
                             <Avatar className="size-24 border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                                <AvatarImage src={`https://picsum.photos/seed/${member.id}/200`} />
                                <AvatarFallback className="font-black">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                             </Avatar>
                             <div className={cn(
                               "absolute -bottom-1 -right-1 size-8 rounded-full border-4 border-white shadow-md",
                               member.attendanceStatus === 'Present' ? "bg-emerald-500" :
                               member.attendanceStatus === 'Late' ? "bg-amber-500" : "bg-red-500"
                             )} />
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900 uppercase text-lg tracking-tight italic">{member.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{member.role}</p>
                          </div>
                          
                          <div className="w-full space-y-4 pt-2">
                             <Badge className={cn(
                               "w-full justify-center py-2 font-black text-[10px] uppercase tracking-[0.2em] border-none shadow-inner",
                               member.attendanceStatus === 'Present' ? "bg-emerald-50 text-emerald-600" :
                               member.attendanceStatus === 'Late' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                             )}>
                                {member.attendanceStatus}
                             </Badge>
                             
                             <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                                <div className="flex items-center justify-between">
                                   <span>Last Clock In:</span>
                                   <span className="text-slate-900">
                                      {member.lastClockIn && mounted ? new Date(member.lastClockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                   </span>
                                </div>
                                <div className="flex items-center justify-between">
                                   <span>Assigned Node:</span>
                                   <span className="text-primary">{member.branchId}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
