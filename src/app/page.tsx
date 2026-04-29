'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, UserCheck, Wrench, Car, ArrowRight, Zap } from 'lucide-react'

const ROLES = [
  {
    key: 'manager',
    label: 'Manager',
    description: 'Full operations control. Revenue, staff, payroll, analytics and reporting.',
    icon: LayoutDashboard,
    accent: '#00A8CC',
    accentDim: '#00A8CC15',
    tag: 'HQ COMMAND',
  },
  {
    key: 'agent',
    label: 'Agent',
    description: 'Customer check-in, vehicle intake and payment processing.',
    icon: UserCheck,
    accent: '#10B981',
    accentDim: '#10B98115',
    tag: 'FRONT DESK',
  },
  {
    key: 'attendant',
    label: 'Attendant',
    description: 'Job console, bay assignments and state machine controls.',
    icon: Wrench,
    accent: '#F59E0B',
    accentDim: '#F59E0B15',
    tag: 'BAY OPS',
  },
  {
    key: 'customer',
    label: 'Customer',
    description: 'Track your vehicle, view transaction history and loyalty points.',
    icon: Car,
    accent: '#8B5CF6',
    accentDim: '#8B5CF615',
    tag: 'SELF SERVICE',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const [hovering, setHovering] = useState<string | null>(null)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060E1E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.025,
        backgroundImage: 'linear-gradient(#00A8CC 1px, transparent 1px), linear-gradient(90deg, #00A8CC 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, #00A8CC20 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          backgroundColor: '#00A8CC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px #00A8CC44',
        }}>
          <Zap size={24} color="#fff" fill="#fff" />
        </div>
        <span style={{
          color: '#fff', fontSize: '22px', fontWeight: 900,
          letterSpacing: '6px', textTransform: 'uppercase',
        }}>
          SparkFlow
        </span>
      </div>

      {/* Subtitle */}
      <p style={{
        color: '#7A8FB0', fontSize: '10px', fontWeight: 700,
        letterSpacing: '4px', textTransform: 'uppercase',
        marginBottom: '64px',
        textAlign: 'center',
      }}>
        Carwash Management ERP &nbsp;·&nbsp; Select Your Portal
      </p>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        width: '100%',
        maxWidth: '940px',
      }}>
        {ROLES.map((role) => {
          const Icon = role.icon
          const isHovered = hovering === role.key
          return (
            <button
              key={role.key}
              onMouseEnter={() => setHovering(role.key)}
              onMouseLeave={() => setHovering(null)}
              onClick={() => router.push(`/signin?role=${role.key}`)}
              style={{
                background: isHovered ? '#0F1F3D' : '#0A1628',
                border: `1px solid ${isHovered ? role.accent + '55' : '#1A2F55'}`,
                borderRadius: '20px',
                padding: '28px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 20px 48px ${role.accent}20` : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                backgroundColor: isHovered ? role.accent : 'transparent',
                transition: 'background-color 0.2s ease',
                borderRadius: '20px 20px 0 0',
              }} />

              {/* Tag */}
              <div style={{
                display: 'inline-block',
                backgroundColor: role.accentDim,
                border: `1px solid ${role.accent}25`,
                borderRadius: '6px',
                padding: '3px 10px',
                marginBottom: '18px',
              }}>
                <span style={{
                  color: role.accent, fontSize: '8px', fontWeight: 800,
                  letterSpacing: '3px', textTransform: 'uppercase',
                }}>
                  {role.tag}
                </span>
              </div>

              {/* Icon */}
              <div style={{
                width: '46px', height: '46px', borderRadius: '13px',
                backgroundColor: role.accentDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                transition: 'transform 0.2s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}>
                <Icon size={20} color={role.accent} />
              </div>

              {/* Label */}
              <div style={{
                color: '#fff', fontSize: '17px', fontWeight: 900,
                letterSpacing: '2px', textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {role.label}
              </div>

              {/* Description */}
              <div style={{
                color: '#7A8FB0', fontSize: '11px', fontWeight: 500,
                lineHeight: '1.65', marginBottom: '22px',
              }}>
                {role.description}
              </div>

              {/* CTA arrow */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: isHovered ? role.accent : '#2A3F65',
                fontSize: '9px', fontWeight: 800,
                letterSpacing: '2px', textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}>
                Sign In <ArrowRight size={11} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <p style={{
        color: '#1A2F55', fontSize: '10px', fontWeight: 600,
        letterSpacing: '2px', marginTop: '56px',
        textTransform: 'uppercase',
      }}>
        Immersicloud Consulting · SparkFlow v4 · {new Date().getFullYear()}
      </p>
    </div>
  )
}