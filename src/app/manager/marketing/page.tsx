
"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Send, 
  MessageSquare, 
  Users, 
  Zap, 
  Calendar, 
  BarChart3, 
  Smartphone,
  Hash,
  Sparkles,
  ArrowRight,
  Clock,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const CAMPAIGNS = [
  { id: '1', title: 'Madaraka Day Offer', channel: 'SMS', recipients: 1240, status: 'Sent', date: '2024-06-01' },
  { id: '2', title: 'Rainy Season Flash', channel: 'WhatsApp', recipients: 850, status: 'Sent', date: '2024-05-15' },
  { id: '3', title: 'Subscription Upsell', channel: 'Push', recipients: 420, status: 'Scheduled', date: '2024-06-15' },
];

export default function MarketingPage() {
  const { toast } = useToast();
  const [smsBalance, setSmsBalance] = useState(2450);
  const [message, setMessage] = useState("");
<<<<<<< HEAD
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);

  useEffect(() => {
    fetch('/api/customers', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setCustomerCount(Array.isArray(data) ? data.length : null))
      .catch(() => {});
  }, []);
=======
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
  
  const handleBroadcast = () => {
    if (!message) return;
    toast({
      title: "Broadcast Initiated",
      description: "Campaign is being queued for delivery across selected channels.",
    });
    setMessage("");
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Marketing Broadcasts</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Direct Communication & Campaign Engine</p>
        </div>
        <Card className="border-none shadow-sm bg-primary text-white px-6 py-3 flex items-center gap-4 rounded-2xl">
           <Hash className="size-5 opacity-50" />
           <div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-70 block leading-none mb-1">SMS Balance</span>
              <span className="text-xl font-black">{smsBalance.toLocaleString()} Units</span>
           </div>
           <Button variant="secondary" className="h-8 rounded-xl font-black text-[8px] uppercase tracking-widest bg-white text-primary">Recharge</Button>
        </Card>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Automated Feedback Trigger Banner */}
          <Card className="border-none shadow-xl rounded-[2rem] bg-emerald-600 text-white p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-white/10 rounded-full blur-2xl" />
             <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Star className="size-6 fill-current" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black uppercase leading-none">Automated Feedback SMS</h3>
                      <p className="text-emerald-100 text-[9px] font-bold uppercase mt-1">Currently Active for all branches</p>
                   </div>
                </div>
                <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase px-3 py-1">ENABLED</Badge>
             </div>
          </Card>

          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 bg-slate-900 text-white">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-2xl">
                    <Send className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black uppercase">New Campaign</CardTitle>
                    <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Multi-channel delivery</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Title</label>
                  <Input placeholder="E.g. Father's Day Special" className="h-12 rounded-xl font-bold border-2 uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Channel</label>
                  <Select defaultValue="sms">
                    <SelectTrigger className="h-12 rounded-xl border-2 font-bold uppercase">
                      <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">Bulk SMS (Units: 1.0)</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                      <SelectItem value="push">Mobile App Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audience Segment</label>
                <div className="flex gap-2">
<<<<<<< HEAD
                   {[
                     { label: 'All Customers', count: customerCount },
                     { label: 'Subscribers Only', count: null },
                     { label: 'Inactive (30+ days)', count: null },
                   ].map(seg => (
                     <Button key={seg.label} variant="outline" className="h-10 rounded-xl font-black uppercase text-[8px] tracking-widest flex-1 border-2">
                        {seg.label}{seg.count !== null ? ` (${seg.count})` : ''}
=======
                   {['All Customers', 'Subscribers Only', 'Inactive (30+ days)'].map(seg => (
                     <Button key={seg} variant="outline" className="h-10 rounded-xl font-black uppercase text-[8px] tracking-widest flex-1 border-2">
                        {seg}
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
                     </Button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message Content</label>
                   <span className="text-[9px] font-black text-slate-400">{message.length}/160 (1 Unit)</span>
                </div>
                <Textarea 
                  placeholder="Type your marketing message here..." 
                  className="min-h-[150px] rounded-2xl border-2 font-bold p-4 uppercase"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                 <Button variant="outline" className="h-14 rounded-2xl flex-1 font-black uppercase text-[10px] tracking-widest border-2">
                    <Calendar className="size-4 mr-2" /> Schedule
                 </Button>
                 <Button className="h-14 rounded-2xl flex-[2] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20" onClick={handleBroadcast}>
                    <Send className="size-4 mr-2" /> Send Broadcast Now
                 </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
             <h3 className="text-xl font-black text-slate-900 uppercase">Campaign History</h3>
             <div className="space-y-3">
                {CAMPAIGNS.map(camp => (
                  <Card key={camp.id} className="border-none shadow-sm rounded-2xl bg-white p-5 group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            {camp.channel === 'SMS' ? <Hash className="size-5" /> : camp.channel === 'WhatsApp' ? <MessageSquare className="size-5" /> : <Smartphone className="size-5" />}
                          </div>
                          <div>
                             <h4 className="font-black uppercase text-xs">{camp.title}</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0 border-none">{camp.channel}</Badge>
                                <span className="text-[9px] font-black text-slate-400 uppercase">{camp.date} • {camp.recipients} Recipients</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <Badge className={cn("font-black text-[8px] uppercase", camp.status === 'Sent' ? 'bg-emerald-500' : 'bg-amber-500')}>{camp.status}</Badge>
                       </div>
                    </div>
                  </Card>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-indigo-600 text-white p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                 <header className="flex items-center gap-3">
                    <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                       <Sparkles className="size-6" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">AI Copywriter</h3>
                 </header>
                 <p className="text-xs font-bold text-indigo-100 leading-relaxed uppercase">Let SparkFlow AI generate high-conversion SMS copy based on current inventory or holidays.</p>
                 <Button className="w-full h-12 bg-white text-indigo-600 hover:bg-slate-50 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl">
                    Generate Smart Copy
                 </Button>
              </div>
           </Card>

           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
              <header className="mb-6">
                 <h3 className="text-lg font-black uppercase tracking-tight leading-none">Feedback Velocity</h3>
                 <p className="text-[9px] font-black text-slate-400 uppercase mt-2">Retention vs Direct SMS links</p>
              </header>
              <div className="space-y-6">
                 {[
                   { label: "SMS Link Clicks", val: 92, color: "bg-blue-500" },
                   { label: "WhatsApp Conversions", val: 45, color: "bg-emerald-500" },
                   { label: "App-less Ratings", val: 78, color: "bg-amber-500" }
                 ].map(stat => (
                   <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                         <span>{stat.label}</span>
                         <span>{stat.val}%</span>
                      </div>
                      <Progress value={stat.val} className={`h-2 ${stat.color} opacity-20`} />
                   </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-8 h-12 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest text-slate-400">
                 View Detailed Analytics <BarChart3 className="size-4 ml-2" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
