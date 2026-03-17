
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SERVICE_BUNDLES, SERVICES, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Search, 
  Car, 
  Star, 
  CheckCircle2, 
  Waves, 
  MessageSquare, 
  Clock, 
  Trophy, 
  Sparkles, 
  Camera, 
  AlertTriangle,
  Truck,
  QrCode,
  Zap,
  MapPin,
  Locate,
  ChevronRight,
  MapIcon,
  Package,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function CustomerPortalContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [searchPlate, setSearchPlate] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [logistics, setLogistics] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "merch" | "history">("home");

  // Home Service Request State
  const [isHomeServiceOpen, setIsHomeServiceOpen] = useState(false);
  const [homeStep, setHomeStep] = useState(1);
  const [selectedHomeService, setSelectedHomeService] = useState(SERVICES[0]);
  const [homeLocation, setHomeLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [homeAddress, setHomeAddress] = useState("");
  const [homeDate, setHomeDate] = useState<Date | undefined>(undefined);
  const [homeTime, setHomeTime] = useState("10:00 AM");
  const [homePlate, setHomePlate] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHomeDate(new Date());
    const plateFromUrl = searchParams.get("plate");
    if (plateFromUrl) {
      setSearchPlate(plateFromUrl.toUpperCase());
      handleSearch(plateFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const travelFee = homeLocation ? 450 : 0; 
  const totalHomeCost = selectedHomeService.price + travelFee;

  const handleSearch = (plateParam?: string) => {
    const targetPlate = plateParam || searchPlate;
    if (!targetPlate) return;
    
    if (targetPlate.startsWith("LOG-") || targetPlate.startsWith("SPARK-")) {
      setLogistics({
        id: targetPlate.toUpperCase(),
        item: "Persian Rug",
        status: "In-Wash",
        progress: 45,
        eta: "2:30 PM",
        qrTag: "SPARK-RU-101",
        window: "09:00 AM - 11:00 AM",
        stages: [
          { name: "Pickup", completed: true, label: "Driver is 5 mins away" },
          { name: "In-Wash", completed: true, label: "Your carpet is being deep-cleaned" },
          { name: "Drying/QC", completed: false, label: "Quality check in progress" },
          { name: "Delivery", completed: false, label: "Est: 2:30 PM" }
        ]
      });
      setVehicle(null);
    } else {
      setVehicle({
        plate: targetPlate.toUpperCase(),
        status: "In Progress",
        progress: 65,
        estimatedTime: "12 mins",
        services: ["Executive Wash", "Ceramic Wax"],
        location: "Bay 2",
        attendant: "Peter O."
      });
      setLogistics(null);

      setTimeout(() => {
        setVehicle((prev: any) => prev ? { 
          ...prev, 
          status: "Completed", 
          progress: 100,
          estimatedTime: "0 mins",
          totalTime: 32 
        } : null);
        toast({ 
          title: "Service Complete!", 
          description: "Your Spark is ready! Please leave a rating below.",
          duration: 5000 
        });
      }, 3000);
    }
  };

  const handlePickLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHomeLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setHomeAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} (GPS Verified)`);
          setIsLocating(false);
          toast({ title: "Location Picked", description: "GPS coordinates captured successfully." });
        },
        () => {
          setIsLocating(false);
          toast({ title: "GPS Failed", description: "Could not get location. Please type address manually.", variant: "destructive" });
        }
      );
    }
  };

  const handleRequestHomeService = () => {
    if (!homePlate && selectedHomeService.category === 'Wash') {
      toast({ title: "Plate Required", description: "Please enter your vehicle plate number.", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Request Scheduled!",
      description: `${selectedHomeService.name} confirmed for ${homeDate ? format(homeDate, 'PPP') : 'N/A'} at ${homeTime}.`,
    });
    setIsHomeServiceOpen(false);
    setHomeStep(1);
  };

  const handleRate = (val: number) => {
    setRating(val);
    if (val < 3) {
      toast({ 
        variant: "destructive",
        title: "We're Sorry!", 
        description: "A Manager has been alerted to your feedback. We will contact you immediately.",
        action: <AlertTriangle className="size-4" />
      });
    } else {
      toast({ 
        title: "Rating Received!", 
        description: `You've earned 50 SparkPoints! We hope to see you again soon.`,
        action: <Trophy className="size-4 text-emerald-600" />
      });
    }
  };

  const handleSubmitReview = () => {
    setIsSubmitted(true);
    toast({
      title: "Review Published",
      description: "Your feedback helps us maintain SparkFlow excellence.",
    });
  };

  const handleWhatsAppSupport = () => {
    window.open("https://wa.me/254700000000?text=Hi SparkFlow, I need assistance with my wash.", "_blank");
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Generating Statement",
      description: "Your service history is being exported to PDF. Please wait...",
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-44 bg-slate-50 flex flex-col font-body">
      <header className="bg-white border-b p-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
            <Waves className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight uppercase">SparkFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
            <Trophy className="size-4 text-emerald-600" />
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">1,240 Pts</span>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-xl mx-auto w-full space-y-8 flex-1">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl h-12 shadow-inner">
          <button 
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
              activeTab === 'home' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Services
          </button>
          <button 
            onClick={() => setActiveTab('merch')}
            className={cn(
              "flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
              activeTab === 'merch' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Shop
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all",
              activeTab === 'history' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            History
          </button>
        </div>

        {activeTab === 'home' && (
          <>
            <section>
              <Dialog open={isHomeServiceOpen} onOpenChange={setIsHomeServiceOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-900/20 group overflow-hidden relative border-none">
                    <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-primary/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                    <div className="flex items-center gap-4 relative z-10 w-full px-6">
                      <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                        <Truck className="size-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-black uppercase leading-none">Home Wash On-Demand</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct to your doorstep • GPS Quote</p>
                      </div>
                      <ChevronRight className="ml-auto size-5 text-slate-500" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white">
                  <div className="p-8 bg-slate-900 text-white">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="p-3 bg-primary rounded-2xl">
                        <Truck className="size-6" />
                       </div>
                       <DialogTitle className="text-2xl font-black uppercase">On-Demand Request</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                       Step {mounted ? homeStep : 1} of 4: {homeStep === 1 ? 'Service' : homeStep === 2 ? 'Location' : homeStep === 3 ? 'Schedule' : 'Confirm'}
                    </DialogDescription>
                  </div>

                  <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {homeStep === 1 && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Service Category</h4>
                        <div className="grid gap-3">
                          {SERVICES.filter(s => s.category === 'Wash' || s.category === 'Home').map(service => (
                            <button
                              key={service.id}
                              onClick={() => setSelectedHomeService(service)}
                              className={cn(
                                "flex items-center justify-between p-5 rounded-3xl border-2 transition-all text-left",
                                selectedHomeService.id === service.id ? "border-primary bg-primary/5" : "border-slate-50 hover:border-slate-200"
                              )}
                            >
                              <div>
                                <span className="font-black uppercase text-xs block">{service.name}</span>
                                <span className="text-[10px] font-bold text-slate-400">KES {service.price.toLocaleString()}</span>
                              </div>
                              {selectedHomeService.id === service.id && <CheckCircle2 className="size-4 text-primary" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {homeStep === 2 && (
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Premises</h4>
                        <div className="space-y-4">
                          <Button 
                            onClick={handlePickLocation}
                            disabled={isLocating}
                            className="w-full h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-600 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest gap-2"
                          >
                            <Locate className={cn("size-4", isLocating ? "animate-spin" : "")} />
                            {homeLocation ? "Location Verified" : "Capture GPS Location"}
                          </Button>
                          <Input 
                            placeholder="Or Type Street / Apartment"
                            value={homeAddress}
                            onChange={(e) => setHomeAddress(e.target.value)}
                            className="h-14 rounded-2xl border-2 font-bold focus:ring-primary"
                          />
                          {homeLocation && (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                               <MapIcon className="size-5 text-emerald-600" />
                               <span className="text-[10px] font-black text-emerald-700 uppercase">Travel Fee: KES 450 (Calculated)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {homeStep === 3 && (
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preferred Slot</h4>
                        <div className="space-y-6">
                          <Calendar
                            mode="single"
                            selected={homeDate}
                            onSelect={setHomeDate}
                            className="rounded-3xl border-2 p-4 mx-auto w-fit"
                            disabled={(date) => date < new Date()}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map(time => (
                              <Button
                                key={time}
                                variant={homeTime === time ? 'default' : 'outline'}
                                onClick={() => setHomeTime(time)}
                                className="h-12 rounded-xl font-black text-[10px] tracking-widest"
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {homeStep === 4 && (
                      <div className="space-y-8 text-center py-4">
                        {selectedHomeService.category === 'Wash' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Step: Vehicle Plate</label>
                            <Input 
                              placeholder="KDC 123A" 
                              value={homePlate}
                              onChange={(e) => setHomePlate(e.target.value.toUpperCase())}
                              className="h-20 text-4xl font-mono font-black tracking-widest text-center rounded-3xl border-4 border-slate-100 focus:border-primary uppercase"
                            />
                          </div>
                        )}
                        <Card className="border-none shadow-inner bg-slate-50 p-6 rounded-[2rem]">
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                              <span>{selectedHomeService.name}</span>
                              <span>KES {selectedHomeService.price}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                              <span>Travel Fee (GPS)</span>
                              <span>KES {travelFee}</span>
                            </div>
                            <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between">
                              <span className="text-sm font-black uppercase">Total Quote</span>
                              <span className="text-2xl font-black text-primary">KES {totalHomeCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>

                  <div className="p-8 bg-slate-50 flex gap-4">
                    {homeStep > 1 && (
                      <Button variant="outline" className="h-14 rounded-2xl flex-1 font-black uppercase text-[10px] tracking-widest" onClick={() => setHomeStep(prev => prev - 1)}>Back</Button>
                    )}
                    {homeStep < 4 ? (
                      <Button className="h-14 rounded-2xl flex-[2] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20" onClick={() => setHomeStep(prev => prev + 1)}>Continue</Button>
                    ) : (
                      <Button className="h-14 rounded-2xl flex-[2] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20" onClick={handleRequestHomeService}>Confirm Booking</Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </section>

            <section className="space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Limited Offers</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">CURATED FOR YOU</Badge>
               </div>
               <div className="grid grid-cols-1 gap-4">
                 {SERVICE_BUNDLES.map((bundle) => (
                   <Card key={bundle.id} className="border-none shadow-sm rounded-3xl bg-slate-900 text-white overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8 -mr-10 -mt-10 bg-primary/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                      <CardContent className="p-5 relative z-10 flex justify-between items-center">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="size-3 text-primary" />
                              <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{bundle.incentive}</span>
                            </div>
                            <h4 className="text-lg font-black uppercase leading-none">{bundle.name}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">{bundle.usp}</p>
                            <div className="flex gap-2 mt-3">
                               {bundle.services.slice(0, 2).map(s => (
                                 <Badge key={s} variant="outline" className="text-[7px] font-black uppercase border-white/10 text-slate-300">{s}</Badge>
                               ))}
                            </div>
                         </div>
                         <div className="text-right shrink-0 ml-4">
                            <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Save KES {bundle.saving}</span>
                            <div className="text-xl font-black text-primary">KES {bundle.price}</div>
                            <Button className="h-8 rounded-xl bg-white text-slate-900 font-black text-[8px] uppercase tracking-widest mt-2 px-4 border-none">
                               Claim
                            </Button>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
               </div>
            </section>

            <section className="space-y-4 text-center py-4">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">Track Your <span className="text-primary">Spark</span></h2>
              <p className="text-slate-500 text-sm font-medium">Real-time status for car wash & concierge logistics</p>
              <div className="flex gap-2">
                <input 
                  placeholder="PLATE OR LOG ID" 
                  className="h-14 w-full text-xl font-mono font-bold text-center tracking-[0.2em] bg-white shadow-sm border-2 focus:ring-primary uppercase rounded-2xl focus:outline-none"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                />
                <Button size="lg" className="h-14 px-8 shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest rounded-2xl border-none" onClick={() => handleSearch()}>
                  <Search className="size-5 mr-2" /> Track
                </Button>
              </div>
            </section>

            {logistics && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                 <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-slate-100">
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <Truck className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-mono font-black tracking-widest">{logistics.id}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concierge Logistics</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest mb-1 uppercase">{logistics.status}</Badge>
                       <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <QrCode className="size-3" /> {logistics.qrTag}
                       </div>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Stage</span>
                          <h4 className="text-2xl font-black text-slate-900">{logistics.stages.find((s:any) => !s.completed)?.name || "Final Delivery"}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Return</span>
                          <div className="flex items-center gap-2 text-primary font-black">
                            <Clock className="size-4" />
                            {logistics.eta}
                          </div>
                        </div>
                      </div>
                      <Progress value={logistics.progress} className="h-4 rounded-full bg-slate-100" />
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                         <Sparkles className="size-4 text-primary" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Live Journey</h4>
                       </div>
                       <div className="space-y-6 relative pl-8">
                          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
                          {logistics.stages.map((stage: any, i: number) => (
                            <div key={i} className="relative flex flex-col gap-1">
                               <div className={cn(
                                 "absolute -left-[1.35rem] size-3 rounded-full border-2 border-white shadow-sm ring-2",
                                 stage.completed ? "bg-primary ring-primary/20" : "bg-white ring-slate-100"
                               )} />
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest",
                                 stage.completed ? "text-primary" : "text-slate-300"
                               )}>{stage.name}</span>
                               <p className={cn(
                                 "text-sm font-bold leading-tight",
                                 stage.completed ? "text-slate-900" : "text-slate-400"
                               )}>{stage.label}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </CardContent>
                 </Card>
              </div>
            )}

            {vehicle ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                <Card className={cn(
                  "border-none shadow-2xl overflow-hidden transition-all duration-500 rounded-[2.5rem]",
                  vehicle.status === 'Completed' ? "ring-4 ring-emerald-500/20" : "ring-1 ring-slate-200"
                )}>
                  <div className={cn(
                    "p-6 flex justify-between items-center text-white transition-colors duration-500",
                    vehicle.status === 'Completed' ? "bg-emerald-500" : "bg-primary"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                        <Car className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-mono font-black tracking-widest">{vehicle.plate}</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest px-4 py-1.5 uppercase">
                      {vehicle.status === 'Completed' ? 'READY' : vehicle.status}
                    </Badge>
                  </div>
                  <CardContent className="p-8 space-y-8 bg-white">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Progress</span>
                          <h4 className="text-3xl font-black text-slate-900">{vehicle.progress}%</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Completion</span>
                          <div className="flex items-center gap-2 text-primary font-black">
                            <Clock className="size-4" />
                            {vehicle.estimatedTime}
                          </div>
                        </div>
                      </div>
                      <Progress value={vehicle.progress} className="h-4 rounded-full bg-slate-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(
                  "border-none shadow-2xl transition-all duration-700 delay-300 rounded-[2.5rem] overflow-hidden",
                  vehicle.status === 'Completed' ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
                )}>
                  <CardHeader className="text-center pb-6 bg-slate-900 text-white">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/20 rounded-3xl animate-pulse">
                        <Sparkles className="size-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight uppercase">Rate Your Experience</CardTitle>
                    <CardDescription className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.1em]">
                      Turnaround: {vehicle.totalTime || 32} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-8 p-10 bg-white">
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRate(star)}
                          className={cn(
                            "transition-all transform duration-300 hover:scale-125",
                            (hoveredRating || rating) >= star ? 'text-amber-400 fill-amber-400 drop-shadow-xl' : 'text-slate-100'
                          )}
                        >
                          <Star className="w-14 h-14" />
                        </button>
                      ))}
                    </div>
                    
                    {rating > 0 && !isSubmitted && (
                      <div className="w-full space-y-6 animate-in fade-in zoom-in-95">
                        <div className="p-5 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl flex items-center gap-4 group cursor-pointer hover:bg-primary/10 transition-all">
                          <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <Camera className="size-7" />
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-slate-900 text-sm uppercase">Earn KES 200 Reward!</p>
                            <p className="text-xs font-bold text-slate-500 uppercase">Post a photo of your clean vehicle</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="relative group">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <input placeholder="What made it great?" className="h-16 pl-12 w-full rounded-2xl bg-slate-50 border-none shadow-inner font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>

                          <Button 
                            className="w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-primary/20 border-none"
                            onClick={handleSubmitReview}
                          >
                            Submit Feedback
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              !logistics && (
                <div className="text-center py-24 flex flex-col items-center gap-6 opacity-40">
                  <div className="p-10 bg-slate-100 rounded-[4rem] border-4 border-dashed border-slate-200 shadow-inner">
                    <Car className="w-24 h-24 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-2xl text-slate-900 tracking-tight uppercase">Awaiting Details</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enter plate or ID to see the Spark</p>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {activeTab === 'merch' && (
          <div className="space-y-6">
            <header className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">SparkFlow <span className="text-primary">Shop</span></h2>
              <p className="text-slate-500 text-sm font-medium">Premium car care products & accessories</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.filter(s => s.category === 'Merchandise').map(item => (
                <Card key={item.id} className="border-none shadow-lg rounded-3xl overflow-hidden bg-white group hover:-translate-y-1 transition-all">
                  <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    <Package className="size-16 text-slate-300 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white border-none font-black text-[8px] uppercase">New Arrival</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="text-lg font-black uppercase text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.usp}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xl font-black text-primary">KES {item.price.toLocaleString()}</div>
                      <Button size="sm" className="rounded-xl font-black text-[9px] uppercase tracking-widest h-10 px-6 border-none">
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <header className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Service <span className="text-primary">Statements</span></h2>
              <p className="text-slate-500 text-sm font-medium">View your past visits and digital receipts</p>
            </header>

            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none">
                    <TableHead className="font-black text-[9px] uppercase text-slate-400 tracking-widest pl-6">Date</TableHead>
                    <TableHead className="font-black text-[9px] uppercase text-slate-400 tracking-widest">Service</TableHead>
                    <TableHead className="font-black text-[9px] uppercase text-slate-400 tracking-widest text-right pr-6">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TRANSACTIONS.map((tx) => (
                    <TableRow key={tx.id} className="border-slate-50 hover:bg-slate-50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-900">{mounted ? format(new Date(tx.date), 'dd MMM') : '--'}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">REF: {tx.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">
                          {tx.plate} • Wash
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-primary">KES {tx.amount.toLocaleString()}</span>
                          <span className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                            <CheckCircle2 className="size-2" /> Paid
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 bg-slate-50 border-t border-dashed border-slate-200 text-center">
                <Button 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase text-slate-400 hover:text-primary h-auto p-0 border-none"
                  onClick={handleDownloadStatement}
                >
                  Download Full Statement (PDF) <FileText className="size-3 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Loyalty Summary */}
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 -mr-16 -mt-16 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <header className="flex items-center gap-4">
                  <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <Trophy className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase leading-none">SparkRewards</h3>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Tier: Gold Member</p>
                  </div>
                </header>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Next Reward: Free Wax</span>
                    <span>1,240 / 2,000</span>
                  </div>
                  <Progress value={62} className="h-2 bg-white/10 [&>div]:bg-primary" />
                </div>
                <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl border-none">
                  Redeem Points
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Button 
        onClick={handleWhatsAppSupport}
        className="fixed bottom-28 right-6 size-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl z-50 p-0 flex items-center justify-center animate-bounce border-none"
      >
        <MessageSquare className="size-8" />
      </Button>

      <RoleSwitcher />
    </div>
  );
}

export default function CustomerPortal() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerPortalContent />
    </Suspense>
  );
}
