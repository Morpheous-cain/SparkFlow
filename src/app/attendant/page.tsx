"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_VEHICLES, STAFF } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, MapPin, Car, Check, Waves, BellRing, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function AttendantPWA() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(MOCK_VEHICLES);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Current logged-in attendant (Mocked)
  const currentAttendantId = "S3"; // Peter Otieno
  const currentAttendant = STAFF.find(s => s.id === currentAttendantId);

  useEffect(() => {
    setMounted(true);
    
    // Simulate receiving a new job card notification after a short delay
    const timer = setTimeout(() => {
      const newJob = MOCK_VEHICLES.find(v => v.status === 'Queue');
      if (newJob) {
        toast({
          title: "New Job Card Received!",
          description: `Vehicle ${newJob.plate} assigned to you. Check details now.`,
          action: (
            <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg">
              <Car className="size-4 text-primary" />
              <span className="text-[10px] font-black uppercase text-primary">{newJob.plate}</span>
            </div>
          ),
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleStartJob = (plate: string) => {
    toast({ 
      title: "Wash Initiated", 
      description: `Job Card ${plate} is now LIVE. Status synced to Agent desk.`,
      variant: "default"
    });
    setJobs(prev => prev.map(j => j.plate === plate ? { ...j, status: 'In-Bay' as const } : j));
    setActiveJobId(plate);
  };

  const handleFinishWash = (plate: string) => {
    toast({ 
      title: "Job Card Closed", 
      description: `Vehicle ${plate} marked as READY. Customer & Cashier notified.`,
    });
    setJobs(prev => prev.map(j => 
      j.plate === plate 
        ? { ...j, status: 'Ready' as const, progress: 100 } 
        : j
    ));
    if (activeJobId === plate) setActiveJobId(null);
  };

  return (
    <div className="min-h-screen pb-32 bg-slate-50 font-body">
      <header className="bg-slate-900 text-white p-6 shadow-2xl rounded-b-[2.5rem] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-primary/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20 animate-pulse">
                <Waves className="size-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Job Console</h1>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">
                  {currentAttendant?.name || "Attendant"} • Station {currentAttendant?.branchId || "04"}
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
              <BellRing className="size-5 text-primary" />
              <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-slate-900" />
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6 max-w-xl mx-auto">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">My Active Job Cards</h2>
          <Badge className="bg-emerald-500 text-white font-black text-[9px] px-3 py-1">
            {jobs.filter(j => j.status !== 'Completed').length} TOTAL
          </Badge>
        </div>

        {jobs.filter(j => j.status !== 'Completed').length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-6 opacity-30">
            <div className="w-24 h-24 bg-slate-200 rounded-[3rem] flex items-center justify-center text-slate-400 shadow-inner">
              <ClipboardCheck className="w-12 h-12" />
            </div>
            <p className="text-slate-500 font-black uppercase text-xs tracking-widest leading-relaxed">
              No pending jobs.<br/>Awaiting assignment from Agent...
            </p>
          </div>
        ) : (
          jobs.filter(j => j.status !== 'Completed').map((job) => (
            <Card key={job.plate} className={`overflow-hidden transition-all border-none shadow-xl rounded-[2.5rem] bg-white ${activeJobId === job.plate ? "ring-4 ring-primary/20 scale-[1.02]" : ""}`}>
              <CardHeader className="pb-4 p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <Badge className={
                    job.status === 'In-Bay' ? 'bg-amber-500 text-white' : 
                    job.status === 'Ready' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                  }>
                    {job.status === 'Ready' ? 'READY FOR EXIT' : job.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="size-3" />
                    <span>IN: {mounted ? new Date(job.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-4xl font-mono font-black tracking-[0.1em] text-slate-900 leading-none">{job.plate}</CardTitle>
                  <CardDescription className="flex items-center gap-2 font-black uppercase text-[10px] text-primary tracking-widest">
                    <MapPin className="size-3" />
                    {job.bayId || "Pending Bay Assignment"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 md:px-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  {job.services.map((s, i) => (
                    <Badge key={i} variant="outline" className="font-black text-[9px] uppercase tracking-tighter border-slate-100 bg-slate-50 text-slate-500 px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                </div>
                
                {job.status === 'In-Bay' && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <span>Live Progress</span>
                      <span className="text-primary">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2 rounded-full bg-white shadow-sm [&>div]:bg-primary transition-all duration-1000" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 md:p-8">
                {job.status === 'Queue' ? (
                  <Button 
                    className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 bg-primary hover:bg-blue-600 transition-all text-white active:scale-95" 
                    onClick={() => handleStartJob(job.plate)}
                  >
                    <Play className="mr-3 size-5 fill-current" /> Initialize Job Card
                  </Button>
                ) : job.status === 'Ready' ? (
                  <div className="w-full p-5 bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-emerald-700 font-black uppercase text-[10px] tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5" />
                      Job Completed
                    </div>
                    <span className="text-[8px] opacity-60">Cleared for payment</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95" 
                    onClick={() => handleFinishWash(job.plate)}
                  >
                    <Check className="mr-3 size-5" /> Finish & Sync Data
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <RoleSwitcher />
    </div>
  );
}
