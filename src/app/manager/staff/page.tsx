"use client"

// src/app/manager/staff/page.tsx
// Wired: GET /api/staff, POST /api/staff, PATCH /api/staff/[id], GET /api/auth/me
// DO NOT touch: src/components/ui/**, src/lib/supabase/**, src/app/api/**, middleware.ts

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, RefreshCw } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffMember {
  id: string
  name: string
  role: string
  email: string
  attendance_status: string | null
  base_salary: number | null
  branch_id: string
  created_at: string
}

interface AuthCtx {
  branch_id: string
  tenant_id: string
  userId: string
  email: string
  role: string
}

interface AddStaffForm {
  name: string
  role: string
  email: string
  password: string
  base_salary: string
}

const EMPTY_FORM: AddStaffForm = {
  name: "",
  role: "attendant",
  email: "",
  password: "",
  base_salary: "",
}

const ATTENDANCE_OPTIONS = ["present", "absent", "on_leave"]

const ROLE_OPTIONS = ["manager", "agent", "attendant"]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function attendanceBadgeClass(status: string | null) {
  switch (status) {
    case "present":
      return "bg-emerald-100 text-emerald-700"
    case "absent":
      return "bg-red-100 text-red-700"
    case "on_leave":
      return "bg-amber-100 text-amber-700"
    default:
      return "bg-slate-100 text-slate-500"
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const { toast } = useToast()

  // Auth context — needed for branch_id when creating staff
  const [ctx, setCtx] = useState<AuthCtx | null>(null)

  // Staff list state
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add staff dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<AddStaffForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  // Attendance update tracking (optimistic UI while PATCH is in flight)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // ── Fetch auth context once on mount ────────────────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((me: AuthCtx) => setCtx(me))
      .catch(() =>
        toast({
          title: "Auth error",
          description: "Could not load session",
          variant: "destructive",
        })
      )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch staff list ─────────────────────────────────────────────────────────
  async function fetchStaff() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/staff", { credentials: "include" })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error ?? `HTTP ${res.status}`)
        return
      }
      const data: StaffMember[] = await res.json()
      setStaff(data)
    } catch {
      setError("Network error — could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add Staff ────────────────────────────────────────────────────────────────
  async function handleAddStaff() {
    if (!ctx?.branch_id) {
      toast({
        title: "Not ready",
        description: "Session context not loaded yet",
        variant: "destructive",
      })
      return
    }

    if (!form.name || !form.email || !form.password) {
      toast({
        title: "Missing fields",
        description: "Name, email, and password are required",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          email: form.email,
          password: form.password,
          branch_id: ctx.branch_id,
          base_salary: form.base_salary ? Number(form.base_salary) : 0,
        }),
      })

      if (res.ok) {
        toast({ title: "Staff member created" })
        setForm(EMPTY_FORM)
        setDialogOpen(false)
        fetchStaff()
      } else {
        const err = await res.json()
        toast({
          title: "Error creating staff",
          description: err.error ?? "Unknown error",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Network error",
        description: "Request failed",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // ── Attendance Toggle ─────────────────────────────────────────────────────────
  async function handleAttendance(staffId: string, status: string) {
    setUpdatingId(staffId)
    try {
      const res = await fetch(`/api/staff/${staffId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance_status: status }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast({
          title: "Could not update attendance",
          description: err.error ?? `HTTP ${res.status}`,
          variant: "destructive",
        })
        return
      }
      // Optimistically update local state — avoids a full re-fetch for a simple toggle
      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, attendance_status: status } : s
        )
      )
    } catch {
      toast({
        title: "Network error",
        description: "Attendance update failed",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 w-36 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-36 bg-slate-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-6">
          <p className="text-red-700 font-bold mb-3">{error}</p>
          <Button variant="outline" onClick={fetchStaff}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-sm text-muted-foreground">
            {staff.length} member{staff.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ─── Add Staff Dialog ─── */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Jane Mwangi"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@sparkflow.co.ke"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="salary">Base Salary (KSh)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="30000"
                  value={form.base_salary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, base_salary: e.target.value }))
                  }
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setForm(EMPTY_FORM)
                    setDialogOpen(false)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddStaff}
                  disabled={submitting}
                >
                  {submitting ? "Creating…" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ─── Staff Grid ─── */}
      {staff.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No staff members found. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <Card key={member.id} className="rounded-3xl">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </p>
                  </div>
                  <Badge
                    className={`capitalize text-xs ${attendanceBadgeClass(
                      member.attendance_status
                    )}`}
                  >
                    {member.attendance_status ?? "Unknown"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground truncate">
                  {member.email}
                </p>

                {member.base_salary != null && (
                  <p className="text-sm">
                    KSh{" "}
                    {Number(member.base_salary).toLocaleString("en-KE")} / mo
                  </p>
                )}

                {/* Attendance selector */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Attendance
                  </Label>
                  <Select
                    value={member.attendance_status ?? ""}
                    onValueChange={(v) => handleAttendance(member.id, v)}
                    disabled={updatingId === member.id}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ATTENDANCE_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt}
                          value={opt}
                          className="capitalize text-sm"
                        >
                          {opt.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
