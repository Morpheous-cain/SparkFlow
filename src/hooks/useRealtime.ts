import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type Bay = {
  id: string
  name: string
  status: 'Available' | 'Occupied' | 'Under Maintenance'
  current_vehicle_plate: string | null
  branch_id: string
  tenant_id: string
  updated_at: string
}

// useBays — subscribes to live bay updates via Supabase Realtime.
// Replaces the Firebase onSnapshot hook.
// Usage: const { bays, loading } = useBays(branchId)
export function useBays(branchId: string) {
  const [bays, setBays] = useState<Bay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!branchId) return

    const supabase = createClient()

    // Initial fetch
    supabase
      .from('bays')
      .select('*')
      .eq('branch_id', branchId)
      .order('name')
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setBays(data ?? [])
        }
        setLoading(false)
      })

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`bays:${branchId}`)
      .on(
        'postgres_changes',
        {
          event:  '*',   // INSERT, UPDATE, DELETE
          schema: 'public',
          table:  'bays',
          filter: `branch_id=eq.${branchId}`,
        },
        (payload: RealtimePostgresChangesPayload<Bay>) => {
          setBays(prev => {
            if (payload.eventType === 'INSERT') {
              return [...prev, payload.new as Bay]
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map(b => b.id === (payload.new as Bay).id ? payload.new as Bay : b)
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter(b => b.id !== (payload.old as Bay).id)
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [branchId])

  return { bays, loading, error }
}


// useVehiclesLive — live vehicle queue for the manager dashboard and customer tracker.
export type VehicleLive = {
  id: string
  plate: string
  status: 'Queue' | 'In-Bay' | 'Ready' | 'Completed'
  progress: number
  services: string[]
  total_amount: number
  arrival_time: string
  bay_id: string | null
  attendant_id: string | null
  customer_id: string | null
}

export function useVehiclesLive(branchId: string) {
  const [vehicles, setVehicles] = useState<VehicleLive[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!branchId) return

    const supabase = createClient()

    supabase
      .from('vehicles_live')
      .select('*')
      .eq('branch_id', branchId)
      .neq('status', 'Completed')
      .order('arrival_time')
      .then(({ data }) => {
        setVehicles(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`vehicles:${branchId}`)
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'vehicles_live',
          filter: `branch_id=eq.${branchId}`,
        },
        (payload: RealtimePostgresChangesPayload<VehicleLive>) => {
          setVehicles(prev => {
            if (payload.eventType === 'INSERT') {
              return [...prev, payload.new as VehicleLive]
            }
            if (payload.eventType === 'UPDATE') {
              const updated = payload.new as VehicleLive
              // Remove completed vehicles from the live list
              if (updated.status === 'Completed') {
                return prev.filter(v => v.id !== updated.id)
              }
              return prev.map(v => v.id === updated.id ? updated : v)
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter(v => v.id !== (payload.old as VehicleLive).id)
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [branchId])

  return { vehicles, loading }
}
