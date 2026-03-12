"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { MOCK_VEHICLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, CreditCard, Clock, MapPin, Car, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { differenceInMinutes } from "date-fns";

export default function AttendantPWA() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(MOCK_VEHICLES);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const handleStartJob = (plate: string) => {
    toast({ title: "Job Started", description: `Wash initiated for ${plate}` });
    setJobs(prev => prev.map(j => j.plate === plate ? { ...j, status: 'In-Bay' as const } : j));
    setActiveJobId(plate);
  };

  const handleRequestPayment = async (plate: string) => {
    setPaymentLoading(plate);
    toast({ title: "M-Pesa STK Push Sent", description: `Prompt sent to customer for ${plate}` });
    
    // Simulate M-Pesa Callback & Auto-Checkout
    await new Promise(r => setTimeout(r, 2500));
    
    const now = new Date();
    const job = jobs.find(j => j.plate === plate);
    const duration = job ? differenceInMinutes(now, new Date(job.arrivalTime)) : 0;

    toast({ 
      title: "Payment Successful", 
      description: `Payment confirmed for ${plate}. TAT: ${duration} mins.`,
    });

    setJobs(prev => prev.map(j => 
      j.plate === plate 
        ? { ...j, status: 'Completed' as const, exitTime: now.toISOString(), durationMinutes: duration } 
        : j
    ));
    
    setPaymentLoading(null);
    if (activeJobId === plate) setActiveJobId(null);

    // Remove from active queue after a delay to show "Completed" state
    setTimeout(() => {
      setJobs(prev => prev.filter(j => j.plate !== plate));
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <header className="bg-primary text-white p-6 shadow-lg rounded-b-[2rem] mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Attendant Tasks</h1>
            <p className="opacity-80 text-sm">Peter Otieno • Online</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {jobs.filter(j => j.status !== 'Completed').length} Active
          </Badge>
        </div>
      </header>

      <div className="px-4 space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <Car className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground">No active jobs in your queue.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Card key={job.plate} className={`overflow-hidden transition-all border-2 ${activeJobId === job.plate ? "border-primary ring-2 ring-primary/20" : "border-transparent"}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={job.status === 'Queue' ? 'outline' : 'default'} className={
                    job.status === 'In-Bay' ? 'bg-amber-500 hover:bg-amber-600' : 
                    job.status === 'Completed' ? 'bg-emerald-500' : ''
                  }>
                    {job.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Arrival: {new Date(job.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-2xl font-mono tracking-wider">{job.plate}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3 h-3" />
                  {job.bayId || "Awaiting Bay"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {job.services.map((s, i) => (
                    <Badge key={i} variant="secondary" className="font-normal text-[10px] uppercase">{s}</Badge>
                  ))}
                </div>
                {activeJobId === job.plate && job.status === 'In-Bay' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Wash Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-1.5" />
                  </div>
                )}
                {job.status === 'Completed' && (
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="size-5" />
                    Job Completed in {job.durationMinutes} mins
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 gap-2">
                {job.status === 'Queue' ? (
                  <Button className="w-full h-12" onClick={() => handleStartJob(job.plate)}>
                    <Play className="mr-2 w-4 h-4 fill-current" /> Start Job
                  </Button>
                ) : job.status === 'Completed' ? (
                  <Button variant="ghost" className="w-full h-12 text-emerald-600 font-bold pointer-events-none">
                    <Check className="mr-2 size-4" /> Ready for Pickup
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => toast({ title: "Task Logged", description: "Progress updated." })}>
                      <Clock className="mr-2 w-4 h-4" /> Log Task
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700" 
                      onClick={() => handleRequestPayment(job.plate)}
                      disabled={paymentLoading === job.plate}
                    >
                      {paymentLoading === job.plate ? (
                        "Syncing..."
                      ) : (
                        <>
                          <CreditCard className="mr-2 w-4 h-4" /> Checkout
                        </>
                      )}
                    </Button>
                  </>
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
