
import { Service, Staff, VehicleLive, Transaction, InventoryItem, Bay, LogisticsRequest, SubscriptionPlan, Voucher, Promotion, ServiceBundle, Branch } from "./types";

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
    waterLevel: 18, // LOW ALERT
    staffing: { current: 8, required: 8 },
    essentialMaterialsLow: 2
  },
  { 
    id: 'BR-003', 
    tenantId: 'T-001', 
    name: 'Mombasa Road', 
    location: 'Panari Center', 
    managerName: 'Sarah Wambui', 
    status: 'Limited', 
    activeBays: 1, 
    revenueMTD: 120000, 
    phone: '+254 711 000 333',
    waterLevel: 62,
    staffing: { current: 4, required: 6 }, // SHORTAGE
    essentialMaterialsLow: 1
  },
];

export const SERVICES: Service[] = [
  { id: '1', tenantId: 'T-001', name: 'Basic Wash', price: 500, duration: 20, category: 'Wash', usp: 'Quick 20-min turnaround' },
  { id: '2', tenantId: 'T-001', name: 'Executive Wash', price: 1200, duration: 45, category: 'Wash', usp: 'Includes interior vacuum & dash shine' },
  { id: '3', tenantId: 'T-001', name: 'Full Detailing', price: 4500, duration: 180, category: 'Detailing', usp: 'Showroom finish guaranteed' },
  { id: '4', tenantId: 'T-001', name: 'Ceramic Coating', price: 15000, duration: 360, category: 'Detailing', usp: '3-year paint protection' },
  { id: '5', tenantId: 'T-001', name: 'Window Tinting', price: 8000, duration: 120, category: 'Tinting', usp: '99% UV rejection film' },
  { id: '6', tenantId: 'T-001', name: 'Carpet Cleaning', price: 2000, duration: 60, category: 'Wash', usp: 'Deep extraction technology' },
];

export const SERVICE_BUNDLES: ServiceBundle[] = [
  { 
    id: 'B1', 
    name: 'The Spark Executive', 
    services: ['Executive Wash', 'Tire Max', 'Engine Wash'], 
    price: 1800, 
    saving: 400,
    incentive: 'Earn 100 Bonus Pts',
    usp: 'Total transformation in under 60 mins'
  },
  { 
    id: 'B2', 
    name: 'Showroom Revival', 
    services: ['Full Detailing', 'Ceramic Wax', 'Headlight Restoration'], 
    price: 6500, 
    saving: 1500,
    incentive: 'Free Microfiber Kit',
    usp: 'Best value for vehicle resale prep'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'SUB1', name: 'Silver', price: 2500, discount: 10, benefits: ['2 Free Basic Washes/Mo', '10% Off Detailing', 'Priority Queue'] },
  { id: 'SUB2', name: 'Gold', price: 5000, discount: 20, benefits: ['4 Free Basic Washes/Mo', '20% Off All Services', 'Free Tire Wax', 'Priority Queue'] },
  { id: 'SUB3', name: 'Platinum', price: 10000, discount: 35, benefits: ['Unlimited Basic Washes', '35% Off All Services', 'Free Engine Wash', 'VIP Lounge Access'] },
];

export const VOUCHERS: Voucher[] = [
  { id: 'V1', code: 'SPARK20', discount: 20, type: 'Percentage', expiry: '2024-12-31', status: 'Active' },
  { id: 'V2', code: 'WELCOME500', discount: 500, type: 'Fixed', expiry: '2024-06-30', status: 'Active' },
  { id: 'V3', code: 'LOYALTY10', discount: 10, type: 'Percentage', expiry: '2024-05-01', status: 'Expired' },
];

export const PROMOTIONS: Promotion[] = [
  { id: 'P1', title: 'Rainy Season Special', description: 'Get 50% off Underwash when you book a Full Detailing.', startDate: '2024-05-01', endDate: '2024-05-31' },
  { id: 'P2', title: 'Weekend Rush Hour', description: 'Double reward points for all washes booked between 8 AM - 10 AM on Saturdays.', startDate: '2024-05-01', endDate: '2024-06-30' },
];

export const STAFF: Staff[] = [
  { 
    id: 'S1', 
    tenantId: 'T-001',
    branchId: 'BR-001',
    name: 'John Kamau', 
    role: 'Attendant', 
    performance: 4.8, 
    attendanceStatus: 'Present',
    lastClockIn: '2024-05-21T07:45:00Z',
    earnings: { base: 8000, commission: 2500, tips: 2000, total: 12500 } 
  },
  { 
    id: 'S2', 
    tenantId: 'T-001',
    branchId: 'BR-002',
    name: 'Sarah Wambui', 
    role: 'Attendant', 
    performance: 4.5, 
    attendanceStatus: 'Late',
    lastClockIn: '2024-05-21T08:30:00Z',
    earnings: { base: 8000, commission: 1200, tips: 1000, total: 10200 } 
  },
  { 
    id: 'S3', 
    tenantId: 'T-001',
    branchId: 'BR-001',
    name: 'Peter Otieno', 
    role: 'Attendant', 
    performance: 4.9, 
    attendanceStatus: 'Present',
    lastClockIn: '2024-05-21T07:15:00Z',
    earnings: { base: 8000, commission: 4500, tips: 2500, total: 15000 } 
  },
  { 
    id: 'S4', 
    tenantId: 'T-001',
    branchId: 'BR-001',
    name: 'Grace Mutua', 
    role: 'Agent', 
    performance: 4.7, 
    attendanceStatus: 'Absent',
    earnings: { base: 20000, commission: 5000, tips: 0, total: 25000 } 
  },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Premium Car Shampoo', stock: 45, wholesale: 1200, retail: 1800, velocity: 'Fast', margin: 33, isEssential: true },
  { id: 'I2', name: 'Microfiber Towels (Bulk)', stock: 120, wholesale: 150, retail: 350, velocity: 'Normal', margin: 57, isEssential: true },
  { id: 'I3', name: 'Specialist Tire Wax', stock: 12, wholesale: 800, retail: 1200, velocity: 'Slow', margin: 33, isEssential: false },
  { id: 'I4', name: 'Heavy Duty Underwash Agent', stock: 5, wholesale: 2500, retail: 4000, velocity: 'Fast', margin: 37, isEssential: true },
];

export const BAYS: Bay[] = [
  { id: 'BAY-1', tenantId: 'T-001', branchId: 'BR-001', name: 'Bay 1 (Standard)', status: 'Occupied', currentVehiclePlate: 'KDC 123A' },
  { id: 'BAY-2', tenantId: 'T-001', branchId: 'BR-001', name: 'Bay 2 (Detailing)', status: 'Occupied', currentVehiclePlate: 'KDJ 999Z' },
  { id: 'BAY-3', tenantId: 'T-001', branchId: 'BR-001', name: 'Bay 3 (Express)', status: 'Available' },
];

export const MOCK_VEHICLES: VehicleLive[] = [
  {
    plate: 'KDC 123A',
    status: 'In-Bay',
    arrivalTime: new Date(Date.now() - 30 * 60000).toISOString(),
    bayId: 'BAY-1',
    attendantId: 'S1',
    services: ['Executive Wash', 'Tire Wax'],
    totalAmount: 2400,
    progress: 65,
    tenantId: 'T-001',
    branchId: 'BR-001'
  },
  {
    plate: 'KDJ 999Z',
    status: 'In-Bay',
    arrivalTime: new Date(Date.now() - 45 * 60000).toISOString(),
    bayId: 'BAY-2',
    attendantId: 'S3',
    services: ['Full Detailing'],
    totalAmount: 4500,
    progress: 30,
    tenantId: 'T-001',
    branchId: 'BR-001'
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', plate: 'KBA 001C', amount: 1200, status: 'Paid', receipt: 'MPESA_9821X', duration: 35, date: '2024-05-20', branchId: 'BR-001' },
  { id: 'T2', plate: 'KBB 002D', amount: 500, status: 'Paid', receipt: 'MPESA_9822Y', duration: 20, date: '2024-05-20', branchId: 'BR-001' },
  { id: 'T3', plate: 'KBC 003E', amount: 4500, status: 'Pending', receipt: null, duration: 150, date: '2024-05-20', branchId: 'BR-002' },
];

export const MOCK_LOGISTICS: LogisticsRequest[] = [
  {
    id: 'LOG-101',
    customerName: 'James Wilson',
    itemType: 'Persian Rug',
    status: 'Processing',
    address: 'Kilimani, Nairobi',
    requestTime: '2024-05-21T09:00:00Z',
    pickupWindow: '09:00 AM - 11:00 AM',
    qrTag: 'SPARK-RU-101',
    trackingProgress: 45,
    amount: 3500,
    tenantId: 'T-001',
    branchId: 'BR-001',
    assignedStaffId: 'S1'
  },
];
