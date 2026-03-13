
import { Service, Staff, VehicleLive, Transaction, InventoryItem, Bay, LogisticsRequest, SubscriptionPlan, Voucher, Promotion, ServiceBundle } from "./types";

export const SERVICES: Service[] = [
  { id: '1', name: 'Basic Wash', price: 500, duration: 20, category: 'Wash', usp: 'Quick 20-min turnaround' },
  { id: '2', name: 'Executive Wash', price: 1200, duration: 45, category: 'Wash', usp: 'Includes interior vacuum & dash shine' },
  { id: '3', name: 'Full Detailing', price: 4500, duration: 180, category: 'Detailing', usp: 'Showroom finish guaranteed' },
  { id: '4', name: 'Ceramic Coating', price: 15000, duration: 360, category: 'Detailing', usp: '3-year paint protection' },
  { id: '5', name: 'Window Tinting', price: 8000, duration: 120, category: 'Tinting', usp: '99% UV rejection film' },
  { id: '6', name: 'Carpet Cleaning', price: 2000, duration: 60, category: 'Wash', usp: 'Deep extraction technology' },
];

export const SERVICE_BUNDLES: ServiceBundle[] = [
  { 
    id: 'B1', 
    name: 'The Spark Executive', 
    services: ['Executive Wash', 'Tire Wax', 'Engine Wash'], 
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
    name: 'John Kamau', 
    role: 'Attendant', 
    performance: 4.8, 
    earnings: { base: 8000, commission: 2500, tips: 2000, total: 12500 } 
  },
  { 
    id: 'S2', 
    name: 'Sarah Wambui', 
    role: 'Attendant', 
    performance: 4.5, 
    earnings: { base: 8000, commission: 1200, tips: 1000, total: 10200 } 
  },
  { 
    id: 'S3', 
    name: 'Peter Otieno', 
    role: 'Attendant', 
    performance: 4.9, 
    earnings: { base: 8000, commission: 4500, tips: 2500, total: 15000 } 
  },
  { 
    id: 'S4', 
    name: 'Grace Mutua', 
    role: 'Agent', 
    performance: 4.7, 
    earnings: { base: 20000, commission: 5000, tips: 0, total: 25000 } 
  },
  { 
    id: 'S5', 
    name: 'David Mwangi', 
    role: 'Driver', 
    performance: 4.6, 
    earnings: { base: 12000, commission: 3500, tips: 3000, total: 18500 } 
  },
  { 
    id: 'S6', 
    name: 'Alice Njeri', 
    role: 'Technician', 
    performance: 4.9, 
    earnings: { base: 15000, commission: 7000, tips: 0, total: 22000 } 
  },
];

export const INVENTORY: InventoryItem[] = [
  { id: 'I1', name: 'Premium Car Shampoo', stock: 45, wholesale: 1200, retail: 1800, velocity: 'Fast', margin: 33 },
  { id: 'I2', name: 'Microfiber Towels (Bulk)', stock: 120, wholesale: 150, retail: 350, velocity: 'Normal', margin: 57 },
  { id: 'I3', name: 'Specialist Tire Wax', stock: 12, wholesale: 800, retail: 1200, velocity: 'Slow', margin: 33 },
  { id: 'I4', name: 'Air Freshener (Pine)', stock: 8, wholesale: 100, retail: 300, velocity: 'Fast', margin: 66 },
  { id: 'I5', name: 'Engine Degreaser', stock: 65, wholesale: 2200, retail: 3500, velocity: 'Slow', margin: 37 },
];

export const BAYS: Bay[] = [
  { id: 'BAY-1', name: 'Bay 1 (Standard)', status: 'Occupied', currentVehiclePlate: 'KDC 123A' },
  { id: 'BAY-2', name: 'Bay 2 (Detailing)', status: 'Occupied', currentVehiclePlate: 'KDJ 999Z' },
  { id: 'BAY-3', name: 'Bay 3 (Express)', status: 'Available' },
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
    tenantId: 'T-001'
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
    tenantId: 'T-001'
  },
  {
    plate: 'KDH 456B',
    status: 'Queue',
    arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(),
    bayId: null,
    attendantId: null,
    services: ['Basic Wash'],
    totalAmount: 500,
    progress: 0,
    tenantId: 'T-001'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T1', plate: 'KBA 001C', amount: 1200, status: 'Paid', receipt: 'MPESA_9821X', duration: 35, date: '2024-05-20' },
  { id: 'T2', plate: 'KBB 002D', amount: 500, status: 'Paid', receipt: 'MPESA_9822Y', duration: 20, date: '2024-05-20' },
  { id: 'T3', plate: 'KBC 003E', amount: 4500, status: 'Pending', receipt: null, duration: 150, date: '2024-05-20' },
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
    assignedStaffId: 'S6',
    tenantId: 'T-001'
  },
  {
    id: 'LOG-102',
    customerName: 'Mary Atieno',
    itemType: 'SUV Valet',
    status: 'Booking',
    address: 'Westlands, Nairobi',
    requestTime: '2024-05-21T10:30:00Z',
    pickupWindow: '02:00 PM - 04:00 PM',
    qrTag: 'SPARK-VA-102',
    trackingProgress: 0,
    amount: 2500,
    tenantId: 'T-001'
  },
  {
    id: 'LOG-103',
    customerName: 'Brian Kipkorir',
    itemType: 'Sofa Set',
    status: 'Pickup',
    address: 'Karen, Nairobi',
    requestTime: '2024-05-21T08:15:00Z',
    pickupWindow: '08:00 AM - 10:00 AM',
    qrTag: 'SPARK-SO-103',
    trackingProgress: 20,
    amount: 5000,
    assignedStaffId: 'S5',
    tenantId: 'T-001'
  }
];
