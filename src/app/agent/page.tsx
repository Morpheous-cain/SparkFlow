
"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SERVICES, MOCK_VEHICLES, BAYS, STAFF } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Plus, Smartphone, Wallet, CreditCard, Banknote, Car, Clock, User, Warehouse, LayoutGrid, Timer, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AgentPortal() {
  const { toast } = useToast();
  const [plate, setPlate] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBay, setSelectedBay] = useState<string>("");
  const [selectedAttendant, setSelectedAttendant] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCheckouts, setPendingCheckouts] = useState(MOCK_VEHICLES.filter(v => v.status === 'Ready' || v.status === 'In-Bay'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      description: `Job created for ${plate}. Assigned to ${selectedBay || "Queue"}.`,
    });
    
    setPlate("");
    setSelectedServices([]);
    setSelectedBay("");
    setSelectedAttendant("");
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
      description: `Vehicle ${plate} cleared. Rating link ready to send.`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 font-black uppercase text-[8px] tracking-widest gap-2 bg-white"
          onClick={() => sendFeedbackLink(plate)}
        >
          <Send className="size-3" /> Send Rating Link
        </Button>
      )
    });
    
    setPendingCheckouts(prev => prev.filter(v => v.plate !== plate));
  };

  const sendFeedbackLink = (plate: string) => {
    const feedbackUrl = `${window.location.origin}/customer?plate=${plate}`;
    // In production, this would trigger an SMS/WhatsApp via Twilio or Africa's Talking
    toast({
      title: "Feedback Link Sent",
      description: `WhatsApp & SMS with link sent to ${plate} owner.`,
      action: <Smartphone className="size-4 text-primary" />
    });
    console.log(`[SMS Simulation] To: Customer, Msg: Thanks for visiting SparkFlow! Rate your experience here: ${feedbackUrl}`);
  };

  const totalAmount = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  const availableBays = BAYS.filter(b => b.status === 'Available');
  const activeAttendants = STAFF.filter(s => s.role === 'Attendant' && s.attendanceStatus === 'Present');
  const queueCount = MOCK_VEHICLES.filter(v => v.status === 'Queue').length;

  return (
    <div className="min-h-screen pb-44 md:pb-52 p-4 max-w-3xl mx-auto flex flex-col gap-6 bg-slate-50 font-body">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">SparkFlow Desk</h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Grace Mutua • Branch Lead</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Warehouse className="size-4" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Bays Free</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-1">{availableBays.length} / {BAYS.length}</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Car className="size-4" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase leading-none">In Queue</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-1">{queueCount}</p>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-slate-200/50 p-1 mb-6">
          <TabsTrigger value="checkin" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Plus className="size-3 mr-2" /> Check-In
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutGrid className="size-3 mr-2" /> Workflow
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Wallet className="size-3 mr-2" /> Payments
            {pendingCheckouts.filter(v => v.status === 'Ready').length > 0 && (
              <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[8px] text-white uppercase">
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
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">License Plate</label>
                <Input 
                  placeholder="KDC 123A" 
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="text-2xl md:text-3xl h-14 md:h-16 font-mono font-black tracking-[0.2em] md:tracking-[0.3em] text-center border-2 border-slate-100 rounded-2xl focus:border-primary focus:ring-0 uppercase transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Assign Bay (Optional)</label>
                  <Select value={selectedBay} onValueChange={setSelectedBay}>
                    <SelectTrigger className="h-12 rounded-xl border-2 font-bold text-xs uppercase tracking-tight">
                      <SelectValue placeholder="Send to Queue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queue">Wait in Queue</SelectItem>
                      {availableBays.map(bay => (
                        <SelectItem key={bay.id} value={bay.id}>{bay.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Assign Attendant</label>
                  <Select value={selectedAttendant} onValueChange={setSelectedAttendant}>
                    <SelectTrigger className="h-12 rounded-xl border-2 font-bold text-xs uppercase tracking-tight">
                      <SelectValue placeholder="Auto-Assign Next" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeAttendants.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

          <div className="fixed bottom-[92px] left-0 right-0 px-4 max-w-3xl mx-auto z-40">
            <Card className="shadow-2xl border-none bg-slate-900 text-white rounded-2xl md:rounded-[2rem] overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex flex-col ml-2 md:ml-4">
                  <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em]">Estimate Total</span>
                  <span className="text-xl md:text-2xl font-black tracking-tighter leading-none">KES {totalAmount.toLocaleString()}</span>
                </div>
                <Button 
                  size="lg" 
                  className="px-6 md:px-8 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-blue-600 transition-all active:scale-95 text-white" 
                  disabled={isSubmitting}
                  onClick={handleCheckIn}
                >
                  {isSubmitting ? "Syncing..." : "Log Vehicle"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_VEHICLES.map((v) => (
              <Card key={v.plate} className="border-none shadow-sm rounded-2xl p-5 bg-white relative overflow-hidden group">
                <div className={cn(
                  "absolute top-0 right-0 w-1 h-full",
                  v.status === 'In-Bay' ? 'bg-amber-500' : 'bg-slate-200'
                )} />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-mono font-black tracking-widest text-slate-900">{v.plate}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">{v.services[0]}</Badge>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{v.status === 'Queue' ? 'Waiting' : 'Servicing'}</span>
                    </div>
                  </div>
                  <Badge className={cn(
                    "font-black text-[8px] uppercase",
                    v.status === 'In-Bay' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 border-none'
                  )}>
                    {v.status === 'In-Bay' ? `BAY ${v.bayId?.split('-')[1]}` : 'QUEUE'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-100">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                    <User className="size-3" />
                    {STAFF.find(s => s.id === v.attendantId)?.name || "Unassigned"}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                    <Clock className="size-3" />
                    {mounted ? new Date(v.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                  </div>
                </div>
              </Card>
            ))}
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
                <CardHeader className="pb-4 p-5 md:p-6 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-10 md:size-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400">
                        <Car className="size-5 md:size-6" />
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-mono font-black tracking-widest text-slate-900 leading-none">{v.plate}</h4>
                        <div className="flex items-center gap-3 mt-1.5 md:mt-2">
                          <div className="flex items-center gap-1">
                            <Timer className="size-3 text-slate-400" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tight">32m Wash</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Banknote className="size-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600">KES {v.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant={v.status === 'Ready' ? 'default' : 'secondary'} className={cn("font-black text-[9px] text-white", v.status === 'Ready' ? 'bg-emerald-500' : 'bg-slate-200 text-slate-500 uppercase')}>
                      {v.status === 'Ready' ? 'READY' : 'IN-WASH'}
                    </Badge>
                  </div>
                </CardHeader>
                {v.status === 'Ready' && (
                  <CardContent className="p-3 md:p-4 bg-slate-50 grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => handlePayment(v.plate, 'MPESA')}
                      className="h-12 md:h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[9px] tracking-widest gap-2 text-white"
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
