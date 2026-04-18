<div align="center">

<br/>

<img src="https://img.shields.io/badge/⚡-SparkFlow-00A8CC?style=for-the-badge&labelColor=0A1628&color=00A8CC" height="40"/>

# SparkFlow ERP

### Carwash Management Platform — Built for Kenya, Scaled for Africa

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-sparkflow--sable.vercel.app-00A8CC?style=flat-square&logo=vercel&logoColor=white&labelColor=0F1F3D)](https://sparkflow-sable.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-0F1F3D?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-0F1F3D?style=flat-square&logo=supabase&logoColor=3ECF8E)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-0F1F3D?style=flat-square&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-0F1F3D?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Version](https://img.shields.io/badge/Version-4.0-00A8CC?style=flat-square&labelColor=0F1F3D)](./docs/SparkFlow_MasterSpec_v4.pdf)

<br/>

> **SparkFlow** is a full-stack ERP system purpose-built for carwash businesses in East Africa.  
> Real-time bay management · M-Pesa payments · Multi-role dashboards · SMS + Email notifications · Mobile apps

<br/>

</div>

---

## ✨ What SparkFlow Does

SparkFlow replaces paper-based carwash operations with a live, cloud-connected platform. From the moment a customer drives in to the moment they pay and leave — every step is tracked, automated, and reported.

| For the **Manager** | For the **Agent** | For the **Attendant** | For the **Customer** |
|---|---|---|---|
| Live revenue dashboard | Vehicle check-in | Job console | Vehicle tracker |
| Bay utilisation metrics | Customer lookup | State machine controls | Transaction history |
| Staff & payroll | Payment processing | Real-time bay updates | Loyalty points |
| Inventory tracking | Workflow monitoring | Queue management | M-Pesa receipts |
| Analytics & reports | Service selection | — | — |

---

## 🏗 Tech Stack

```
Frontend          Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui
Backend           Next.js API Routes · Supabase (PostgreSQL + RLS + Realtime)
Auth              Supabase Auth · JWT · Role-based middleware
Payments          M-Pesa Daraja STK Push (Safaricom)
Notifications     Africa's Talking SMS · Resend Email
AI                Google Genkit (operational insights — Phase 4)
Mobile            Expo (React Native) · Zustand · MMKV
Deployment        Vercel (web) · EAS Build (mobile)
```

---

## 🗂 Project Structure

```
SparkFlow/
├── src/
│   ├── app/
│   │   ├── api/                         # 13 REST API routes
│   │   │   ├── auth/session|me/
│   │   │   ├── bays/          [id]/
│   │   │   ├── customers/     [id]/
│   │   │   ├── vehicles/      [id]/
│   │   │   ├── transactions/  [id]/
│   │   │   ├── staff/         [id]/
│   │   │   ├── inventory/     [id]/restock/
│   │   │   ├── services/
│   │   │   └── dashboard/
│   │   ├── manager/                     # Manager portal (16 pages)
│   │   │   ├── page.tsx                 # Dashboard
│   │   │   ├── bays/                    # Live bay grid (Realtime)
│   │   │   ├── staff/                   # Staff + attendance
│   │   │   ├── inventory/               # Stock levels + restock
│   │   │   ├── sales/                   # Transaction history
│   │   │   ├── services/                # Service catalogue
│   │   │   ├── payroll/                 # Salary + M-Pesa disburse
│   │   │   ├── analytics/               # Revenue + retention charts
│   │   │   ├── marketing/               # SMS campaign builder
│   │   │   ├── logistics/               # Concierge + fleet
│   │   │   ├── subscriptions/           # Membership tiers + vouchers
│   │   │   ├── accounts/                # General ledger + expenses
│   │   │   ├── branches/                # Multi-branch KPIs
│   │   │   ├── tasks/                   # Operational task list
│   │   │   ├── reports/                 # PDF report architect
│   │   │   └── settings/                # Branding + billing config
│   │   ├── agent/                       # Agent portal
│   │   ├── attendant/                   # Attendant job console
│   │   ├── customer/                    # Customer tracker
│   │   ├── saas-admin/                  # Super-admin tenant mgmt
│   │   └── signin/
│   ├── components/
│   │   ├── manager/
│   │   │   ├── Sidebar.tsx              # Collapsible nav (16 links)
│   │   │   └── ManagerShell.tsx         # Auth guard + layout wrapper
│   │   └── ui/                          # shadcn/ui (do not modify)
│   ├── hooks/
│   │   ├── useAuth.ts                   # Shared auth hook
│   │   └── useRealtime.ts               # Supabase Realtime hooks
│   ├── lib/
│   │   ├── supabase/client|server|admin.ts
│   │   ├── auth-helpers.ts
│   │   ├── types.ts
│   │   └── mock-data.ts
│   └── ai/
│       └── flows/                       # Genkit AI flows (Phase 4)
├── supabase/
│   └── migrations/
│       ├── 001_tables.sql               # 11 tables
│       ├── 002_rls.sql                  # Row Level Security
│       └── 003_rpcs.sql                 # create_transaction + advance_vehicle_status
├── sparkflow-mobile/                    # Expo mobile app (F1 complete)
│   ├── app/
│   │   ├── (auth)/login.tsx
│   │   ├── (manager)/dashboard.tsx
│   │   ├── (agent)/checkin.tsx
│   │   ├── (attendant)/jobs.tsx
│   │   └── (customer)/tracker.tsx
│   └── lib/
│       ├── api.ts
│       ├── auth.ts
│       └── store/auth.ts
└── middleware.ts                        # JWT route protection
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (Middle East region recommended for Kenya latency)
- Vercel account

### 1. Clone & Install

```bash
git clone https://github.com/Morpheous-cain/SparkFlow.git
cd SparkFlow
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:9002

# Phase 3 — fill before testing payments/notifications
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-ngrok-url/api/payments/mpesa/callback
AT_API_KEY=
AT_USERNAME=sandbox
RESEND_API_KEY=
```

### 3. Run Locally

```bash
npm run dev
# App runs at http://localhost:9002
```

### 4. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Manager | `manager@sparkflow.test` | `password123` |
| Agent | `agent@sparkflow.test` | `password123` |
| Attendant | `attendant@sparkflow.test` | `password123` |
| Customer | `customer@sparkflow.test` | `password123` |

---

## 📊 Database Schema

SparkFlow runs on **11 Supabase tables** with Row Level Security on every table:

```
tenants           → SaaS tenant registry
branches          → Branch locations per tenant
user_roles        → Role assignment (manager/agent/attendant/customer)
bays              → Wash bays — Realtime enabled
services          → Service catalogue with pricing
staff             → Staff profiles + earnings
inventory_items   → Stock levels + restock tracking
customers         → Customer profiles + loyalty tier
vehicles_live     → Live vehicle queue — Realtime enabled
transactions      → Payment records
logistics_requests→ Concierge pickup/delivery orders
```

**Postgres RPCs (migration 003):**
- `create_transaction()` — atomic transaction creation
- `advance_vehicle_status()` — state machine: Queue → In-Bay → Ready → Completed

---

## 📱 Mobile App (Expo)

The `sparkflow-mobile/` directory contains the React Native app built with Expo.

```bash
cd sparkflow-mobile
npm install
npx expo start          # Scan QR with Expo Go on Android
```

| Sprint | Status | Scope |
|--------|--------|-------|
| F1 — Scaffold + Auth | ✅ Complete | Login, JWT, Zustand + MMKV, role routing |
| F2 — Staff App | 🔜 Next | Bay grid (Realtime), check-in, job console, offline queue, FCM |
| F3 — Customer App | 📋 Planned | Live tracker, M-Pesa in-app, loyalty, logistics tracking |
| F4 — Polish + Store | 📋 Planned | UAT, Fastlane, Play Store submission |

---

## 🗺 Roadmap

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| Phase 1 — Foundation | ✅ Complete | Supabase, 11 tables, RLS, auth, seed data |
| Phase 2 — Core ERP APIs | ✅ Complete | 13 API routes, RPCs, Realtime, tested |
| Frontend Wiring | ✅ Complete | All pages wired to real APIs |
| Auth & Routing | ✅ Complete | Middleware, useAuth, role-based routing |
| Manager Portal (16 pages) | ✅ Complete | Full sidebar + all manager pages |
| Phase 3 — Payments + Notifs | 🔜 Next | M-Pesa STK Push, Africa's Talking SMS, Resend email |
| Phase 4 — Reports + AI | 📋 Planned | Cron jobs, CSV/PDF export, Genkit AI flows |
| Phase 5 — Harden + CI/CD | 📋 Planned | GitHub Actions, RLS audit, Sentry, rate limiting |
| Mobile F1 | ✅ Complete | Expo scaffold, login, JWT auth, role routing |
| Mobile F2–F4 | 📋 Planned | Bay grid, check-in, customer tracker, Play Store |

---

## ⚙️ Key Engineering Decisions

**Why Supabase over Firebase?**  
Row Level Security gives us true multi-tenant data isolation at the database level. Every query is automatically scoped to the correct `tenant_id` without application-level filtering.

**Why Next.js App Router API routes?**  
Keeps the stack unified — one repo, one deploy, one set of environment variables. API routes run as Vercel serverless functions with zero additional infrastructure.

**Why MMKV over AsyncStorage for mobile?**  
MMKV is synchronous and ~30x faster than AsyncStorage for reads. Critical for JWT token access on every API request without async overhead.

**Realtime architecture:**  
Bay status and vehicle queue updates use Supabase Realtime (PostgreSQL logical replication → WebSocket). No polling. Attendant and manager screens update instantly when state changes.

---

## 🤝 Built By

**Immersicloud Consulting**  
📧 immersitec@gmail.com  
🌍 Nairobi, Kenya

---

<div align="center">

**Production Repo:** [github.com/Morpheous-cain/SparkFlow](https://github.com/Morpheous-cain/SparkFlow)  
**Live App:** [sparkflow-sable.vercel.app](https://sparkflow-sable.vercel.app)  
**Spec:** MasterSpec v4 — April 2026

<br/>

*SparkFlow ERP · Built with ⚡ by Immersicloud Consulting*

</div>
