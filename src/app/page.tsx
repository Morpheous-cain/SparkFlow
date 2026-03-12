import Link from "next/link";
import { LayoutDashboard, Users, Smartphone, Car, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const views = [
    { 
      title: "Agent Portal", 
      desc: "Check-in vehicles and select services.", 
      href: "/agent", 
      icon: Smartphone,
      color: "bg-blue-500"
    },
    { 
      title: "Attendant PWA", 
      desc: "Manage jobs and request payments.", 
      href: "/attendant", 
      icon: Car,
      color: "bg-indigo-600"
    },
    { 
      title: "Manager Dashboard", 
      desc: "Real-time analytics and insights.", 
      href: "/manager", 
      icon: LayoutDashboard,
      color: "bg-cyan-600"
    },
    { 
      title: "Customer Portal", 
      desc: "Track service status and feedback.", 
      href: "/customer", 
      icon: Users,
      color: "bg-teal-500"
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <Waves className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground mb-4">
          SparkFlow <span className="text-primary">Ops</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Intelligent Car Wash Management ERP with real-time syncing and AI insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {views.map((view, i) => {
          const Icon = view.icon;
          return (
            <Link key={view.href} href={view.href} className="group transition-all hover:-translate-y-1 block h-full">
              <Card className="h-full border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer bg-white">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${view.color} flex items-center justify-center mb-4 shadow-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{view.title}</CardTitle>
                  <CardDescription className="text-sm">{view.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full py-2.5 px-4 rounded-xl border border-input bg-background text-sm font-semibold text-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                    Open Portal
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 text-muted-foreground text-sm font-medium">
        Kenya's Leading Car Wash ERP • Powered by Daraja API & Twilio
      </div>
    </div>
  );
}
