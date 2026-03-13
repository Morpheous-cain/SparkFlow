"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SERVICES, MOCK_VEHICLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Plus, Smartphone, Wallet, CreditCard, Banknote, Car, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AgentPortal() {
  const { toast } = useToast();
  const [plate, setPlate] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCheckouts, setPendingCheckouts] = useState(MOCK_VEHICLES.filter(v => v.status === 'Ready' || v.status === 'In-Bay'));

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleCheckIn = async () => {
    if (!plate.trim()) {
      toast({ title: "Plate Required", description: "Enter plate number.", variant: "destructive" });
      return;
    }
    if (selectedServices.length === 0) {
      toast({ title: "Service Required", description: "Select at least one wash service.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    toast({
      title: "Vehicle Logged",
      description: `Job created for ${plate}. Assigned to Bay 3.`,
    });
    
    setPlate("");
    setSelectedServices([]);
    setIsSubmitting(false);
  };

  const handlePayment = async (plate: string, method: 'MPESA' | 'CASH') => {
    toast({ 
      title: method === 'MPESA' ? "M-Pesa Push Sent" : "Processing Cash", 
      description: `Initiating checkout for ${plate}...` 
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    toast({
      title: "Payment Successful",
      description: `Vehicle ${plate} has been cleared for exit. Receipt printed.`,
    });
    
    setPendingCheckouts(prev => prev.filter(v => v.plate !== plate));
  };

  const totalAmount = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen pb-44 md:pb-52 p-4 max-w-2xl mx-auto flex flex-col gap-6 bg-slate-50">
      <header className="flex items-center gap-4 py-6">
        <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">SparkFlow Desk</h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Grace Mutua • Branch Lead</p>
        </div>
      </header>

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-slate-200/50 p-1 mb-6">
          <TabsTrigger value="checkin" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Plus className="size-3 mr-2" /> Check-In
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Wallet className="size-3 mr-2" /> Payments
            {pendingCheckouts.filter(v => v.status === 'Ready').length > 0 && (
              <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[8px]">
                {pendingCheckouts.filter(v => v.status === 'Ready').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="space-y-6 outline-none focus:ring-0">
          <Card className="shadow-2xl border-none rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 md:p-8">
              <CardTitle className="text-lg md:text-xl font-black uppercase leading-none">New Entry</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Capture details to begin workflow</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">License Plate</label>
                <Input 
                  placeholder="KDC 123A" 
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="text-2xl md:text-3xl h-14 md:h-16 font-mono font-black tracking-[0.2em] md:tracking-[0.3em] text-center border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 uppercase transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Select Packages</label>
                <div className="grid grid-cols-1 gap-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedServices.includes(service.id)
                          ? "border-primary bg-primary/5"
                          : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-black text-[11px] md:text-xs uppercase text-slate-900 leading-tight">{service.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">KES {service.price.toLocaleString()} • {service.duration}m</span>
                      </div>
                      <div className={`rounded-full p-1 transition-colors ${selectedServices.includes(service.id) ? "bg-primary text-white" : "bg-slate-200 text-slate-200"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="fixed bottom-[92px] left-0 right-0 px-4 max-w-2xl mx-auto z-40">
            <Card className="shadow-2xl border-none bg-slate-900 text-white rounded-2xl md:rounded-[2rem] overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex flex-col ml-2 md:ml-4">
                  <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em]">Estimate Total</span>
                  <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">KES {totalAmount.toLocaleString()}</span>
                </div>
                <Button 
                  size="lg" 
                  className="px-6 md:px-8 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-blue-600 transition-all active:scale-95" 
                  disabled={isSubmitting}
                  onClick={handleCheckIn}
                >
                  {isSubmitting ? "Syncing..." : "Log Vehicle"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 outline-none focus:ring-0">
          {pendingCheckouts.length === 0 ? (
            <div className="text-center py-20 opacity-30">
               <div className="size-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="size-10" />
               </div>
               <p className="font-black uppercase text-xs tracking-widest">No Pending Payments</p>
            </div>
          ) : (
            pendingCheckouts.map((v) => (
              <Card key={v.plate} className={`border-none shadow-sm rounded-2xl md:rounded-[2rem] overflow-hidden ${v.status === 'Ready' ? 'ring-2 ring-emerald-500/20' : 'opacity-70'}`}>
                <CardHeader className="pb-4 p-5 md:p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-10 md:size-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400">
                        <Car className="size-5 md:size-6" />
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-mono font-black tracking-widest text-slate-900 leading-none">{v.plate}</h4>
                        <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                          <Clock className="size-3 text-slate-400" />
                          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tight">{v.progress}% Sync</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={v.status === 'Ready' ? 'default' : 'secondary'} className={cn("font-black text-[9px]", v.status === 'Ready' ? 'bg-emerald-500' : '')}>
                      {v.status === 'Ready' ? 'READY' : 'IN-WASH'}
                    </Badge>
                  </div>
                </CardHeader>
                {v.status === 'Ready' && (
                  <CardContent className="p-3 md:p-4 bg-slate-50 grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => handlePayment(v.plate, 'MPESA')}
                      className="h-12 md:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[9px] tracking-widest gap-2"
                    >
                      <CreditCard className="size-3.5" /> M-Pesa
                    </Button>
                    <Button 
                      onClick={() => handlePayment(v.plate, 'CASH')}
                      variant="outline"
                      className="h-12 md:h-14 rounded-xl border-slate-200 bg-white font-black uppercase text-[9px] tracking-widest gap-2 text-slate-600"
                    >
                      <Banknote className="size-3.5" /> Cash
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <RoleSwitcher />
    </div>
  );
}
