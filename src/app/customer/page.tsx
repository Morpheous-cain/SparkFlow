"use client";

import { useState, useEffect } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Car, Star, CheckCircle2, Waves, MessageSquare, Clock, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CustomerPortal() {
  const { toast } = useToast();
  const [searchPlate, setSearchPlate] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSearch = () => {
    if (!searchPlate) return;
    // Mock lookup: Simulate a search
    setVehicle({
      plate: searchPlate.toUpperCase(),
      status: "In Progress",
      progress: 65,
      estimatedTime: "12 mins",
      services: ["Executive Wash", "Ceramic Wax"],
      location: "Bay 2",
      attendant: "Peter O."
    });

    // Simulate real-time update to "Completed" for testing checkout flow
    setTimeout(() => {
      setVehicle((prev: any) => prev ? { 
        ...prev, 
        status: "Completed", 
        progress: 100,
        estimatedTime: "0 mins",
        totalTime: 32 
      } : null);
      toast({ title: "Service Complete!", description: "Your car is ready. Please rate your experience." });
    }, 5000);
  };

  const handleRate = (val: number) => {
    setRating(val);
    toast({ 
      title: "Rating Received!", 
      description: `You've earned 50 SparkPoints for your feedback!`,
      action: <Trophy className="size-4 text-amber-500" />
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
            <Waves className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-primary">SparkFlow</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
          <Trophy className="size-3 text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase">1,240 Pts</span>
        </div>
      </header>

      <div className="p-6 max-w-xl mx-auto w-full space-y-6 flex-1">
        <section className="space-y-4 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">Track Your <span className="text-primary">Spark</span></h2>
          <p className="text-slate-500 text-sm font-medium">Enter your license plate to see real-time progress</p>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. KDC 123A" 
              className="h-14 text-xl font-mono font-bold text-center tracking-widest bg-white shadow-sm border-2 focus:ring-primary"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
            />
            <Button size="lg" className="h-14 px-8 shadow-xl shadow-primary/20 font-bold" onClick={handleSearch}>
              <Search className="size-5 mr-2" /> Track
            </Button>
          </div>
        </section>

        {vehicle ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
            <Card className={cn(
              "border-none shadow-2xl overflow-hidden transition-all duration-500",
              vehicle.status === 'Completed' ? "ring-4 ring-emerald-500/20" : "ring-1 ring-slate-200"
            )}>
              <div className={cn(
                "p-4 flex justify-between items-center text-white transition-colors duration-500",
                vehicle.status === 'Completed' ? "bg-emerald-500" : "bg-primary"
              )}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-mono font-bold tracking-widest">{vehicle.plate}</span>
                </div>
                <Badge className="bg-white/20 text-white border-none font-bold">
                  {vehicle.status === 'Completed' ? 'READY' : vehicle.status.toUpperCase()}
                </Badge>
              </div>
              <CardContent className="p-8 space-y-8 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Progress</span>
                      <h4 className="text-2xl font-black text-slate-900">{vehicle.progress}%</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Completion</span>
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Clock className="size-4" />
                        {vehicle.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <Progress value={vehicle.progress} className="h-4 rounded-full bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Location</span>
                    <p className="font-bold text-slate-900">{vehicle.location}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Assigned To</span>
                    <p className="font-bold text-slate-900">{vehicle.attendant}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Order Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.services.map((s: string) => (
                      <div key={s} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post-Completion Rating Module */}
            <Card className={cn(
              "border-none shadow-xl transition-all duration-700 delay-300",
              vehicle.status === 'Completed' ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
            )}>
              <CardHeader className="text-center pb-2 bg-slate-900 text-white rounded-t-[2rem]">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-primary/20 rounded-full animate-bounce">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-black">Rate Your Spark</CardTitle>
                <CardDescription className="text-slate-400 font-medium">How did we do today? Your TAT was {vehicle.totalTime}m.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8 p-8 bg-white rounded-b-[2rem]">
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRate(star)}
                      className={cn(
                        "transition-all transform duration-300 hover:scale-125",
                        (hoveredRating || rating) >= star ? 'text-amber-400 fill-amber-400 drop-shadow-lg' : 'text-slate-200'
                      )}
                    >
                      <Star className="w-12 h-12" />
                    </button>
                  ))}
                </div>
                
                <div className="w-full flex flex-col gap-4">
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input placeholder="What made it great? (Optional)" className="h-14 pl-12 rounded-2xl bg-slate-50 border-none shadow-inner" />
                  </div>
                  <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-6 opacity-30">
            <div className="p-8 bg-slate-100 rounded-[3rem] border-4 border-dashed border-slate-200">
              <Car className="w-20 h-20 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-xl text-slate-900">Awaiting Plate Number</p>
              <p className="text-sm font-medium">Enter your details above to track live progress</p>
            </div>
          </div>
        )}
      </div>

      <RoleSwitcher />
    </div>
  );
}
