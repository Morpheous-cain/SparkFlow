
import { Service, Staff, VehicleLive, Transaction, InventoryItem, Bay, LogisticsRequest, SubscriptionPlan, Voucher, Promotion, ServiceBundle, Branch, PayrollRecord, Expense, ChartOfAccount } from "./types";

export const BRANCHES: Branch[] = [
  { 
    id: 'BR-001', 
    tenantId: 'T-001', 
    name: 'Westlands Flagship', 
    location: 'Ring Road, Westlands', 
    managerName: 'Grace Mutua', 
    status: 'Open', 
    activeBays: 3, 
    revenueMTD: 450000, 
    phone: '+254 711 000 111',
    waterLevel: 85,
    staffing: { current: 12, required: 15 },
    essentialMaterialsLow: 0
  },
  { 
    id: 'BR-002', 
    tenantId: 'T-001', 
    name: 'Karen Hub', 
    location: 'Karen Road', 
    managerName: 'Peter Otieno', 
    status: 'Open', 
    activeBays: 2, 
    revenueMTD: 280000, 
    phone: '+254 711 000 222',
    waterLevel: 18,
    staffing: { current: 8, required: 8 },
    essentialMaterialsLow: 2
  },
];

export const STAFF: Staff[] = [
  { 
    id: 'S1', 
    tenantId: 'T-001',
    branchId: 'BR-001',
    name: 'John Kamau', 
    role: 'Attendant', 
    performance: 4.9, 
    rating: 4.9,
    attendanceStatus: 'Present',
    lastClockIn: '2024-05-21T07:45:00Z',
    earnings: { base: 12000, commission: 4500, tips: 3000, total: 19500 },
    isEmployeeOfMonth: true
  },
  { 
    id: 'S2', 
    tenantId: 'T-001',
    branchId: 'BR-002',
    name: 'Sarah Wambui', 
    role: 'Attendant', 
    performance: 4.5, 
    rating: 4.2,
    attendanceStatus: 'Late',
    lastClockIn: '2024-05-21T08:30:00Z',
    earnings: { base: 12000, commission: 1200, tips: 1000, total: 14200 } 
  },
  { 
    id: 'S3', 
    tenantId: 'T-001',
    branchId: 'BR-001',
    name: 'Peter Otieno', 
    role: 'Attendant', 
    performance: 4.7, 
    rating: 4.8,
    attendanceStatus: 'Present',
    lastClockIn: '2024-05-21T07:15:00Z',
    earnings: { base: 12000, commission: 3200, tips: 2000, total: 17200 } 
  },
];

export const PAYROLL: PayrollRecord[] = [
  { id: 'PR-001', staffId: 'S1', staffName: 'John Kamau', month: 'May 2024', baseAmount: 12000, commission: 4500, deductions: 500, netPay: 16000, status: 'Approved' },
  { id: 'PR-002', staffId: 'S2', staffName: 'Sarah Wambui', month: 'May 2024', baseAmount: 12000, commission: 1200, deductions: 200, netPay: 13000, status: 'Draft' },
];

export const EXPENSES: Expense[] = [
  { id: 'EXP-001', category: 'Supplies', description: 'Car Shampoo Refill', amount: 4500, date: '2024-05-18', type: 'Direct', branchId: 'BR-001' },
  { id: 'EXP-002', category: 'Petty Cash', description: 'Office Milk & Snacks', amount: 1200, date: '2024-05-20', type: 'Petty Cash', branchId: 'BR-001' },
  { id: 'EXP-003', category: 'Utilities', description: 'Water Bill - BR002', amount: 8500, date: '2024-05-15', type: 'Indirect', branchId: 'BR-002' },
];

export const CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { code: '1000', name: 'Cash at Hand', type: 'Asset', balance: 24500 },
  { code: '1010', name: 'M-Pesa Business Account', type: 'Asset', balance: 142000 },
  { code: '4000', name: 'Wash Revenue', type: 'Revenue', balance: 450000 },
  { code: '5000', name: 'Staff Salaries', type: 'Expense', balance: 120000 },
  { code: '5010', name: 'Consumables Expense', type: 'Expense', balance: 35000 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', plate: 'KBA 001C', amount: 1200, status: 'Paid', receipt: 'MPESA_9821X', duration: 35, date: '2024-05-20', branchId: 'BR-001', paymentMethod: 'M-Pesa' },
  { id: 'T2', plate: 'KBB 002D', amount: 500, status: 'Paid', receipt: 'MPESA_9822Y', duration: 20, date: '2024-05-20', branchId: 'BR-001', paymentMethod: 'M-Pesa' },
];

export const SERVICES: Service[] = [
  { id: '1', tenantId: 'T-001', name: 'Basic Wash', price: 500, duration: 20, category: 'Wash', usp: 'Quick 20-min turnaround' },
  { id: '2', tenantId: 'T-001', name: 'Executive Wash', price: 1200, duration: 45, category: 'Wash', usp: 'Includes interior vacuum & dash shine' },
];

export const SERVICE_BUNDLES: ServiceBundle[] = [
  { id: 'B1', name: 'The Spark Executive', services: ['Executive Wash', 'Tire Max', 'Engine Wash'], price: 1800, saving: 400, incentive: 'Earn 100 Bonus Pts', usp: 'Total transformation in under 60 mins' },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'SUB1', name: 'Silver', price: 2500, discount: 10, benefits: ['2 Free Basic Washes/Mo', '10% Off Detailing'] },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Premium Car Shampoo', stock: 45, wholesale: 1200, retail: 1800, velocity: 'Fast', margin: 33, isEssential: true },
];

export const BAYS: Bay[] = [
  { id: 'BAY-1', tenantId: 'T-001', branchId: 'BR-001', name: 'Bay 1 (Standard)', status: 'Occupied', currentVehiclePlate: 'KDC 123A' },
];

export const MOCK_VEHICLES: VehicleLive[] = [
  { plate: 'KDC 123A', status: 'In-Bay', arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(), bayId: 'BAY-1', attendantId: 'S1', services: ['Executive Wash'], totalAmount: 2400, progress: 65, tenantId: 'T-001', branchId: 'BR-001' },
];

export const VOUCHERS: Voucher[] = [
  { id: 'V1', code: 'SPARK20', discount: 20, type: 'Percentage', expiry: '2024-12-31', status: 'Active' },
];

export const PROMOTIONS: Promotion[] = [
  { id: 'P1', title: 'Rainy Season Special', description: 'Get 50% off Underwash.', startDate: '2024-05-01', endDate: '2024-05-31' },
];
