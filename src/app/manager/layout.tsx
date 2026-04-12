// src/app/manager/layout.tsx
// SERVER COMPONENT — do not add 'use client' here.
// The sidebar auth logic lives in ManagerShell (client component).
// This pattern is required by Next.js App Router so the layout
// persists across sub-page navigations without unmounting.

import { ManagerShell } from '@/components/manager/ManagerShell'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>
}
