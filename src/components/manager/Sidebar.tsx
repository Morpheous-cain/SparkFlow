'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import {
  LayoutDashboard,
  Warehouse,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Waves,
  LogOut,
  ShieldCheck,
  Wrench,
  Banknote,
  Send,
  Moon,
  Sun,
  Truck,
  Crown,
  PieChart,
  Building2,
  ClipboardList,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/manager',                icon: LayoutDashboard, exact: true  },
  { label: 'Bays',          href: '/manager/bays',           icon: Warehouse,       exact: false },
  { label: 'Staff',         href: '/manager/staff',          icon: Users,           exact: false },
  { label: 'Inventory',     href: '/manager/inventory',      icon: Package,         exact: false },
  { label: 'Sales',         href: '/manager/sales',          icon: CreditCard,      exact: false },
  { label: 'Services',      href: '/manager/services',       icon: Wrench,          exact: false },
  { label: 'Payroll',       href: '/manager/payroll',        icon: Banknote,        exact: false },
  { label: 'Analytics',     href: '/manager/analytics',      icon: BarChart3,       exact: false },
  { label: 'Marketing',     href: '/manager/marketing',      icon: Send,            exact: false },
  { label: 'Logistics',     href: '/manager/logistics',      icon: Truck,           exact: false },
  { label: 'Subscriptions', href: '/manager/subscriptions',  icon: Crown,           exact: false },
  { label: 'Accounts',      href: '/manager/accounts',       icon: PieChart,        exact: false },
  { label: 'Branches',      href: '/manager/branches',       icon: Building2,       exact: false },
  { label: 'Tasks',         href: '/manager/tasks',          icon: ClipboardList,   exact: false }
  
] as const

const BOTTOM_ITEMS = [
  {
    label: 'Settings',
    href:  '/manager/settings',
    icon:  Settings,
  },
] as const

// ── Props ──────────────────────────────────────────────────────────────────────
interface SidebarProps {
  /** Called when sign-out is clicked — wire to useAuth().signOut */
  onSignOut?: () => void
  /** Manager email for display */
  userEmail?: string
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Sidebar({ onSignOut, userEmail }: SidebarProps) {
  const pathname              = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggle } = useTheme()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const displayName = userEmail?.split('@')[0] ?? 'Manager'

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          // Base
          'relative flex flex-col h-screen bg-[#0F1F3D] transition-all duration-300 ease-in-out shrink-0',
          // Width
          collapsed ? 'w-[64px]' : 'w-[200px]',
          // Subtle right border
          'border-r border-white/5'
        )}
      >
        {/* ── Top: Logo ──────────────────────────────────────────────────── */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-white/5',
          collapsed && 'justify-center px-0'
        )}>
          <div className="shrink-0 p-2 bg-[#00A8CC] rounded-xl shadow-lg shadow-cyan-500/20">
            <Waves className="size-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-black text-sm uppercase tracking-[0.12em] leading-none">
                SparkFlow
              </p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5">
                Manager
              </p>
            </div>
          )}
        </div>

        {/* ── Main nav ───────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {collapsed ? (
            // Collapsed: single icon column
            <div className="space-y-0.5">
              {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <NavItem
                    key={href}
                    label={label}
                    href={href}
                    icon={Icon}
                    active={active}
                    collapsed={collapsed}
                  />
                )
              })}
            </div>
          ) : (
            // Expanded: 2-column icon grid — all 15 links visible without scrolling
            <div className="grid grid-cols-2 gap-1">
              {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl transition-all duration-150 group',
                      active
                        ? 'bg-[#00A8CC]/20 text-[#00A8CC]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className={cn(
                      'size-4 shrink-0 transition-colors',
                      active ? 'text-[#00A8CC]' : 'text-white/40 group-hover:text-white'
                    )} />
                    <span className={cn(
                      'text-[8px] font-black uppercase tracking-wide leading-none text-center',
                      active ? 'text-[#00A8CC]' : 'text-white/40 group-hover:text-white'
                    )}>
                      {label}
                    </span>
                    {active && (
                      <div className="absolute left-0 w-0.5 h-6 bg-[#00A8CC] rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        {/* ── Bottom section ─────────────────────────────────────────────── */}
        <div className="px-2 pb-2 space-y-0.5 border-t border-white/5 pt-3">
          {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => (
            <NavItem
              key={href}
              label={label}
              href={href}
              icon={Icon}
              active={pathname.startsWith(href)}
              collapsed={collapsed}
            />
          ))}

          {/* User row */}
          {!collapsed && (
            <div className="mt-2 mb-1 px-2 py-2.5 rounded-2xl bg-white/5 flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-[#00A8CC]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-3.5 text-[#00A8CC]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-black uppercase tracking-widest truncate leading-none">
                  {displayName}
                </p>
                <p className="text-white/30 text-[8px] font-bold uppercase tracking-wider mt-0.5">
                  Manager
                </p>
              </div>
            </div>
          )}

          {/* Dark mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggle}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10',
                  'transition-colors duration-150',
                  collapsed && 'justify-center px-0'
                )}
              >
                {theme === 'dark'
                  ? <Sun className="size-4 shrink-0" />
                  : <Moon className="size-4 shrink-0" />
                }
                {!collapsed && (
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Sign out */}
          {onSignOut && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSignOut}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'text-white/40 hover:text-red-400 hover:bg-red-500/10',
                    'transition-colors duration-150 group',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <LogOut className="size-4 shrink-0 transition-colors" />
                  {!collapsed && (
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Sign Out
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                  Sign Out
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>

        {/* ── Collapse toggle ────────────────────────────────────────────── */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={cn(
            'absolute -right-3 top-[72px]',
            'size-6 rounded-full bg-[#0F1F3D] border border-white/10',
            'flex items-center justify-center',
            'text-white/50 hover:text-white hover:border-white/30',
            'transition-colors duration-150 shadow-md',
            'z-10'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="size-3" />
            : <ChevronLeft  className="size-3" />}
        </button>
      </aside>
    </TooltipProvider>
  )
}

// ── NavItem sub-component ──────────────────────────────────────────────────────
interface NavItemProps {
  label:     string
  href:      string
  icon:      React.ElementType
  active:    boolean
  collapsed: boolean
}

function NavItem({ label, href, icon: Icon, active, collapsed }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
            collapsed && 'justify-center px-0',
            active
              ? 'bg-[#00A8CC]/15 text-[#00A8CC]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          )}
        >
          {/* Active indicator bar */}
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00A8CC] rounded-full" />
          )}

          <Icon
            className={cn(
              'size-4 shrink-0 transition-colors',
              active ? 'text-[#00A8CC]' : 'text-white/40 group-hover:text-white'
            )}
          />

          {!collapsed && (
            <span
              className={cn(
                'text-[10px] font-black uppercase tracking-[0.12em] leading-none transition-colors',
                active ? 'text-[#00A8CC]' : 'text-white/50 group-hover:text-white'
              )}
            >
              {label}
            </span>
          )}
        </Link>
      </TooltipTrigger>

      {/* Only show tooltip when collapsed */}
      {collapsed && (
        <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700 text-[10px] font-black uppercase tracking-widest">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  )
}

export default Sidebar