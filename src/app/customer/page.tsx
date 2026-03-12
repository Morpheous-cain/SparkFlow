"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Share2, 
  AlertTriangle,
  ExternalLink,
  Wallet,
  QrCode,
  Truck,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CustomerPortal() {
  const { toast } = useToast();
  const [searchPlate, setSearchPlate] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [logistics, setLogistics] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSearch = () => {
    if (!searchPlate) return;
    
    // Logic: If it looks like a LOG ID, show logistics, else show vehicle
    if (searchPlate.startsWith("LOG-") || searchPlate.startsWith("SPARK-")) {
      setLogistics({
        id: searchPlate.toUpperCase(),
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
        plate: searchPlate.toUpperCase(),
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
          description: "Your Spark is ready! Check the feedback prompt below.",
          duration: 5000 
        });
      }, 4000);
    }
  };

  const handleRate = (val: number) => {
    setRating(val);
    if (val < 3) {
      toast({ 
        variant: "destructive",
        title: "We're Sorry!", 
        description: "An Urgent Alert has been sent to our Manager. We'll call you shortly to resolve this.",
        action: <AlertTriangle className="size-4" />
      });
    } else {
      toast({ 
        title: "Rating Received!", 
        description: `You've earned 50 SparkPoints for your feedback!`,
        action: <Trophy className="size-4 text-amber-500" />
      });
    }
  };

  const handleSubmitReview = () => {
    setIsSubmitted(true);
    toast({
      title: "Review Published",
      description: "Thanks for helping us maintain high standards!",
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
            <Waves className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">SparkFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Cashback Wallet</span>
            <span className="text-sm font-black text-primary italic">KES 450.00</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
            <Trophy className="size-4 text-emerald-600" />
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">1,240 Pts</span>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-xl mx-auto w-full space-y-6 flex-1">
        <section className="space-y-4 text-center py-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">Track Your <span className="text-primary italic">Spark</span></h2>
          <p className="text-slate-500 text-sm font-medium">Real-time status for car wash & concierge logistics</p>
          <div className="flex gap-2">
            <Input 
              placeholder="PLATE OR LOG ID" 
              className="h-14 text-xl font-mono font-bold text-center tracking-[0.2em] bg-white shadow-sm border-2 focus:ring-primary uppercase"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
            />
            <Button size="lg" className="h-14 px-8 shadow-xl shadow-primary/20 font-black uppercase text-xs tracking-widest" onClick={handleSearch}>
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
                   <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest mb-1">{logistics.status.toUpperCase()}</Badge>
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

                <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pickup Window</span>
                      <p className="text-xs font-black text-slate-900">{logistics.window}</p>
                   </div>
                   <div className="p-4 bg-primary/5 rounded-2xl flex flex-col justify-center items-center text-center">
                      <div className="size-8 bg-primary text-white rounded-xl flex items-center justify-center mb-1">
                        <QrCode className="size-4" />
                      </div>
                      <span className="text-[8px] font-black text-primary uppercase">Laundry Tag Ready</span>
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
                  <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-mono font-black tracking-widest">{vehicle.plate}</span>
                </div>
                <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest px-4 py-1.5">
                  {vehicle.status === 'Completed' ? 'READY' : vehicle.status.toUpperCase()}
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

                <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Location</span>
                    <p className="font-black text-slate-900">{vehicle.location}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">Assigned To</span>
                    <p className="font-black text-slate-900">{vehicle.attendant}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.services.map((s: string) => (
                      <div key={s} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 360 Feedback Loop Module */}
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
                <CardTitle className="text-3xl font-black tracking-tight">Rate Your Experience</CardTitle>
                <CardDescription className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.1em]">
                  Service turnaround: {vehicle.totalTime || 32} minutes
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
                    {/* Review Incentive */}
                    <div className="p-5 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl flex items-center gap-4 group cursor-pointer hover:bg-primary/10 transition-all">
                      <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <Camera className="size-7" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-sm">Earn $2 Off Next Time!</p>
                        <p className="text-xs font-bold text-slate-500">Post a photo of your clean vehicle/item</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative group">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="What made it great?" className="h-16 pl-12 rounded-2xl bg-slate-50 border-none shadow-inner font-bold" />
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button 
                          className="w-full h-16 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-primary/20"
                          onClick={handleSubmitReview}
                        >
                          Submit to SparkFlow
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-12 rounded-2xl gap-2 font-black text-[10px] uppercase tracking-wider text-slate-500 border-slate-200">
                            <ExternalLink className="size-3" /> Sync Google
                          </Button>
                          <Button variant="outline" className="flex-1 h-12 rounded-2xl gap-2 font-black text-[10px] uppercase tracking-wider text-slate-500 border-slate-200">
                            <Share2 className="size-3" /> Share Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isSubmitted && (
                  <div className="text-center space-y-4 py-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                      <CheckCircle2 className="size-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Review Published!</h3>
                    <p className="text-slate-500 font-bold text-sm max-w-[250px]">Your feedback keeps SparkFlow running at peak performance.</p>
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
                <p className="font-black text-2xl text-slate-900 tracking-tight">Awaiting ID or Plate</p>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enter details above to see the Spark</p>
              </div>
            </div>
          )
        )}
      </div>

      <RoleSwitcher />
    </div>
  );
}
