"use client"

// src/app/customer/page.tsx
// Wired:
//   Task 7 — Vehicle tracker: GET /api/vehicles?plate=
//   Task 8 — History tab:     GET /api/transactions?limit=20
//   Task 9 — Loyalty points:  GET /api/auth/me + GET /api/customers/[id]
//
// MOCK REMOVALS:
//   DELETE: import { MOCK_TRANSACTIONS } from '@/lib/mock-data'
//   DELETE: hardcoded "1,240 Pts" and "Gold Member"
//   DELETE: handleSearch() setTimeout mock
//   SERVICE_BUNDLES / SERVICES may still come from mock-data for the shop tab — leave those imports
//
// DO NOT touch: src/components/ui/**, src/lib/supabase/**, src/app/api/**, middleware.ts

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Car,
  MapPin,
  User,
  Star,
  History,
  ShoppingBag,
  RefreshCw,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthCtx {
  userId: string
  customerId?: string   // populated if role === 'customer'
  email: string
  role: string
  branch_id: string
}

interface Bay {
  id: string
  name: string
}

interface AttendantRef {
  id: string
  name: string
}

interface Vehicle {
  id: string
  plate: string
  status: "Queue" | "In-Bay" | "Ready" | "Completed"
  progress: number
  services: string[]
  arrival_time: string
  bay: Bay | null
  attendant: AttendantRef | null
}

interface Transaction {
  id: string
  date: string
  plate: string
  services: string[]
  amount: number | string
  status: "Paid" | "Pending"
  payment_method: string
  mpesa_receipt: string | null
}

interface Customer {
  id: string
  name: string
  loyalty_points: number
  subscription_tier: string
  total_spent: number
  total_visits: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function txStatusClass(status: string) {
  return status === "Paid"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700"
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

// ─── Vehicle status step indicators ───────────────────────────────────────────
const STATUS_STEPS = ["Queue", "In-Bay", "Ready"]

function stepIndex(status: string) {
  return STATUS_STEPS.indexOf(status)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerPage() {
  const { toast } = useToast()

  // ── Auth context ─────────────────────────────────────────────────────────────
  const [ctx, setCtx] = useState<AuthCtx | null>(null)

  // ── Task 9: Customer / loyalty data ──────────────────────────────────────────
  const [customer, setCustomer] = useState<Customer | null>(null)

  // ── Task 7: Vehicle tracker ───────────────────────────────────────────────────
  const [searchPlate, setSearchPlate] = useState("")
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [trackLoading, setTrackLoading] = useState(false)

  // ── Task 8: Transaction history ───────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txLoading, setTxLoading] = useState(true)

  // ── Boot: session + loyalty + history ────────────────────────────────────────
  useEffect(() => {
    // 1. Get auth context
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((me: AuthCtx) => {
        setCtx(me)

        // Task 9: Fetch customer loyalty record
        // spec: if me.role === 'customer' && me.customerId, fetch /api/customers/[id]
        // NOTE: GET /api/customers needs ?user_id= filter if customerId is not
        // directly on me — add one-line filter: query.eq("user_id", user_id)
        if (me.role === "customer" && me.customerId) {
          fetch(`/api/customers/${me.customerId}`, { credentials: "include" })
            .then((r) => r.json())
            .then((c: Customer) => setCustomer(c))
            .catch(() => {}) // non-fatal — show zeros if unavailable
        } else if (me.role === "customer" && me.userId) {
          // Fallback: fetch by user_id query param if customerId not on me
          fetch(`/api/customers?user_id=${me.userId}`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
              const c = Array.isArray(data) ? data[0] : data
              if (c) setCustomer(c)
            })
            .catch(() => {})
        }
      })
      .catch(() => {})

    // Task 8: Fetch transaction history
    fetch("/api/transactions?limit=20", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.data ?? [])
        setTxLoading(false)
      })
      .catch(() => setTxLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Task 7: Plate search ──────────────────────────────────────────────────────
  // spec: REPLACE handleSearch() setTimeout mock with real GET /api/vehicles?plate=
  async function handleSearch(plateParam?: string) {
    const plate = (plateParam ?? searchPlate).toUpperCase().trim()
    if (!plate) return

    setTrackLoading(true)
    setVehicle(null)

    try {
      const res = await fetch(
        `/api/vehicles?plate=${encodeURIComponent(plate)}`,
        { credentials: "include" }
      )
      if (!res.ok) {
        toast({
          title: "Search failed",
          description: `HTTP ${res.status}`,
          variant: "destructive",
        })
        return
      }
      const data = await res.json()
      // API returns array — find active (non-Completed) match
      const match: Vehicle | null = Array.isArray(data)
        ? data.find(
            (v: Vehicle) =>
              v.plate === plate && v.status !== "Completed"
          ) ?? null
        : null

      setVehicle(match)
      if (!match) {
        toast({
          title: "Not found",
          description: "No active vehicle with that plate number",
        })
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" })
    } finally {
      setTrackLoading(false)
    }
  }

  // ── Loyalty progress (spec: loyalty_points / 2000 * 100) ─────────────────────
  const loyaltyPoints = customer?.loyalty_points ?? 0
  const loyaltyProgress = Math.min(100, (loyaltyPoints / 2000) * 100)

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      {/* ─── Loyalty Header Card ─── */}
      <Card className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 text-white border-0">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Welcome back</p>
              <p className="font-semibold text-lg truncate">
                {customer?.name ?? ctx?.email ?? "Customer"}
              </p>
            </div>
            <Star className="w-6 h-6 text-amber-400" />
          </div>

          {/* spec Task 9: real loyalty_points */}
          <div>
            <div className="flex items-baseline gap-2">
              {/* BEFORE: '1,240 Pts' */}
              {/* AFTER:  `${customer?.loyalty_points ?? 0} Pts` */}
              <span className="text-3xl font-bold">
                {loyaltyPoints.toLocaleString("en-KE")}
              </span>
              <span className="text-slate-400 text-sm">Pts</span>
            </div>
            {/* BEFORE: 'Gold Member' */}
            {/* AFTER:  `Tier: ${customer?.subscription_tier ?? 'None'}` */}
            <p className="text-slate-400 text-sm capitalize">
              Tier: {customer?.subscription_tier ?? "None"}
            </p>
          </div>

          {/* Progress bar — spec: loyalty_points / 2000 * 100 */}
          <div className="space-y-1">
            <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${loyaltyProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-right">
              {loyaltyPoints} / 2,000 pts to next tier
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="services">
        <TabsList className="w-full">
          <TabsTrigger value="services" className="flex-1 gap-1.5">
            <Car className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 gap-1.5">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex-1 gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            Shop
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════
            Task 7 — Services / Vehicle Tracker tab
            ══════════════════════════════════════════════ */}
        <TabsContent value="services" className="mt-4 space-y-4">
          <Card className="rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Track Your Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Plate search */}
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. KDG 123A"
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="font-mono uppercase"
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={trackLoading || !searchPlate.trim()}
                >
                  {trackLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Vehicle result */}
              {vehicle && (
                <div className="space-y-4 pt-2">
                  {/* Status steps */}
                  <div className="flex items-center gap-0">
                    {STATUS_STEPS.map((step, i) => {
                      const active = stepIndex(vehicle.status) >= i
                      const current = vehicle.status === step
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                active
                                  ? current
                                    ? "bg-blue-500 text-white ring-2 ring-blue-200"
                                    : "bg-emerald-500 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {i + 1}
                            </div>
                            <span className={`text-xs ${active ? "font-medium" : "text-muted-foreground"}`}>
                              {step}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div
                              className={`h-0.5 w-full mb-5 transition-colors ${
                                stepIndex(vehicle.status) > i
                                  ? "bg-emerald-400"
                                  : "bg-slate-100"
                              }`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Vehicle details */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-lg">{vehicle.plate}</span>
                      <Badge
                        className={
                          vehicle.status === "Ready"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {/* spec: vehicle.status === 'Ready' ? 'Ready!' : `${vehicle.progress}% complete` */}
                        {vehicle.status === "Ready"
                          ? "Ready!"
                          : `${vehicle.progress ?? 0}% complete`}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          vehicle.status === "Ready"
                            ? "bg-emerald-400"
                            : "bg-blue-400"
                        }`}
                        style={{
                          width:
                            vehicle.status === "Ready"
                              ? "100%"
                              : `${vehicle.progress ?? 0}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {/* spec: vehicle.location -> vehicle.bay?.name ?? 'Assigned' */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {/* BEFORE: vehicle.location */}
                        {/* AFTER:  vehicle.bay?.name ?? 'Assigned' */}
                        {vehicle.bay?.name ?? "Assigned"}
                      </div>
                      {/* spec: vehicle.attendant -> vehicle.attendant?.name ?? 'Assigned' */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        {/* BEFORE: vehicle.attendant */}
                        {/* AFTER:  vehicle.attendant?.name ?? 'Assigned' */}
                        {vehicle.attendant?.name ?? "Assigned"}
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Services: </span>
                      {/* spec: vehicle.services — same structure, no change */}
                      {Array.isArray(vehicle.services)
                        ? vehicle.services.join(", ")
                        : vehicle.services}
                    </div>

                    {/* spec: vehicle.status === 'Ready' (not 'Completed') = customer can collect */}
                    {vehicle.status === "Ready" && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800 font-medium text-center">
                        🎉 Your vehicle is ready for collection!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════
            Task 8 — History tab
            ══════════════════════════════════════════════ */}
        <TabsContent value="history" className="mt-4">
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Wash History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {txLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No transaction history yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Plate</TableHead>
                      <TableHead>Services</TableHead>
                      {/* spec: tx.receipt -> tx.mpesa_receipt ?? 'CASH' */}
                      <TableHead>Receipt</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* BEFORE: MOCK_TRANSACTIONS.map((tx) => ( */}
                    {/* AFTER:  transactions.map((tx) => ( */}
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDate(tx.date)}
                        </TableCell>
                        {/* tx.plate — same field name */}
                        <TableCell className="font-mono text-sm font-medium">
                          {tx.plate}
                        </TableCell>
                        <TableCell className="text-sm max-w-[140px]">
                          <span className="line-clamp-1">
                            {Array.isArray(tx.services)
                              ? tx.services.join(", ")
                              : tx.services}
                          </span>
                        </TableCell>
                        {/* spec: tx.receipt -> tx.mpesa_receipt ?? 'CASH' */}
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {tx.mpesa_receipt ?? "CASH"}
                        </TableCell>
                        {/* tx.amount — same field name */}
                        <TableCell className="text-right text-sm font-medium">
                          KSh {Number(tx.amount).toLocaleString("en-KE")}
                        </TableCell>
                        <TableCell>
                          {/* tx.status — same field name: 'Paid' | 'Pending' */}
                          <Badge
                            className={`${txStatusClass(tx.status)} text-xs`}
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════
            Shop tab — SERVICE_BUNDLES / SERVICES still
            come from mock-data (no backend route yet).
            Do NOT remove those mock imports.
            ══════════════════════════════════════════════ */}
        <TabsContent value="shop" className="mt-4">
          <Card className="rounded-3xl">
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
              Service bundles and shop items are loaded from the services
              catalogue. Wire this tab when the shop API route is available
              in Phase 4.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
