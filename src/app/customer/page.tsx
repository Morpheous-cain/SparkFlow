"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Car, Star, CheckCircle2, Waves, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerPortal() {
  const { toast } = useToast();
  const [searchPlate, setSearchPlate] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [rating, setRating] = useState(0);

  const handleSearch = () => {
    if (!searchPlate) return;
    // Mock lookup
    setVehicle({
      plate: searchPlate.toUpperCase(),
      status: "In Progress",
      progress: 65,
      estimatedTime: "15 mins",
      services: ["Executive Wash", "Ceramic Wax"],
      location: "Bay 2"
    });
  };

  const handleRate = (val: number) => {
    setRating(val);
    toast({ title: "Thank you!", description: "Your feedback helps us improve." });
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 flex flex-col">
      <header className="bg-white border-b p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg text-white">
            <Waves className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-primary">SparkFlow</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </header>

      <div className="p-6 max-w-xl mx-auto w-full space-y-6">
        <section className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-center">Track Your Wash</h2>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter Plate Number" 
              className="h-12 text-lg font-mono font-bold text-center tracking-widest"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
            />
            <Button size="lg" className="h-12" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </section>

        {vehicle ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="bg-primary text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-mono font-bold">{vehicle.plate}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
                  <Clock className="w-3 h-3" /> {vehicle.estimatedTime} left
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Status: {vehicle.status}</span>
                    <span className="text-primary">{vehicle.progress}%</span>
                  </div>
                  <Progress value={vehicle.progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Location</span>
                    <span className="font-semibold">{vehicle.location}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Attendant</span>
                    <span className="font-semibold">Peter O.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Services Selected</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.services.map((s: string) => (
                      <div key={s} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">Service Feedback</CardTitle>
                <CardDescription>How was your experience today?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 pb-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRate(star)}
                      className={`transition-all transform hover:scale-125 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                    >
                      <Star className="w-10 h-10" />
                    </button>
                  ))}
                </div>
                <div className="w-full flex gap-2">
                  <Input placeholder="Leave a comment (optional)" className="flex-1" />
                  <Button variant="secondary" size="icon">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium">Enter your vehicle plate above to track status</p>
          </div>
        )}
      </div>

      <RoleSwitcher />
    </div>
  );
}