
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Smartphone, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ERP Settings</h1>
          <p className="text-slate-500">Configure system-wide parameters and branding</p>
        </div>
        <Button className="gap-2 rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">
          <Save className="size-4" /> Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Globe className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Organization Branding</CardTitle>
                <CardDescription>System-wide branding and contact info</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue="SparkFlow Ops" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input defaultValue="admin@sparkflow.com" className="h-12 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue="KES" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="EAT (UTC+3)" className="h-12 rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Bell className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription>Manage STK Push and SMS alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">M-Pesa STK Push</Label>
                <p className="text-xs text-slate-500">Auto-trigger payment on completion</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Customer SMS Alerts</Label>
                <p className="text-xs text-slate-500">Send "Ready for Pickup" texts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold">Staff Performance Digests</Label>
                <p className="text-xs text-slate-500">Weekly manager reports via email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
