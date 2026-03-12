"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_VEHICLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Clock, MapPin, Car, Check, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function AttendantPWA() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(MOCK_VEHICLES);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const handleStartJob = (plate: string) => {
    toast({ title: "Wash Started", description: `Vehicle ${plate} is now being serviced.` });
    setJobs(prev => prev.map(j => j.plate === plate ? { ...j, status: 'In-Bay' as const } : j));
    setActiveJobId(plate);
  };

  const handleFinishWash = (plate: string) => {
    toast({ 
      title: "Wash Finished", 
      description: `Vehicle ${plate} is ready for payment. Notification sent to Agent.`,
    });
    setJobs(prev => prev.map(j => 
      j.plate === plate 
        ? { ...j, status: 'Ready' as const, progress: 100 } 
        : j
    ));
    if (activeJobId === plate) setActiveJobId(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <header className="bg-primary text-white p-6 shadow-lg rounded-b-[2rem] mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-xl">
                <Waves className="size-5" />
             </div>
             <div>
                <h1 className="text-xl font-bold italic uppercase tracking-tighter">Attendant Console</h1>
                <p className="opacity-80 text-[10px] font-bold uppercase tracking-widest">Peter Otieno • Station 04</p>
             </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 font-black">
            {jobs.filter(j => j.status === 'Queue' || j.status === 'In-Bay').length} ACTIVE
          </Badge>
        </div>
      </header>

      <div className="px-4 space-y-4 max-w-xl mx-auto">
        {jobs.filter(j => j.status !== 'Completed').length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
              <Car className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground font-bold">No active washes in your queue.</p>
          </div>
        ) : (
          jobs.filter(j => j.status !== 'Completed').map((job) => (
            <Card key={job.plate} className={`overflow-hidden transition-all border-none shadow-sm rounded-[2rem] ${activeJobId === job.plate ? "ring-4 ring-primary/10" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={
                    job.status === 'In-Bay' ? 'bg-amber-500 hover:bg-amber-600' : 
                    job.status === 'Ready' ? 'bg-emerald-500' : 'bg-slate-200 text-slate-600 hover:bg-slate-200'
                  }>
                    {job.status === 'Ready' ? 'READY FOR PAYMENT' : job.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <Clock className="size-3" />
                    <span>ARRIVED: {new Date(job.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-3xl font-mono font-black tracking-widest text-slate-900 italic">{job.plate}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2 mt-1 font-bold uppercase text-[10px] text-slate-400">
                  <MapPin className="size-3 text-primary" />
                  {job.bayId || "Awaiting Bay Assignment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {job.services.map((s, i) => (
                    <Badge key={i} variant="outline" className="font-black text-[9px] uppercase tracking-tighter border-slate-100 bg-slate-50 text-slate-500">{s}</Badge>
                  ))}
                </div>
                {job.status === 'In-Bay' && (
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Wash Progress</span>
                      <span className="text-primary">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2 rounded-full bg-slate-100" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-4">
                {job.status === 'Queue' ? (
                  <Button className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20" onClick={() => handleStartJob(job.plate)}>
                    <Play className="mr-2 size-4 fill-current" /> Start Wash
                  </Button>
                ) : job.status === 'Ready' ? (
                  <div className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-3 text-emerald-700 font-black uppercase text-[10px] tracking-[0.2em]">
                    <CheckCircle2 className="size-5" />
                    Sent to Cashier Desk
                  </div>
                ) : (
                  <Button 
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-black uppercase text-xs tracking-widest" 
                    onClick={() => handleFinishWash(job.plate)}
                  >
                    <Check className="mr-2 size-4" /> Finish Wash & Sync
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
