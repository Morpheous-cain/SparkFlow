"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { SERVICES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Smartphone, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AgentPortal() {
  const { toast } = useToast();
  const [plate, setPlate] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!plate) {
      toast({ title: "Plate Number Required", description: "Please enter the vehicle plate number.", variant: "destructive" });
      return;
    }
    if (selectedServices.length === 0) {
      toast({ title: "No Services Selected", description: "Please select at least one service.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    toast({
      title: "Vehicle Checked In",
      description: `Vehicle ${plate} has been added to the queue.`,
    });
    
    setPlate("");
    setSelectedServices([]);
    setIsSubmitting(false);
  };

  const totalAmount = SERVICES
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen pb-24 p-4 max-w-3xl mx-auto flex flex-col gap-6">
      <header className="flex items-center gap-4 py-4">
        <div className="p-2 bg-primary rounded-lg text-white">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Agent Check-in</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Grace Mutua</p>
        </div>
      </header>

      <Card className="shadow-lg border-2">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Enter the license plate to start a new job</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Plate Number</label>
              <Input 
                placeholder="e.g. KDC 123A" 
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="text-2xl h-14 font-mono font-bold tracking-widest text-center border-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Services</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{service.name}</span>
                      <span className="text-xs text-muted-foreground">KES {service.price.toLocaleString()} • {service.duration}m</span>
                    </div>
                    {selectedServices.includes(service.id) && (
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-24 w-full animate-in slide-in-from-bottom-2">
        <Card className="shadow-2xl border-primary/20 bg-primary/5 backdrop-blur-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-primary uppercase">Total Estimation</span>
              <span className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</span>
            </div>
            <Button 
              size="lg" 
              className="px-8 shadow-lg shadow-primary/20" 
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Processing..." : "Complete Check-in"}
              {!isSubmitting && <Plus className="ml-2 w-4 h-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      <RoleSwitcher />
    </div>
  );
}